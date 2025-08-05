import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { moodEmojis } from '@/constants/moodEmojis';
import { MoodType } from '@/constants/verses';
import { typography, elegantColors } from '@/constants/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';
import { useTheme } from '@/hooks/useTheme';
import { useUserProfile } from '@/store/userProfileStore';

interface MoodEmojiProps {
  mood: MoodType;
  onPress?: () => void;
  animate?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
  size?: string;
}

export default function AnimatedMoodEmoji({ mood, onPress, animate = false, isSelected = false, disabled = false, size = 'medium' }: MoodEmojiProps) {
  const { t, language } = useTranslation();
  const { moodDisplayMode } = useSettingsStore();
  const { colors } = useTheme();
  const { profile } = useUserProfile();
  const animatedPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  
  const getMoodLabel = (mood: MoodType) => {
    // Use gender-specific translations for Romanian when profile is available
    if (language === 'ro' && profile?.gender) {
      const genderSuffix = profile.gender === 'female' ? 'Female' : 'Male';
      switch(mood) {
        case 'lost': return t(`mood${mood.charAt(0).toUpperCase() + mood.slice(1)}${genderSuffix}` as any) || t('moodLost');
        case 'distressed': return t(`mood${mood.charAt(0).toUpperCase() + mood.slice(1)}${genderSuffix}` as any) || t('moodDistressed');
        case 'unsure': return t(`mood${mood.charAt(0).toUpperCase() + mood.slice(1)}${genderSuffix}` as any) || t('moodUnsure');
        case 'good': return t(`mood${mood.charAt(0).toUpperCase() + mood.slice(1)}${genderSuffix}` as any) || t('moodGood');
        case 'amazing': return t(`mood${mood.charAt(0).toUpperCase() + mood.slice(1)}${genderSuffix}` as any) || t('moodAmazing');
        case 'wonderful': return t(`mood${mood.charAt(0).toUpperCase() + mood.slice(1)}${genderSuffix}` as any) || t('moodWonderful');
        default: return '';
      }
    }
    
    // Default translations
    switch(mood) {
      case 'lost': return t('moodLost');
      case 'distressed': return t('moodDistressed');
      case 'unsure': return t('moodUnsure');
      case 'good': return t('moodGood');
      case 'amazing': return t('moodAmazing');
      case 'wonderful': return t('moodWonderful');
      default: return '';
    }
  };

  useEffect(() => {
    if (animate) {
      // Position the emoji in the middle area without overlapping text
      Animated.parallel([
        Animated.timing(animatedPosition, {
          toValue: { x: 0, y: 0 },  // Keep it centered
          duration: 800,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        Animated.timing(animatedScale, {
          toValue: 1.1,  // Slightly larger
          duration: 800,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      ]).start();
    }
  }, [animate]);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginVertical: 40,
      zIndex: 10,
    },
    smallContainer: {
      marginVertical: 8,
    },
    extraSmallContainer: {
      marginVertical: 4,
    },
    emojiCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.accent,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
    emoji: {
      fontSize: 50,
    },
    selectedCircle: {
      borderColor: colors.primary,
      borderWidth: 3,
      backgroundColor: colors.primary + '20',
    },
    largeCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    smallCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 8,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    extraSmallCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginBottom: 4,
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 3,
    },
    smallEmoji: {
      fontSize: 28,
    },
    extraSmallEmoji: {
      fontSize: 20,
    },
    label: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500' as const,
    },
    textDisplay: {
      fontSize: 14,
      textAlign: 'center',
      fontWeight: '600' as const,
      width: '90%',
      paddingHorizontal: 4,
    },
    smallTextDisplay: {
      fontSize: 10,
      paddingHorizontal: 2,
    },
    extraSmallTextDisplay: {
      fontSize: 8,
      paddingHorizontal: 1,
    },
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        size === 'small' && styles.smallContainer,
        size === 'extraSmall' && styles.extraSmallContainer,
        {
          transform: [
            { translateX: animatedPosition.x },
            { translateY: animatedPosition.y },
            { scale: animatedScale }
          ]
        }
      ]}
    >
      <TouchableOpacity 
        style={[
          styles.emojiCircle,
          isSelected && styles.selectedCircle,
          size === 'large' && styles.largeCircle,
          size === 'small' && styles.smallCircle,
          size === 'extraSmall' && styles.extraSmallCircle
        ]}
        onPress={onPress}
        disabled={!onPress || disabled}
        activeOpacity={0.8}
      >
        {moodDisplayMode === 'emoji' ? (
          <Text style={[
            styles.emoji,
            size === 'small' && styles.smallEmoji,
            size === 'extraSmall' && styles.extraSmallEmoji
          ]}>{moodEmojis[mood]}</Text>
        ) : (
          <Text 
            style={[
              styles.textDisplay, 
              typography.script,
              { color: colors.text },
              size === 'small' && styles.smallTextDisplay,
              size === 'extraSmall' && styles.extraSmallTextDisplay
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.6}
          >
            {getMoodLabel(mood)}
          </Text>
        )}
      </TouchableOpacity>
      {!animate && moodDisplayMode === 'emoji' && size !== 'small' && size !== 'extraSmall' && <Text style={styles.label}>{getMoodLabel(mood)}</Text>}
    </Animated.View>
  );
}

