import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Book, BookOpen, Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { useReadingStore } from '@/store/readingStore';
import { getBookById } from '@/constants/bibleBooks';
import { trpc } from '@/lib/trpc';
import { useSettingsStore } from '@/store/settingsStore';
import AnimatedCard from '@/components/AnimatedCard';
import AnimatedButton from '@/components/AnimatedButton';
import BibleBookGrid from '@/components/BibleBookGrid';

function BibleContent() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const { testament } = useLocalSearchParams();
  const { lastReadBook, lastReadChapter, hasReadingHistory } = useReadingStore();
  const [selectedTestament, setSelectedTestament] = useState<'old' | 'new' | null>(null);
  
  // Handle testament parameter from navigation
  useEffect(() => {
    if (testament === 'old' || testament === 'new') {
      setSelectedTestament(testament);
    }
  }, [testament]);
  
  // Fetch Bible books from API with current language
  const { data: bibleBooks, isLoading: booksLoading } = trpc.bible.getBibleBooks.useQuery({
    language: language
  });
  
  // Get book name for last read
  const lastReadBookData = bibleBooks ? getBookById(bibleBooks, lastReadBook || '') : null;
  const lastReadBookName = lastReadBookData?.name || lastReadBook;

  const handleContinueReading = () => {
    if (lastReadBook && lastReadChapter) {
      router.push(`/bible/${lastReadBook}/${lastReadChapter}`);
    }
  };

  const handleStartReading = () => {
    setSelectedTestament('old');
  };

  const handleBookSelect = (bookId: string) => {
    router.push(`/bible/${bookId}`);
  };

  if (booksLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.primaryText }]}>
            {t('loadingBooks')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {selectedTestament && bibleBooks ? (
        <BibleBookGrid 
          testament={selectedTestament}
          books={bibleBooks}
          onBookSelect={handleBookSelect}
          onBack={() => setSelectedTestament(null)}
        />
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
          <Book size={28} color={colors.primary} />
          <Text style={[styles.title, { color: colors.primaryText }]}>
            {t('bibleReader')}
          </Text>
        </View>

        {hasReadingHistory() && (
          <AnimatedCard style={styles.continueCard}>
            <View style={styles.continueHeader}>
              <Clock size={18} color={colors.primary} />
              <Text style={[styles.continueTitle, { color: colors.primaryText }]}>
                {t('lastRead')}
              </Text>
            </View>
            <Text style={[styles.continueText, { color: colors.secondaryText }]}>
              {lastReadBookName} {t('chapter')} {lastReadChapter}
            </Text>
            <View style={styles.continueButton}>
              <AnimatedButton
                title={t('continueReading')}
                onPress={handleContinueReading}
                icon={<BookOpen size={16} color={colors.buttonText} />}
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                textStyle={[styles.actionButtonText, { color: colors.buttonText }]}
              />
            </View>
          </AnimatedCard>
        )}

        <AnimatedCard style={styles.testamentCard}>
          <View style={styles.testamentHeader}>
            <BookOpen size={20} color={colors.primary} />
            <Text style={[styles.testamentTitle, { color: colors.primaryText }]}>
              {t('selectBook')}
            </Text>
          </View>
          
          <View style={styles.testamentButtons}>
            <AnimatedButton
              title={t('oldTestament')}
              onPress={() => setSelectedTestament('old')}
              style={[styles.testamentButton, styles.actionButton, { backgroundColor: colors.primary }]}
              textStyle={[styles.actionButtonText, { color: colors.buttonText }]}
            />
            <AnimatedButton
              title={t('newTestament')}
              onPress={() => setSelectedTestament('new')}
              style={[styles.testamentButton, styles.actionButton, { backgroundColor: colors.primary }]}
              textStyle={[styles.actionButtonText, { color: colors.buttonText }]}
            />
          </View>
        </AnimatedCard>

        {!hasReadingHistory() && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              {t('noReadingHistory')}
            </Text>
            <View style={styles.startButton}>
              <AnimatedButton
                title={t('startReading')}
                onPress={handleStartReading}
                icon={<Book size={16} color={colors.buttonText} />}
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                textStyle={[styles.actionButtonText, { color: colors.buttonText }]}
              />
            </View>
          </View>
        )}
        </ScrollView>
      )}
    </View>
  );
}

export default function BibleScreen() {
  const { isHydrated } = useSettingsStore();
  const { colors } = useTheme();
  
  // Don't render until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.primaryText }]}>Loading...</Text>
      </View>
    );
  }

  return <BibleContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: '300' as const,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '600' as const,
    marginTop: 8,
    letterSpacing: 1,
  },
  continueCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  continueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    marginLeft: 8,
  },
  continueText: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 18,
    fontWeight: '300' as const,
  },
  continueButton: {
    alignSelf: 'flex-start',
  },
  testamentCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  testamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  testamentTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    marginLeft: 8,
  },
  testamentButtons: {
    gap: 10,
  },
  testamentButton: {
    marginBottom: 8,
  },
  actionButton: {
    // backgroundColor will be set dynamically
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
    fontWeight: '300' as const,
  },
  startButton: {
    paddingHorizontal: 40,
    width: '100%',
  },
});