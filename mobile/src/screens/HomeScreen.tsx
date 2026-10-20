import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import {
  TrendingUp,
  Flame,
  Award,
  Zap,
  ChevronRight,
  ShieldCheck,
  FileText,
  ArrowUpRight,
} from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { COLORS, SHADOWS } from '../theme/theme';
import { useApp } from '../context/AppContext';
import { TabKey } from '../components/BottomTabBar';

interface HomeScreenProps {
  onNavigate: (tab: TabKey) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { fuelPrices, news, tanks } = useApp();

  // Quick stats calculation
  const totalTanks = tanks.length;
  const avgFill = Math.round(
    tanks.reduce((acc, t) => acc + (t.value / t.max) * 100, 0) / (totalTanks || 1)
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Banner */}
      <View style={[styles.heroCard, SHADOWS.goldGlow]}>
        <View style={styles.heroOverlay}>
          <View style={styles.badge}>
            <Zap size={12} color={COLORS.gold} />
            <Text style={styles.badgeText}>Smart Energy Infrastructure</Text>
          </View>
          <Text style={styles.heroTitle}>Smart Mercury Energy</Text>
          <Text style={styles.heroSub}>
            Надёжные поставки и автоматизированный мониторинг топлива по всему Казахстану
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>{avgFill}%</Text>
              <Text style={styles.heroStatLbl}>Средняя загрузка</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>{totalTanks}</Text>
              <Text style={styles.heroStatLbl}>Резервуаров</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>JIG 2</Text>
              <Text style={styles.heroStatLbl}>Стандарт качества</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActionsRow}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => onNavigate('prices')}
        >
          <View style={styles.actionIconBg}>
            <TrendingUp size={20} color={COLORS.gold} />
          </View>
          <Text style={styles.actionTitle}>Цены</Text>
          <Text style={styles.actionSub}>Котировки</Text>
        </Pressable>

        <Pressable
          style={styles.actionBtn}
          onPress={() => onNavigate('tanks')}
        >
          <View style={styles.actionIconBg}>
            <Flame size={20} color={COLORS.emeraldLight} />
          </View>
          <Text style={styles.actionTitle}>Нефтебаза</Text>
          <Text style={styles.actionSub}>Резервуары</Text>
        </Pressable>

        <Pressable
          style={styles.actionBtn}
          onPress={() => onNavigate('news')}
        >
          <View style={styles.actionIconBg}>
            <FileText size={20} color={COLORS.goldLight} />
          </View>
          <Text style={styles.actionTitle}>Пресс-центр</Text>
          <Text style={styles.actionSub}>Новости</Text>
        </Pressable>
      </View>

      {/* Fuel Prices Preview */}
      <GlassCard style={styles.sectionCard} variant="goldBorder">
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <TrendingUp size={18} color={COLORS.gold} />
            <Text style={styles.sectionTitle}>Цены на дизельное топливо</Text>
          </View>
          <Pressable
            style={styles.moreBtn}
            onPress={() => onNavigate('prices')}
          >
            <Text style={styles.moreText}>Все цены</Text>
            <ChevronRight size={14} color={COLORS.gold} />
          </Pressable>
        </View>

        <View style={styles.priceList}>
          {fuelPrices.diesel.map((item) => (
            <View key={item.id} style={styles.priceRow}>
              <Text style={styles.priceLoc}>{item.location}</Text>
              <Text style={styles.priceVal}>{item.price}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.updateText}>Актуально на: {fuelPrices.updatedAt}</Text>
      </GlassCard>

      {/* Quality Standards & Certifications */}
      <GlassCard style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <ShieldCheck size={18} color={COLORS.emeraldLight} />
          <Text style={styles.sectionTitle}>Стандарты и Безопасность</Text>
        </View>
        <Text style={styles.certDesc}>
          Все процессы заправки и хранения авиатоплива соответствуют международному регламенту JIG 2 (issue 13, 2021).
        </Text>
      </GlassCard>

      {/* Latest News Highlights */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Последние новости</Text>
        <Pressable style={styles.moreBtn} onPress={() => onNavigate('news')}>
          <Text style={styles.moreText}>Все</Text>
          <ChevronRight size={14} color={COLORS.gold} />
        </Pressable>
      </View>

      {news.slice(0, 2).map((item) => (
        <GlassCard key={item.id} style={styles.newsCard}>
          <View style={styles.newsRow}>
            <Image
              source={{ uri: item.img }}
              style={styles.newsImg}
              resizeMode="cover"
            />
            <View style={styles.newsInfo}>
              <View style={styles.newsMeta}>
                <Text style={styles.newsDate}>{item.date}</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendText}>★ {item.trending}%</Text>
                </View>
              </View>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.newsDesc} numberOfLines={2}>
                {item.content}
              </Text>
            </View>
          </View>
        </GlassCard>
      ))}
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
  heroCard: {
    backgroundColor: COLORS.panelBg,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginBottom: 16,
  },
  heroOverlay: {
    padding: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
    marginBottom: 10,
  },
  badgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: COLORS.cream,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSub: {
    color: COLORS.creamMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 15, 10, 0.6)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.15)',
  },
  heroStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  heroStatVal: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '800',
  },
  heroStatLbl: {
    color: COLORS.creamMuted,
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(197, 160, 89, 0.2)',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  actionIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(197, 160, 89, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '700',
  },
  actionSub: {
    color: COLORS.creamMuted,
    fontSize: 10,
    marginTop: 2,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '700',
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  moreText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  priceList: {
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  priceLoc: {
    color: COLORS.cream,
    fontSize: 13,
  },
  priceVal: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '800',
  },
  updateText: {
    color: COLORS.creamMuted,
    fontSize: 10,
    marginTop: 10,
    textAlign: 'right',
  },
  certDesc: {
    color: COLORS.creamMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  newsCard: {
    marginBottom: 10,
  },
  newsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  newsImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: COLORS.panelBg,
  },
  newsInfo: {
    flex: 1,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  newsDate: {
    color: COLORS.creamMuted,
    fontSize: 10,
  },
  trendBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendText: {
    color: COLORS.emeraldLight,
    fontSize: 9,
    fontWeight: '700',
  },
  newsTitle: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  newsDesc: {
    color: COLORS.creamMuted,
    fontSize: 11,
    lineHeight: 15,
  },
});
