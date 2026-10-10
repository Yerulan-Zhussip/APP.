import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Bernoulli probability math helpers from original website
function combinations(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let res = 1;
  for (let i = 1; i <= k; i++) res = (res * (n - i + 1)) / i;
  return Math.round(res);
}

function bernoulliProbability(n, k, p) {
  return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

export const TanksScreen = () => {
  const { tanks, updateTank, addTank } = useData();
  const { currentUser } = useAuth();

  const [selectedCity, setSelectedCity] = useState('All');
  const [addTankModal, setAddTankModal] = useState(false);
  const [editTankModal, setEditTankModal] = useState(null);

  // Bernoulli calculator state
  const [bernoulliN, setBernoulliN] = useState('10');
  const [bernoulliP, setBernoulliP] = useState('0.15');

  // Form states
  const [tankName, setTankName] = useState('');
  const [tankCity, setTankCity] = useState('Astana');
  const [tankContent, setTankContent] = useState('Дизельное топливо');
  const [tankValue, setTankValue] = useState('25000');
  const [tankCapacity, setTankCapacity] = useState('50000');

  const canEdit = currentUser?.permissions?.canEditTanks || currentUser?.role === 'admin';

  const filteredTanks = selectedCity === 'All'
    ? tanks
    : tanks.filter(t => t.city.toLowerCase() === selectedCity.toLowerCase());

  // Bernoulli probabilities calculation
  const nVal = parseInt(bernoulliN, 10) || 10;
  const pVal = parseFloat(bernoulliP) || 0.15;
  const probData = [];
  for (let k = 0; k <= Math.min(nVal, 8); k++) {
    const prob = bernoulliProbability(nVal, k, pVal);
    probData.push({ k, prob: (prob * 100).toFixed(2) });
  }

  const handleSaveTank = () => {
    if (!editTankModal) return;
    const val = parseInt(tankValue, 10);
    const cap = parseInt(tankCapacity, 10);
    if (isNaN(val) || isNaN(cap) || cap <= 0) {
      Alert.alert('Ошибка', 'Введите корректные числовые значения для объёма');
      return;
    }
    updateTank({
      ...editTankModal,
      value: Math.min(val, cap),
      maxCapacity: cap,
      lastUpdated: new Date().toISOString()
    }, currentUser?.username);
    setEditTankModal(null);
    Alert.alert('Успешно', 'Данные резервуара обновлены');
  };

  const handleAddTank = () => {
    if (!tankName.trim()) {
      Alert.alert('Ошибка', 'Укажите название резервуара');
      return;
    }
    const val = parseInt(tankValue, 10) || 0;
    const cap = parseInt(tankCapacity, 10) || 50000;
    addTank({
      name: tankName,
      city: tankCity,
      content: tankContent,
      value: val,
      maxCapacity: cap
    }, currentUser?.username);
    setTankName('');
    setAddTankModal(false);
    Alert.alert('Успешно', 'Новый резервуар добавлен');
  };

  return (
    <View style={styles.container}>
      <Header title="Мониторинг резервуаров" subtitle="Учёт запасов и вероятностный анализ Бернулли" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* City Filter Pills & Add Button */}
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['All', 'Astana', 'Almaty', 'Dostyk'].map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
                onPress={() => setSelectedCity(city)}
              >
                <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>
                  {city === 'All' ? 'Все города' : city}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {canEdit && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                setTankName(`Резервуар №${tanks.length + 1}`);
                setAddTankModal(true);
              }}
            >
              <Ionicons name="add" size={20} color={theme.colors.bg} />
            </TouchableOpacity>
          )}
        </View>

        {/* Bernoulli Distribution Analysis Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="analytics" size={20} color={theme.colors.gold} />
            <Text style={styles.cardTitle}>Анализ рисков по формуле Бернулли</Text>
          </View>
          <Text style={styles.mathSub}>P(K=k) = C_n^k * p^k * (1-p)^(n-k)</Text>

          <View style={styles.calcInputsRow}>
            <View style={styles.calcInputGroup}>
              <Text style={styles.calcLabel}>Число испытаний (n):</Text>
              <TextInput
                style={styles.calcInput}
                keyboardType="numeric"
                value={bernoulliN}
                onChangeText={setBernoulliN}
              />
            </View>

            <View style={styles.calcInputGroup}>
              <Text style={styles.calcLabel}>Вероятность риска (p):</Text>
              <TextInput
                style={styles.calcInput}
                keyboardType="numeric"
                value={bernoulliP}
                onChangeText={setBernoulliP}
              />
            </View>
          </View>

          {/* Mini Probabilities Bar Chart View */}
          <Text style={styles.chartTitle}>Распределение вероятностей сбоев (k событий):</Text>
          <View style={styles.barsContainer}>
            {probData.map((item) => (
              <View key={item.k} style={styles.barCol}>
                <Text style={styles.barValText}>{item.prob}%</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${Math.min(parseFloat(item.prob) * 2, 100)}%` }
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>k={item.k}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tanks List Grid */}
        <Text style={styles.sectionTitle}>
          Спискок резервуаров ({filteredTanks.length})
        </Text>

        {filteredTanks.map((tank) => {
          const cap = tank.maxCapacity || 50000;
          const fillPercent = Math.min(Math.round((tank.value / cap) * 100), 100);
          const isLow = fillPercent < 25;

          return (
            <View key={tank.id} style={styles.tankCard}>
              <View style={styles.tankCardHeader}>
                <View>
                  <View style={styles.tankTitleRow}>
                    <Text style={styles.tankName}>{tank.name}</Text>
                    <View style={styles.cityBadge}>
                      <Text style={styles.cityBadgeText}>{tank.city}</Text>
                    </View>
                  </View>
                  <Text style={styles.tankContent}>{tank.content}</Text>
                </View>

                {canEdit && (
                  <TouchableOpacity
                    style={styles.editTankBtn}
                    onPress={() => {
                      setEditTankModal(tank);
                      setTankValue(tank.value.toString());
                      setTankCapacity(cap.toString());
                    }}
                  >
                    <Ionicons name="create-outline" size={18} color={theme.colors.gold} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Tank Progress Visualizer */}
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Заполнение: {fillPercent}%</Text>
                <Text style={styles.progressVal}>
                  {tank.value.toLocaleString()} / {cap.toLocaleString()} л
                </Text>
              </View>

              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${fillPercent}%`,
                      backgroundColor: isLow ? theme.colors.danger : fillPercent > 80 ? theme.colors.success : theme.colors.gold
                    }
                  ]}
                />
              </View>
            </View>
          );
        })}

      </ScrollView>

      {/* Edit Tank Modal */}
      <Modal visible={!!editTankModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Редактировать {editTankModal?.name}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Текущий объём (литров):</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={tankValue}
                onChangeText={setTankValue}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Максимальная емкость (литров):</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={tankCapacity}
                onChangeText={setTankCapacity}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setEditTankModal(null)}
              >
                <Text style={styles.cancelBtnText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSaveTank}
              >
                <Text style={styles.saveBtnText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Tank Modal */}
      <Modal visible={addTankModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить резервуар</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Название</Text>
              <TextInput
                style={styles.textInput}
                value={tankName}
                onChangeText={setTankName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Город (Astana, Almaty, Dostyk)</Text>
              <TextInput
                style={styles.textInput}
                value={tankCity}
                onChangeText={setTankCity}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Вид топлива</Text>
              <TextInput
                style={styles.textInput}
                value={tankContent}
                onChangeText={setTankContent}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Начальный объём (л)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={tankValue}
                onChangeText={setTankValue}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Максимальная вместимость (л)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={tankCapacity}
                onChangeText={setTankCapacity}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setAddTankModal(false)}
              >
                <Text style={styles.cancelBtnText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleAddTank}
              >
                <Text style={styles.saveBtnText}>Создать</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
  },
  cityChipActive: {
    backgroundColor: theme.colors.gold,
    borderColor: theme.colors.gold,
  },
  cityChipText: {
    color: theme.colors.cream,
    fontSize: 12,
    fontWeight: '600',
  },
  cityChipTextActive: {
    color: theme.colors.bg,
    fontWeight: '800',
  },
  addBtn: {
    backgroundColor: theme.colors.gold,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    color: theme.colors.cream,
    fontSize: 15,
    fontWeight: '700',
  },
  mathSub: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
  },
  calcInputsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  calcInputGroup: {
    flex: 1,
  },
  calcLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  calcInput: {
    backgroundColor: '#1a0f0a',
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontWeight: '700',
  },
  chartTitle: {
    color: theme.colors.cream,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValText: {
    color: theme.colors.gold,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  barTrack: {
    width: 14,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: theme.colors.gold,
    borderRadius: 7,
  },
  barLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  sectionTitle: {
    color: theme.colors.cream,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  tankCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  tankCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  tankTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tankName: {
    color: theme.colors.cream,
    fontSize: 15,
    fontWeight: '700',
  },
  cityBadge: {
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cityBadgeText: {
    color: theme.colors.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  tankContent: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  editTankBtn: {
    padding: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: theme.colors.cream,
    fontSize: 12,
    fontWeight: '600',
  },
  progressVal: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#1a0f0a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.gold,
  },
  modalTitle: {
    color: theme.colors.gold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  inputGroup: {
    marginBottom: theme.spacing.sm,
  },
  inputLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#1a0f0a',
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#3a2217',
  },
  cancelBtnText: {
    color: theme.colors.cream,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: theme.colors.gold,
  },
  saveBtnText: {
    color: theme.colors.bg,
    fontWeight: '800',
  }
});
