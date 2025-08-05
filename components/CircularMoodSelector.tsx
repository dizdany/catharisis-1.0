import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MoodType } from '@/constants/verses';
import AnimatedMoodEmoji from './AnimatedMoodEmoji';

interface CircularMoodSelectorProps {
  onMoodSelect: (mood: MoodType) => void;
  selectedMood: MoodType | null;
}

const moods: MoodType[] = ['lost', 'distressed', 'unsure', 'good', 'amazing'];

export default function CircularMoodSelector({ onMoodSelect, selectedMood }: CircularMoodSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.moodGrid}>
        {moods.map((mood, index) => (
          <View key={mood} style={styles.moodItem}>
            <AnimatedMoodEmoji
              mood={mood}
              onPress={() => onMoodSelect(mood)}
              isSelected={selectedMood === mood}
              disabled={false}
              size="large"
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  moodItem: {
    margin: 12,
    minWidth: '18%',
    alignItems: 'center',
  },
});