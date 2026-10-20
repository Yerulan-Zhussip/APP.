import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Tank } from '../types';
import { COLORS } from '../theme/theme';
import { Database } from 'lucide-react-native';

interface TankGaugeCardProps {
  tank: Tank;
  style?: ViewStyle;
}

export const TankGaugeCard: React.FC<TankGaugeCardProps> = ({ tank, style }) => {
  const percentage = Math.round((tank.value / tank.max) * 100);

  const getStatusColor = () => {
    if (percentage > 70) return COLORS.emerald;
    if (percentage > 30) return COLORS.gold;
    return COLORS.red;
  };

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Database size={16} color={COLORS.gold} />
          <Text style={styles.tankName}>{tank.name}</Text>
        </View>
        <Text style={[styles.percentText, { color: getStatusColor() }]}>{percentage}%</Text>
      </View>

      <Text style={styles.contentLabel}>{tank.content}</Text>

      {/* Progress Gauge Bar */}
      <View style={styles.gaugeTrack}>
        <View
          style={[
            styles.gaugeFill,
            {
              width: `${percentage}%`,
              backgroundColor: getStatusColor(),
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.valueText}>
          {tank.value.toLocaleString('ru-RU')} л
        </Text>
        <Text style={styles.maxText}>
          из {tank.max.toLocaleString('ru-RU')} л
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tankName: {
    color: COLORS.cream,
    fontWeight: '700',
    fontSize: 14,
  },
  percentText: {
    fontWeight: '800',
    fontSize: 15,
  },
  contentLabel: {
    color: COLORS.creamMuted,
    fontSize: 11,
    marginTop: 4,
    marginBottom: 10,
  },
  gaugeTrack: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueText: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '600',
  },
  maxText: {
    color: COLORS.creamMuted,
    fontSize: 11,
  },
});
