import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Easing,
  View
} from 'react-native';
import { Heart } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

interface AnimatedFavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export default function AnimatedFavoriteButton({ 
  isFavorite, 
  onToggle 
}: AnimatedFavoriteButtonProps) {
  const { t } = useTranslation();
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isFavorite) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      ]).start();
    }
  }, [isFavorite]);
  
  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.9,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale }] }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          isFavorite ? styles.favoriteActive : styles.favoriteButton
        ]}
        onPress={onToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Heart 
          size={14} 
          color={isFavorite ? "#FF6B6B" : colors.primary}
          fill={isFavorite ? "#FF6B6B" : 'transparent'}
        />
        <Text 
          style={[
            styles.buttonText, 
            isFavorite ? styles.favoriteActiveText : {}
          ]}
        >
          {isFavorite ? t('saved') : t('save')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  favoriteButton: {
    backgroundColor: 'transparent',
  },
  favoriteActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  buttonText: {
    marginLeft: 5,
    color: colors.primary,
    fontWeight: '500',
    fontSize: 13,
  },
  favoriteActiveText: {
    color: '#FF6B6B',
  },
});