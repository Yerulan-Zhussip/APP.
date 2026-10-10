import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

export const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="О Компании" subtitle="Mercury Energy — Лидер в энергетической логистике" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Company Image Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../assets/kart1.png')}
            style={styles.bannerImg}
            resizeMode="cover"
          />
        </View>

        {/* Mission Statement */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Наша Миссия</Text>
          <Text style={styles.bodyText}>
            Mercury Energy — динамично развивающаяся компания в сфере хранения, логистики и реализации нефтепродуктов, дизельного топлива и авиационного керосина Jet A-1.
          </Text>
          <Text style={[styles.bodyText, { marginTop: 10 }]}>
            Мы обеспечиваем стратегические объемы поставок для авиакомпаний, крупных промышленных предприятий и автозаправочных комплексов по всему Казахстану.
          </Text>
        </View>

        {/* Key Values & Standards */}
        <View style={styles.valuesGrid}>
          <View style={styles.valueCard}>
            <Ionicons name="shield-checkmark" size={28} color={theme.colors.gold} />
            <Text style={styles.valueTitle}>Стандарт JIG 2</Text>
            <Text style={styles.valueSub}>Международные регламенты хранения авиатоплива</Text>
          </View>

          <View style={styles.valueCard}>
            <Ionicons name="hardware-chip" size={28} color={theme.colors.gold} />
            <Text style={styles.valueTitle}>Smart Автоматизация</Text>
            <Text style={styles.valueSub}>Цифровой учёт уровня баков и плотности</Text>
          </View>

          <View style={styles.valueCard}>
            <Ionicons name="ribbon" size={28} color={theme.colors.gold} />
            <Text style={styles.valueTitle}>Контроль Качества</Text>
            <Text style={styles.valueSub}>Собственная аккредитованная лаборатория</Text>
          </View>

          <View style={styles.valueCard}>
            <Ionicons name="git-network" size={28} color={theme.colors.gold} />
            <Text style={styles.valueTitle}>Логистика</Text>
            <Text style={styles.valueSub}>Развитая сеть терминалов в Астане, Алматы, Достык</Text>
          </View>
        </View>

        {/* Executive summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Инфраструктура Нефтебаз</Text>
          <Text style={styles.bodyText}>
            Наши терминалы оснащены высокоскоростными стояками налива, сепараторами фильтрации высокой тонкости и автоматизированными системами измерения объёмов.
          </Text>
        </View>

      </ScrollView>
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
  bannerContainer: {
    height: 160,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    color: theme.colors.gold,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  bodyText: {
    color: theme.colors.cream,
    fontSize: 13,
    lineHeight: 20,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  valueCard: {
    width: '48%',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  valueTitle: {
    color: theme.colors.cream,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  valueSub: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  }
});
