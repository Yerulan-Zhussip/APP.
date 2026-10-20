import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Tag, Database, Newspaper, User } from 'lucide-react-native';
import { COLORS } from '../theme/theme';

export type TabKey = 'home' | 'prices' | 'tanks' | 'news' | 'profile';

interface BottomTabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets();

  const tabs: { key: TabKey; label: string; icon: React.FC<{ color: string; size: number }> }[] = [
    { key: 'home', label: 'Главная', icon: Home },
    { key: 'prices', label: 'Цены', icon: Tag },
    { key: 'tanks', label: 'Нефтебаза', icon: Database },
    { key: 'news', label: 'Новости', icon: Newspaper },
    { key: 'profile', label: 'Профиль', icon: User },
  ];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          const iconColor = isActive ? COLORS.black : COLORS.creamMuted;

          return (
            <Pressable
              key={tab.key}
              style={[styles.tabItem, isActive && styles.activeTabItem]}
              onPress={() => onTabChange(tab.key)}
            >
              <Icon size={20} color={iconColor} />
              <Text style={[styles.tabLabel, { color: isActive ? COLORS.black : COLORS.creamMuted }]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 6,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.gold,
    borderRadius: 24,
    padding: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 18,
    minWidth: 58,
  },
  activeTabItem: {
    backgroundColor: COLORS.cream,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
});
