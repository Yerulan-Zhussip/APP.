import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export const Header = ({ title, subtitle, rightElement }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="flame" size={22} color={theme.colors.gold} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.brandTitle}>MERCURY ENERGY</Text>
          {title && <Text style={styles.screenTitle}>{title}</Text>}
        </View>
        {rightElement && <View style={styles.rightContainer}>{rightElement}</View>}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: theme.colors.cardBg,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  brandTitle: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  screenTitle: {
    color: theme.colors.cream,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  rightContainer: {
    justifyContent: 'center',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 6,
  }
});
