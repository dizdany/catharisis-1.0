import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BibleState {
  lastReadBook: string | null;
  lastReadChapter: number | null;
  readingProgress: Record<string, number[]>; // bookId -> array of read chapters
  setLastRead: (bookId: string, chapter: number) => void;
  markChapterAsRead: (bookId: string, chapter: number) => void;
  isChapterRead: (bookId: string, chapter: number) => boolean;
  getBookProgress: (bookId: string) => number; // percentage
  hasReadingHistory: () => boolean;
}

export const useBibleStore = create<BibleState>()(
  persist(
    (set, get) => ({
      lastReadBook: null,
      lastReadChapter: null,
      readingProgress: {},
      
      setLastRead: (bookId, chapter) => {
        set({ lastReadBook: bookId, lastReadChapter: chapter });
        get().markChapterAsRead(bookId, chapter);
      },
      
      markChapterAsRead: (bookId, chapter) => {
        set((state) => {
          const currentProgress = state.readingProgress[bookId] || [];
          if (!currentProgress.includes(chapter)) {
            return {
              readingProgress: {
                ...state.readingProgress,
                [bookId]: [...currentProgress, chapter].sort((a, b) => a - b)
              }
            };
          }
          return state;
        });
      },
      
      isChapterRead: (bookId, chapter) => {
        const progress = get().readingProgress[bookId] || [];
        return progress.includes(chapter);
      },
      
      getBookProgress: (bookId) => {
        const { readingProgress } = get();
        const progress = readingProgress[bookId] || [];
        // This would need the total chapters for the book to calculate percentage
        // For now, just return the number of chapters read
        return progress.length;
      },
      
      hasReadingHistory: () => {
        const { lastReadBook, lastReadChapter } = get();
        return lastReadBook !== null && lastReadChapter !== null;
      },
    }),
    {
      name: 'bible-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);