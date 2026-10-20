import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shield, LogOut, UserCircle } from 'lucide-react-native';
import { COLORS, SHADOWS } from '../theme/theme';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onProfilePress?: () => void;
}

export const SafeAreaHeader: React.FC<HeaderProps> = ({ onProfilePress }) => {
  const insets = useSafeAreaInsets();
  const { currentUser, logout } = useApp();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.content}>
        {/* Logo & Brand Name */}
        <View style={styles.brandRow}>
          <View style={[styles.logoBadge, SHADOWS.goldGlow]}>
            <View style={styles.logoInner}>
              <Text style={styles.logoText}>ME</Text>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.brandTitle}>SmartME</Text>
            <Text style={styles.brandSub}>Mercury Energy</Text>
          </View>
        </View>

        {/* User Badge / Status */}
        {currentUser ? (
          <View style={styles.userSection}>
            <Pressable style={styles.profileBadge} onPress={onProfilePress}>
              <Shield size={14} color={COLORS.gold} />
              <Text style={styles.userName} numberOfLines={1}>
                {currentUser.firstName}
              </Text>
            </Pressable>
            <Pressable style={styles.logoutBtn} onPress={logout}>
              <LogOut size={16} color={COLORS.red} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.loginBtn} onPress={onProfilePress}>
            <UserCircle size={16} color={COLORS.gold} />
            <Text style={styles.loginText}>Вход</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197, 160, 89, 0.15)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.gold,
    padding: 2,
  },
  logoInner: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.gold,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    color: COLORS.cream,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandSub: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(197, 160, 89, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
  },
  userName: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 80,
  },
  logoutBtn: {
    padding: 6,
    backgroundColor: COLORS.redBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  loginText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },
});
