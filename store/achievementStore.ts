import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TranslationKey } from '@/constants/translations';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirement: number;
  type: 'chapters' | 'books_started' | 'books_completed' | 'favorites';
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

interface AchievementNotification {
  achievement: Achievement;
  timestamp: number;
}

interface AchievementState {
  unlockedAchievements: string[];
  pendingNotifications: AchievementNotification[];
  currentNotification: Achievement | null;
  showNotification: boolean;
  
  // Actions
  unlockAchievement: (achievement: Achievement) => void;
  showNextNotification: () => void;
  hideCurrentNotification: () => void;
  checkAchievements: (stats: {
    readChapters: number;
    booksStarted: number;
    booksCompleted: number;
    favoriteVersesCount: number;
  }) => void;
}

// Achievement definitions
const ACHIEVEMENTS: Achievement[] = [
  // Chapter Reading Achievements
  {
    id: 'first_chapter',
    title: 'First Chapter',
    description: 'Read your first chapter',
    titleKey: 'firstChapter',
    descriptionKey: 'firstChapterDesc',
    icon: '📖',
    color: '#4ECDC4',
    requirement: 1,
    type: 'chapters',
  },
  {
    id: 'chapter_explorer',
    title: 'Chapter Explorer',
    description: 'Read 10 chapters',
    titleKey: 'chapterExplorer',
    descriptionKey: 'chapterExplorerDesc',
    icon: '🗺️',
    color: '#45B7D1',
    requirement: 10,
    type: 'chapters',
  },
  {
    id: 'devoted_reader',
    title: 'Devoted Reader',
    description: 'Read 50 chapters',
    titleKey: 'devotedReader',
    descriptionKey: 'devotedReaderDesc',
    icon: '📚',
    color: '#96CEB4',
    requirement: 50,
    type: 'chapters',
  },
  {
    id: 'scripture_scholar',
    title: 'Scripture Scholar',
    description: 'Read 100 chapters',
    titleKey: 'scriptureScholar',
    descriptionKey: 'scriptureScholarDesc',
    icon: '🎓',
    color: '#FECA57',
    requirement: 100,
    type: 'chapters',
  },
  {
    id: 'bible_master',
    title: 'Bible Master',
    description: 'Read 200 chapters',
    titleKey: 'bibleMaster',
    descriptionKey: 'bibleMasterDesc',
    icon: '👑',
    color: '#FF6B6B',
    requirement: 200,
    type: 'chapters',
  },

  // Book Completion Achievements
  {
    id: 'first_book',
    title: 'First Book',
    description: 'Complete your first book',
    titleKey: 'firstBook',
    descriptionKey: 'firstBookDesc',
    icon: '🥉',
    color: '#CD7F32',
    requirement: 1,
    type: 'books_completed',
  },
  {
    id: 'book_collector',
    title: 'Book Collector',
    description: 'Complete 5 books',
    titleKey: 'bookCollector',
    descriptionKey: 'bookCollectorDesc',
    icon: '🥈',
    color: '#C0C0C0',
    requirement: 5,
    type: 'books_completed',
  },
  {
    id: 'testament_reader',
    title: 'Testament Reader',
    description: 'Complete 10 books',
    titleKey: 'testamentReader',
    descriptionKey: 'testamentReaderDesc',
    icon: '🥇',
    color: '#FFD700',
    requirement: 10,
    type: 'books_completed',
  },
  {
    id: 'bible_completionist',
    title: 'Bible Completionist',
    description: 'Complete all 66 books',
    titleKey: 'bibleCompletionist',
    descriptionKey: 'bibleCompletionistDesc',
    icon: '🏆',
    color: '#FF6B6B',
    requirement: 66,
    type: 'books_completed',
  },

  // Book Starting Achievements
  {
    id: 'curious_explorer',
    title: 'Curious Explorer',
    description: 'Start reading 5 books',
    titleKey: 'curiousExplorer',
    descriptionKey: 'curiousExplorerDesc',
    icon: '🧭',
    color: '#A8E6CF',
    requirement: 5,
    type: 'books_started',
  },
  {
    id: 'wide_reader',
    title: 'Wide Reader',
    description: 'Start reading 15 books',
    titleKey: 'wideReader',
    descriptionKey: 'wideReaderDesc',
    icon: '🌍',
    color: '#88D8C0',
    requirement: 15,
    type: 'books_started',
  },

  // Favorites Achievements
  {
    id: 'verse_lover',
    title: 'Verse Lover',
    description: 'Favorite 5 verses',
    titleKey: 'verseLover',
    descriptionKey: 'verseLoverDesc',
    icon: '💝',
    color: '#FF8A80',
    requirement: 5,
    type: 'favorites',
  },
  {
    id: 'scripture_collector',
    title: 'Scripture Collector',
    description: 'Favorite 20 verses',
    titleKey: 'scriptureCollector',
    descriptionKey: 'scriptureCollectorDesc',
    icon: '💎',
    color: '#B39DDB',
    requirement: 20,
    type: 'favorites',
  },
  {
    id: 'wisdom_keeper',
    title: 'Wisdom Keeper',
    description: 'Favorite 50 verses',
    titleKey: 'wisdomKeeper',
    descriptionKey: 'wisdomKeeperDesc',
    icon: '🔮',
    color: '#9C27B0',
    requirement: 50,
    type: 'favorites',
  },
];

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedAchievements: [],
      pendingNotifications: [],
      currentNotification: null,
      showNotification: false,

      unlockAchievement: (achievement) => {
        const { unlockedAchievements, pendingNotifications } = get();
        
        if (!unlockedAchievements.includes(achievement.id)) {
          console.log('🏆 Achievement unlocked:', achievement.title);
          
          set({
            unlockedAchievements: [...unlockedAchievements, achievement.id],
            pendingNotifications: [
              ...pendingNotifications,
              { achievement, timestamp: Date.now() }
            ],
          });

          // Show notification if none is currently showing
          if (!get().showNotification) {
            setTimeout(() => {
              get().showNextNotification();
            }, 500);
          }
        }
      },

      showNextNotification: () => {
        const { pendingNotifications } = get();
        
        if (pendingNotifications.length > 0) {
          const nextNotification = pendingNotifications[0];
          set({
            currentNotification: nextNotification.achievement,
            showNotification: true,
            pendingNotifications: pendingNotifications.slice(1),
          });
        }
      },

      hideCurrentNotification: () => {
        set({
          currentNotification: null,
          showNotification: false,
        });

        // Show next notification if any pending
        setTimeout(() => {
          const { pendingNotifications } = get();
          if (pendingNotifications.length > 0) {
            get().showNextNotification();
          }
        }, 1000);
      },

      checkAchievements: (stats) => {
        const { unlockedAchievements, unlockAchievement } = get();
        
        ACHIEVEMENTS.forEach((achievement) => {
          if (!unlockedAchievements.includes(achievement.id)) {
            let shouldUnlock = false;
            
            switch (achievement.type) {
              case 'chapters':
                shouldUnlock = stats.readChapters >= achievement.requirement;
                break;
              case 'books_started':
                shouldUnlock = stats.booksStarted >= achievement.requirement;
                break;
              case 'books_completed':
                shouldUnlock = stats.booksCompleted >= achievement.requirement;
                break;
              case 'favorites':
                shouldUnlock = stats.favoriteVersesCount >= achievement.requirement;
                break;
            }
            
            if (shouldUnlock) {
              unlockAchievement(achievement);
            }
          }
        });
      },
    }),
    {
      name: 'achievement-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper function to get translated achievement (to be used with translation function)
export const getTranslatedAchievement = (achievement: Achievement, t: (key: TranslationKey) => string): Achievement => {
  return {
    ...achievement,
    title: t(achievement.titleKey),
    description: t(achievement.descriptionKey),
  };
};

// Helper function to get all translated achievements (to be used with translation function)
export const getTranslatedAchievements = (t: (key: TranslationKey) => string): Achievement[] => {
  return ACHIEVEMENTS.map(achievement => getTranslatedAchievement(achievement, t));
};

export { ACHIEVEMENTS };
export type { Achievement, AchievementNotification };