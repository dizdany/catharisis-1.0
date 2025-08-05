import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { useReadingStore } from '@/store/readingStore';
import { trpc } from '@/lib/trpc';
import { MoodType } from '@/constants/verses';
import { useMoodStore } from '@/store/moodStore';
import { getVerseById } from '@/constants/moodVerses';
import { useVerseStore } from '@/store/verseStore';
import InstagramVerseView from '@/components/InstagramVerseView';

interface BibleVerseWithMood {
  id: string;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  mood?: string;
}

export default function VerseScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { markVerseAsRead } = useReadingStore();
  const { selectedMood } = useMoodStore();
  const { favoriteVerses, generateVerseId } = useVerseStore();
  const [currentVerse, setCurrentVerse] = useState<BibleVerseWithMood | null>(null);
  const [allMoodVerses, setAllMoodVerses] = useState<BibleVerseWithMood[]>([]);
  const { colors: themeColors } = useTheme();
  
  // Try to get the verse from multiple sources
  useEffect(() => {
    if (id) {
      // First try to get from mood verses (local storage)
      const localMoodVerse = getVerseById(id);
      if (localMoodVerse) {
        setCurrentVerse(localMoodVerse);
        markVerseAsRead(localMoodVerse.id);
        return;
      }
      
      // Then try to get from favorite verses (for verses saved from random reading)
      const favoriteVerse = favoriteVerses.find(v => v.id === id);
      if (favoriteVerse) {
        const verseWithMood: BibleVerseWithMood = {
          id: favoriteVerse.id,
          text: favoriteVerse.text,
          reference: favoriteVerse.reference,
          book: favoriteVerse.book,
          chapter: favoriteVerse.chapter,
          verse: favoriteVerse.verse,
          mood: 'mood' in favoriteVerse ? favoriteVerse.mood : undefined
        };
        setCurrentVerse(verseWithMood);
        markVerseAsRead(favoriteVerse.id);
        return;
      }
    }
  }, [id, favoriteVerses]);
  
  // Fetch verses for the current mood using tRPC hook
  const { data: versesData, isLoading: loading, error } = trpc.bible.getVersesByMood.useQuery(
    { mood: selectedMood as any, random: false },
    { enabled: !!selectedMood && !currentVerse }
  );
  
  // Fetch chapter data for verses from favorites (random reading)
  const { data: chapterData, isLoading: chapterLoading } = trpc.bible.getChapter.useQuery(
    { 
      book: currentVerse?.book || '', 
      chapter: currentVerse?.chapter || 0 
    },
    { 
      enabled: !!currentVerse && !currentVerse.mood && allMoodVerses.length === 0 
    }
  );
  
  // Update verses when data changes
  useEffect(() => {
    if (versesData && !currentVerse) {
      if (Array.isArray(versesData)) {
        setAllMoodVerses(versesData);
        // Find the current verse by ID
        const current = versesData.find(v => v.id === id);
        if (current) {
          setCurrentVerse(current);
        } else if (versesData.length > 0) {
          // If specific verse not found, use the first one
          setCurrentVerse(versesData[0]);
        }
      } else {
        // Single verse returned
        setAllMoodVerses([versesData]);
        setCurrentVerse(versesData);
      }
    }
  }, [versesData, id, currentVerse]);
  
  // Handle chapter data for verses from random reading
  useEffect(() => {
    if (chapterData && currentVerse && !currentVerse.mood && allMoodVerses.length === 0) {
      // Convert chapter verses to the format we need using the same ID generation logic
      const chapterVerses: BibleVerseWithMood[] = chapterData.verses.map(v => ({
        id: generateVerseId(chapterData.book, chapterData.chapter, v.verse),
        text: v.text,
        reference: `${chapterData.book} ${chapterData.chapter}:${v.verse}`,
        book: chapterData.book,
        chapter: chapterData.chapter,
        verse: v.verse
      }));
      
      setAllMoodVerses(chapterVerses);
    }
  }, [chapterData, currentVerse, allMoodVerses.length, generateVerseId]);
  
  // Mark verse as read
  useEffect(() => {
    if (currentVerse) {
      markVerseAsRead(currentVerse.id);
    }
  }, [currentVerse?.id]);
  
  const handleNavigatePrevious = () => {
    if (!currentVerse || allMoodVerses.length === 0) return;
    
    const currentIndex = allMoodVerses.findIndex(v => v.id === currentVerse.id);
    if (currentIndex > 0) {
      setCurrentVerse(allMoodVerses[currentIndex - 1]);
    }
  };
  
  const handleNavigateNext = () => {
    if (!currentVerse || allMoodVerses.length === 0) return;
    
    const currentIndex = allMoodVerses.findIndex(v => v.id === currentVerse.id);
    if (currentIndex < allMoodVerses.length - 1) {
      setCurrentVerse(allMoodVerses[currentIndex + 1]);
    }
  };
  
  if ((loading || chapterLoading) && !currentVerse) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.loadingText, { color: themeColors.primaryText }]}>
          {t('loading') || 'Loading...'}
        </Text>
      </View>
    );
  }
  
  if (error && !currentVerse) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: themeColors.primaryText }]}>
          {error?.message || 'Verse not found'}
        </Text>
      </View>
    );
  }
  
  if (!currentVerse) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: themeColors.primaryText }]}>
          Verse not found
        </Text>
      </View>
    );
  }
  
  // Get previous and next verses
  const currentIndex = allMoodVerses.length > 0 ? allMoodVerses.findIndex(v => v.id === currentVerse.id) : -1;
  const previous = currentIndex > 0 ? allMoodVerses[currentIndex - 1] : null;
  const next = currentIndex < allMoodVerses.length - 1 ? allMoodVerses[currentIndex + 1] : null;

  const handleBackPress = () => {
    if (from === 'favorites') {
      router.push('/(tabs)/favorites');
    } else {
      router.back();
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: currentVerse?.reference || 'Verse',
          headerTitleStyle: {
            color: themeColors.primaryText,
            fontWeight: '600',
            fontSize: 16,
          },
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackPress}
              style={{ marginLeft: -8, padding: 8 }}
            >
              <ChevronLeft size={24} color={themeColors.primaryText} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container}>
        <InstagramVerseView 
          previous={previous}
          current={currentVerse}
          next={next}
          onNavigatePrevious={handleNavigatePrevious}
          onNavigateNext={handleNavigateNext}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});