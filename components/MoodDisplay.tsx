import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { moodEmojis } from '@/constants/moodEmojis';
import { MoodType } from '@/constants/verses';
import colors from '@/constants/colors';
import { typography, elegantColors } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';

interface MoodDisplayProps {
  mood: MoodType;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function MoodDisplay({ mood, onPress, size = 'medium' }: MoodDisplayProps) {
  const { t } = useTranslation();
  const { moodDisplayMode } = useSettingsStore();
  
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

  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  const emojiSizes = {
    small: 22,
    medium: 34,
    large: 42,
  };

  const textSizes = {
    small: 8,
    medium: 11,
    large: 13,
  };

  const content = moodDisplayMode === 'emoji' ? (
    <Text style={[styles.emoji, { fontSize: emojiSizes[size] }]}>
      {moodEmojis[mood]}
    </Text>
  ) : (
    <Text style={[
      styles.textDisplay, 
      typography.script,
      { fontSize: textSizes[size], color: elegantColors.elegantText }
    ]}>
      {getMoodLabel(mood)}
    </Text>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.displayCircle, sizeStyles[size]]}>
          {content}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.displayCircle, sizeStyles[size]]}>
        {content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  displayCircle: {
    borderRadius: 50,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    padding: 4,
    // Add a subtle inner glow effect
    overflow: 'hidden',
  },
  small: {
    width: 44,
    height: 44,
  },
  medium: {
    width: 64,
    height: 64,
  },
  large: {
    width: 84,
    height: 84,
  },
  emoji: {
    textAlign: 'center',
    lineHeight: undefined,
  },
  textDisplay: {
    textAlign: 'center',
    fontWeight: '600',
    maxWidth: '90%',
    flexWrap: 'wrap',
    lineHeight: undefined,
  },
});