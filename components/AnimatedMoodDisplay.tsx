import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { MoodType } from '@/constants/verses';
import MoodDisplay from './MoodDisplay';

interface AnimatedMoodDisplayProps {
  mood: MoodType;
  onPress?: () => void;
  animate?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function AnimatedMoodDisplay({ 
  mood, 
  onPress, 
  animate = false, 
  size = 'medium' 
}: AnimatedMoodDisplayProps) {
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animate) {
      // Reset animations
      animatedScale.setValue(0.8);
      animatedOpacity.setValue(0);
      
      // Animate in with elegant entrance - no position changes to avoid overlapping
      Animated.parallel([
        Animated.spring(animatedScale, {
          toValue: 1.1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      ]).start();
    } else {
      // Keep it visible and stable when not animating
      animatedScale.setValue(1);
      animatedOpacity.setValue(1);
    }
  }, [animate, mood]); // Add mood to dependencies to prevent flickering

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: animatedOpacity,
          transform: [{ scale: animatedScale }]
        }
      ]}
    >
      <MoodDisplay 
        mood={mood}
        onPress={onPress}
        size={size}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    zIndex: 10,
  },
});