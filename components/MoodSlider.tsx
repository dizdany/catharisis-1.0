import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MoodType } from '@/constants/verses';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedMoodEmoji from './AnimatedMoodEmoji';
import { RotateCcw } from 'lucide-react-native';

interface MoodSliderProps {
  onMoodSelect: (mood: MoodType) => void;
  selectedMood: MoodType | null;
  onRetry?: () => void;
}

const moods: MoodType[] = ['lost', 'unsure', 'good', 'wonderful'];

export default function MoodSlider({ onMoodSelect, selectedMood, onRetry }: MoodSliderProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, selectedMood && styles.selectedContainer]}>
      {!selectedMood ? (
        <View style={[styles.moodRow, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
          {moods.map((mood, index) => (
            <View key={mood} style={styles.moodItem}>
              <AnimatedMoodEmoji
                mood={mood}
                onPress={() => onMoodSelect(mood)}
                isSelected={false}
                disabled={false}
                size="small"
              />
            </View>
          ))}
        </View>
      ) : (
        <View style={[styles.selectedMoodRow, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
          <View style={styles.selectedMoodItem}>
            <AnimatedMoodEmoji
              mood={selectedMood}
              onPress={undefined}
              isSelected={true}
              disabled={true}
              size="extraSmall"
            />
          </View>
          {onRetry && (
            <Pressable
              style={[styles.retryButton, { backgroundColor: colors.primary, shadowColor: colors.shadow }]}
              onPress={onRetry}
            >
              <RotateCcw size={12} color={colors.buttonText} />
              <Text style={[styles.retryText, { color: colors.buttonText }]}>
                {t('tryAnother')}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  selectedContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    transform: [{ translateY: -25 }],
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    zIndex: 10,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  moodItem: {
    marginHorizontal: 8,
    alignItems: 'center',
  },
  selectedMoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedMoodItem: {
    marginRight: 8,
    alignItems: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    maxWidth: 80,
    minWidth: 70,
  },
  retryText: {
    fontSize: 10,
    fontWeight: '600' as const,
    marginLeft: 3,
    flexShrink: 1,
    textAlign: 'center',
  },
});