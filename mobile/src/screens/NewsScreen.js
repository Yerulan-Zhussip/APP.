import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const NewsScreen = () => {
  const { news, addNews } = useData();
  const { currentUser } = useAuth();

  const [selectedNews, setSelectedNews] = useState(null);
  const [addNewsModal, setAddNewsModal] = useState(false);

  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');

  const canAdd = currentUser?.permissions?.canAddNews || currentUser?.role === 'admin';

  const handleCreateNews = () => {
    if (!newsTitle.trim() || !newsContent.trim()) {
      Alert.alert('Ошибка', 'Заполните заголовок и текст новости');
      return;
    }
    addNews({
      title: newsTitle,
      content: newsContent
    }, currentUser?.username);
    setNewsTitle('');
    setNewsContent('');
    setAddNewsModal(false);
    Alert.alert('Успешно', 'Новость опубликована');
  };

  return (
    <View style={styles.container}>
      <Header title="Новости и События" subtitle="Официальные анонсы и обновления Mercury Energy" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {canAdd && (
          <TouchableOpacity
            style={styles.addNewsBtn}
            onPress={() => setAddNewsModal(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color={theme.colors.bg} />
            <Text style={styles.addNewsBtnText}>Опубликовать новость</Text>
          </TouchableOpacity>
        )}

        {news.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.newsCard}
            onPress={() => setSelectedNews(item)}
            activeOpacity={0.8}
          >
            <View style={styles.newsHeaderRow}>
              <Text style={styles.newsDate}>{item.date}</Text>
              <View style={styles.trendingBadge}>
                <Ionicons name="flame" size={12} color={theme.colors.gold} />
                <Text style={styles.trendingText}>{item.trending || 80}%</Text>
              </View>
            </View>

            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsSnippet} numberOfLines={3}>{item.content}</Text>

            <Text style={styles.readMoreText}>Читать полностью →</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* Full News Reader Modal */}
      <Modal visible={!!selectedNews} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.newsDate}>{selectedNews?.date}</Text>
              <TouchableOpacity onPress={() => setSelectedNews(null)}>
                <Ionicons name="close" size={24} color={theme.colors.gold} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalArticleTitle}>{selectedNews?.title}</Text>

            <ScrollView style={{ maxHeight: 300, marginVertical: theme.spacing.md }}>
              <Text style={styles.modalArticleText}>{selectedNews?.content}</Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedNews(null)}
            >
              <Text style={styles.closeBtnText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add News Modal */}
      <Modal visible={addNewsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Публикация новости</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Заголовок новости</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Заголовок..."
                placeholderTextColor={theme.colors.textMuted}
                value={newsTitle}
                onChangeText={setNewsTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Содержание</Text>
              <TextInput
                style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Текст новости..."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                value={newsContent}
                onChangeText={setNewsContent}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setAddNewsModal(false)}
              >
                <Text style={styles.cancelBtnText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleCreateNews}
              >
                <Text style={styles.saveBtnText}>Опубликовать</Text>
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
  addNewsBtn: {
    backgroundColor: theme.colors.gold,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  addNewsBtnText: {
    color: theme.colors.bg,
    fontWeight: '800',
    fontSize: 14,
  },
  newsCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  newsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  newsDate: {
    color: theme.colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendingText: {
    color: theme.colors.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  newsTitle: {
    color: theme.colors.cream,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  newsSnippet: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  readMoreText: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: '700',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  modalArticleTitle: {
    color: theme.colors.cream,
    fontSize: 18,
    fontWeight: '700',
  },
  modalArticleText: {
    color: theme.colors.cream,
    fontSize: 14,
    lineHeight: 22,
  },
  closeBtn: {
    backgroundColor: theme.colors.gold,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  closeBtnText: {
    color: theme.colors.bg,
    fontWeight: '800',
  },
  modalTitle: {
    color: theme.colors.gold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
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
    paddingVertical: 8,
    fontSize: 14,
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
