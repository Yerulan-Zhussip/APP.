import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

export const ContactsScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSendInquiry = () => {
    if (!name.trim() || !phone.trim() || !message.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля формы перед отправкой');
      return;
    }
    Alert.alert('Заявка отправлена', `Спасибо, ${name}! Наш менеджер свяжется с вами по номеру ${phone}.`);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Header title="Контакты" subtitle="Связь с нами и отделом продаж" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Contact Info Grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Головной Офис</Text>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => Linking.openURL('tel:+77273110000')}
          >
            <View style={styles.iconBadge}>
              <Ionicons name="call" size={18} color={theme.colors.gold} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Телефон поддержки</Text>
              <Text style={styles.infoValue}>+7 (727) 311-00-00</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => Linking.openURL('mailto:info@mercuryenergy.kz')}
          >
            <View style={styles.iconBadge}>
              <Ionicons name="mail" size={18} color={theme.colors.gold} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Электронная почта</Text>
              <Text style={styles.infoValue}>info@mercuryenergy.kz</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <View style={styles.iconBadge}>
              <Ionicons name="location" size={18} color={theme.colors.gold} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Адрес компании</Text>
              <Text style={styles.infoValue}>г. Алматы, пр. Достык 180, БЦ 'Коктем'</Text>
            </View>
          </View>
        </View>

        {/* Interactive Inquiry Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Обратная связь / Заявка на топливо</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ваше имя *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Алексей"
              placeholderTextColor={theme.colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Номер телефона *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="+7 (707) 000-00-00"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Сообщение / Запрос объёмов *</Text>
            <TextInput
              style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
              placeholder="Укажите нужный вид топлива и объем..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSendInquiry}
          >
            <Text style={styles.submitBtnText}>Отправить заявку</Text>
          </TouchableOpacity>
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: 12,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  infoValue: {
    color: theme.colors.cream,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
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
  }
});
