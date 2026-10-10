import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen = () => {
  const { currentUser, users, login, logout, addUser } = useAuth();
  const { changeLogs } = useData();

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');

  // Modals state
  const [logsModal, setLogsModal] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);

  // New employee state
  const [newUName, setNewUName] = useState('');
  const [newUPass, setNewUPass] = useState('');
  const [newUFirstName, setNewUFirstName] = useState('');
  const [newULastName, setNewULastName] = useState('');
  const [newUPosition, setNewUPosition] = useState('Оператор');

  const handleLogin = () => {
    if (!login(username, password)) {
      Alert.alert('Ошибка входа', 'Неверный логин или пароль');
    }
  };

  const handleCreateEmployee = () => {
    if (!newUName.trim() || !newUPass.trim() || !newUFirstName.trim()) {
      Alert.alert('Ошибка', 'Заполните обязательные поля');
      return;
    }
    addUser({
      username: newUName,
      password: newUPass,
      role: "operator",
      firstName: newUFirstName,
      lastName: newULastName || "",
      position: newUPosition,
      permissions: {
        viewTanks: "all",
        canEditPrices: false,
        canEditTanks: true,
        canAddNews: false,
        canViewMarketPrices: true,
        canEditMarketPrices: false
      },
      lastSeen: Date.now()
    });
    setNewUName('');
    setNewUPass('');
    setNewUFirstName('');
    setNewULastName('');
    setAddUserModal(false);
    Alert.alert('Успешно', 'Новый сотрудник зарегистрирован');
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Header title="Авторизация" subtitle="Вход в личный кабинет Mercury Energy" />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.loginBadge}>
              <Ionicons name="lock-closed" size={32} color={theme.colors.gold} />
            </View>
            <Text style={styles.loginTitle}>Вход в систему</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Логин</Text>
              <TextInput
                style={styles.textInput}
                placeholder="admin"
                placeholderTextColor={theme.colors.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Пароль</Text>
              <TextInput
                style={styles.textInput}
                placeholder="••••••"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleLogin}>
              <Text style={styles.submitBtnText}>Войти</Text>
            </TouchableOpacity>

            <Text style={styles.hintText}>Тестовый доступ: admin / admin</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <View style={styles.container}>
      <Header title="Личный кабинет" subtitle={`${currentUser.firstName} ${currentUser.lastName}`} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.userHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={32} color={theme.colors.gold} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.firstName} {currentUser.lastName}</Text>
              <Text style={styles.userRole}>{currentUser.position || 'Сотрудник'} ({currentUser.role})</Text>
              <Text style={styles.userCabinet}>Кабинет: {currentUser.cabinet || '101'}</Text>
            </View>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.actionRow}>
            {isAdmin && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => setAddUserModal(true)}>
                <Ionicons name="person-add-outline" size={18} color={theme.colors.gold} />
                <Text style={styles.actionBtnText}>Сотрудники</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionBtn} onPress={() => setLogsModal(true)}>
              <Ionicons name="time-outline" size={18} color={theme.colors.gold} />
              <Text style={styles.actionBtnText}>Журнал действий</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Permissions Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Права доступа и разрешения</Text>

          <View style={styles.permRow}>
            <Text style={styles.permLabel}>Редактирование цен:</Text>
            <Ionicons
              name={currentUser.permissions?.canEditPrices ? "checkmark-circle" : "close-circle"}
              size={20}
              color={currentUser.permissions?.canEditPrices ? theme.colors.success : theme.colors.danger}
            />
          </View>

          <View style={styles.permRow}>
            <Text style={styles.permLabel}>Управление резервуарами:</Text>
            <Ionicons
              name={currentUser.permissions?.canEditTanks ? "checkmark-circle" : "close-circle"}
              size={20}
              color={currentUser.permissions?.canEditTanks ? theme.colors.success : theme.colors.danger}
            />
          </View>

          <View style={styles.permRow}>
            <Text style={styles.permLabel}>Публикация новостей:</Text>
            <Ionicons
              name={currentUser.permissions?.canAddNews ? "checkmark-circle" : "close-circle"}
              size={20}
              color={currentUser.permissions?.canAddNews ? theme.colors.success : theme.colors.danger}
            />
          </View>

          <View style={styles.permRow}>
            <Text style={styles.permLabel}>Редактирование рыночных котировок:</Text>
            <Ionicons
              name={currentUser.permissions?.canEditMarketPrices ? "checkmark-circle" : "close-circle"}
              size={20}
              color={currentUser.permissions?.canEditMarketPrices ? theme.colors.success : theme.colors.danger}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
          <Text style={styles.logoutBtnText}>Выйти из аккаунта</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Logs Modal */}
      <Modal visible={logsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Журнал изменений</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {changeLogs.map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <Text style={styles.logTime}>{log.time}</Text>
                  <Text style={styles.logUser}>[{log.user}] {log.action}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setLogsModal(false)}>
              <Text style={styles.closeBtnText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Employee Modal */}
      <Modal visible={addUserModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить сотрудника</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Логин *</Text>
              <TextInput style={styles.textInput} value={newUName} onChangeText={setNewUName} autoCapitalize="none" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Пароль *</Text>
              <TextInput style={styles.textInput} value={newUPass} onChangeText={setNewUPass} secureTextEntry />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Имя *</Text>
              <TextInput style={styles.textInput} value={newUFirstName} onChangeText={setNewUFirstName} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Фамилия</Text>
              <TextInput style={styles.textInput} value={newULastName} onChangeText={setNewULastName} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Должность</Text>
              <TextInput style={styles.textInput} value={newUPosition} onChangeText={setNewUPosition} />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setAddUserModal(false)}>
                <Text style={styles.cancelBtnText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleCreateEmployee}>
                <Text style={styles.saveBtnText}>Создать</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    marginBottom: theme.spacing.md,
  },
  loginBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  loginTitle: {
    color: theme.colors.cream,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: theme.spacing.md,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: theme.colors.cream,
    fontSize: 16,
    fontWeight: '700',
  },
  userRole: {
    color: theme.colors.gold,
    fontSize: 12,
    marginTop: 2,
  },
  userCabinet: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingTop: theme.spacing.md,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#1a0f0a',
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnText: {
    color: theme.colors.cream,
    fontSize: 12,
    fontWeight: '600',
  },
  permRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  permLabel: {
    color: theme.colors.cream,
    fontSize: 13,
  },
  logoutBtn: {
    backgroundColor: 'rgba(229, 62, 62, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.danger,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutBtnText: {
    color: theme.colors.danger,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: theme.spacing.sm,
  },
  inputLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#1a0f0a',
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: theme.colors.gold,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  submitBtnText: {
    color: theme.colors.bg,
    fontWeight: '800',
    fontSize: 14,
  },
  hintText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.gold,
  },
  modalTitle: {
    color: theme.colors.gold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  logItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  logTime: {
    color: theme.colors.gold,
    fontSize: 10,
  },
  logUser: {
    color: theme.colors.cream,
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: theme.colors.gold,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  closeBtnText: {
    color: theme.colors.bg,
    fontWeight: '800',
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#3a2217',
  },
  cancelBtnText: {
    color: theme.colors.cream,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: theme.colors.gold,
  },
  saveBtnText: {
    color: theme.colors.bg,
    fontWeight: '800',
  }
});
