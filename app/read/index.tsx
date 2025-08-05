import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, RefreshCw, BookOpen, Heart } from 'lucide-react-native';
import { typography } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { standaloneClient } from '@/lib/trpc';
import { useVerseStore } from '@/store/verseStore';
import { useLanguageStore } from '@/store/languageStore';
import { useReadingStore } from '@/store/readingStore';
import AnimatedButton from '@/components/AnimatedButton';

interface BibleVerse {
  verse: number;
  text: string;
}

interface RandomChapterData {
  book: string;
  bookId: string;
  chapter: number;
  verses: BibleVerse[];
  reference: string;
  language?: string;
}

export default function ReadScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { language } = useLanguageStore();
  const { addBibleVerseToFavorites, removeFromFavorites, isFavorite, generateVerseId } = useVerseStore();
  const { markChapterAsRead, startReadingSession, endReadingSession } = useReadingStore();
  const [chapterData, setChapterData] = useState<RandomChapterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Double tap detection
  const lastTap = useRef<number | null>(null);
  const DOUBLE_TAP_DELAY = 300;

  const fetchRandomChapter = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data;
      if (language === 'ro') {
        // Use Romanian API for Romanian language
        data = await standaloneClient.bible.getRandomChapterRomanian.query({});
      } else {
        // Use English API for other languages
        data = await standaloneClient.bible.getRandomChapter.query({});
      }
      setChapterData(data);
      
      // Start reading session when loaded
      if (data && data.bookId) {
        console.log('Starting reading session for random chapter:', data.bookId, data.chapter);
        startReadingSession();
      }
    } catch (err) {
      console.error('Error fetching random chapter:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chapter');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomChapter();
  }, [language]); // Re-fetch when language changes

  // End reading session and mark chapter as read when component unmounts
  useEffect(() => {
    return () => {
      if (chapterData && chapterData.bookId) {
        console.log('Ending reading session and marking random chapter as read:', chapterData.bookId, chapterData.chapter);
        endReadingSession(chapterData.bookId, chapterData.chapter);
        markChapterAsRead(chapterData.bookId, chapterData.chapter);
      }
    };
  }, [chapterData, endReadingSession, markChapterAsRead]);

  const handleRefresh = () => {
    fetchRandomChapter();
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleVerseDoubleTap = (verse: BibleVerse) => {
    if (!chapterData) return;
    
    const verseId = generateVerseId(chapterData.book, chapterData.chapter, verse.verse);
    const reference = `${chapterData.book} ${chapterData.chapter}:${verse.verse}`;
    
    if (isFavorite(verseId)) {
      removeFromFavorites(verseId);
    } else {
      addBibleVerseToFavorites({
        text: verse.text,
        reference: reference,
        book: chapterData.book,
        chapter: chapterData.chapter,
        verse: verse.verse
      });
    }
  };

  const handleVerseTap = (verse: BibleVerse) => {
    const now = Date.now();
    
    if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
      // Double tap detected
      handleVerseDoubleTap(verse);
      lastTap.current = null;
    } else {
      // Single tap
      lastTap.current = now;
    }
  };

  if (isLoading) {
    const styles = createStyles(colors);
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Read',
            headerLeft: () => (
              <Pressable onPress={handleGoBack} style={styles.headerButton}>
                <ArrowLeft size={24} color={colors.primaryText} />
              </Pressable>
            ),
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
            Loading random chapter...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    const styles = createStyles(colors);
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Read',
            headerLeft: () => (
              <Pressable onPress={handleGoBack} style={styles.headerButton}>
                <ArrowLeft size={24} color={colors.primaryText} />
              </Pressable>
            ),
          }} 
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <AnimatedButton
            title="Try Again"
            onPress={handleRefresh}
            icon={<RefreshCw size={20} color={colors.buttonText} />}
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  if (!chapterData) {
    const styles = createStyles(colors);
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Read',
            headerLeft: () => (
              <Pressable onPress={handleGoBack} style={styles.headerButton}>
                <ArrowLeft size={24} color={colors.primaryText} />
              </Pressable>
            ),
          }} 
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            No chapter data available
          </Text>
          <AnimatedButton
            title="Try Again"
            onPress={handleRefresh}
            icon={<RefreshCw size={20} color={colors.buttonText} />}
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: chapterData.reference,
          headerLeft: () => (
            <Pressable onPress={handleGoBack} style={styles.headerButton}>
              <ArrowLeft size={24} color={colors.primaryText} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={handleRefresh} style={styles.headerButton}>
              <RefreshCw size={20} color={colors.primaryText} />
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.referenceContainer}>
            <BookOpen size={24} color={colors.primary} />
            <Text style={[styles.reference, { color: colors.primaryText }]}>
              {chapterData.reference}
            </Text>
          </View>
          <Text style={[styles.verseCount, { color: colors.secondaryText }]}>
            {chapterData.verses.length} verse{chapterData.verses.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <Text style={[styles.instructionText, { color: colors.secondaryText }]}>
          {t('doubleTapToFavorite')}
        </Text>

        <View style={styles.versesContainer}>
          {chapterData.verses.map((verse) => {
            const verseId = generateVerseId(chapterData.book, chapterData.chapter, verse.verse);
            const isFav = isFavorite(verseId);
            
            return (
              <TouchableOpacity
                key={verse.verse}
                onPress={() => handleVerseTap(verse)}
                activeOpacity={0.7}
              >
                <View style={[styles.verseContainer, { backgroundColor: colors.cardBackground }]}>
                  <View style={styles.verseContent}>
                    <Text style={[styles.verseNumber, { color: colors.primary }]}>
                      {verse.verse}
                    </Text>
                    <Text style={[styles.verseText, { color: colors.primaryText }]}>
                      {verse.text}
                    </Text>
                  </View>
                  {isFav && (
                    <View style={styles.favoriteIndicator}>
                      <Heart size={16} color="#FF6B6B" fill="#FF6B6B" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actionContainer}>
          <AnimatedButton
            title={t('readAnotherChapter')}
            onPress={handleRefresh}
            icon={<RefreshCw size={20} color={colors.buttonText} />}
            style={styles.refreshButton}
            textStyle={styles.refreshButtonText}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
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
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    alignItems: 'center',
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reference: {
    fontSize: 24,
    fontWeight: '600' as const,
    marginLeft: 12,
    textAlign: 'center',
  },
  verseCount: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  versesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  instructionText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    opacity: 0.7,
    paddingHorizontal: 20,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    position: 'relative',
    alignItems: 'flex-start',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteIndicator: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  verseContent: {
    flexDirection: 'row',
    flex: 1,
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginRight: 12,
    marginTop: 2,
    minWidth: 24,
    textAlign: 'right',
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    fontWeight: '400' as const,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  refreshButton: {
    backgroundColor: colors.primary,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.buttonText,
  },
});