import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { Trophy, Award, X, Share2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { getTranslatedAchievement } from '@/store/achievementStore';
import { TranslationKey } from '@/constants/translations';



interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  titleKey?: TranslationKey;
  descriptionKey?: TranslationKey;
}

interface AchievementBubbleProps {
  achievement: Achievement | null;
  visible: boolean;
  onHide: () => void;
}

export default function AchievementBubble({ achievement, visible, onHide }: AchievementBubbleProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  
  // Translate achievement if it has translation keys
  const translatedAchievement = achievement && achievement.titleKey && achievement.descriptionKey 
    ? getTranslatedAchievement(achievement as any, t)
    : achievement;

  useEffect(() => {
    if (visible && achievement) {
      // Reset position
      translateX.setValue(0);
      translateY.setValue(0);
      rotateAnim.setValue(0);
      
      // Animate in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        // Sparkle animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(sparkleAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(sparkleAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
        // Pulse animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      // Auto hide after 6 seconds (increased for interaction time)
      const timer = setTimeout(() => {
        hideAnimation();
      }, 6000);

      return () => clearTimeout(timer);
    } else if (!visible) {
      hideAnimation();
    }
  }, [visible, achievement]);

  const hideAnimation = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX: tx, translationY: ty, velocityX, velocityY } = event.nativeEvent;
      
      // If dragged far enough or with enough velocity, dismiss
      if (Math.abs(tx) > 100 || Math.abs(ty) > 100 || Math.abs(velocityX) > 500 || Math.abs(velocityY) > 500) {
        // Animate out in the direction of the drag
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: tx + velocityX * 0.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: ty + velocityY * 0.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      } else {
        // Spring back to original position
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          // Add a little rotation for fun
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: tx > 0 ? 5 : -5,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }
    }
  };

  const handleShare = () => {
    // Add haptic feedback if available
    if (Platform.OS !== 'web') {
      // Could add haptic feedback here
    }
    console.log('Share achievement:', translatedAchievement?.title);
  };

  const handleClose = () => {
    hideAnimation();
  };

  if (!translatedAchievement) return null;

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                { translateY: slideAnim },
                { translateX: translateX },
                { translateY: Animated.add(slideAnim, translateY) },
                { scale: Animated.multiply(scaleAnim, pulseAnim) },
                { rotate: rotateAnim.interpolate({
                  inputRange: [-10, 10],
                  outputRange: ['-10deg', '10deg'],
                }) },
              ],
              opacity: opacityAnim,
            },
          ]}
        >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: colors.cardBackground,
            borderColor: translatedAchievement.color + '40',
            shadowColor: colors.primaryText,
          },
        ]}
      >
        {/* Glow effect */}
        <View
          style={[
            styles.glowEffect,
            {
              backgroundColor: translatedAchievement.color + '20',
            },
          ]}
        />

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.divider + '40' }]}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={16} color={colors.primaryText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.divider + '40' }]}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <X size={16} color={colors.primaryText} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Icon container */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: translatedAchievement.color + '20',
              },
            ]}
          >
            <Text style={styles.achievementIcon}>{translatedAchievement.icon}</Text>
            <View style={styles.trophyBadge}>
              <Trophy size={12} color={translatedAchievement.color} />
            </View>
          </View>

          {/* Text content */}
          <View style={styles.textContent}>
            <View style={styles.header}>
              <Award size={16} color={translatedAchievement.color} />
              <Text style={[styles.headerText, { color: colors.primaryText }]}>
                {t('achievementUnlocked')}
              </Text>
            </View>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              {translatedAchievement.title}
            </Text>
            <Text style={[styles.description, { color: colors.secondaryText }]}>
              {translatedAchievement.description}
            </Text>
          </View>
        </View>

        {/* Drag indicator */}
        <View style={[styles.dragIndicator, { backgroundColor: colors.divider }]} />

        {/* Animated sparkle effects */}
        <Animated.View 
          style={[
            styles.sparkle, 
            styles.sparkle1,
            {
              opacity: sparkleAnim,
              transform: [{
                scale: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.2],
                })
              }]
            }
          ]}
        >
          <Text style={styles.sparkleText}>✨</Text>
        </Animated.View>
        <Animated.View 
          style={[
            styles.sparkle, 
            styles.sparkle2,
            {
              opacity: sparkleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.3],
              }),
              transform: [{
                scale: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.2, 0.8],
                })
              }]
            }
          ]}
        >
          <Text style={styles.sparkleText}>⭐</Text>
        </Animated.View>
        <Animated.View 
          style={[
            styles.sparkle, 
            styles.sparkle3,
            {
              opacity: sparkleAnim,
              transform: [{
                rotate: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })
              }]
            }
          ]}
        >
          <Text style={styles.sparkleText}>💫</Text>
        </Animated.View>
      </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
    pointerEvents: 'box-none',
  },
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  bubble: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    paddingTop: 24,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'visible',
  },
  actionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    opacity: 0.3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  achievementIcon: {
    fontSize: 28,
  },
  trophyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: -8,
    right: 20,
  },
  sparkle2: {
    bottom: -6,
    left: 30,
  },
  sparkle3: {
    top: 10,
    right: -8,
  },
  sparkleText: {
    fontSize: 16,
  },
});