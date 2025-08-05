import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface MiniClockProps {
  size?: 'small' | 'medium';
}

export default function MiniClock({ size = 'small' }: MiniClockProps) {
  const { colors } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const isSmall = size === 'small';

  return (
    <View style={[
      styles.container, 
      { backgroundColor: colors.cardBackground },
      isSmall ? styles.smallContainer : styles.mediumContainer
    ]}>
      <Clock 
        size={isSmall ? 12 : 16} 
        color={colors.secondaryText} 
        style={styles.icon}
      />
      <Text style={[
        styles.timeText, 
        { color: colors.primaryText },
        isSmall ? styles.smallText : styles.mediumText
      ]}>
        {formatTime(time)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  smallContainer: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  mediumContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  icon: {
    marginRight: 4,
  },
  timeText: {
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
});