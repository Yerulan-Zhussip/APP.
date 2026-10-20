import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SHADOWS } from '../theme/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'goldBorder' | 'subtle';
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, variant = 'default' }) => {
  const getBorderStyle = () => {
    if (variant === 'goldBorder') return styles.goldBorder;
    if (variant === 'subtle') return styles.subtleBorder;
    return styles.defaultBorder;
  };

  return (
    <View style={[styles.card, getBorderStyle(), SHADOWS.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  defaultBorder: {
    borderColor: COLORS.cardBorder,
  },
  goldBorder: {
    borderColor: COLORS.gold,
  },
  subtleBorder: {
    borderColor: 'rgba(197, 160, 89, 0.12)',
  },
});
