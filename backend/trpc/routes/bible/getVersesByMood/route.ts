import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { moodVerses, getVersesByMood, getRandomVerseByMood } from "@/constants/moodVerses";

export const getVersesByMoodProcedure = publicProcedure
  .input(z.object({ 
    mood: z.enum(['lost', 'distressed', 'unsure', 'good', 'amazing', 'wonderful']),
    random: z.boolean().optional().default(false)
  }))
  .query(async ({ input }) => {
    const { mood, random } = input;
    
    try {
      if (random) {
        // Return a single random verse
        const randomVerse = getRandomVerseByMood(mood);
        if (!randomVerse) {
          throw new Error(`No verses found for mood: ${mood}`);
        }
        return randomVerse;
      } else {
        // Return all verses for the mood
        const verses = getVersesByMood(mood);
        if (verses.length === 0) {
          throw new Error(`No verses found for mood: ${mood}`);
        }
        return verses;
      }
    } catch (error) {
      console.error('Error getting verses by mood:', error);
      throw new Error('Failed to load verses.');
    }
  });