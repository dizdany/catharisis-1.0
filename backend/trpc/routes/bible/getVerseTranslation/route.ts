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
  language?: string;
}

// Romanian book name mappings
const romanianBookNameMap: Record<string, string> = {
  'genesis': 'Geneza',
  'exodus': 'Exodul',
  'leviticus': 'Leviticul',
  'numbers': 'Numerii',
  'deuteronomy': 'Deuteronomul',
  'joshua': 'Iosua',
  'judges': 'Judecătorii',
  'ruth': 'Rut',
  '1samuel': '1 Samuel',
  '2samuel': '2 Samuel',
  '1kings': '1 Împărați',
  '2kings': '2 Împărați',
  '1chronicles': '1 Cronici',
  '2chronicles': '2 Cronici',
  'ezra': 'Ezra',
  'nehemiah': 'Neemia',
  'esther': 'Estera',
  'job': 'Iov',
  'psalms': 'Psalmii',
  'proverbs': 'Proverbele',
  'ecclesiastes': 'Ecclesiastul',
  'song': 'Cântarea Cântărilor',
  'isaiah': 'Isaia',
  'jeremiah': 'Ieremia',
  'lamentations': 'Plângerile',
  'ezekiel': 'Ezechiel',
  'daniel': 'Daniel',
  'hosea': 'Osea',
  'joel': 'Ioel',
  'amos': 'Amos',
  'obadiah': 'Obadia',
  'jonah': 'Iona',
  'micah': 'Mica',
  'nahum': 'Naum',
  'habakkuk': 'Habacuc',
  'zephaniah': 'Țefania',
  'haggai': 'Hagai',
  'zechariah': 'Zaharia',
  'malachi': 'Maleahi',
  'matthew': 'Matei',
  'mark': 'Marcu',
  'luke': 'Luca',
  'john': 'Ioan',
  'acts': 'Faptele Apostolilor',
  'romans': 'Romani',
  '1corinthians': '1 Corinteni',
  '2corinthians': '2 Corinteni',
  'galatians': 'Galateni',
  'ephesians': 'Efeseni',
  'philippians': 'Filipeni',
  'colossians': 'Coloseni',
  '1thessalonians': '1 Tesaloniceni',
  '2thessalonians': '2 Tesaloniceni',
  '1timothy': '1 Timotei',
  '2timothy': '2 Timotei',
  'titus': 'Tit',
  'philemon': 'Filimon',
  'hebrews': 'Evrei',
  'james': 'Iacov',
  '1peter': '1 Petru',
  '2peter': '2 Petru',
  '1john': '1 Ioan',
  '2john': '2 Ioan',
  '3john': '3 Ioan',
  'jude': 'Iuda',
  'revelation': 'Apocalipsa'
};

// English book name mappings
const englishBookNameMap: Record<string, string> = {
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

// Bible book abbreviations for Romanian API calls (RCCV format)
const bookAbbreviations: Record<string, string> = {
  'genesis': 'GEN',
  'exodus': 'EXO',
  'leviticus': 'LEV',
  'numbers': 'NUM',
  'deuteronomy': 'DEU',
  'joshua': 'JOS',
  'judges': 'JDG',
  'ruth': 'RUT',
  '1samuel': '1SA',
  '2samuel': '2SA',
  '1kings': '1KI',
  '2kings': '2KI',
  '1chronicles': '1CH',
  '2chronicles': '2CH',
  'ezra': 'EZR',
  'nehemiah': 'NEH',
  'esther': 'EST',
  'job': 'JOB',
  'psalms': 'PSA',
  'proverbs': 'PRO',
  'ecclesiastes': 'ECC',
  'song': 'SNG',
  'isaiah': 'ISA',
  'jeremiah': 'JER',
  'lamentations': 'LAM',
  'ezekiel': 'EZK',
  'daniel': 'DAN',
  'hosea': 'HOS',
  'joel': 'JOL',
  'amos': 'AMO',
  'obadiah': 'OBA',
  'jonah': 'JON',
  'micah': 'MIC',
  'nahum': 'NAM',
  'habakkuk': 'HAB',
  'zephaniah': 'ZEP',
  'haggai': 'HAG',
  'zechariah': 'ZEC',
  'malachi': 'MAL',
  'matthew': 'MAT',
  'mark': 'MRK',
  'luke': 'LUK',
  'john': 'JHN',
  'acts': 'ACT',
  'romans': 'ROM',
  '1corinthians': '1CO',
  '2corinthians': '2CO',
  'galatians': 'GAL',
  'ephesians': 'EPH',
  'philippians': 'PHP',
  'colossians': 'COL',
  '1thessalonians': '1TH',
  '2thessalonians': '2TH',
  '1timothy': '1TI',
  '2timothy': '2TI',
  'titus': 'TIT',
  'philemon': 'PHM',
  'hebrews': 'HEB',
  'james': 'JAS',
  '1peter': '1PE',
  '2peter': '2PE',
  '1john': '1JN',
  '2john': '2JN',
  '3john': '3JN',
  'jude': 'JUD',
  'revelation': 'REV'
};

const fetchVerseTranslation = async (
  book: string, 
  chapter: number, 
  verse: number, 
  language: string
): Promise<{
  text: string;
  reference: string;
  book: string;
  language: string;
}> => {
  try {
    if (language === 'ro') {
      // Fetch Romanian translation
      const bookAbbr = bookAbbreviations[book.toLowerCase()] || book.toUpperCase();
      const apiUrl = `https://bible-api.com/data/rccv/${bookAbbr}/${chapter}`;
      
      console.log(`Fetching Romanian verse from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Bible-App/1.0',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch Romanian verse`);
      }
      
      const data = await response.json();
      
      if (!data || !data.verses || !Array.isArray(data.verses)) {
        throw new Error('Invalid API response for Romanian verse');
      }
      
      const targetVerse = data.verses.find((v: any) => (v.verse || v.number) === verse);
      
      if (!targetVerse) {
        throw new Error(`Verse ${verse} not found in chapter ${chapter}`);
      }
      
      const romanianBookName = romanianBookNameMap[book.toLowerCase()] || book;
      
      return {
        text: (targetVerse.text || targetVerse.content || '').trim(),
        reference: `${romanianBookName} ${chapter}:${verse}`,
        book: romanianBookName,
        language: 'ro'
      };
    } else {
      // Fetch English translation
      const englishBookName = englishBookNameMap[book.toLowerCase()] || book;
      const apiUrl = `https://bible-api.com/${encodeURIComponent(englishBookName)}+${chapter}:${verse}`;
      
      console.log(`Fetching English verse from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Bible-App/1.0',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch English verse`);
      }
      
      const data = await response.json();
      
      if (!data || !data.text) {
        throw new Error('Invalid API response for English verse');
      }
      
      return {
        text: data.text.trim(),
        reference: `${englishBookName} ${chapter}:${verse}`,
        book: englishBookName,
        language: 'en'
      };
    }
  } catch (error) {
    console.error('Error fetching verse translation:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw new Error(`Failed to load verse translation: ${error.message}`);
    }
    
    throw new Error('Failed to load verse translation. Please try again.');
  }
};

export const getVerseTranslationProcedure = publicProcedure
  .input(z.object({ 
    book: z.string(),
    chapter: z.number().min(1),
    verse: z.number().min(1),
    language: z.string()
  }))
  .query(async ({ input }) => {
    return await fetchVerseTranslation(input.book, input.chapter, input.verse, input.language);
  });