import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Animated, Easing, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, Shuffle } from 'lucide-react-native';
import { MoodType } from '@/constants/verses';
import NewLanguageSelector from '@/components/NewLanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { useMoodStore } from '@/store/moodStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import AnimatedButton from '@/components/AnimatedButton';
import MoodSlider from '@/components/MoodSlider';
import VerseDisplay from '@/components/VerseDisplay';
import HomeScreen from '@/components/HomeScreen';
import MiniClock from '@/components/MiniClock';
import { getRandomVerseByMood } from '@/constants/moodVerses';

function IndexContent() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedMood, setMood, resetMood } = useMoodStore();
  const [currentVerse, setCurrentVerse] = useState<any>(null);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const buttonFadeAnim = React.useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = React.useRef(new Animated.Value(50)).current;
  const moodFadeAnim = React.useRef(new Animated.Value(0)).current;
  const moodSlideAnim = React.useRef(new Animated.Value(50)).current;
  const verseFadeAnim = React.useRef(new Animated.Value(0)).current;
  const verseSlideAnim = React.useRef(new Animated.Value(30)).current;

  // Load verse for existing mood on component mount
  useEffect(() => {
    if (selectedMood && !currentVerse) {
      const verse = getRandomVerseByMood(selectedMood);
      setCurrentVerse(verse);
    }
  }, [selectedMood, currentVerse]);

  useEffect(() => {
    // Start animations when component mounts
    Animated.sequence([
      // First animate the header
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      // Then animate the mood slider
      Animated.parallel([
        Animated.timing(moodFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(moodSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      // Finally animate the button
      Animated.parallel([
        Animated.timing(buttonFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(buttonSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();
  }, []);

  const handleMoodSelect = (mood: MoodType) => {
    setMood(mood);
    const verse = getRandomVerseByMood(mood);
    setCurrentVerse(verse);
    
    // Animate verse appearance
    verseFadeAnim.setValue(0);
    verseSlideAnim.setValue(30);
    
    Animated.parallel([
      Animated.timing(verseFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(verseSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  };

  const handleRetry = () => {
    if (selectedMood) {
      const verse = getRandomVerseByMood(selectedMood);
      setCurrentVerse(verse);
      
      // Animate verse change
      verseFadeAnim.setValue(0);
      verseSlideAnim.setValue(30);
      
      Animated.parallel([
        Animated.timing(verseFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(verseSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    }
  };

  const handleResetMood = () => {
    resetMood();
    setCurrentVerse(null);
  };

  const { randomReadingEnabled } = useSettingsStore();

  const handleReadBible = () => {
    if (randomReadingEnabled) {
      // Navigate to random reading
      router.push('/read');
    } else {
      // Navigate to bible selection (start reading)
      router.push('/bible');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.topContainer}>
          <View style={styles.languageContainer}>
            <NewLanguageSelector />
          </View>
          <View style={styles.clockContainer}>
            <MiniClock size="small" />
          </View>
        </View>
        
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={[styles.title, { color: colors.primaryText }]}>
            {t('appTitle')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            {t('findComfort')}
          </Text>
        </Animated.View>

        {!selectedMood && (
          <Animated.View 
            style={[
              styles.moodContainer,
              {
                opacity: moodFadeAnim,
                transform: [{ translateY: moodSlideAnim }]
              }
            ]}
          >
            <Text style={[styles.moodTitle, { color: colors.primaryText }]}>
              {t('howAreYouFeeling') || 'How are you feeling?'}
            </Text>
            <MoodSlider 
              onMoodSelect={handleMoodSelect} 
              selectedMood={selectedMood} 
              onRetry={handleRetry}
            />
          </Animated.View>
        )}
        
        {selectedMood && (
          <View style={styles.selectedMoodContainer}>
            <MoodSlider 
              onMoodSelect={handleMoodSelect} 
              selectedMood={selectedMood} 
              onRetry={handleRetry}
            />
          </View>
        )}
        
        {currentVerse && (
          <Animated.View 
            style={[
              styles.verseContainer,
              {
                opacity: verseFadeAnim,
                transform: [{ translateY: verseSlideAnim }]
              }
            ]}
          >
            <VerseDisplay verse={currentVerse} fadeAnim={verseFadeAnim} slideAnim={verseSlideAnim} />
          </Animated.View>
        )}

        {selectedMood && (
          <View style={styles.resetButtonContainer}>
            <Pressable
              style={styles.resetButton}
              onPress={handleResetMood}
            >
              <Text style={[styles.resetButtonText, { color: colors.secondaryText }]}>
                {t('chooseDifferentMood')}
              </Text>
            </Pressable>
          </View>
        )}

        <Animated.View 
          style={[
            styles.centerButtonContainer,
            {
              opacity: buttonFadeAnim,
              transform: [{ translateY: buttonSlideAnim }]
            }
          ]}
        >
          <AnimatedButton
            title={randomReadingEnabled ? t('readRandomChapter') : t('startReading')}
            onPress={handleReadBible}
            icon={randomReadingEnabled ? (
              <Shuffle size={24} color={colors.buttonText} />
            ) : (
              <BookOpen size={24} color={colors.primaryText} />
            )}
            style={[styles.readBibleButton, randomReadingEnabled ? 
              { backgroundColor: colors.primary, shadowColor: colors.shadow } : 
              { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary }
            ]}
            textStyle={[styles.readBibleButtonText, { 
              color: randomReadingEnabled ? colors.buttonText : colors.primaryText 
            }]}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

export default function IndexScreen() {
  const { isHydrated } = useSettingsStore();
  const { isCompleted } = useOnboardingStore();
  const { selectedMood } = useMoodStore();
  
  // Don't render until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If onboarding is completed and user has a mood, show HomeScreen
  if (isCompleted && selectedMood) {
    return <HomeScreen />;
  }

  // Otherwise show the mood selection interface
  return <IndexContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    minHeight: '100%',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  topContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  languageContainer: {
    marginBottom: 12,
  },
  clockContainer: {
    alignSelf: 'flex-end',
  },

  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700' as const,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '300' as const,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  moodContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  moodTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginBottom: 20,
    textAlign: 'center',
  },
  verseContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  centerButtonContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  readBibleButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 200,
  },
  readBibleButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  resetButtonContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    textDecorationLine: 'underline',
  },
  selectedMoodContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
});