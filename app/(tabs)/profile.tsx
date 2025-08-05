import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User, 
  Edit3, 
  BookOpen, 
  Heart, 
  Globe, 
  Settings,
  Award,
  Target,
  Clock,
  BarChart3,
  Sun,
  Moon,
  Type,
  Shuffle
} from 'lucide-react-native';


import { useSettingsStore } from '@/store/settingsStore';
import { useVerseStore } from '@/store/verseStore';
import { useLanguageStore } from '@/store/languageStore';
import { useReadingStore } from '@/store/readingStore';
import { useUserProfile } from '@/store/userProfileStore';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedCard from '@/components/AnimatedCard';
import AnimatedButton from '@/components/AnimatedButton';
import AchievementsModal from '@/components/AchievementsModal';


import { BibleBook } from '@/constants/bibleBooks';
import { trpc } from '@/lib/trpc';

const { width: screenWidth } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [achievementsModalVisible, setAchievementsModalVisible] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  
  const { profile } = useUserProfile();
  const { favoriteVerses } = useVerseStore();
  const { language } = useLanguageStore();
  const { readChapters, getReadChaptersCount } = useReadingStore();
  const { 
    moodDisplayMode, 
    randomReadingEnabled, 
    themeMode 
  } = useSettingsStore();

  // Fetch Bible books
  const bibleBooks = trpc.bible.getBibleBooks.useQuery({ language });
  
  // Calculate statistics
  const stats = useMemo(() => {
    const books = bibleBooks.data || [];
    const totalBibleChapters = books.reduce((sum: number, book: BibleBook) => sum + book.chapters, 0);
    const readChaptersCount = getReadChaptersCount();
    const readingProgress = totalBibleChapters > 0 ? Math.round((readChaptersCount / totalBibleChapters) * 100) : 0;
    
    // Calculate books started/completed
    const booksProgress = books.map((book: BibleBook) => {
      const bookReadChapters = readChapters.filter(chapter => 
        chapter.startsWith(`${book.id}:`)
      ).length;
      return {
        ...book,
        readChapters: bookReadChapters,
        progress: Math.round((bookReadChapters / book.chapters) * 100),
        isCompleted: bookReadChapters === book.chapters,
        isStarted: bookReadChapters > 0
      };
    });
    
    const booksStarted = booksProgress.filter((book: any) => book.isStarted).length;
    const booksCompleted = booksProgress.filter((book: any) => book.isCompleted).length;
    
    return {
      totalChapters: totalBibleChapters,
      readChapters: readChaptersCount,
      readingProgress,
      favoriteVersesCount: favoriteVerses.length,
      booksStarted,
      booksCompleted,
      totalBooks: books.length
    };
  }, [readChapters, favoriteVerses, getReadChaptersCount, bibleBooks.data]);

  const getLanguageDisplayName = (lang: string) => {
    switch (lang) {
      case 'en': return 'English';
      case 'ro': return 'Română';
      case 'es': return 'Español';
      default: return lang.toUpperCase();
    }
  };



  const getAchievementLevel = () => {
    if (stats.booksCompleted >= 10) return { 
      level: t('masterReader'), 
      description: t('masterReaderDesc'),
      icon: '🏆', 
      color: colors.primary 
    };
    if (stats.booksCompleted >= 5) return { 
      level: t('advancedReader'), 
      description: t('advancedReaderDesc'),
      icon: '🥇', 
      color: colors.accent 
    };
    if (stats.booksCompleted >= 1) return { 
      level: t('bookFinisher'), 
      description: t('bookFinisherDesc'),
      icon: '🥈', 
      color: '#CD7F32' 
    };
    if (stats.booksStarted >= 5) return { 
      level: t('explorer'), 
      description: t('explorerDesc'),
      icon: '🥉', 
      color: '#CD7F32' 
    };
    if (stats.readChapters >= 10) return { 
      level: t('beginner'), 
      description: t('beginnerDesc'),
      icon: '📖', 
      color: colors.secondaryText 
    };
    return { 
      level: t('newReader'), 
      description: t('newReaderDesc'),
      icon: '🌱', 
      color: colors.secondaryText 
    };
  };

  const achievement = getAchievementLevel();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Platform.OS === 'android' ? Math.max(insets.top + 10, 20) : 10,
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <AnimatedCard style={[styles.profileHeader, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.profileInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
              <User size={32} color={colors.primary} />
            </View>
            <View style={styles.profileDetails}>
              <Text style={[styles.profileName, { color: colors.primaryText }]}>
                {profile?.name || 'User'}
              </Text>
              <Text style={[styles.profileSubtitle, { color: colors.secondaryText }]}>
                {profile?.age ? `${profile.age} ${t('years')}` : t('unknownAge')} • {profile?.gender === 'male' ? t('male') : profile?.gender === 'female' ? t('female') : t('unknown')}
              </Text>
              <View style={styles.achievementBadge}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[styles.achievementText, { color: achievement.color }]}>
                  {achievement.level}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.primary + '20' }]}
              onPress={() => router.push('/onboarding')}
              activeOpacity={0.7}
            >
              <Edit3 size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        {/* Reading Statistics */}
        <AnimatedCard style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <BarChart3 size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              {t('readingStatistics')}
            </Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
                <BookOpen size={20} color={colors.primary} />
              </View>
              <Text style={[styles.statNumber, { color: colors.primaryText }]}>
                {stats.readChapters}
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                {t('chaptersRead')}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.accent + '20' }]}>
                <Target size={20} color={colors.accent} />
              </View>
              <Text style={[styles.statNumber, { color: colors.primaryText }]}>
                {stats.readingProgress}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                {t('totalProgress')}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FF6B6B20' }]}>
                <Heart size={20} color="#FF6B6B" />
              </View>
              <Text style={[styles.statNumber, { color: colors.primaryText }]}>
                {stats.favoriteVersesCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                {t('favoriteVerses')}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#4ECDC420' }]}>
                <Award size={20} color="#4ECDC4" />
              </View>
              <Text style={[styles.statNumber, { color: colors.primaryText }]}>
                {stats.booksCompleted}
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                {t('booksCompleted')}
              </Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressBarBg, { backgroundColor: colors.divider }]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${stats.readingProgress}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.secondaryText }]}>
              {stats.readChapters} {t('outOf')} {stats.totalChapters} {t('chapters').toLowerCase()}
            </Text>
          </View>
        </AnimatedCard>

        {/* Current Preferences */}
        <AnimatedCard style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              {t('yourPreferences')}
            </Text>
          </View>
          
          <View style={styles.preferencesList}>
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Globe size={18} color={colors.primary} />
                <Text style={[styles.preferenceLabel, { color: colors.primaryText }]}>
                  {t('appLanguage')}
                </Text>
              </View>
              <Text style={[styles.preferenceValue, { color: colors.secondaryText }]}>
                {getLanguageDisplayName(language)}
              </Text>
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                {themeMode === 'light' ? (
                  <Sun size={18} color={colors.primary} />
                ) : (
                  <Moon size={18} color={colors.primary} />
                )}
                <Text style={[styles.preferenceLabel, { color: colors.primaryText }]}>
                  {t('theme')}
                </Text>
              </View>
              <Text style={[styles.preferenceValue, { color: colors.secondaryText }]}>
                {themeMode === 'light' ? t('light') : t('dark')}
              </Text>
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                {moodDisplayMode === 'emoji' ? (
                  <Text style={styles.emojiIcon}>😊</Text>
                ) : (
                  <Type size={18} color={colors.primary} />
                )}
                <Text style={[styles.preferenceLabel, { color: colors.primaryText }]}>
                  {t('moodDisplay')}
                </Text>
              </View>
              <Text style={[styles.preferenceValue, { color: colors.secondaryText }]}>
                {moodDisplayMode === 'emoji' ? t('emoji') : t('text')}
              </Text>
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                {randomReadingEnabled ? (
                  <Shuffle size={18} color={colors.primary} />
                ) : (
                  <BookOpen size={18} color={colors.primary} />
                )}
                <Text style={[styles.preferenceLabel, { color: colors.primaryText }]}>
                  {t('randomReading')}
                </Text>
              </View>
              <Text style={[styles.preferenceValue, { color: colors.secondaryText }]}>
                {randomReadingEnabled ? t('enabled') : t('disabled')}
              </Text>
            </View>
          </View>
        </AnimatedCard>



        {/* Quick Actions */}
        <AnimatedCard style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              {t('quickActions')}
            </Text>
          </View>
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: colors.primary + '10' }]}
              onPress={() => router.push('/bible')}
              activeOpacity={0.7}
            >
              <BookOpen size={24} color={colors.primary} />
              <Text style={[styles.quickActionText, { color: colors.primary }]}>
                {t('readBible')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: '#FF6B6B10' }]}
              onPress={() => router.push('/favorites')}
              activeOpacity={0.7}
            >
              <Heart size={24} color="#FF6B6B" />
              <Text style={[styles.quickActionText, { color: '#FF6B6B' }]}>
                {t('favorites')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <AnimatedButton
            title={t('advancedSettings')}
            onPress={() => router.push('/settings')}
            icon={<Settings size={20} color={colors.primaryText} />}
            style={[styles.settingsButton, { 
              backgroundColor: 'transparent', 
              borderWidth: 1, 
              borderColor: colors.divider 
            }]}
            textStyle={[styles.settingsButtonText, { color: colors.primaryText }]}
          />
        </AnimatedCard>

        {/* Achievements Button */}
        <AnimatedCard style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              {t('achievements')}
            </Text>
          </View>
          
          <View style={styles.achievementPreview}>
            <View style={styles.achievementHeader}>
              <Text style={styles.achievementMainIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, { color: achievement.color }]}>
                  {achievement.level}
                </Text>
                <Text style={[styles.achievementDescription, { color: colors.secondaryText }]}>
                  {achievement.description}
                </Text>
              </View>
            </View>
          </View>
          
          <AnimatedButton
            title={t('viewAchievements')}
            onPress={() => setAchievementsModalVisible(true)}
            icon={<Award size={20} color={colors.primaryText} />}
            style={[styles.achievementsButton, { 
              backgroundColor: colors.primary + '20', 
              borderWidth: 1, 
              borderColor: colors.primary + '40' 
            }]}
            textStyle={[styles.achievementsButtonText, { color: colors.primary }]}
          />
        </AnimatedCard>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.secondaryText }]}>
            {t('profileFooter')}
          </Text>
        </View>
      </ScrollView>
      
      {/* Achievements Modal */}
      <AchievementsModal
        visible={achievementsModalVisible}
        onClose={() => setAchievementsModalVisible(false)}
        stats={{
          readChapters: stats.readChapters,
          booksStarted: stats.booksStarted,
          booksCompleted: stats.booksCompleted,
          favoriteVersesCount: stats.favoriteVersesCount,
        }}
      />
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
    paddingBottom: 20,
  },
  profileHeader: {
    marginBottom: 16,
    marginHorizontal: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '400' as const,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  achievementText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 16,
    marginHorizontal: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginLeft: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    width: (screenWidth - 72) / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400' as const,
  },
  progressBar: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400' as const,
  },
  preferencesList: {
    gap: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginLeft: 12,
  },
  preferenceValue: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  emojiIcon: {
    fontSize: 18,
  },

  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickAction: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  settingsButton: {
    marginTop: 8,
  },
  settingsButtonText: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  achievementPreview: {
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementMainIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  achievementsButton: {
    marginTop: 8,
  },
  achievementsButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
});