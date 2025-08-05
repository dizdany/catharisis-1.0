export interface Verse {
  id: string;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  mood?: 'lost' | 'distressed' | 'unsure' | 'good' | 'amazing';
}

export interface BibleVerse {
  id: string;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
}

export interface VerseRange {
  id: string;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  verses: { verse: number; text: string }[];
}

export type MoodType = 'lost' | 'distressed' | 'unsure' | 'good' | 'amazing' | 'wonderful';

export const moodLabels: Record<MoodType, string> = {
  lost: 'Lost',
  distressed: 'Distressed',
  unsure: 'Unsure',
  good: 'Good',
  amazing: 'Amazing',
  wonderful: 'Wonderful'
};

// Helper function to generate consistent verse IDs for Bible verses (without mood)
export const generateVerseId = (book: string, chapter: number, verse: number): string => {
  return `${book.toLowerCase().replace(/\s+/g, '').replace(/[0-9]/g, '')}-${chapter}-${verse}`;
};

// Helper function to generate unique IDs for mood verses (with mood)
export const generateMoodVerseId = (book: string, chapter: number, verse: number, mood: MoodType): string => {
  return `${book.toLowerCase().replace(/\s+/g, '').replace(/[0-9]/g, '')}-${chapter}-${verse}-${mood}`;
};

export const getVerseById = (id: string): Verse | undefined => {
  // This function is now deprecated as verses are fetched from the Bible API
  // Keeping for backward compatibility
  return undefined;
};