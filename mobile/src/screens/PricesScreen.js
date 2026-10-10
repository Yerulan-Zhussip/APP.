import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const PricesScreen = () => {
  const { prices, marketPrices, updatePrices, updateMarketPrices } = useData();
  const { currentUser } = useAuth();

  const [editPricesModal, setEditPricesModal] = useState(false);
  const [addFuelModal, setAddFuelModal] = useState(false);

  // Edit prices local state
  const [dieselPrices, setDieselPrices] = useState(prices.diesel);
  const [petrolPrices, setPetrolPrices] = useState(prices.aviationAndPetrol);

  // Add market fuel local state
  const [newFuelName, setNewFuelName] = useState('');
  const [newFuelSingapore, setNewFuelSingapore] = useState('');
  const [newFuelArgus, setNewFuelArgus] = useState('');
  const [newFuelWholesale, setNewFuelWholesale] = useState('');
  const [newFuelRetail, setNewFuelRetail] = useState('');

  const canEdit = currentUser?.permissions?.canEditPrices || currentUser?.role === 'admin';
  const canEditMarket = currentUser?.permissions?.canEditMarketPrices || currentUser?.role === 'admin';

  const handleSavePrices = () => {
    updatePrices({
      diesel: dieselPrices,
      aviationAndPetrol: petrolPrices,
      updatedAt: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    }, currentUser?.username);
    setEditPricesModal(false);
    Alert.alert('Успешно', 'Цены на топливо обновлены');
  };

  const handleAddMarketFuel = () => {
    if (!newFuelName.trim()) {
      Alert.alert('Ошибка', 'Введите название топлива');
      return;
    }
    const updated = {
      ...marketPrices,
      fuels: [...marketPrices.fuels, newFuelName],
      prices: {
        ...marketPrices.prices,
        [newFuelName]: {
          "Сингапур": newFuelSingapore || '0 $',
          "Аргус": newFuelArgus || '0 $',
          "Оптовая": newFuelWholesale || '0 ₸',
          "Розница": newFuelRetail || '0 ₸'
        }
      }
    };
    updateMarketPrices(updated, currentUser?.username);
    setNewFuelName('');
    setNewFuelSingapore('');
    setNewFuelArgus('');
    setNewFuelWholesale('');
    setNewFuelRetail('');
    setAddFuelModal(false);
    Alert.alert('Успешно', `Топливо ${newFuelName} добавлено в котировки`);
  };

  return (
    <View style={styles.container}>
      <Header title="Цены и Котировки" subtitle={`Актуалность: ${prices.updatedAt}`} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Admin Bar if user can edit */}
        {canEdit && (
          <View style={styles.adminBar}>
            <TouchableOpacity
              style={styles.adminBtn}
              onPress={() => setEditPricesModal(true)}
            >
              <Ionicons name="create-outline" size={18} color={theme.colors.gold} />
              <Text style={styles.adminBtnText}>Изменить внутренние цены</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.adminBtn}
              onPress={() => setAddFuelModal(true)}
            >
              <Ionicons name="add-circle-outline" size={18} color={theme.colors.gold} />
              <Text style={styles.adminBtnText}>Добавить продукт в рынок</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Diesel Fuel Prices Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bus-outline" size={20} color={theme.colors.gold} />
            <Text style={styles.cardTitle}>Дизельное топливо (Нефтебазы)</Text>
          </View>

          {prices.diesel.map((item, idx) => (
            <View key={idx} style={styles.priceItem}>
              <View>
                <Text style={styles.itemName}>{item.location}</Text>
                <Text style={styles.itemSub}>Прямая отгрузка</Text>
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))}
        </View>

        {/* Aviation & Petrol Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="airplane-outline" size={20} color={theme.colors.gold} />
            <Text style={styles.cardTitle}>Авиатопливо и Бензины</Text>
          </View>

          {prices.aviationAndPetrol.map((item, idx) => (
            <View key={idx} style={styles.priceItem}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>Стандарт качества ISO/JIG</Text>
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))}
        </View>

        {/* Market Analysis / Global Market Prices */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="globe-outline" size={20} color={theme.colors.gold} />
            <Text style={styles.cardTitle}>Рыночные котировки & Индексы</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.th, styles.thFuel]}>Продукт</Text>
                {marketPrices.sources.map((src, i) => (
                  <Text key={i} style={styles.th}>{src}</Text>
                ))}
              </View>

              {marketPrices.fuels.map((fuel, i) => (
                <View key={i} style={styles.tableBodyRow}>
                  <Text style={[styles.td, styles.tdFuel]}>{fuel}</Text>
                  {marketPrices.sources.map((src, j) => (
                    <Text key={j} style={styles.td}>
                      {marketPrices.prices[fuel]?.[src] || '-'}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

      </ScrollView>

      {/* Modal: Edit Internal Prices */}
      <Modal visible={editPricesModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Редактировать внутренние цены</Text>

            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={styles.sectionLabel}>Дизельное топливо:</Text>
              {dieselPrices.map((item, idx) => (
                <View key={idx} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{item.location}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={item.price}
                    onChangeText={(val) => {
                      const updated = [...dieselPrices];
                      updated[idx].price = val;
                      setDieselPrices(updated);
                    }}
                  />
                </View>
              ))}

              <Text style={[styles.sectionLabel, { marginTop: 15 }]}>Авиа и Бензины:</Text>
              {petrolPrices.map((item, idx) => (
                <View key={idx} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{item.name}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={item.price}
                    onChangeText={(val) => {
                      const updated = [...petrolPrices];
                      updated[idx].price = val;
                      setPetrolPrices(updated);
                    }}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setEditPricesModal(false)}
              >
                <Text style={styles.cancelBtnText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSavePrices}
              >
                <Text style={styles.saveBtnText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Add Market Product */}
      <Modal visible={addFuelModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить продукт в котировки</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Название топлива</Text>
              <TextInput
                style={styles.textInput}
                placeholder="напр. Мазут 100"
                placeholderTextColor={theme.colors.textMuted}
                value={newFuelName}
                onChangeText={setNewFuelName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Сингапур ($)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="850 $"
                placeholderTextColor={theme.colors.textMuted}
                value={newFuelSingapore}
                onChangeText={setNewFuelSingapore}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Аргус ($)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="840 $"
                placeholderTextColor={theme.colors.textMuted}
                value={newFuelArgus}
                onChangeText={setNewFuelArgus}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Оптовая (₸)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="250 000 ₸"
                placeholderTextColor={theme.colors.textMuted}
                value={newFuelWholesale}
                onChangeText={setNewFuelWholesale}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Розница (₸)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="240 ₸/л"
                placeholderTextColor={theme.colors.textMuted}
                value={newFuelRetail}
                onChangeText={setNewFuelRetail}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setAddFuelModal(false)}
              >
                <Text style={styles.cancelBtnText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleAddMarketFuel}
              >
                <Text style={styles.saveBtnText}>Добавить</Text>
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
  adminBar: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  adminBtn: {
    flex: 1,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  adminBtnText: {
    color: theme.colors.cream,
    fontSize: 11,
    fontWeight: '600',
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
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    color: theme.colors.cream,
    fontSize: 15,
    fontWeight: '700',
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  itemName: {
    color: theme.colors.cream,
    fontSize: 14,
    fontWeight: '600',
  },
  itemSub: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  itemPrice: {
    color: theme.colors.gold,
    fontSize: 16,
    fontWeight: '800',
  },
  tableContainer: {
    minWidth: 400,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 8,
  },
  tableBodyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    paddingVertical: 10,
  },
  th: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  thFuel: {
    flex: 1.5,
    textAlign: 'left',
  },
  td: {
    color: theme.colors.cream,
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  tdFuel: {
    flex: 1.5,
    textAlign: 'left',
    fontWeight: '600',
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
  sectionLabel: {
    color: theme.colors.cream,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
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
