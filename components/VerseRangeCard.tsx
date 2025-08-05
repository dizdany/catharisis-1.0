import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BookOpen, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useVerseStore } from '@/store/verseStore';
import { VerseRange } from '@/constants/verses';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedCard from './AnimatedCard';
import AnimatedFavoriteButton from './AnimatedFavoriteButton';
import AnimatedButton from './AnimatedButton';
import VerseShareModal from './VerseShareModal';
import { useRouter } from 'expo-router';

interface VerseRangeCardProps {
  verseRange: VerseRange;
  onReadMore?: () => void;
  showReadMore?: boolean;
}

export default function VerseRangeCard({ verseRange, onReadMore, showReadMore = true }: VerseRangeCardProps) {
  const { removeFromFavorites, addVerseRangeToFavorites, isFavorite } = useVerseStore();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const favorite = isFavorite(verseRange.id);

  const toggleFavorite = () => {
    if (favorite) {
      removeFromFavorites(verseRange.id);
    } else {
      // Add to favorites
      addVerseRangeToFavorites({
        verses: verseRange.verses,
        book: verseRange.book,
        chapter: verseRange.chapter,
        bookDisplayName: verseRange.book
      });
    }
  };

  const handleReadMore = () => {
    // Navigate to Bible chapter with verse range highlight
    const bookId = verseRange.book.toLowerCase().replace(/\s+/g, '').replace(/[0-9]/g, '');
    router.push({
      pathname: `/bible/[book]/[chapter]` as const,
      params: { 
        book: bookId, 
        chapter: verseRange.chapter.toString(),
        highlightVerse: verseRange.startVerse.toString() 
      }
    });
  };

  // Create a display object for the share modal
  const displayVerse = {
    id: verseRange.id,
    text: verseRange.text,
    reference: verseRange.reference,
    book: verseRange.book,
    chapter: verseRange.chapter,
    verse: verseRange.startVerse
  };

  // Truncate text if too long and not expanded
  const maxLength = 200;
  const shouldTruncate = verseRange.text.length > maxLength;
  const displayText = expanded || !shouldTruncate 
    ? verseRange.text 
    : verseRange.text.substring(0, maxLength) + '...';

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
          {displayText}
        </Text>
        
        {shouldTruncate && (
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={[styles.expandText, { color: colors.primary }]}>
              {expanded ? t('showLess') : t('showMore')}
            </Text>
            {expanded ? (
              <ChevronUp size={16} color={colors.primary} />
            ) : (
              <ChevronDown size={16} color={colors.primary} />
            )}
          </TouchableOpacity>
        )}
        
        <Text style={[styles.reference, typography.heading, { color: colors.primary }]}>
          {verseRange.reference}
        </Text>
        <Text style={[styles.book, typography.caption, { color: colors.secondaryText }]}>
          {t('bookOf')} {verseRange.book}
        </Text>
        
        {/* Show individual verses if expanded */}
        {expanded && verseRange.verses.length > 1 && (
          <View style={styles.versesContainer}>
            <Text style={[styles.versesHeader, { color: colors.secondaryText }]}>
              {t('individualVerses')}:
            </Text>
            {verseRange.verses.map((verse, index) => (
              <View key={verse.verse} style={styles.individualVerse}>
                <Text style={[styles.verseNumber, { color: colors.primary }]}>
                  {verse.verse}.
                </Text>
                <Text style={[styles.individualVerseText, { color: colors.primaryText }]}>
                  {verse.text}
                </Text>
              </View>
            ))}
          </View>
        )}
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
    paddingRight: 30,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  expandText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reference: {
    fontSize: 14,
    marginBottom: 6,
  },
  book: {
    fontSize: 12,
    marginBottom: 4,
  },
  versesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  versesHeader: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  individualVerse: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  verseNumber: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 8,
    marginTop: 2,
    minWidth: 20,
  },
  individualVerseText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
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