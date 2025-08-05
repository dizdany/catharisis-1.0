import { Verse } from '@/constants/verses';

// This utility is now deprecated as verses are fetched from the Bible API
// Keeping for backward compatibility

export const getAdjacentVerses = (verseId: string): { 
  previous: Verse | null; 
  current: Verse; 
  next: Verse | null 
} => {
  // This function is no longer used with the new Bible API system
  // Navigation is now handled within the verse screen component
  throw new Error('getAdjacentVerses is deprecated. Use the new Bible API system.');
};