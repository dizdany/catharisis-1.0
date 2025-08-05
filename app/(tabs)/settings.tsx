import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, Palette, Type, Globe, BookOpen, Shuffle, Sun, Moon, RotateCcw, AlertTriangle, User, Edit3, Shield, ExternalLink } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';
import { useVerseStore } from '@/store/verseStore';
import { useMoodStore } from '@/store/moodStore';
import { useLanguageStore } from '@/store/languageStore';
import { useReadingStore } from '@/store/readingStore';
import { useBibleStore } from '@/store/bibleStore';
import { useUserProfile } from '@/store/userProfileStore';
import { useTheme } from '@/hooks/useTheme';
import AnimatedCard from '@/components/AnimatedCard';
import AnimatedButton from '@/components/AnimatedButton';
import LanguageSelector from '@/components/LanguageSelector';
import BibleProgressCard from '@/components/BibleProgressCard';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const [isResetting, setIsResetting] = useState(false);
  const insets = useSafeAreaInsets();
  
  const { 
    moodDisplayMode, 
    setMoodDisplayMode, 
    randomReadingEnabled, 
    setRandomReadingEnabled,
    themeMode,
    setThemeMode
  } = useSettingsStore();
  
  // Import all stores for reset functionality (used in performReset)
  useVerseStore();
  useMoodStore();
  useLanguageStore();
  useReadingStore();
  useBibleStore();
  const { resetProfile } = useUserProfile();

  const handleMoodDisplayToggle = () => {
    setMoodDisplayMode(moodDisplayMode === 'emoji' ? 'text' : 'emoji');
  };

  const handleRandomReadingToggle = () => {
    setRandomReadingEnabled(!randomReadingEnabled);
  };

  const handleThemeToggle = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
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

  const handlePrivacyPolicy = async () => {
    const url = 'https://catharisisapp.com/privacy-policy';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          t('error') || 'Error',
          t('cantOpenLink') || 'Cannot open this link',
          [{ text: t('ok') || 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening privacy policy:', error);
      Alert.alert(
        t('error') || 'Error',
        t('cantOpenLink') || 'Cannot open this link',
        [{ text: t('ok') || 'OK' }]
      );
    }
  };

  const handleResetData = () => {
    const showAlert = () => {
      Alert.alert(
        t('resetDataTitle') || 'Reset All Data',
        t('resetDataMessage') || 'This will permanently delete all your data including favorites, reading progress, and settings. This action cannot be undone.',
        [
          {
            text: t('cancel') || 'Cancel',
            style: 'cancel',
          },
          {
            text: t('resetData') || 'Reset Data',
            style: 'destructive',
            onPress: performReset,
          },
        ],
        { cancelable: true }
      );
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        (t('resetDataMessage') || 'This will permanently delete all your data including favorites, reading progress, and settings. This action cannot be undone.') + '\n\nAre you sure you want to continue?'
      );
      if (confirmed) {
        performReset();
      }
    } else {
      showAlert();
    }
  };

  const performReset = async () => {
    try {
      setIsResetting(true);
      console.log('Starting data reset...');
      
      // Clear all AsyncStorage data
      const keys = [
        'settings-storage',
        'verse-storage', 
        'mood-storage',
        'language-storage',
        'reading-storage',
        'bible-storage',
        'user-profile'
      ];
      
      await AsyncStorage.multiRemove(keys);
      console.log('AsyncStorage cleared');
      
      // Reset user profile
      await resetProfile();
      
      // Reset all stores to their initial state
      // Note: Since we're using persist middleware, we need to trigger a reload
      // to properly reset the stores
      
      if (Platform.OS === 'web') {
        // On web, reload the page
        window.location.reload();
      } else {
        // On mobile, we can try to reset stores manually
        // But the most reliable way is to restart the app
        Alert.alert(
          t('resetComplete') || 'Reset Complete',
          t('restartAppMessage') || 'Please restart the app to complete the reset process.',
          [{ text: t('ok') || 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('Error resetting data:', error);
      Alert.alert(
        t('error') || 'Error',
        t('resetErrorMessage') || 'Failed to reset data. Please try again.',
        [{ text: t('ok') || 'OK' }]
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Settings size={24} color={colors.primary} />
          <Text style={[styles.title, { color: colors.primaryText }]}>
            {t('settings')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            {t('settingsSubtitle')}
          </Text>
        </View>

        <BibleProgressCard />

        <AnimatedCard style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <User size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              {t('profile')}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/onboarding')}
            activeOpacity={0.7}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.primaryText }]}>
                  {t('editProfile')}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                  {t('personalInfo')}
                </Text>
              </View>
              <View style={[
                styles.profileButton,
                { backgroundColor: colors.primary + '20' }
              ]}>
                <Edit3 size={16} color={colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </AnimatedCard>

        <AnimatedCard style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Palette size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              {t('appearance')}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleThemeToggle}
            activeOpacity={0.7}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.primaryText }]}>
                  {t('theme')}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                  {themeMode === 'light' ? t('lightMode') : t('darkMode')}
                </Text>
              </View>
              <View style={[
                styles.toggle,
                { backgroundColor: themeMode === 'light' ? colors.primary : colors.accent }
              ]}>
                <View style={[
                  styles.toggleSlider,
                  {
                    backgroundColor: themeMode === 'light' ? colors.secondary : colors.lightText,
                    alignSelf: themeMode === 'light' ? 'flex-end' : 'flex-start'
                  }
                ]}>
                  {themeMode === 'light' ? (
                    <Sun size={12} color={colors.primary} />
                  ) : (
                    <Moon size={12} color={colors.secondary} />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleMoodDisplayToggle}
            activeOpacity={0.7}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.primaryText }]}>
                  {t('moodDisplay')}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                  {moodDisplayMode === 'emoji' ? t('moodDisplayEmoji') : t('moodDisplayText')}
                </Text>
              </View>
              <View style={[
                styles.toggle,
                { backgroundColor: moodDisplayMode === 'emoji' ? colors.primary : colors.accent }
              ]}>
                <View style={[
                  styles.toggleSlider,
                  {
                    backgroundColor: moodDisplayMode === 'emoji' ? colors.secondary : colors.lightText,
                    alignSelf: moodDisplayMode === 'emoji' ? 'flex-end' : 'flex-start'
                  }
                ]}>
                  {moodDisplayMode === 'emoji' ? (
                    <Text style={styles.toggleEmoji}>😊</Text>
                  ) : (
                    <Type size={12} color={colors.secondary} />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </AnimatedCard>

        <AnimatedCard style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <BookOpen size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              {t('readBible')}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleRandomReadingToggle}
            activeOpacity={0.7}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.primaryText }]}>
                  {t('randomReading')}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                  {randomReadingEnabled ? t('randomReadingEnabled') : t('randomReadingDisabled')}
                </Text>
              </View>
              <View style={[
                styles.toggle,
                { backgroundColor: randomReadingEnabled ? colors.primary : colors.accent }
              ]}>
                <View style={[
                  styles.toggleSlider,
                  {
                    backgroundColor: randomReadingEnabled ? colors.secondary : colors.lightText,
                    alignSelf: randomReadingEnabled ? 'flex-end' : 'flex-start'
                  }
                ]}>
                  {randomReadingEnabled ? (
                    <Shuffle size={12} color={colors.primary} />
                  ) : (
                    <BookOpen size={12} color={colors.secondary} />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <AnimatedButton
            title={randomReadingEnabled ? t('readRandomChapter') : t('startReading')}
            onPress={handleReadBibleAction}
            icon={randomReadingEnabled ? (
              <Shuffle size={20} color={colors.buttonText} />
            ) : (
              <BookOpen size={20} color={colors.primaryText} />
            )}
            style={[styles.actionButton, randomReadingEnabled ? 
              { backgroundColor: colors.primary } : 
              { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary }
            ]}
            textStyle={[styles.actionButtonText, { 
              color: randomReadingEnabled ? colors.buttonText : colors.primaryText 
            }]}
          />
        </AnimatedCard>

        <AnimatedCard style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Globe size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              {t('language')}
            </Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.primaryText }]}>
                {t('appLanguage')}
              </Text>
            </View>
          </View>
          
          <LanguageSelector />
        </AnimatedCard>

        <AnimatedCard style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Shield size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              {t('privacy') || 'Privacy & Legal'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handlePrivacyPolicy}
            activeOpacity={0.7}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.primaryText }]}>
                  {t('privacyPolicy') || 'Privacy Policy'}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                  {t('privacyPolicyDescription') || 'Learn how we protect your data'}
                </Text>
              </View>
              <View style={[
                styles.linkButton,
                { backgroundColor: colors.primary + '20' }
              ]}>
                <ExternalLink size={16} color={colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </AnimatedCard>

        {__DEV__ && (
          <AnimatedCard style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={18} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
                {t('developer') || 'Developer'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.settingItem, styles.dangerItem]}
              onPress={handleResetData}
              activeOpacity={0.7}
              disabled={isResetting}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.accent }]}>
                    {t('resetData') || 'Reset All Data'}
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                    {t('resetDataDescription') || 'Clear all app data and settings'}
                  </Text>
                </View>
                <View style={[
                  styles.dangerButton,
                  { backgroundColor: colors.accent + '20', opacity: isResetting ? 0.5 : 1 }
                ]}>
                  <RotateCcw size={16} color={colors.accent} />
                </View>
              </View>
            </TouchableOpacity>
          </AnimatedCard>
        )}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.secondaryText }]}>
            {t('settingsFooter')}
          </Text>
          {__DEV__ && (
            <Text style={[styles.devFooterText, { color: colors.secondaryText }]}>
              {t('devModeActive') || 'Development Mode Active'}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    marginTop: 8,
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
    fontWeight: '300' as const,
  },
  section: {
    marginBottom: 12,
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    marginLeft: 10,
  },
  settingItem: {
    paddingVertical: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 20,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '300' as const,
  },
  toggle: {
    width: 52,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSlider: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleEmoji: {
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
    fontWeight: '300' as const,
  },
  actionButton: {
    marginTop: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  dangerItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#ff4444',
    paddingLeft: 15,
  },
  dangerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devFooterText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '400' as const,
    opacity: 0.6,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});