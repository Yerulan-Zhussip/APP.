import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import {
  Database,
  Calculator,
  Filter,
  BarChart2,
  AlertTriangle,
} from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { TankGaugeCard } from '../components/TankGaugeCard';
import { COLORS } from '../theme/theme';
import { useApp } from '../context/AppContext';
import { CityName } from '../types';
import { INITIAL_CITIES, bernoulliProbability } from '../data/initialData';

export const TanksScreen: React.FC = () => {
  const { tanks, selectedCity, setSelectedCity } = useApp();

  // Bernoulli calculator state
  const [n, setN] = useState('10');
  const [p, setP] = useState('0.5');

  const numN = parseInt(n, 10) || 10;
  const numP = parseFloat(p) || 0.5;

  const filteredTanks =
    selectedCity === 'All'
      ? tanks
      : tanks.filter((t) => t.city === selectedCity);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* City Filters */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <Filter size={16} color={COLORS.gold} />
          <Text style={styles.filterTitle}>Выберите объект (Город)</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            <Pressable
              style={[
                styles.cityChip,
                selectedCity === 'All' && styles.cityChipActive,
              ]}
              onPress={() => setSelectedCity('All')}
            >
              <Text
                style={[
                  styles.cityChipText,
                  selectedCity === 'All' && styles.cityChipTextActive,
                ]}
              >
                Все объекты ({tanks.length})
              </Text>
            </Pressable>

            {INITIAL_CITIES.map((c) => {
              const isActive = selectedCity === c.name;
              return (
                <Pressable
                  key={c.name}
                  style={[styles.cityChip, isActive && styles.cityChipActive]}
                  onPress={() => setSelectedCity(c.name as CityName)}
                >
                  <Text
                    style={[
                      styles.cityChipText,
                      isActive && styles.cityChipTextActive,
                    ]}
                  >
                    {c.label} ({c.count})
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Tanks List */}
      <View style={styles.tanksSection}>
        <Text style={styles.sectionHeaderTitle}>
          Резервуарный парк {selectedCity !== 'All' ? `(${selectedCity})` : ''}
        </Text>

        {filteredTanks.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <AlertTriangle size={28} color={COLORS.gold} />
            <Text style={styles.emptyText}>Резервуары не найдены</Text>
          </GlassCard>
        ) : (
          filteredTanks.map((tank) => (
            <TankGaugeCard key={tank.id} tank={tank} />
          ))
        )}
      </View>

      {/* Math Logic: Bernoulli Probability Calculator */}
      <GlassCard variant="goldBorder" style={styles.calcCard}>
        <View style={styles.calcHeader}>
          <Calculator size={20} color={COLORS.gold} />
          <Text style={styles.calcTitle}>Бернулли үлестірімі (n, p)</Text>
        </View>

        <Text style={styles.calcDesc}>
          Расчёт вероятностей наступления событий при регулярных поставках топлива (Формула Бернулли).
        </Text>

        <View style={styles.inputsRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Количество испытаний (n)</Text>
            <TextInput
              style={styles.input}
              value={n}
              onChangeText={setN}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Вероятность успеха (p)</Text>
            <TextInput
              style={styles.input}
              value={p}
              onChangeText={setP}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Probability Table Result */}
        <View style={styles.probTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.thCell}>Успехов (k)</Text>
            <Text style={styles.thCell}>Вероятность P(k)</Text>
          </View>

          {Array.from({ length: Math.min(numN + 1, 6) }).map((_, k) => {
            const prob = (bernoulliProbability(numN, k, numP) * 100).toFixed(2);
            return (
              <View key={k} style={styles.tableRow}>
                <Text style={styles.tdCell}>k = {k}</Text>
                <Text style={styles.tdCellProb}>{prob}%</Text>
              </View>
            );
          })}
        </View>
      </GlassCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  filterTitle: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cityChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.2)',
  },
  cityChipActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.goldLight,
  },
  cityChipText: {
    color: COLORS.creamMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  cityChipTextActive: {
    color: COLORS.black,
    fontWeight: '800',
  },
  tanksSection: {
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 30,
    gap: 10,
  },
  emptyText: {
    color: COLORS.creamMuted,
    fontSize: 14,
  },
  calcCard: {
    marginTop: 10,
  },
  calcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  calcTitle: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '700',
  },
  calcDesc: {
    color: COLORS.creamMuted,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 14,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    color: COLORS.cream,
    fontSize: 11,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
    color: COLORS.cream,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  probTable: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gold,
    paddingBottom: 6,
    marginBottom: 6,
  },
  thCell: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  tdCell: {
    color: COLORS.cream,
    fontSize: 12,
  },
  tdCellProb: {
    color: COLORS.emeraldLight,
    fontSize: 12,
    fontWeight: '700',
  },
});
