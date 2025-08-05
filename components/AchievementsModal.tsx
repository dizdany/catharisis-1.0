import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { X, Award, Trophy, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedCard from '@/components/AnimatedCard';
import { useAchievementStore, getTranslatedAchievements } from '@/store/achievementStore';



interface AchievementWithProgress {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirement: number;
  type: 'chapters' | 'books_started' | 'books_completed' | 'favorites';
  isUnlocked: boolean;
  progress: number;
}

interface AchievementsModalProps {
  visible: boolean;
  onClose: () => void;
  stats: {
    readChapters: number;
    booksStarted: number;
    booksCompleted: number;
    favoriteVersesCount: number;
  };
}

export default function AchievementsModal({ visible, onClose, stats }: AchievementsModalProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { unlockedAchievements } = useAchievementStore();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const getProgress = (achievement: any, stats: any) => {
    switch (achievement.type) {
      case 'chapters':
        return Math.min(stats.readChapters / achievement.requirement, 1);
      case 'books_started':
        return Math.min(stats.booksStarted / achievement.requirement, 1);
      case 'books_completed':
        return Math.min(stats.booksCompleted / achievement.requirement, 1);
      case 'favorites':
        return Math.min(stats.favoriteVersesCount / achievement.requirement, 1);
      default:
        return 0;
    }
  };

  const getProgressText = (achievement: any, stats: any) => {
    const isUnlocked = unlockedAchievements.includes(achievement.id);
    
    if (isUnlocked) {
      // For unlocked achievements, show requirement/requirement
      return `${achievement.requirement}/${achievement.requirement}`;
    }
    
    // For locked achievements, show current progress
    switch (achievement.type) {
      case 'chapters':
        return `${Math.min(stats.readChapters, achievement.requirement)}/${achievement.requirement}`;
      case 'books_started':
        return `${Math.min(stats.booksStarted, achievement.requirement)}/${achievement.requirement}`;
      case 'books_completed':
        return `${Math.min(stats.booksCompleted, achievement.requirement)}/${achievement.requirement}`;
      case 'favorites':
        return `${Math.min(stats.favoriteVersesCount, achievement.requirement)}/${achievement.requirement}`;
      default:
        return '0/0';
    }
  };

  const achievements: AchievementWithProgress[] = getTranslatedAchievements(t).map(achievement => ({
    ...achievement,
    isUnlocked: unlockedAchievements.includes(achievement.id),
    progress: getProgress(achievement, stats),
  }));

  // Group achievements by category
  const achievementCategories = {
    chapters: {
      title: '📖 Reading Progress',
      achievements: achievements.filter(a => a.type === 'chapters'),
      icon: '📖'
    },
    books_completed: {
      title: '🏆 Book Completion',
      achievements: achievements.filter(a => a.type === 'books_completed'),
      icon: '🏆'
    },
    books_started: {
      title: '🚀 Book Explorer',
      achievements: achievements.filter(a => a.type === 'books_started'),
      icon: '🚀'
    },
    favorites: {
      title: '💝 Verse Collection',
      achievements: achievements.filter(a => a.type === 'favorites'),
      icon: '💝'
    }
  };

  const totalUnlocked = achievements.filter(a => a.isUnlocked).length;

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const renderAchievement = (achievement: AchievementWithProgress) => (
    <AnimatedCard
      key={achievement.id}
      style={[
        styles.achievementCard,
        {
          backgroundColor: achievement.isUnlocked
            ? colors.cardBackground
            : colors.cardBackground + '60',
          borderWidth: achievement.isUnlocked ? 2 : 1,
          borderColor: achievement.isUnlocked
            ? achievement.color + '40'
            : colors.divider,
        },
      ]}
    >
      <View style={styles.achievementHeader}>
        <View
          style={[
            styles.achievementIconContainer,
            {
              backgroundColor: achievement.isUnlocked
                ? achievement.color + '20'
                : colors.divider + '40',
            },
          ]}
        >
          <Text
            style={[
              styles.achievementIcon,
              { opacity: achievement.isUnlocked ? 1 : 0.5 },
            ]}
          >
            {achievement.icon}
          </Text>
        </View>
        <View style={styles.achievementInfo}>
          <Text
            style={[
              styles.achievementTitle,
              {
                color: achievement.isUnlocked
                  ? colors.primaryText
                  : colors.secondaryText,
              },
            ]}
          >
            {achievement.title}
          </Text>
          <Text
            style={[
              styles.achievementDescription,
              {
                color: achievement.isUnlocked
                  ? colors.secondaryText
                  : colors.secondaryText + '80',
              },
            ]}
          >
            {achievement.description}
          </Text>
        </View>
        {achievement.isUnlocked && (
          <View style={styles.unlockedBadge}>
            <Trophy size={16} color={achievement.color} />
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.divider }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: achievement.color,
                width: `${achievement.progress * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.secondaryText }]}>
          {getProgressText(achievement, stats)}
        </Text>
      </View>
    </AnimatedCard>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
          <View style={styles.headerLeft}>
            <Award size={24} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.primaryText }]}>
              {t('achievements')}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.divider + '40' }]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={20} color={colors.primaryText} />
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={[styles.statsContainer, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {totalUnlocked}
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              {t('unlocked')}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.secondaryText }]}>
              {achievements.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              {t('total')}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>
              {Math.round((totalUnlocked / achievements.length) * 100)}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              Complete
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Achievement Categories */}
          {Object.entries(achievementCategories).map(([categoryKey, category]) => {
            if (category.achievements.length === 0) return null;
            
            const categoryUnlocked = category.achievements.filter(a => a.isUnlocked).length;
            const categoryTotal = category.achievements.length;
            const isExpanded = expandedCategories[categoryKey] ?? true; // Default to expanded
            
            return (
              <View key={categoryKey} style={styles.section}>
                <TouchableOpacity 
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(categoryKey)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryTitleContainer}>
                    {isExpanded ? (
                      <ChevronDown size={20} color={colors.secondaryText} />
                    ) : (
                      <ChevronRight size={20} color={colors.secondaryText} />
                    )}
                    <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
                      {category.title}
                    </Text>
                  </View>
                  <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
                      {categoryUnlocked}/{categoryTotal}
                    </Text>
                  </View>
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.categoryContent}>
                    {category.achievements
                      .sort((a, b) => {
                        // Sort by unlocked first, then by requirement
                        if (a.isUnlocked && !b.isUnlocked) return -1;
                        if (!a.isUnlocked && b.isUnlocked) return 1;
                        return a.requirement - b.requirement;
                      })
                      .map(renderAchievement)
                    }
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginLeft: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  categoryContent: {
    marginTop: -8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  unlockedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500' as const,
    minWidth: 50,
    textAlign: 'right',
  },
});