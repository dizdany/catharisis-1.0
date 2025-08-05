import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BookOpen, Heart, Share2 } from 'lucide-react-native';
import { useVerseStore } from '@/store/verseStore';
import { Verse, BibleVerse, VerseRange } from '@/constants/verses';
import { MoodVerse } from '@/constants/moodVerses';
import { useTheme } from '@/hooks/useTheme';
import { typography, elegantColors } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedCard from './AnimatedCard';
import AnimatedFavoriteButton from './AnimatedFavoriteButton';
import AnimatedButton from './AnimatedButton';
import VerseShareModal from './VerseShareModal';
import { useRouter } from 'expo-router';

interface VerseCardProps {
  verse: Verse | BibleVerse | MoodVerse;
  onReadMore?: () => void;
  showReadMore?: boolean;
}

export default function VerseCard({ verse, onReadMore, showReadMore = true }: VerseCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite, addBibleVerseToFavorites, generateVerseId } = useVerseStore();
  const { t, translateVerse } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Double tap detection
  const lastTap = useRef<number | null>(null);
  const DOUBLE_TAP_DELAY = 300;
  
  const favorite = isFavorite(verse.id);

  const toggleFavorite = () => {
    if (favorite) {
      removeFromFavorites(verse.id);
    } else {
      if ('mood' in verse) {
        // This is a regular Verse or MoodVerse
        addToFavorites(verse);
      } else {
        // This is a BibleVerse - use the proper method
        addBibleVerseToFavorites({
          text: verse.text,
          reference: verse.reference,
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse
        });
      }
    }
  };

  const handleReadMore = () => {
    // Check if verse has book/chapter/verse info for Bible navigation
    if (verse.book && verse.chapter && verse.verse) {
      // Navigate to Bible chapter with verse highlight
      const bookId = verse.book.toLowerCase().replace(/\s+/g, '').replace(/[0-9]/g, '');
      router.push({
        pathname: `/bible/[book]/[chapter]` as const,
        params: { 
          book: bookId, 
          chapter: verse.chapter.toString(),
          highlightVerse: verse.verse.toString() 
        }
      });
    } else if (onReadMore) {
      // Fallback to provided onReadMore function
      onReadMore();
    }
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

  // Handle translation for regular verses, Bible verses don't need translation
  const displayVerse = 'mood' in verse ? translateVerse(verse) : verse;

  return (
    <AnimatedCard style={styles.cardContainer}>
      {/* Favorite heart indicator in top-right corner */}
      {favorite && (
        <View style={styles.favoriteIndicator}>
          <Heart size={16} color="#FF6B6B" fill="#FF6B6B" />
        </View>
      )}
      
      <View style={styles.textContainer}>
        <Text style={[styles.verseText, typography.body, { color: colors.primaryText }]}>
          {displayVerse.text}
        </Text>
        <Text style={[styles.reference, typography.heading, { color: colors.primary }]}>
          {displayVerse.reference}
        </Text>
        <Text style={[styles.book, typography.caption, { color: colors.secondaryText }]}>
          {t('bookOf')} {displayVerse.book}
        </Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <View style={styles.actions}>
          <AnimatedFavoriteButton 
            isFavorite={favorite}
            onToggle={toggleFavorite}
          />
          
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: colors.accent, borderColor: colors.accent }]}
            onPress={() => setShowShareModal(true)}
            activeOpacity={0.7}
          >
            <Share2 size={16} color={colors.primary} />
          </TouchableOpacity>
          
          {showReadMore && (
            <View style={styles.readMoreContainer}>
              <AnimatedButton
                title={t('readMore')}
                onPress={handleReadMore}
                icon={<BookOpen size={14} color={colors.primary} />}
                variant="outlined"
                style={styles.readMoreButton}
              />
            </View>
          )}
        </View>
      </View>
      
      <VerseShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        verse={displayVerse}
      />
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    marginVertical: 6,
    marginHorizontal: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 12,
    right: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    marginBottom: 20,
    paddingRight: 30, // Add padding to avoid overlap with favorite indicator
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  reference: {
    fontSize: 14,
    marginBottom: 6,
  },
  book: {
    fontSize: 12,
    marginBottom: 4,
  },
  actionsContainer: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  readMoreContainer: {
    flex: 1,
  },
  readMoreButton: {
    flex: 1,
    paddingVertical: 12,
  },
});