import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Verse, BibleVerse } from '@/constants/verses';
import { useAchievementStore } from './achievementStore';
import { useReadingStore } from './readingStore';
import { BibleBook } from '@/constants/bibleBooks';

// Helper function to generate consistent verse IDs
const generateVerseId = (book: string, chapter: number, verse: number): string => {
  return `${book.toLowerCase().replace(/\s+/g, '').replace(/[0-9]/g, '')}-${chapter}-${verse}`;
};

// Helper function to generate verse range IDs
const generateVerseRangeId = (book: string, chapter: number, startVerse: number, endVerse: number): string => {
  return `${book.toLowerCase().replace(/\s+/g, '').replace(/[0-9]/g, '')}-${chapter}-${startVerse}-${endVerse}-range`;
};

interface BibleVerseWithMood {
  id: string;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  mood?: string;
}

interface VerseRange {
  id: string;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  verses: { verse: number; text: string }[];
}

interface VerseState {
  favoriteVerses: (Verse | BibleVerse | BibleVerseWithMood | VerseRange)[];
  selectedVerses: number[];
  selectionMode: boolean;
  addToFavorites: (verse: Verse | BibleVerseWithMood) => void;
  addBibleVerseToFavorites: (verseData: { text: string; reference: string; book: string; chapter: number; verse: number }) => void;
  addVerseRangeToFavorites: (rangeData: { verses: { verse: number; text: string }[]; book: string; chapter: number; bookDisplayName: string }) => void;
  removeFromFavorites: (id: string) => void;
  removeSelectedVersesFromFavorites: (book: string, chapter: number) => void;
  isFavorite: (id: string) => boolean;
  isVerseFavorited: (book: string, chapter: number, verse: number) => boolean;
  generateVerseId: (book: string, chapter: number, verse: number) => string;
  generateVerseRangeId: (book: string, chapter: number, startVerse: number, endVerse: number) => string;
  toggleVerseSelection: (verse: number) => void;
  clearSelection: () => void;
  setSelectionMode: (enabled: boolean) => void;
  isVerseSelected: (verse: number) => boolean;
}

export const useVerseStore = create<VerseState>()(
  persist(
    (set, get) => ({
      favoriteVerses: [],
      selectedVerses: [],
      selectionMode: false,
      generateVerseId,
      generateVerseRangeId,
      addToFavorites: (verse) => {
        const { favoriteVerses } = get();
        if (!favoriteVerses.some(v => v.id === verse.id)) {
          const newFavoriteVerses = [...favoriteVerses, verse];
          set({ favoriteVerses: newFavoriteVerses });
          
          // Trigger achievement check after state update
          setTimeout(() => {
            const readChapters = useReadingStore.getState().readChapters;
            const readChaptersCount = readChapters.length;
            
            // Calculate books started and completed
            // Note: This will be updated when books are loaded from API
            const bookStats = { booksStarted: 0, booksCompleted: 0 };
            /*
            const bookStats = bibleBooks.reduce((acc: { booksStarted: number; booksCompleted: number }, book: BibleBook) => {
              const bookChapters = readChapters.filter(chapter => 
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
              favoriteVersesCount: newFavoriteVerses.length,
            });
          }, 100);
        }
      },
      addBibleVerseToFavorites: (verseData) => {
        const { favoriteVerses } = get();
        const verseId = generateVerseId(verseData.book, verseData.chapter, verseData.verse);
        
        if (!favoriteVerses.some(v => v.id === verseId)) {
          const bibleVerse: BibleVerse = {
            id: verseId,
            text: verseData.text,
            reference: verseData.reference,
            book: verseData.book,
            chapter: verseData.chapter,
            verse: verseData.verse
          };
          const newFavoriteVerses = [...favoriteVerses, bibleVerse];
          set({ favoriteVerses: newFavoriteVerses });
          
          // Trigger achievement check after state update
          setTimeout(() => {
            const readChapters = useReadingStore.getState().readChapters;
            const readChaptersCount = readChapters.length;
            
            // Calculate books started and completed
            // Note: This will be updated when books are loaded from API
            const bookStats = { booksStarted: 0, booksCompleted: 0 };
            /*
            const bookStats = bibleBooks.reduce((acc: { booksStarted: number; booksCompleted: number }, book: BibleBook) => {
              const bookChapters = readChapters.filter(chapter => 
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
              favoriteVersesCount: newFavoriteVerses.length,
            });
          }, 100);
        }
      },
      removeFromFavorites: (id) => {
        const { favoriteVerses } = get();
        set({ favoriteVerses: favoriteVerses.filter(verse => verse.id !== id) });
      },
      isFavorite: (id) => {
        const { favoriteVerses } = get();
        return favoriteVerses.some(verse => verse.id === id);
      },
      // New method to check if a verse is favorited by book/chapter/verse
      isVerseFavorited: (book: string, chapter: number, verse: number) => {
        const { favoriteVerses } = get();
        const bibleId = generateVerseId(book, chapter, verse);
        return favoriteVerses.some(v => v.id === bibleId);
      },
      addVerseRangeToFavorites: (rangeData) => {
        const { favoriteVerses } = get();
        const { verses, book, chapter, bookDisplayName } = rangeData;
        
        if (verses.length === 0) return;
        
        const startVerse = Math.min(...verses.map(v => v.verse));
        const endVerse = Math.max(...verses.map(v => v.verse));
        const rangeId = generateVerseRangeId(book, chapter, startVerse, endVerse);
        
        // Check if this range already exists
        if (favoriteVerses.some(v => v.id === rangeId)) return;
        
        const combinedText = verses.map(v => v.text).join(' ');
        const reference = startVerse === endVerse 
          ? `${bookDisplayName} ${chapter}:${startVerse}`
          : `${bookDisplayName} ${chapter}:${startVerse}-${endVerse}`;
        
        const verseRange: VerseRange = {
          id: rangeId,
          text: combinedText,
          reference: reference,
          book: book,
          chapter: chapter,
          startVerse: startVerse,
          endVerse: endVerse,
          verses: verses
        };
        
        const newFavoriteVerses = [...favoriteVerses, verseRange];
        set({ favoriteVerses: newFavoriteVerses });
        
        // Trigger achievement check after state update
        setTimeout(() => {
          const readChapters = useReadingStore.getState().readChapters;
          const readChaptersCount = readChapters.length;
          const bookStats = { booksStarted: 0, booksCompleted: 0 };
          
          useAchievementStore.getState().checkAchievements({
            readChapters: readChaptersCount,
            booksStarted: bookStats.booksStarted,
            booksCompleted: bookStats.booksCompleted,
            favoriteVersesCount: newFavoriteVerses.length,
          });
        }, 100);
      },
      toggleVerseSelection: (verse: number) => {
        const { selectedVerses } = get();
        const isSelected = selectedVerses.includes(verse);
        
        if (isSelected) {
          set({ selectedVerses: selectedVerses.filter(v => v !== verse) });
        } else {
          set({ selectedVerses: [...selectedVerses, verse].sort((a, b) => a - b) });
        }
      },
      clearSelection: () => {
        set({ selectedVerses: [], selectionMode: false });
      },
      setSelectionMode: (enabled: boolean) => {
        set({ selectionMode: enabled });
        if (!enabled) {
          set({ selectedVerses: [] });
        }
      },
      isVerseSelected: (verse: number) => {
        const { selectedVerses } = get();
        return selectedVerses.includes(verse);
      },
      removeSelectedVersesFromFavorites: (book: string, chapter: number) => {
        const { favoriteVerses, selectedVerses } = get();
        
        if (selectedVerses.length === 0) return;
        
        // Remove individual verses
        const individualVerseIds = selectedVerses.map(verse => 
          generateVerseId(book, chapter, verse)
        );
        
        // Remove verse ranges that match the selected verses
        const startVerse = Math.min(...selectedVerses);
        const endVerse = Math.max(...selectedVerses);
        const rangeId = generateVerseRangeId(book, chapter, startVerse, endVerse);
        
        // Also check for any ranges that contain the selected verses
        const rangesToRemove: string[] = [];
        favoriteVerses.forEach(fav => {
          if ('startVerse' in fav && 'endVerse' in fav) {
            // Check if this range overlaps with selected verses
            const rangeVerses: number[] = [];
            for (let v = fav.startVerse; v <= fav.endVerse; v++) {
              rangeVerses.push(v);
            }
            
            // If all selected verses are within this range, remove the range
            const allSelectedInRange = selectedVerses.every(v => rangeVerses.includes(v));
            if (allSelectedInRange && fav.book === book && fav.chapter === chapter) {
              rangesToRemove.push(fav.id);
            }
          }
        });
        
        const idsToRemove = [...individualVerseIds, rangeId, ...rangesToRemove];
        
        const updatedFavorites = favoriteVerses.filter(verse => 
          !idsToRemove.includes(verse.id)
        );
        
        set({ favoriteVerses: updatedFavorites });
      }
    }),
    {
      name: 'verse-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteVerses: state.favoriteVerses,
        // Don't persist selection state
      }),
    }
  )
);