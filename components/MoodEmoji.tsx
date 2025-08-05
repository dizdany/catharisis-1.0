import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { moodEmojis } from '@/constants/moodEmojis';
import { MoodType } from '@/constants/verses';
import colors from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

interface MoodEmojiProps {
  mood: MoodType;
  onPress?: () => void;
}

export default function MoodEmoji({ mood, onPress }: MoodEmojiProps) {
  const { t } = useTranslation();
  
  const getMoodLabel = (mood: MoodType) => {
    switch(mood) {
      case 'lost': return t('moodLost');
      case 'distressed': return t('moodDistressed');
      case 'unsure': return t('moodUnsure');
      case 'good': return t('moodGood');
      case 'amazing': return t('moodAmazing');
      default: return '';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.emojiCircle}>
        <Text style={styles.emoji}>{moodEmojis[mood]}</Text>
      </View>
      <Text style={styles.label}>{getMoodLabel(mood)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  emojiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: 12,
  },
  emoji: {
    fontSize: 40,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  }
});