import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Plus, Newspaper, Calendar, Star, Send } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { ModalView } from '../components/ModalView';
import { COLORS } from '../theme/theme';
import { useApp } from '../context/AppContext';

export const NewsScreen: React.FC = () => {
  const { news, currentUser, addNews } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const canAddNews =
    currentUser?.role === 'admin' || currentUser?.permissions.canAddNews;

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Ошибка', 'Заполните заголовок и содержание новости');
      return;
    }

    addNews({
      title,
      content,
      img: imgUrl.trim() || 'https://mercuryenergy.kz/upload/iblock/d7a/news.jpg',
    });

    setTitle('');
    setContent('');
    setImgUrl('');
    setModalVisible(false);
    Alert.alert('Успех', 'Новость успешно опубликована!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Page Title & Add Button */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Newspaper size={20} color={COLORS.gold} />
          <Text style={styles.headerTitle}>Новости и Пресс-релизы</Text>
        </View>

        {canAddNews && (
          <Pressable
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <Plus size={16} color={COLORS.black} />
            <Text style={styles.addBtnText}>Опубликовать</Text>
          </Pressable>
        )}
      </View>

      {/* News Feed */}
      <View style={styles.newsList}>
        {news.map((item) => (
          <GlassCard key={item.id} style={styles.newsCard} variant="goldBorder">
            <Image
              source={{ uri: item.img }}
              style={styles.newsImage}
              resizeMode="cover"
            />

            <View style={styles.cardBody}>
              <View style={styles.metaRow}>
                <View style={styles.dateBadge}>
                  <Calendar size={12} color={COLORS.creamMuted} />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>

                <View style={styles.trendBadge}>
                  <Star size={12} color={COLORS.emeraldLight} />
                  <Text style={styles.trendText}>{item.trending}% Рейтинг</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardContent}>{item.content}</Text>
            </View>
          </GlassCard>
        ))}
      </View>

      {/* Add News Modal */}
      <ModalView
        visible={modalVisible}
        title="Опубликовать новость"
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Заголовок новости</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Введите заголовок..."
              placeholderTextColor={COLORS.creamMuted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Ссылка на изображение (URL)</Text>
            <TextInput
              style={styles.input}
              value={imgUrl}
              onChangeText={setImgUrl}
              placeholder="https://..."
              placeholderTextColor={COLORS.creamMuted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Содержание новости</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
              placeholder="Текст новости..."
              placeholderTextColor={COLORS.creamMuted}
            />
          </View>

          <Pressable style={styles.submitBtn} onPress={handlePublish}>
            <Send size={16} color={COLORS.black} />
            <Text style={styles.submitBtnText}>Опубликовать новость</Text>
          </Pressable>
        </View>
      </ModalView>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '700',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addBtnText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: '800',
  },
  newsList: {
    gap: 16,
  },
  newsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.panelBg,
  },
  cardBody: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    color: COLORS.creamMuted,
    fontSize: 11,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    color: COLORS.emeraldLight,
    fontSize: 10,
    fontWeight: '700',
  },
  cardTitle: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardContent: {
    color: COLORS.creamMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  formContainer: {
    gap: 12,
  },
  formGroup: {
    gap: 4,
  },
  inputLabel: {
    color: COLORS.cream,
    fontSize: 12,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.gold,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  submitBtnText: {
    color: COLORS.black,
    fontWeight: '800',
    fontSize: 14,
  },
});
