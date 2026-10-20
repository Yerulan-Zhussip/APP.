import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { Tag, Globe, Edit3, Check } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { ModalView } from '../components/ModalView';
import { COLORS } from '../theme/theme';
import { useApp } from '../context/AppContext';

export const PricesScreen: React.FC = () => {
  const { fuelPrices, marketPrices, currentUser, updateFuelPrices, updateMarketPrices } = useApp();

  const [activeTab, setActiveTab] = useState<'fuel' | 'market'>('fuel');
  const [modalVisible, setModalVisible] = useState(false);

  // Edit Fuel Price form state
  const [editedDiesel, setEditedDiesel] = useState(fuelPrices.diesel);
  const [editedAviation, setEditedAviation] = useState(fuelPrices.aviationAndPetrol);

  // Edit Market Price form state
  const [editedMarket, setEditedMarket] = useState(marketPrices.prices);

  const canEditPrices = currentUser?.role === 'admin' || currentUser?.permissions.canEditPrices;
  const canEditMarket = currentUser?.role === 'admin' || currentUser?.permissions.canEditMarketPrices;

  const handleSaveFuelPrices = () => {
    updateFuelPrices({
      diesel: editedDiesel,
      aviationAndPetrol: editedAviation,
      updatedAt: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    });
    setModalVisible(false);
    Alert.alert('Успех', 'Топливные цены успешно обновлены');
  };

  const handleSaveMarketPrices = () => {
    updateMarketPrices({
      ...marketPrices,
      prices: editedMarket,
    });
    setModalVisible(false);
    Alert.alert('Успех', 'Рыночные цены успешно обновлены');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Switcher Tabs */}
      <View style={styles.switchRow}>
        <Pressable
          style={[styles.switchBtn, activeTab === 'fuel' && styles.switchBtnActive]}
          onPress={() => setActiveTab('fuel')}
        >
          <Tag size={16} color={activeTab === 'fuel' ? COLORS.black : COLORS.creamMuted} />
          <Text style={[styles.switchText, activeTab === 'fuel' && styles.switchTextActive]}>
            Топливные цены
          </Text>
        </Pressable>

        <Pressable
          style={[styles.switchBtn, activeTab === 'market' && styles.switchBtnActive]}
          onPress={() => setActiveTab('market')}
        >
          <Globe size={16} color={activeTab === 'market' ? COLORS.black : COLORS.creamMuted} />
          <Text style={[styles.switchText, activeTab === 'market' && styles.switchTextActive]}>
            Рыночные цены
          </Text>
        </Pressable>
      </View>

      {/* Edit Trigger Button if permitted */}
      {((activeTab === 'fuel' && canEditPrices) || (activeTab === 'market' && canEditMarket)) && (
        <Pressable style={styles.editTriggerBtn} onPress={() => setModalVisible(true)}>
          <Edit3 size={16} color={COLORS.gold} />
          <Text style={styles.editTriggerText}>
            Редактировать {activeTab === 'fuel' ? 'топливные' : 'рыночные'} цены
          </Text>
        </Pressable>
      )}

      {activeTab === 'fuel' ? (
        <View style={styles.sectionGap}>
          {/* Diesel Fuel */}
          <GlassCard variant="goldBorder">
            <Text style={styles.cardSectionTitle}>Дизельное топливо</Text>
            <View style={styles.itemList}>
              {fuelPrices.diesel.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.location}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Aviation & Petrol */}
          <GlassCard variant="goldBorder">
            <Text style={styles.cardSectionTitle}>Авиатопливо и бензин</Text>
            <View style={styles.itemList}>
              {fuelPrices.aviationAndPetrol.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          <Text style={styles.updatedAtText}>Обновлено: {fuelPrices.updatedAt}</Text>
        </View>
      ) : (
        <View style={styles.sectionGap}>
          {/* Market Price Table */}
          <GlassCard>
            <Text style={styles.cardSectionTitle}>Мировые & Оптовые Котировки</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tableContainer}>
                {/* Header Row */}
                <View style={styles.tableRowHeader}>
                  <Text style={[styles.tableCellHeader, styles.cellFuel]}>Топливо</Text>
                  {marketPrices.sources.map((src) => (
                    <Text key={src} style={styles.tableCellHeader}>
                      {src}
                    </Text>
                  ))}
                </View>

                {/* Data Rows */}
                {marketPrices.fuels.map((fuel) => (
                  <View key={fuel} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.cellFuel, { fontWeight: '700' }]}>
                      {fuel}
                    </Text>
                    {marketPrices.sources.map((src) => (
                      <Text key={src} style={styles.tableCell}>
                        {marketPrices.prices[fuel]?.[src] || '—'}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </GlassCard>
        </View>
      )}

      {/* Edit Modal */}
      <ModalView
        visible={modalVisible}
        title={activeTab === 'fuel' ? 'Редактирование цен' : 'Редактирование рынка'}
        onClose={() => setModalVisible(false)}
      >
        {activeTab === 'fuel' ? (
          <View style={styles.formContainer}>
            <Text style={styles.formSectionHeader}>Дизельное топливо</Text>
            {editedDiesel.map((item, idx) => (
              <View key={item.id} style={styles.formGroup}>
                <Text style={styles.inputLabel}>{item.location}</Text>
                <TextInput
                  style={styles.textInput}
                  value={item.price}
                  onChangeText={(val) => {
                    const next = [...editedDiesel];
                    next[idx].price = val;
                    setEditedDiesel(next);
                  }}
                />
              </View>
            ))}

            <Text style={[styles.formSectionHeader, { marginTop: 16 }]}>Авиатопливо и бензин</Text>
            {editedAviation.map((item, idx) => (
              <View key={item.id} style={styles.formGroup}>
                <Text style={styles.inputLabel}>{item.name}</Text>
                <TextInput
                  style={styles.textInput}
                  value={item.price}
                  onChangeText={(val) => {
                    const next = [...editedAviation];
                    next[idx].price = val;
                    setEditedAviation(next);
                  }}
                />
              </View>
            ))}

            <Pressable style={styles.saveBtn} onPress={handleSaveFuelPrices}>
              <Check size={18} color={COLORS.black} />
              <Text style={styles.saveBtnText}>Сохранить изменения</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.formContainer}>
            {marketPrices.fuels.map((fuel) => (
              <View key={fuel} style={styles.marketFuelGroup}>
                <Text style={styles.formSectionHeader}>{fuel}</Text>
                {marketPrices.sources.map((src) => (
                  <View key={src} style={styles.formGroup}>
                    <Text style={styles.inputLabel}>{src}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editedMarket[fuel]?.[src] || ''}
                      onChangeText={(val) => {
                        setEditedMarket((prev) => ({
                          ...prev,
                          [fuel]: {
                            ...(prev[fuel] || {}),
                            [src]: val,
                          },
                        }));
                      }}
                    />
                  </View>
                ))}
              </View>
            ))}

            <Pressable style={styles.saveBtn} onPress={handleSaveMarketPrices}>
              <Check size={18} color={COLORS.black} />
              <Text style={styles.saveBtnText}>Сохранить котировки</Text>
            </Pressable>
          </View>
        )}
      </ModalView>
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
  switchRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.15)',
  },
  switchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  switchBtnActive: {
    backgroundColor: COLORS.gold,
  },
  switchText: {
    color: COLORS.creamMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  switchTextActive: {
    color: COLORS.black,
    fontWeight: '700',
  },
  editTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 16,
  },
  editTriggerText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionGap: {
    gap: 16,
  },
  cardSectionTitle: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  itemList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  itemName: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '500',
  },
  itemPrice: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '800',
  },
  updatedAtText: {
    color: COLORS.creamMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  tableContainer: {
    minWidth: 320,
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gold,
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableCellHeader: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
    width: 75,
    textAlign: 'center',
  },
  cellFuel: {
    width: 90,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  tableCell: {
    color: COLORS.cream,
    fontSize: 12,
    width: 75,
    textAlign: 'center',
  },
  formContainer: {
    gap: 12,
  },
  formSectionHeader: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  marketFuelGroup: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197, 160, 89, 0.2)',
    paddingBottom: 10,
  },
  formGroup: {
    marginBottom: 8,
  },
  inputLabel: {
    color: COLORS.creamMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
    color: COLORS.cream,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.gold,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 12,
  },
  saveBtnText: {
    color: COLORS.black,
    fontWeight: '800',
    fontSize: 14,
  },
});
