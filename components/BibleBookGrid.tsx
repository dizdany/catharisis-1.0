import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { ChevronLeft, Book } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography, elegantColors } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { getBooksByTestament, BibleBook } from '@/constants/bibleBooks';
import { useBibleStore } from '@/store/bibleStore';
import { useReadingStore } from '@/store/readingStore';
import AnimatedCard from './AnimatedCard';

interface BibleBookGridProps {
  testament: 'old' | 'new';
  books: BibleBook[];
  onBookSelect: (bookId: string) => void;
  onBack: () => void;
}

export default function BibleBookGrid({ testament, books, onBookSelect, onBack }: BibleBookGridProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { getBookProgress } = useReadingStore();
  
  const testamentBooks = getBooksByTestament(books, testament);

  const renderBook = ({ item }: { item: BibleBook }) => {
    const progressPercentage = getBookProgress(item.id, item.chapters);
    const readChapters = Math.round((progressPercentage / 100) * item.chapters);

    return (
      <AnimatedCard 
        style={styles.bookCard}
        onPress={() => onBookSelect(item.id)}
      >
        <View style={styles.bookHeader}>
          <Book size={16} color={colors.primary} />
          <Text style={[styles.bookName, { color: colors.primaryText }]}>
            {item.name}
          </Text>
        </View>
        <Text style={[styles.bookInfo, { color: colors.secondaryText }]}>
          {item.chapters} {t('chapters')}
        </Text>
        {readChapters > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.accent + '30' }]}>
              <View style={[styles.progressFill, { width: `${Math.min(progressPercentage, 100)}%`, backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.secondaryText }]}>
              {readChapters}/{item.chapters}
            </Text>
          </View>
        )}
      </AnimatedCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>
            {t('back')}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          {testament === 'old' ? t('oldTestament') : t('newTestament')}
        </Text>
      </View>

      <FlatList
        data={testamentBooks}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500' as const,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  grid: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  bookCard: {
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bookName: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginLeft: 6,
    flex: 1,
  },
  bookInfo: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '300' as const,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    textAlign: 'right',
    fontWeight: '400' as const,
  },
});