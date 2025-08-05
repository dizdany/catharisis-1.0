import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ViewStyle, 
  TextStyle, 
  Animated, 
  Easing,
  View
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'filled' | 'outlined';
  direction?: 'left' | 'right' | 'up' | 'down';
  disabled?: boolean;
}

export default function AnimatedButton({ 
  title, 
  onPress, 
  icon, 
  style, 
  textStyle,
  variant = 'filled',
  direction = 'up',
  disabled = false
}: AnimatedButtonProps) {
  const { colors } = useTheme();
  const animatedScale = React.useRef(new Animated.Value(1)).current;
  const animatedTranslate = React.useRef(new Animated.Value(0)).current;
  const animatedOpacity = React.useRef(new Animated.Value(1)).current;
  
  const getTransformStyle = () => {
    switch (direction) {
      case 'left':
        return { translateX: animatedTranslate };
      case 'right':
        return { translateX: Animated.multiply(animatedTranslate, -1) };
      case 'up':
        return { translateY: animatedTranslate };
      case 'down':
        return { translateY: Animated.multiply(animatedTranslate, -1) };
      default:
        return { translateY: animatedTranslate };
    }
  };
  
  const handlePressIn = () => {
    if (disabled) return;
    
    Animated.parallel([
      Animated.timing(animatedScale, {
        toValue: 0.92,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.timing(animatedTranslate, {
        toValue: 3,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.timing(animatedOpacity, {
        toValue: 0.8,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    ]).start();
  };
  
  const handlePressOut = () => {
    if (disabled) return;
    
    Animated.parallel([
      Animated.spring(animatedScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 200,
      }),
      Animated.spring(animatedTranslate, {
        toValue: 0,
        useNativeDriver: true,
        friction: 4,
        tension: 200,
      }),
      Animated.spring(animatedOpacity, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 200,
      })
    ]).start();
  };
  
  const buttonStyles = variant === 'filled' ? 
    [styles.filledButton, { backgroundColor: colors.primary, shadowColor: colors.shadow }] : 
    [styles.outlinedButton, { borderColor: colors.accent }];
  const textStyles = variant === 'filled' ? 
    [styles.filledText, { color: colors.buttonText }] : 
    [styles.outlinedText, { color: colors.primary }];
  
  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        { 
          transform: [
            { scale: animatedScale },
            ...Object.entries(getTransformStyle()).map(([key, value]) => ({ [key]: value }))
          ],
          opacity: animatedOpacity
        }
      ]}
    >
      <TouchableOpacity
        style={[buttonStyles, style, disabled && styles.disabledButton]}
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={disabled ? 1 : 0.8}
        disabled={disabled}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[textStyles, textStyle, disabled && styles.disabledText]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    overflow: 'visible',
  },
  filledButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  filledText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  outlinedText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  iconContainer: {
    marginRight: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});