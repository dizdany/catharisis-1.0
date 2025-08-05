import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

interface BibleVerse {
  verse: number;
  text: string;
}

interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

const fetchBibleChapter = async (book: string, chapter: number): Promise<BibleChapter> => {
  try {
    // Format book name for bible-api.com
    // Convert book IDs to proper names for the API
    const bookNameMap: Record<string, string> = {
      'genesis': 'Genesis',
      'exodus': 'Exodus',
      'leviticus': 'Leviticus',
      'numbers': 'Numbers',
      'deuteronomy': 'Deuteronomy',
      'joshua': 'Joshua',
      'judges': 'Judges',
      'ruth': 'Ruth',
      '1samuel': '1 Samuel',
      '2samuel': '2 Samuel',
      '1kings': '1 Kings',
      '2kings': '2 Kings',
      '1chronicles': '1 Chronicles',
      '2chronicles': '2 Chronicles',
      'ezra': 'Ezra',
      'nehemiah': 'Nehemiah',
      'esther': 'Esther',
      'job': 'Job',
      'psalms': 'Psalms',
      'proverbs': 'Proverbs',
      'ecclesiastes': 'Ecclesiastes',
      'song': 'Song of Songs',
      'isaiah': 'Isaiah',
      'jeremiah': 'Jeremiah',
      'lamentations': 'Lamentations',
      'ezekiel': 'Ezekiel',
      'daniel': 'Daniel',
      'hosea': 'Hosea',
      'joel': 'Joel',
      'amos': 'Amos',
      'obadiah': 'Obadiah',
      'jonah': 'Jonah',
      'micah': 'Micah',
      'nahum': 'Nahum',
      'habakkuk': 'Habakkuk',
      'zephaniah': 'Zephaniah',
      'haggai': 'Haggai',
      'zechariah': 'Zechariah',
      'malachi': 'Malachi',
      'matthew': 'Matthew',
      'mark': 'Mark',
      'luke': 'Luke',
      'john': 'John',
      'acts': 'Acts',
      'romans': 'Romans',
      '1corinthians': '1 Corinthians',
      '2corinthians': '2 Corinthians',
      'galatians': 'Galatians',
      'ephesians': 'Ephesians',
      'philippians': 'Philippians',
      'colossians': 'Colossians',
      '1thessalonians': '1 Thessalonians',
      '2thessalonians': '2 Thessalonians',
      '1timothy': '1 Timothy',
      '2timothy': '2 Timothy',
      'titus': 'Titus',
      'philemon': 'Philemon',
      'hebrews': 'Hebrews',
      'james': 'James',
      '1peter': '1 Peter',
      '2peter': '2 Peter',
      '1john': '1 John',
      '2john': '2 John',
      '3john': '3 John',
      'jude': 'Jude',
      'revelation': 'Revelation'
    };
    
    const formattedBookName = bookNameMap[book.toLowerCase()] || book;
    const apiUrl = `https://bible-api.com/${encodeURIComponent(formattedBookName)}+${chapter}`;
    
    console.log(`Fetching Bible chapter from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Bible-App/1.0',
        'Accept': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP ${response.status}: Failed to fetch Bible chapter - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // Check if we got valid data
    if (!data || (!data.verses && !data.text)) {
      console.error('Invalid API response:', data);
      throw new Error('No verses found for this chapter');
    }
    
    // Transform the API response to our format
    let verses: BibleVerse[] = [];
    
    if (data.verses) {
      // Multiple verses format
      verses = data.verses.map((verse: any) => ({
        verse: verse.verse,
        text: verse.text.trim()
      }));
    } else if (data.text) {
      // Single verse format
      verses = [{
        verse: 1,
        text: data.text.trim()
      }];
    }
    
    // Extract book name from reference if available
    let bookName = formattedBookName;
    if (data.reference) {
      const refMatch = data.reference.match(/^([^0-9]+)/);
      if (refMatch) {
        bookName = refMatch[1].trim();
      }
    }
    
    console.log(`Successfully fetched ${verses.length} verses for ${bookName} ${chapter}`);
    
    return {
      book: bookName,
      chapter: chapter,
      verses
    };
  } catch (error) {
    console.error('Error fetching Bible chapter:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw new Error(`Failed to load Bible chapter: ${error.message}`);
    }
    
    throw new Error('Failed to load Bible chapter. Please try again.');
  }
};

export const getChapterProcedure = publicProcedure
  .input(z.object({ 
    book: z.string(),
    chapter: z.number().min(1)
  }))
  .query(async ({ input }) => {
    return await fetchBibleChapter(input.book, input.chapter);
  });