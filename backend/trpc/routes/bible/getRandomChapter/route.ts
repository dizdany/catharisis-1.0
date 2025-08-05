import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

interface BibleVerse {
  verse: number;
  text: string;
}

interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  testament: 'old' | 'new';
  order: number;
}

interface RandomChapterResult {
  book: string;
  bookId: string;
  chapter: number;
  verses: BibleVerse[];
  reference: string;
}

// Bible books with chapter counts
const bibleBooks: BibleBook[] = [
  // Old Testament
  { id: 'genesis', name: 'Genesis', chapters: 50, testament: 'old', order: 1 },
  { id: 'exodus', name: 'Exodus', chapters: 40, testament: 'old', order: 2 },
  { id: 'leviticus', name: 'Leviticus', chapters: 27, testament: 'old', order: 3 },
  { id: 'numbers', name: 'Numbers', chapters: 36, testament: 'old', order: 4 },
  { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34, testament: 'old', order: 5 },
  { id: 'joshua', name: 'Joshua', chapters: 24, testament: 'old', order: 6 },
  { id: 'judges', name: 'Judges', chapters: 21, testament: 'old', order: 7 },
  { id: 'ruth', name: 'Ruth', chapters: 4, testament: 'old', order: 8 },
  { id: '1samuel', name: '1 Samuel', chapters: 31, testament: 'old', order: 9 },
  { id: '2samuel', name: '2 Samuel', chapters: 24, testament: 'old', order: 10 },
  { id: '1kings', name: '1 Kings', chapters: 22, testament: 'old', order: 11 },
  { id: '2kings', name: '2 Kings', chapters: 25, testament: 'old', order: 12 },
  { id: '1chronicles', name: '1 Chronicles', chapters: 29, testament: 'old', order: 13 },
  { id: '2chronicles', name: '2 Chronicles', chapters: 36, testament: 'old', order: 14 },
  { id: 'ezra', name: 'Ezra', chapters: 10, testament: 'old', order: 15 },
  { id: 'nehemiah', name: 'Nehemiah', chapters: 13, testament: 'old', order: 16 },
  { id: 'esther', name: 'Esther', chapters: 10, testament: 'old', order: 17 },
  { id: 'job', name: 'Job', chapters: 42, testament: 'old', order: 18 },
  { id: 'psalms', name: 'Psalms', chapters: 150, testament: 'old', order: 19 },
  { id: 'proverbs', name: 'Proverbs', chapters: 31, testament: 'old', order: 20 },
  { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12, testament: 'old', order: 21 },
  { id: 'song', name: 'Song of Songs', chapters: 8, testament: 'old', order: 22 },
  { id: 'isaiah', name: 'Isaiah', chapters: 66, testament: 'old', order: 23 },
  { id: 'jeremiah', name: 'Jeremiah', chapters: 52, testament: 'old', order: 24 },
  { id: 'lamentations', name: 'Lamentations', chapters: 5, testament: 'old', order: 25 },
  { id: 'ezekiel', name: 'Ezekiel', chapters: 48, testament: 'old', order: 26 },
  { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'old', order: 27 },
  { id: 'hosea', name: 'Hosea', chapters: 14, testament: 'old', order: 28 },
  { id: 'joel', name: 'Joel', chapters: 3, testament: 'old', order: 29 },
  { id: 'amos', name: 'Amos', chapters: 9, testament: 'old', order: 30 },
  { id: 'obadiah', name: 'Obadiah', chapters: 1, testament: 'old', order: 31 },
  { id: 'jonah', name: 'Jonah', chapters: 4, testament: 'old', order: 32 },
  { id: 'micah', name: 'Micah', chapters: 7, testament: 'old', order: 33 },
  { id: 'nahum', name: 'Nahum', chapters: 3, testament: 'old', order: 34 },
  { id: 'habakkuk', name: 'Habakkuk', chapters: 3, testament: 'old', order: 35 },
  { id: 'zephaniah', name: 'Zephaniah', chapters: 3, testament: 'old', order: 36 },
  { id: 'haggai', name: 'Haggai', chapters: 2, testament: 'old', order: 37 },
  { id: 'zechariah', name: 'Zechariah', chapters: 14, testament: 'old', order: 38 },
  { id: 'malachi', name: 'Malachi', chapters: 4, testament: 'old', order: 39 },

  // New Testament
  { id: 'matthew', name: 'Matthew', chapters: 28, testament: 'new', order: 40 },
  { id: 'mark', name: 'Mark', chapters: 16, testament: 'new', order: 41 },
  { id: 'luke', name: 'Luke', chapters: 24, testament: 'new', order: 42 },
  { id: 'john', name: 'John', chapters: 21, testament: 'new', order: 43 },
  { id: 'acts', name: 'Acts', chapters: 28, testament: 'new', order: 44 },
  { id: 'romans', name: 'Romans', chapters: 16, testament: 'new', order: 45 },
  { id: '1corinthians', name: '1 Corinthians', chapters: 16, testament: 'new', order: 46 },
  { id: '2corinthians', name: '2 Corinthians', chapters: 13, testament: 'new', order: 47 },
  { id: 'galatians', name: 'Galatians', chapters: 6, testament: 'new', order: 48 },
  { id: 'ephesians', name: 'Ephesians', chapters: 6, testament: 'new', order: 49 },
  { id: 'philippians', name: 'Philippians', chapters: 4, testament: 'new', order: 50 },
  { id: 'colossians', name: 'Colossians', chapters: 4, testament: 'new', order: 51 },
  { id: '1thessalonians', name: '1 Thessalonians', chapters: 5, testament: 'new', order: 52 },
  { id: '2thessalonians', name: '2 Thessalonians', chapters: 3, testament: 'new', order: 53 },
  { id: '1timothy', name: '1 Timothy', chapters: 6, testament: 'new', order: 54 },
  { id: '2timothy', name: '2 Timothy', chapters: 4, testament: 'new', order: 55 },
  { id: 'titus', name: 'Titus', chapters: 3, testament: 'new', order: 56 },
  { id: 'philemon', name: 'Philemon', chapters: 1, testament: 'new', order: 57 },
  { id: 'hebrews', name: 'Hebrews', chapters: 13, testament: 'new', order: 58 },
  { id: 'james', name: 'James', chapters: 5, testament: 'new', order: 59 },
  { id: '1peter', name: '1 Peter', chapters: 5, testament: 'new', order: 60 },
  { id: '2peter', name: '2 Peter', chapters: 3, testament: 'new', order: 61 },
  { id: '1john', name: '1 John', chapters: 5, testament: 'new', order: 62 },
  { id: '2john', name: '2 John', chapters: 1, testament: 'new', order: 63 },
  { id: '3john', name: '3 John', chapters: 1, testament: 'new', order: 64 },
  { id: 'jude', name: 'Jude', chapters: 1, testament: 'new', order: 65 },
  { id: 'revelation', name: 'Revelation', chapters: 22, testament: 'new', order: 66 },
];

const fetchRandomBibleChapter = async (testament?: 'old' | 'new'): Promise<RandomChapterResult> => {
  try {
    // Filter books by testament if specified
    const availableBooks = testament 
      ? bibleBooks.filter(book => book.testament === testament)
      : bibleBooks;

    // Select random book
    const randomBook = availableBooks[Math.floor(Math.random() * availableBooks.length)];
    
    // Select random chapter
    const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;

    // Format book name for bible-api.com
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
    
    const formattedBookName = bookNameMap[randomBook.id.toLowerCase()] || randomBook.name;
    const apiUrl = `https://bible-api.com/${encodeURIComponent(formattedBookName)}+${randomChapter}`;
    
    console.log(`Fetching random Bible chapter from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Bible-App/1.0',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP ${response.status}: Failed to fetch Bible chapter - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data || (!data.verses && !data.text)) {
      console.error('Invalid API response:', data);
      throw new Error('No verses found for this chapter');
    }
    
    // Transform the API response to our format
    let verses: BibleVerse[] = [];
    
    if (data.verses) {
      verses = data.verses.map((verse: any) => ({
        verse: verse.verse,
        text: verse.text.trim()
      }));
    } else if (data.text) {
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
    
    const reference = `${bookName} ${randomChapter}`;
    
    console.log(`Successfully fetched random chapter: ${reference} with ${verses.length} verses`);
    
    return {
      book: bookName,
      bookId: randomBook.id,
      chapter: randomChapter,
      verses,
      reference
    };
  } catch (error) {
    console.error('Error fetching random Bible chapter:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw new Error(`Failed to load random Bible chapter: ${error.message}`);
    }
    
    throw new Error('Failed to load random Bible chapter. Please try again.');
  }
};

export const getRandomChapterProcedure = publicProcedure
  .input(z.object({ 
    testament: z.enum(['old', 'new']).optional()
  }))
  .query(async ({ input }) => {
    return await fetchRandomBibleChapter(input.testament);
  });