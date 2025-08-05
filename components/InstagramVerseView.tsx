import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { ChevronLeft, ChevronRight, Heart, BookOpen, Share2 } from 'lucide-react-native';
import colors from '@/constants/colors';
import { typography, elegantColors } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { useVerseStore } from '@/store/verseStore';
import { useReadingStore } from '@/store/readingStore';
import { useRouter } from 'expo-router';
import AnimatedButton from '@/components/AnimatedButton';

interface BibleVerseWithMood {
  id: string;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  mood?: string;
}

interface InstagramVerseViewProps {
  previous: BibleVerseWithMood | null;
  current: BibleVerseWithMood;
  next: BibleVerseWithMood | null;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
}

export default function InstagramVerseView({ 
  previous, 
  current, 
  next,
  onNavigatePrevious,
  onNavigateNext
}: InstagramVerseViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, isFavorite, isVerseFavorited } = useVerseStore();
  const { markVerseAsRead } = useReadingStore();
  
  // Double tap detection
  const lastTap = useRef<number | null>(null);
  const DOUBLE_TAP_DELAY = 300;
  
  // Check if this verse is favorited
  const favorite = current.mood 
    ? isVerseFavorited(current.book, current.chapter, current.verse)
    : isFavorite(current.id);
  
  // Mark verse as read when component mounts or current verse changes
  React.useEffect(() => {
    markVerseAsRead(current.id);
  }, [current.id, markVerseAsRead]);
  
  const toggleFavorite = () => {
    if (current.mood) {
      // For mood-based verses, only create Bible verse entry (not shown in favorites page)
      const { generateVerseId, addBibleVerseToFavorites } = useVerseStore.getState();
      const bibleVerseId = generateVerseId(current.book, current.chapter, current.verse);
      
      if (favorite) {
        // Remove the Bible verse entry
        removeFromFavorites(bibleVerseId);
      } else {
        // Add only the Bible verse entry
        addBibleVerseToFavorites({
          text: current.text,
          reference: current.reference,
          book: current.book,
          chapter: current.chapter,
          verse: current.verse
        });
      }
    } else {
      // For regular Bible verses, save to favorites
      if (favorite) {
        removeFromFavorites(current.id);
      } else {
        addToFavorites(current);
      }
    }
  };
  
  const handleReadMore = () => {
    // Navigate to the Bible chapter containing this verse
    // Create a proper book ID by normalizing the book name
    const bookId = current.book
      .toLowerCase()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^a-z]/g, ''); // Remove numbers and special characters
    
    router.push(`/bible/${bookId}/${current.chapter}`);
  };

  const handleVerseTap = () => {
    const now = Date.now();
    
    if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
      // Double tap detected - toggle favorite
      toggleFavorite();
      lastTap.current = null;
    } else {
      // Single tap
      lastTap.current = now;
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Favorite heart indicator in top-right corner */}
      {favorite && (
        <View style={styles.favoriteIndicator}>
          <Heart size={16} color="#FF6B6B" fill="#FF6B6B" />
        </View>
      )}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.textContainer}
            onPress={handleVerseTap}
            activeOpacity={0.9}
          >
            <Text style={[styles.instructionText, { color: colors.secondaryText }]}>
              {t('doubleTapToFavorite')}
            </Text>
            <Text style={[styles.verseText, typography.body]}>
              {current.text}
            </Text>
            <Text style={[styles.verseReference, typography.heading]}>
              {current.reference}
            </Text>
            <Text style={[styles.verseBook, typography.caption]}>
              {t('bookOf')} {current.book}
            </Text>
            
            {/* Read More Button */}
            <View style={styles.readMoreContainer}>
              <AnimatedButton
                title={t('readMore')}
                onPress={handleReadMore}
                icon={<BookOpen size={16} color={colors.buttonText} />}
                style={styles.readMoreButton}
                textStyle={styles.readMoreText}
                variant="filled"
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Fixed Navigation buttons at bottom */}
      <View style={styles.navigationContainer}>
        <AnimatedButton
          title={t('previousVerse')}
          onPress={onNavigatePrevious}
          icon={<ChevronLeft size={16} color={previous ? elegantColors.elegantText : colors.lightText} />}
          style={[
            styles.navigationButton,
            styles.previousButton,
            !previous && styles.disabledButton
          ]}
          textStyle={[
            styles.navigationText,
            { color: previous ? elegantColors.elegantText : colors.lightText },
            !previous && styles.disabledText
          ]}
          variant={previous ? 'outlined' : 'outlined'}
          direction="right"
        />
        
        {/* Favorite button - always show */}
        <TouchableOpacity 
          style={[
            styles.favoriteButton,
            favorite && styles.favoriteActive
          ]}
          onPress={toggleFavorite}
          activeOpacity={0.7}
        >
          <Heart 
            size={20} 
            color={favorite ? "#FF6B6B" : colors.primary}
            fill={favorite ? "#FF6B6B" : 'transparent'}
          />
        </TouchableOpacity>
        
        <AnimatedButton
          title={t('nextVerse')}
          onPress={onNavigateNext}
          icon={<ChevronRight size={16} color={next ? elegantColors.elegantText : colors.lightText} />}
          style={[
            styles.navigationButton,
            styles.nextButton,
            !next && styles.disabledButton
          ]}
          textStyle={[
            styles.navigationText,
            { color: next ? elegantColors.elegantText : colors.lightText },
            !next && styles.disabledText
          ]}
          variant={next ? 'outlined' : 'outlined'}
          direction="left"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 60, // Below status bar
    right: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 60, // Add padding to avoid overlap with favorite indicator
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  verseText: {
    fontSize: 18,
    color: elegantColors.elegantText,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
  },
  verseReference: {
    fontSize: 15,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  verseBook: {
    fontSize: 13,
    color: elegantColors.elegantLight,
    textAlign: 'center',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 80,
  },
  navigationButton: {
    flex: 1,
    maxWidth: 120,
  },
  previousButton: {
    marginRight: 8,
  },
  nextButton: {
    marginLeft: 8,
  },
  navigationText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  favoriteActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderColor: '#FF6B6B',
  },
  disabledButton: {
    opacity: 0.4,
  },
  disabledText: {
    opacity: 0.6,
  },
  readMoreContainer: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  readMoreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 140,
  },
  readMoreText: {
    color: colors.buttonText,
    fontSize: 14,
    fontWeight: '600',
  },
});