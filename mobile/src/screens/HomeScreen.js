import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = ({ navigation }) => {
  const { prices, news, tanks } = useData();
  const { currentUser } = useAuth();

  const totalCapacity = tanks.reduce((acc, t) => acc + (t.maxCapacity || 50000), 0);
  const totalVolume = tanks.reduce((acc, t) => acc + t.value, 0);
  const averageFillLevel = Math.round((totalVolume / totalCapacity) * 100) || 0;

  return (
    <View style={styles.container}>
      <Header subtitle="Система управления нефтепродуктами и мониторинга" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../assets/kart1.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerBadge}>MERCURY ENERGY</Text>
            <Text style={styles.bannerTitle}>Надёжное снабжение и высокотехнологичный учёт</Text>
            <Text style={styles.bannerSub}>Международные стандарты JIG 2 & ISO</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Prices')}
            activeOpacity={0.8}
          >
            <View style={styles.statHeader}>
              <Ionicons name="pricetag-outline" size={20} color={theme.colors.gold} />
              <Text style={styles.statTitle}>Дизель Атырау</Text>
            </View>
            <Text style={styles.statValue}>{prices.diesel[0]?.price || '285 ₸/л'}</Text>
            <Text style={styles.statSub}>Обновлено {prices.updatedAt}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Tanks')}
            activeOpacity={0.8}
          >
            <View style={styles.statHeader}>
              <Ionicons name="cube-outline" size={20} color={theme.colors.gold} />
              <Text style={styles.statTitle}>Заполнение баков</Text>
            </View>
            <Text style={styles.statValue}>{averageFillLevel}%</Text>
            <Text style={styles.statSub}>{tanks.length} резервуаров онлайн</Text>
          </TouchableOpacity>
        </View>

        {/* Prices Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="analytics-outline" size={20} color={theme.colors.gold} />
              <Text style={styles.cardTitle}>Текущие цены на топливо</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Prices')}>
              <Text style={styles.linkText}>Все цены →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Бензин АИ-92</Text>
            <Text style={styles.priceVal}>{prices.aviationAndPetrol.find(p => p.name.includes('92'))?.price || '225 ₸/л'}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Бензин АИ-95</Text>
            <Text style={styles.priceVal}>{prices.aviationAndPetrol.find(p => p.name.includes('95'))?.price || '235 ₸/л'}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Авиатопливо (Jet A-1)</Text>
            <Text style={styles.priceVal}>{prices.aviationAndPetrol.find(p => p.name.includes('Jet'))?.price || 'по запросу'}</Text>
          </View>
        </View>

        {/* Quick Actions Bar */}
        <Text style={styles.sectionTitle}>Быстрые действия</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Prices')}
          >
            <Ionicons name="cash-outline" size={22} color={theme.colors.gold} />
            <Text style={styles.actionBtnText}>Котировки</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Tanks')}
          >
            <Ionicons name="calculator-outline" size={22} color={theme.colors.gold} />
            <Text style={styles.actionBtnText}>Бернулли калькулятор</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('News')}
          >
            <Ionicons name="newspaper-outline" size={22} color={theme.colors.gold} />
            <Text style={styles.actionBtnText}>Новости компании</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Contacts')}
          >
            <Ionicons name="call-outline" size={22} color={theme.colors.gold} />
            <Text style={styles.actionBtnText}>Контакты</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* News Feed Preview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="flame-outline" size={20} color={theme.colors.gold} />
              <Text style={styles.cardTitle}>Последние новости</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('News')}>
              <Text style={styles.linkText}>Читать все →</Text>
            </TouchableOpacity>
          </View>

          {news.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.newsItem}
              onPress={() => navigation.navigate('News')}
            >
              <Text style={styles.newsDate}>{item.date}</Text>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsContent} numberOfLines={2}>{item.content}</Text>
            </TouchableOpacity>
          ))}
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
    height: 180,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    position: 'relative',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.65,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(26, 15, 10, 0.75)',
  },
  bannerBadge: {
    color: theme.colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  bannerTitle: {
    color: theme.colors.cream,
    fontSize: 16,
    fontWeight: '700',
  },
  bannerSub: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statTitle: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  statValue: {
    color: theme.colors.gold,
    fontSize: 20,
    fontWeight: '800',
  },
  statSub: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 4,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: theme.colors.cream,
    fontSize: 15,
    fontWeight: '700',
  },
  linkText: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  priceLabel: {
    color: theme.colors.cream,
    fontSize: 13,
  },
  priceVal: {
    color: theme.colors.gold,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    color: theme.colors.cream,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  actionsRow: {
    marginBottom: theme.spacing.md,
  },
  actionBtn: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 110,
  },
  actionBtnText: {
    color: theme.colors.cream,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  newsItem: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  newsDate: {
    color: theme.colors.gold,
    fontSize: 10,
    fontWeight: '600',
  },
  newsTitle: {
    color: theme.colors.cream,
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 2,
  },
  newsContent: {
    color: theme.colors.textMuted,
    fontSize: 12,
  }
});
