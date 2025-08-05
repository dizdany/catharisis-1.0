import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { getBookById } from '@/constants/bibleBooks';
import { useSettingsStore } from '@/store/settingsStore';

import { trpc } from '@/lib/trpc';
import ChapterGrid from '@/components/ChapterGrid';

function BookChaptersContent() {
  const { book } = useLocalSearchParams<{ book: string }>();
  const router = useRouter();
  const { t, language } = useTranslation();
  const { colors } = useTheme();

  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  
  // Fetch Bible books to get book metadata with current language
  const { data: bibleBooks, isLoading } = trpc.bible.getBibleBooks.useQuery({
    language: language
  });
  
  const bookData = bibleBooks ? getBookById(bibleBooks, book) : null;
  
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, typography.script, { color: colors.secondaryText }]}>
            {t('loadingBook')}
          </Text>
        </View>
      </View>
    );
  }
  
  if (!bookData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, typography.heading, { color: colors.error }]}>
            {t('bookNotFound')}
          </Text>
        </View>
      </View>
    );
  }

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    // Navigate to the chapter after a short delay to show the selection
    setTimeout(() => {
      router.push(`/bible/${book}/${chapter}`);
    }, 200);
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: bookData.name,
          headerTitleStyle: {
            color: colors.primaryText,
            fontWeight: '600',
            fontSize: 16,
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: -8, padding: 8 }}
            >
              <ChevronLeft size={24} color={colors.primaryText} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ChapterGrid
          totalChapters={bookData.chapters}
          selectedChapter={selectedChapter}
          onChapterSelect={handleChapterSelect}
          bookId={book}
        />
      </View>
    </>
  );
}

export default function BookChaptersScreen() {
  const { isHydrated } = useSettingsStore();
  
  // Don't render until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return <BookChaptersContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});