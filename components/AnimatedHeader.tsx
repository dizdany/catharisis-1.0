import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';

interface AnimatedHeaderProps {
  style?: any;
}

export default function AnimatedHeader({ style }: AnimatedHeaderProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Start title animation immediately
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Start subtitle animation with delay and slower fade
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 1200, // Slower fade for subtitle
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400); // Delay subtitle animation
  }, []);

  return (
    <View style={[styles.header, style]}>
      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ translateY: titleTranslateY }],
        }}
      >
        <Text style={[styles.title, { color: colors.primaryText }]}>
          {t('appTitle')}
        </Text>
      </Animated.View>
      
      <Animated.View
        style={{
          opacity: subtitleOpacity,
          transform: [{ translateY: subtitleTranslateY }],
        }}
      >
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          {t('findComfort')}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
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
});