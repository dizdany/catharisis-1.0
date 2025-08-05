import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default function OnboardingScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingFlow />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});