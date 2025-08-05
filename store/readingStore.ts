import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAchievementStore } from './achievementStore';
import { useVerseStore } from './verseStore';
import { BibleBook } from '@/constants/bibleBooks';

interface ReadingSession {
  timestamp: number;
  chapterId: string;
  duration: number; // in minutes
  timeOfDay: number; // hour of day (0-23)
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
}

interface ReadingState {
  readVerses: string[];
  readChapters: string[]; // Format: "bookId:chapterNumber"
  readingSessions: ReadingSession[];
  currentSessionStart: number | null;
  lastReadBook: string | null;
  lastReadChapter: number | null;
  
  // Existing methods
  markVerseAsRead: (verseId: string) => void;
  isVerseRead: (verseId: string) => boolean;
  markChapterAsRead: (bookId: string, chapterNumber: number) => void;
  isChapterRead: (bookId: string, chapterNumber: number) => boolean;
  getBookProgress: (bookId: string, totalChapters: number) => number;
  getTotalProgress: (totalChapters: number) => number;
  getReadChaptersCount: () => number;
  
  // New time-based methods
  startReadingSession: () => void;
  endReadingSession: (bookId: string, chapterNumber: number) => void;
  getTimeBasedStats: () => {
    nightReadingSessions: number;
    earlyMorningReadingSessions: number;
    weekendReadingSessions: number;
    totalReadingTime: number;
    midnightSessions: number;
    dailyChapterCounts: number[];
  };
  
  // Last read tracking
  setLastRead: (bookId: string, chapterNumber: number) => void;
  hasReadingHistory: () => boolean;
}

export const useReadingStore = create<ReadingState>()(
  persist(
    (set, get) => ({
      readVerses: [],
      readChapters: [],
      readingSessions: [],
      currentSessionStart: null,
      lastReadBook: null,
      lastReadChapter: null,
      
      markVerseAsRead: (verseId) => {
        set((state) => {
          if (state.readVerses.includes(verseId)) {
            return state;
          }
          return { readVerses: [...state.readVerses, verseId] };
        });
      },
      
      isVerseRead: (verseId) => {
        return get().readVerses.includes(verseId);
      },
      
      markChapterAsRead: (bookId, chapterNumber) => {
        const chapterId = `${bookId}:${chapterNumber}`;
        set((state) => {
          if (state.readChapters.includes(chapterId)) {
            return state;
          }
          const newReadChapters = [...state.readChapters, chapterId];
          
          // Update last read
          const newState = {
            readChapters: newReadChapters,
            lastReadBook: bookId,
            lastReadChapter: chapterNumber,
          };
          
          // Trigger achievement check after state update
          setTimeout(() => {
            const readChaptersCount = newReadChapters.length;
            const favoriteVersesCount = useVerseStore.getState().favoriteVerses.length;
            const timeBasedStats = get().getTimeBasedStats();
            
            // Calculate books started and completed
            // Note: This will be updated when books are loaded from API
            const bookStats = { booksStarted: 0, booksCompleted: 0 };
            /*
            const bookStats = bibleBooks.reduce((acc: { booksStarted: number; booksCompleted: number }, book: BibleBook) => {
              const bookChapters = newReadChapters.filter(chapter => 
                chapter.startsWith(`${book.id}:`)
              ).length;
              
              if (bookChapters > 0) {
                acc.booksStarted++;
              }
              if (bookChapters >= book.chapters) {
                acc.booksCompleted++;
              }
              
              return acc;
            }, { booksStarted: 0, booksCompleted: 0 });
            */
            
            useAchievementStore.getState().checkAchievements({
              readChapters: readChaptersCount,
              booksStarted: bookStats.booksStarted,
              booksCompleted: bookStats.booksCompleted,
              favoriteVersesCount,
            });
          }, 100);
          
          return newState;
        });
      },
      
      isChapterRead: (bookId, chapterNumber) => {
        const chapterId = `${bookId}:${chapterNumber}`;
        return get().readChapters.includes(chapterId);
      },
      
      getBookProgress: (bookId, totalChapters) => {
        const readChapters = get().readChapters.filter(chapter => 
          chapter.startsWith(`${bookId}:`)
        ).length;
        return totalChapters > 0 ? Math.round((readChapters / totalChapters) * 100) : 0;
      },
      
      getTotalProgress: (totalChapters) => {
        const readChaptersCount = get().readChapters.length;
        return totalChapters > 0 ? Math.round((readChaptersCount / totalChapters) * 100) : 0;
      },
      
      getReadChaptersCount: () => {
        return get().readChapters.length;
      },
      
      startReadingSession: () => {
        set({ currentSessionStart: Date.now() });
      },
      
      endReadingSession: (bookId, chapterNumber) => {
        const { currentSessionStart, readingSessions } = get();
        if (!currentSessionStart) return;
        
        const now = new Date();
        const duration = Math.round((Date.now() - currentSessionStart) / (1000 * 60)); // minutes
        const chapterId = `${bookId}:${chapterNumber}`;
        
        const session: ReadingSession = {
          timestamp: Date.now(),
          chapterId,
          duration: Math.max(1, duration), // minimum 1 minute
          timeOfDay: now.getHours(),
          dayOfWeek: now.getDay(),
        };
        
        console.log('📖 Reading session ended:', {
          chapterId,
          duration: session.duration,
          timeOfDay: session.timeOfDay,
          dayOfWeek: session.dayOfWeek,
          timestamp: new Date(session.timestamp).toLocaleString()
        });
        
        const newReadingSessions = [...readingSessions, session];
        
        set({
          readingSessions: newReadingSessions,
          currentSessionStart: null,
        });
        
        // Trigger achievement check for time-based achievements
        setTimeout(() => {
          const favoriteVersesCount = useVerseStore.getState().favoriteVerses.length;
          const readChaptersCount = get().readChapters.length;
          const timeBasedStats = get().getTimeBasedStats();
          
          useAchievementStore.getState().checkAchievements({
            readChapters: readChaptersCount,
            booksStarted: 0, // Will be calculated properly when needed
            booksCompleted: 0, // Will be calculated properly when needed
            favoriteVersesCount,
          });
        }, 100);
      },
      
      getTimeBasedStats: () => {
        const { readingSessions } = get();
        
        // Night Owl: sessions after 10 PM (22:00)
        const nightReadingSessions = readingSessions.filter(
          session => session.timeOfDay >= 22 || session.timeOfDay < 2 // Include late night/early morning
        ).length;
        
        // Early Bird: sessions between 5-7 AM
        const earlyMorningReadingSessions = readingSessions.filter(
          session => session.timeOfDay >= 5 && session.timeOfDay < 7
        ).length;
        
        // Weekend Warrior: sessions on Saturday (6) or Sunday (0)
        const weekendReadingSessions = readingSessions.filter(
          session => session.dayOfWeek === 0 || session.dayOfWeek === 6
        ).length;
        
        // Total reading time in minutes
        const totalReadingTime = readingSessions.reduce(
          (total, session) => total + session.duration,
          0
        );
        
        // Midnight sessions (exactly at 00:00)
        const midnightSessions = readingSessions.filter(
          session => session.timeOfDay === 0
        ).length;
        
        // Calculate daily chapter counts for speed reader achievement
        const dailyChapterCounts: number[] = [];
        const dailyChapters = new Map<string, number>();
        
        readingSessions.forEach(session => {
          const date = new Date(session.timestamp).toDateString();
          dailyChapters.set(date, (dailyChapters.get(date) || 0) + 1);
        });
        
        dailyChapters.forEach(count => dailyChapterCounts.push(count));
        
        console.log('📊 Time-based stats:', {
          nightReadingSessions,
          earlyMorningReadingSessions,
          weekendReadingSessions,
          totalReadingTime,
          midnightSessions,
          maxDailyChapters: Math.max(...dailyChapterCounts, 0),
          totalSessions: readingSessions.length
        });
        
        return {
          nightReadingSessions,
          earlyMorningReadingSessions,
          weekendReadingSessions,
          totalReadingTime,
          midnightSessions,
          dailyChapterCounts,
        };
      },
      
      setLastRead: (bookId, chapterNumber) => {
        set({ lastReadBook: bookId, lastReadChapter: chapterNumber });
        get().markChapterAsRead(bookId, chapterNumber);
      },
      
      hasReadingHistory: () => {
        const { lastReadBook, lastReadChapter } = get();
        return lastReadBook !== null && lastReadChapter !== null;
      },
    }),
    {
      name: 'reading-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);