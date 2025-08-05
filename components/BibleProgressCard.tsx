import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BookOpen, TrendingUp, Target, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useReadingStore } from '@/store/readingStore';

import { trpc } from '@/lib/trpc';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedCard from '@/components/AnimatedCard';

interface BibleProgressCardProps {
  style?: any;
}

export default function BibleProgressCard({ style }: BibleProgressCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { getReadChaptersCount, getTotalProgress } = useReadingStore();

  const booksQuery = trpc.bible.getBibleBooks.useQuery({});
  const books = booksQuery.data || [];

  const progressData = useMemo(() => {
    const totalChapters = books.reduce((sum: number, book: any) => sum + book.chapters, 0);
    const readChapters = getReadChaptersCount();
    const progressPercentage = getTotalProgress(totalChapters);
    
    return {
      totalChapters,
      readChapters,
      progressPercentage,
      remainingChapters: totalChapters - readChapters
    };
  }, [books, getReadChaptersCount, getTotalProgress]);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return '#4CAF50'; // Green
    if (percentage >= 50) return '#FF9800'; // Orange
    if (percentage >= 25) return '#2196F3'; // Blue
    return colors.primary; // Default
  };

  const getProgressIcon = (percentage: number) => {
    if (percentage >= 75) return <Award size={20} color={getProgressColor(percentage)} />;
    if (percentage >= 50) return <Target size={20} color={getProgressColor(percentage)} />;
    if (percentage >= 25) return <TrendingUp size={20} color={getProgressColor(percentage)} />;
    return <BookOpen size={20} color={getProgressColor(percentage)} />;
  };

  const handlePress = () => {
    router.push('/bible');
  };

  return (
    <AnimatedCard style={[styles.container, { backgroundColor: colors.cardBackground }, style]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {getProgressIcon(progressData.progressPercentage)}
            <Text style={[styles.title, { color: colors.primaryText }]}>
              {t('bibleProgress') || 'Progres Biblie'}
            </Text>
          </View>
          <Text style={[styles.percentage, { color: getProgressColor(progressData.progressPercentage) }]}>
            {progressData.progressPercentage}%
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.accent + '20' }]}>
            <View 
              style={[
                styles.progressFill,
                { 
                  backgroundColor: getProgressColor(progressData.progressPercentage),
                  width: `${progressData.progressPercentage}%`
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primaryText }]}>
              {progressData.readChapters}
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              {t('chaptersRead') || 'Capitole citite'}
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primaryText }]}>
              {progressData.remainingChapters}
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              {t('remaining') || 'Rămase'}
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primaryText }]}>
              {progressData.totalChapters}
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              {t('total') || 'Total'}
            </Text>
          </View>
        </View>

        {progressData.progressPercentage > 0 && (
          <View style={styles.motivationContainer}>
            <Text style={[styles.motivationText, { color: colors.secondaryText }]}>
              {progressData.progressPercentage >= 75 
                ? (t('almostDone') || 'Aproape gata! Continuă să citești!')
                : progressData.progressPercentage >= 50
                ? (t('halfwayThere') || 'La jumătatea drumului! Excelent progres!')
                : progressData.progressPercentage >= 25
                ? (t('goodProgress') || 'Progres bun! Continuă să citești!')
                : (t('greatStart') || 'Început excelent! Continuă să citești!')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginLeft: 10,
  },
  percentage: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400' as const,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
    opacity: 0.3,
  },
  motivationContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderTopOpacity: 0.2,
  },
  motivationText: {
    fontSize: 14,
    fontWeight: '400' as const,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});