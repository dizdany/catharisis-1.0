import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, TouchableOpacity } from 'react-native';
import { Heart, Share2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { MoodVerse } from '@/constants/moodVerses';
import { useVerseStore } from '@/store/verseStore';
import VerseShareModal from './VerseShareModal';

interface VerseDisplayProps {
  verse: MoodVerse;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function VerseDisplay({ verse, fadeAnim, slideAnim }: VerseDisplayProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useVerseStore();
  const { colors } = useTheme();
  const isVerseFavorite = isFavorite(verse.id);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleFavoritePress = () => {
    if (isVerseFavorite) {
      removeFromFavorites(verse.id);
    } else {
      addToFavorites({
        id: verse.id,
        text: verse.text,
        reference: verse.reference,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        mood: verse.mood
      });
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.card, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
        <View style={styles.header}>
          <Text style={[styles.reference, { color: colors.primary }]}>
            {verse.reference}
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setShowShareModal(true)}
              style={styles.shareButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Share2
                size={18}
                color={colors.secondaryText}
              />
            </TouchableOpacity>
            <Pressable
              onPress={handleFavoritePress}
              style={styles.favoriteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart
                size={20}
                color={isVerseFavorite ? colors.error : colors.secondaryText}
                fill={isVerseFavorite ? colors.error : 'transparent'}
              />
            </Pressable>
          </View>
        </View>
        
        <Text style={[styles.verseText, { color: colors.primaryText }]}>
          {verse.text}
        </Text>
      </View>
      
      <VerseShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        verse={verse}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareButton: {
    padding: 4,
  },
  reference: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  favoriteButton: {
    padding: 4,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
    textAlign: 'left',
  },
});