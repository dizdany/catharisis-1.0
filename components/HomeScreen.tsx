import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book, RotateCcw, BookOpen, Shuffle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useMoodStore } from '@/store/moodStore';
import { useSettingsStore } from '@/store/settingsStore';

import { getRandomVerseByMood } from '@/constants/moodVerses';
import AnimatedMoodDisplay from './AnimatedMoodDisplay';
import AnimatedButton from './AnimatedButton';
import AnimatedHeader from './AnimatedHeader';
import MiniClock from './MiniClock';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { selectedMood, resetMood } = useMoodStore();
  const { randomReadingEnabled } = useSettingsStore();
  const [animateEmoji, setAnimateEmoji] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateEmoji(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!selectedMood) {
    return null;
  }

  const handleGetVerse = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Get a random verse from local storage
      const randomVerse = getRandomVerseByMood(selectedMood);
      if (randomVerse) {
        router.push(`/verse/${randomVerse.id}`);
      } else {
        console.error('No verses found for mood:', selectedMood);
      }
    } catch (error) {
      console.error('Error getting verse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeMood = () => {
    resetMood();
  };

  const handleReadBibleAction = () => {
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
      <View style={[styles.clockContainer, { 
        top: Platform.OS === 'android' ? Math.max(insets.top + 10, 20) : 20 
      }]}>
        <MiniClock size="small" />
      </View>
      
      <AnimatedHeader />
      
      <View style={styles.moodSection}>
        <AnimatedMoodDisplay 
          mood={selectedMood} 
          onPress={handleChangeMood} 
          animate={animateEmoji}
          size="large"
        />
        
        <View style={styles.changeMoodContainer}>
          <AnimatedButton
            title={t('chooseDifferentMood')}
            onPress={handleChangeMood}
            icon={<RotateCcw size={16} color={colors.secondaryText} />}
            variant="outlined"
            style={[styles.changeMoodButton, { borderColor: colors.accent }]}
            textStyle={[styles.changeMoodText, { color: colors.secondaryText }]}
          />
        </View>
      </View>
      
      <View style={styles.actionContainer}>
        <AnimatedButton
          title={isLoading ? t('loading') || 'Loading...' : t('getVerse')}
          onPress={handleGetVerse}
          icon={<Book size={20} color={colors.buttonText} />}
          style={[styles.readButton, { backgroundColor: colors.primary }, isLoading && styles.loadingButton]}
          textStyle={[styles.readButtonText, { color: colors.buttonText }] as TextStyle}
          disabled={isLoading}
        />
        
        <AnimatedButton
          title={randomReadingEnabled ? t('readRandomChapter') : t('startReading')}
          onPress={handleReadBibleAction}
          icon={randomReadingEnabled ? (
            <Shuffle size={20} color={colors.primaryText} />
          ) : (
            <BookOpen size={20} color={colors.primaryText} />
          )}
          style={[styles.bibleButton, randomReadingEnabled ? 
            { backgroundColor: colors.accent } : 
            { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary }
          ]}
          textStyle={[styles.bibleButtonText, { 
            color: randomReadingEnabled ? colors.buttonText : colors.primaryText 
          }]}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  clockContainer: {
    position: 'absolute',
    left: 20,
    zIndex: 1000,
  },

  moodSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  changeMoodContainer: {
    marginTop: 30,
    paddingHorizontal: 40,
  },
  changeMoodButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  changeMoodText: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  actionContainer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  readButton: {},
  readButtonBackground: {
    backgroundColor: 'transparent',
  },
  loadingButton: {
    opacity: 0.7,
  },
  readButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  bibleButton: {
    marginTop: 12,
  },
  bibleButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },

});