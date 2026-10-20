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
import {
  User,
  Shield,
  LogOut,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  KeyRound,
  CheckCircle,
  Users,
} from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { COLORS } from '../theme/theme';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO, INITIAL_USERS } from '../data/initialData';

export const ProfileScreen: React.FC = () => {
  const { currentUser, login, logout, logs } = useApp();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleLogin = () => {
    if (!usernameInput || !passwordInput) {
      Alert.alert('Ошибка', 'Заполните логин и пароль');
      return;
    }

    const success = login(usernameInput, passwordInput);
    if (!success) {
      Alert.alert('Ошибка', 'Неверное имя пользователя или пароль');
    } else {
      setUsernameInput('');
      setPasswordInput('');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {currentUser ? (
        <View style={styles.sectionGap}>
          {/* User Profile Card */}
          <GlassCard variant="goldBorder" style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarCircle}>
                <User size={32} color={COLORS.gold} />
              </View>

              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>
                  {currentUser.firstName} {currentUser.lastName}
                </Text>
                <Text style={styles.profileRole}>
                  {currentUser.position} • {currentUser.role.toUpperCase()}
                </Text>
                <View style={styles.cabinetBadge}>
                  <Text style={styles.cabinetText}>Кабинет: {currentUser.cabinet}</Text>
                </View>
              </View>
            </View>

            {/* User Permissions Badges */}
            <View style={styles.permSection}>
              <Text style={styles.permTitle}>Права доступа:</Text>
              <View style={styles.permList}>
                {currentUser.permissions.canEditPrices && (
                  <View style={styles.permBadge}>
                    <CheckCircle size={12} color={COLORS.emeraldLight} />
                    <Text style={styles.permBadgeText}>Изменение цен</Text>
                  </View>
                )}
                {currentUser.permissions.canEditTanks && (
                  <View style={styles.permBadge}>
                    <CheckCircle size={12} color={COLORS.emeraldLight} />
                    <Text style={styles.permBadgeText}>Управление резервуарами</Text>
                  </View>
                )}
                {currentUser.permissions.canAddNews && (
                  <View style={styles.permBadge}>
                    <CheckCircle size={12} color={COLORS.emeraldLight} />
                    <Text style={styles.permBadgeText}>Публикация новостей</Text>
                  </View>
                )}
              </View>
            </View>

            <Pressable style={styles.logoutBtn} onPress={logout}>
              <LogOut size={16} color={COLORS.red} />
              <Text style={styles.logoutText}>Выйти из системы</Text>
            </Pressable>
          </GlassCard>

          {/* Audit Logs */}
          <GlassCard style={styles.logsCard}>
            <Text style={styles.sectionTitle}>Журнал действий</Text>
            {logs.length === 0 ? (
              <Text style={styles.emptyLogs}>Нет последних действий</Text>
            ) : (
              logs.slice(0, 5).map((log) => (
                <View key={log.id} style={styles.logRow}>
                  <View style={styles.logTimeCol}>
                    <Text style={styles.logTime}>{log.timestamp}</Text>
                  </View>
                  <View style={styles.logInfoCol}>
                    <Text style={styles.logAction}>{log.action}</Text>
                    <Text style={styles.logDetails}>{log.details}</Text>
                  </View>
                </View>
              ))
            )}
          </GlassCard>
        </View>
      ) : (
        /* Login Form */
        <GlassCard variant="goldBorder" style={styles.loginCard}>
          <View style={styles.loginHeader}>
            <Shield size={32} color={COLORS.gold} />
            <Text style={styles.loginTitle}>Вход в корпоративную систему</Text>
            <Text style={styles.loginSub}>Smart Mercury Energy Terminal</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Логин</Text>
            <TextInput
              style={styles.input}
              value={usernameInput}
              onChangeText={setUsernameInput}
              autoCapitalize="none"
              placeholder="admin / manager"
              placeholderTextColor={COLORS.creamMuted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Пароль</Text>
            <TextInput
              style={styles.input}
              value={passwordInput}
              onChangeText={setPasswordInput}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={COLORS.creamMuted}
            />
          </View>

          <Pressable style={styles.submitLoginBtn} onPress={handleLogin}>
            <KeyRound size={18} color={COLORS.black} />
            <Text style={styles.submitLoginText}>Войти</Text>
          </Pressable>

          <View style={styles.demoNote}>
            <Text style={styles.demoTitle}>Демо учётные записи:</Text>
            <Text style={styles.demoText}>• Admin: admin / admin</Text>
            <Text style={styles.demoText}>• Manager: manager / 123</Text>
          </View>
        </GlassCard>
      )}

      {/* Company Info Section */}
      <GlassCard style={styles.companyCard}>
        <View style={styles.companyHeader}>
          <Building2 size={20} color={COLORS.gold} />
          <Text style={styles.companyTitle}>О компании Mercury Energy</Text>
        </View>
        <Text style={styles.companyDesc}>{COMPANY_INFO.description}</Text>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Руководство компании</Text>
        <View style={styles.leadershipList}>
          {COMPANY_INFO.leadership.map((person, idx) => (
            <View key={idx} style={styles.leaderRow}>
              <Users size={16} color={COLORS.gold} />
              <View style={styles.leaderInfo}>
                <Text style={styles.leaderName}>{person.name}</Text>
                <Text style={styles.leaderTitle}>{person.title}</Text>
              </View>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Contact Details */}
      <GlassCard style={styles.contactCard}>
        <Text style={styles.companyTitle}>Контакты и поддержка</Text>

        <View style={styles.contactItem}>
          <MapPin size={16} color={COLORS.gold} />
          <Text style={styles.contactText}>{COMPANY_INFO.contacts.address}</Text>
        </View>

        <View style={styles.contactItem}>
          <Phone size={16} color={COLORS.gold} />
          <Text style={styles.contactText}>{COMPANY_INFO.contacts.phone}</Text>
        </View>

        <View style={styles.contactItem}>
          <Mail size={16} color={COLORS.gold} />
          <Text style={styles.contactText}>{COMPANY_INFO.contacts.email}</Text>
        </View>

        <View style={styles.contactItem}>
          <Clock size={16} color={COLORS.gold} />
          <Text style={styles.contactText}>{COMPANY_INFO.contacts.hours}</Text>
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
  sectionGap: {
    gap: 16,
    marginBottom: 16,
  },
  profileCard: {
    padding: 18,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: COLORS.cream,
    fontSize: 18,
    fontWeight: '800',
  },
  profileRole: {
    color: COLORS.gold,
    fontSize: 11,
    marginTop: 2,
  },
  cabinetBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
  },
  cabinetText: {
    color: COLORS.creamMuted,
    fontSize: 10,
  },
  permSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(197, 160, 89, 0.15)',
    paddingTop: 12,
    marginBottom: 16,
  },
  permTitle: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  permList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  permBadgeText: {
    color: COLORS.emeraldLight,
    fontSize: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.redBg,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    color: COLORS.red,
    fontWeight: '700',
    fontSize: 13,
  },
  logsCard: {
    padding: 16,
  },
  sectionTitle: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  emptyLogs: {
    color: COLORS.creamMuted,
    fontSize: 12,
  },
  logRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  logTimeCol: {
    width: 50,
  },
  logTime: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  logInfoCol: {
    flex: 1,
  },
  logAction: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '600',
  },
  logDetails: {
    color: COLORS.creamMuted,
    fontSize: 11,
  },
  loginCard: {
    padding: 20,
    marginBottom: 16,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginTitle: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  loginSub: {
    color: COLORS.gold,
    fontSize: 11,
    marginTop: 2,
  },
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: COLORS.cream,
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
    color: COLORS.cream,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  submitLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.gold,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  submitLoginText: {
    color: COLORS.black,
    fontWeight: '800',
    fontSize: 14,
  },
  demoNote: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  demoTitle: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  demoText: {
    color: COLORS.creamMuted,
    fontSize: 11,
  },
  companyCard: {
    marginBottom: 16,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  companyTitle: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '700',
  },
  companyDesc: {
    color: COLORS.creamMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  leadershipList: {
    gap: 10,
    marginTop: 8,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 10,
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
  },
  leaderTitle: {
    color: COLORS.creamMuted,
    fontSize: 11,
  },
  contactCard: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    color: COLORS.cream,
    fontSize: 12,
    flex: 1,
  },
});
