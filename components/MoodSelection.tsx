import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MoodType } from '@/constants/verses';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { useUserProfile } from '@/store/userProfileStore';
import CircularMoodSelector from './CircularMoodSelector';

interface MoodSelectionProps {
  onMoodSelect: (mood: MoodType) => void;
  selectedMood: MoodType | null;
}

export default function MoodSelection({ onMoodSelect, selectedMood }: MoodSelectionProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { profile } = useUserProfile();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          {t('appTitle')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          {t('findComfort')}
        </Text>
      </View>
      
      <View style={styles.moodContainer}>
        <Text style={[styles.question, { color: colors.text }]}>
          {profile?.name ? `${t('howAreYouFeeling').replace('?', '')}, ${profile.name}?` : t('howAreYouFeeling')}
        </Text>
        
        <CircularMoodSelector
          onMoodSelect={onMoodSelect}
          selectedMood={selectedMood}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '600' as const,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300' as const,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  moodContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  question: {
    fontSize: 18,
    fontWeight: '500' as const,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
});