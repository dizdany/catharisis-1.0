import React, { useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  ViewStyle, 
  Animated, 
  TouchableWithoutFeedback,
  Easing
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export default function AnimatedCard({ children, style, onPress }: AnimatedCardProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    if (!onPress) return;
    
    Animated.timing(scale, {
      toValue: 0.98,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };
  
  const handlePressOut = () => {
    if (!onPress) return;
    
    Animated.timing(scale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };
  
  const Card = (
    <Animated.View 
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.shadow,
        },
        style,
        { transform: [{ scale }] }
      ]}
    >
      {children}
    </Animated.View>
  );
  
  if (onPress) {
    return (
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        {Card}
      </TouchableWithoutFeedback>
    );
  }
  
  return Card;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
});