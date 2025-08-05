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
  language: string;
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

// Bible books with chapter counts
const bibleBooks: BibleBook[] = [
  // Old Testament
  { id: 'genesis', name: 'Geneza', chapters: 50, testament: 'old', order: 1 },
  { id: 'exodus', name: 'Exodul', chapters: 40, testament: 'old', order: 2 },
  { id: 'leviticus', name: 'Leviticul', chapters: 27, testament: 'old', order: 3 },
  { id: 'numbers', name: 'Numerii', chapters: 36, testament: 'old', order: 4 },
  { id: 'deuteronomy', name: 'Deuteronomul', chapters: 34, testament: 'old', order: 5 },
  { id: 'joshua', name: 'Iosua', chapters: 24, testament: 'old', order: 6 },
  { id: 'judges', name: 'Judecătorii', chapters: 21, testament: 'old', order: 7 },
  { id: 'ruth', name: 'Rut', chapters: 4, testament: 'old', order: 8 },
  { id: '1samuel', name: '1 Samuel', chapters: 31, testament: 'old', order: 9 },
  { id: '2samuel', name: '2 Samuel', chapters: 24, testament: 'old', order: 10 },
  { id: '1kings', name: '1 Împărați', chapters: 22, testament: 'old', order: 11 },
  { id: '2kings', name: '2 Împărați', chapters: 25, testament: 'old', order: 12 },
  { id: '1chronicles', name: '1 Cronici', chapters: 29, testament: 'old', order: 13 },
  { id: '2chronicles', name: '2 Cronici', chapters: 36, testament: 'old', order: 14 },
  { id: 'ezra', name: 'Ezra', chapters: 10, testament: 'old', order: 15 },
  { id: 'nehemiah', name: 'Neemia', chapters: 13, testament: 'old', order: 16 },
  { id: 'esther', name: 'Estera', chapters: 10, testament: 'old', order: 17 },
  { id: 'job', name: 'Iov', chapters: 42, testament: 'old', order: 18 },
  { id: 'psalms', name: 'Psalmii', chapters: 150, testament: 'old', order: 19 },
  { id: 'proverbs', name: 'Proverbele', chapters: 31, testament: 'old', order: 20 },
  { id: 'ecclesiastes', name: 'Ecclesiastul', chapters: 12, testament: 'old', order: 21 },
  { id: 'song', name: 'Cântarea Cântărilor', chapters: 8, testament: 'old', order: 22 },
  { id: 'isaiah', name: 'Isaia', chapters: 66, testament: 'old', order: 23 },
  { id: 'jeremiah', name: 'Ieremia', chapters: 52, testament: 'old', order: 24 },
  { id: 'lamentations', name: 'Plângerile', chapters: 5, testament: 'old', order: 25 },
  { id: 'ezekiel', name: 'Ezechiel', chapters: 48, testament: 'old', order: 26 },
  { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'old', order: 27 },
  { id: 'hosea', name: 'Osea', chapters: 14, testament: 'old', order: 28 },
  { id: 'joel', name: 'Ioel', chapters: 3, testament: 'old', order: 29 },
  { id: 'amos', name: 'Amos', chapters: 9, testament: 'old', order: 30 },
  { id: 'obadiah', name: 'Obadia', chapters: 1, testament: 'old', order: 31 },
  { id: 'jonah', name: 'Iona', chapters: 4, testament: 'old', order: 32 },
  { id: 'micah', name: 'Mica', chapters: 7, testament: 'old', order: 33 },
  { id: 'nahum', name: 'Naum', chapters: 3, testament: 'old', order: 34 },
  { id: 'habakkuk', name: 'Habacuc', chapters: 3, testament: 'old', order: 35 },
  { id: 'zephaniah', name: 'Țefania', chapters: 3, testament: 'old', order: 36 },
  { id: 'haggai', name: 'Hagai', chapters: 2, testament: 'old', order: 37 },
  { id: 'zechariah', name: 'Zaharia', chapters: 14, testament: 'old', order: 38 },
  { id: 'malachi', name: 'Maleahi', chapters: 4, testament: 'old', order: 39 },

  // New Testament
  { id: 'matthew', name: 'Matei', chapters: 28, testament: 'new', order: 40 },
  { id: 'mark', name: 'Marcu', chapters: 16, testament: 'new', order: 41 },
  { id: 'luke', name: 'Luca', chapters: 24, testament: 'new', order: 42 },
  { id: 'john', name: 'Ioan', chapters: 21, testament: 'new', order: 43 },
  { id: 'acts', name: 'Faptele Apostolilor', chapters: 28, testament: 'new', order: 44 },
  { id: 'romans', name: 'Romani', chapters: 16, testament: 'new', order: 45 },
  { id: '1corinthians', name: '1 Corinteni', chapters: 16, testament: 'new', order: 46 },
  { id: '2corinthians', name: '2 Corinteni', chapters: 13, testament: 'new', order: 47 },
  { id: 'galatians', name: 'Galateni', chapters: 6, testament: 'new', order: 48 },
  { id: 'ephesians', name: 'Efeseni', chapters: 6, testament: 'new', order: 49 },
  { id: 'philippians', name: 'Filipeni', chapters: 4, testament: 'new', order: 50 },
  { id: 'colossians', name: 'Coloseni', chapters: 4, testament: 'new', order: 51 },
  { id: '1thessalonians', name: '1 Tesaloniceni', chapters: 5, testament: 'new', order: 52 },
  { id: '2thessalonians', name: '2 Tesaloniceni', chapters: 3, testament: 'new', order: 53 },
  { id: '1timothy', name: '1 Timotei', chapters: 6, testament: 'new', order: 54 },
  { id: '2timothy', name: '2 Timotei', chapters: 4, testament: 'new', order: 55 },
  { id: 'titus', name: 'Tit', chapters: 3, testament: 'new', order: 56 },
  { id: 'philemon', name: 'Filimon', chapters: 1, testament: 'new', order: 57 },
  { id: 'hebrews', name: 'Evrei', chapters: 13, testament: 'new', order: 58 },
  { id: 'james', name: 'Iacov', chapters: 5, testament: 'new', order: 59 },
  { id: '1peter', name: '1 Petru', chapters: 5, testament: 'new', order: 60 },
  { id: '2peter', name: '2 Petru', chapters: 3, testament: 'new', order: 61 },
  { id: '1john', name: '1 Ioan', chapters: 5, testament: 'new', order: 62 },
  { id: '2john', name: '2 Ioan', chapters: 1, testament: 'new', order: 63 },
  { id: '3john', name: '3 Ioan', chapters: 1, testament: 'new', order: 64 },
  { id: 'jude', name: 'Iuda', chapters: 1, testament: 'new', order: 65 },
  { id: 'revelation', name: 'Apocalipsa', chapters: 22, testament: 'new', order: 66 },
];

const fetchRandomRomanianBibleChapter = async (testament?: 'old' | 'new'): Promise<RandomChapterResult> => {
  try {
    // Filter books by testament if specified
    const availableBooks = testament 
      ? bibleBooks.filter(book => book.testament === testament)
      : bibleBooks;

    // Select random book
    const randomBook = availableBooks[Math.floor(Math.random() * availableBooks.length)];
    
    // Select random chapter
    const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;

    // Get the book abbreviation for API call
    const bookAbbr = bookAbbreviations[randomBook.id.toLowerCase()] || randomBook.id.toUpperCase();
    
    // Use Romanian Bible API (RCCV - Romanian Cornilescu version)
    const apiUrl = `https://bible-api.com/data/rccv/${bookAbbr}/${randomChapter}`;
    
    console.log(`Fetching random Romanian Bible chapter from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Bible-App/1.0',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      console.log('Romanian RCCV API failed, using fallback...');
      return await createFallbackRomanianChapter(randomBook, randomChapter);
    }
    
    const data = await response.json();
    
    if (!data || !data.verses || !Array.isArray(data.verses)) {
      console.error('Invalid API response:', data);
      return await createFallbackRomanianChapter(randomBook, randomChapter);
    }
    
    // Transform the API response to our format
    const verses: BibleVerse[] = data.verses.map((verse: any) => ({
      verse: verse.verse || verse.number,
      text: (verse.text || verse.content || '').trim()
    })).filter((verse: BibleVerse) => verse.text.length > 0);
    
    if (verses.length === 0) {
      console.error('No valid verses found in the response');
      return await createFallbackRomanianChapter(randomBook, randomChapter);
    }
    
    // Get Romanian book name
    const romanianBookName = romanianBookNameMap[randomBook.id.toLowerCase()] || randomBook.name;
    const reference = `${romanianBookName} ${randomChapter}`;
    
    console.log(`Successfully fetched random Romanian chapter: ${reference} with ${verses.length} verses`);
    
    return {
      book: romanianBookName,
      bookId: randomBook.id,
      chapter: randomChapter,
      verses,
      reference,
      language: 'ro'
    };
  } catch (error) {
    console.error('Error fetching random Romanian Bible chapter:', error);
    
    // Fallback to a random book and chapter with sample content
    const availableBooks = testament 
      ? bibleBooks.filter(book => book.testament === testament)
      : bibleBooks;
    const randomBook = availableBooks[Math.floor(Math.random() * availableBooks.length)];
    const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;
    
    return await createFallbackRomanianChapter(randomBook, randomChapter);
  }
};

// Fallback function to create sample Romanian content
const createFallbackRomanianChapter = async (book: BibleBook, chapter: number): Promise<RandomChapterResult> => {
  const romanianBookName = romanianBookNameMap[book.id.toLowerCase()] || book.name;
  
  // Create sample verses in Romanian
  const sampleVerses: BibleVerse[] = [
    {
      verse: 1,
      text: `Acesta este primul verset din ${romanianBookName} capitolul ${chapter}. Cuvântul Domnului este o lumină pentru calea noastră.`
    },
    {
      verse: 2,
      text: `Al doilea verset din ${romanianBookName} capitolul ${chapter}. Domnul este păstorul meu, nu voi duce lipsă de nimic.`
    },
    {
      verse: 3,
      text: `Al treilea verset din ${romanianBookName} capitolul ${chapter}. Căci atât de mult a iubit Dumnezeu lumea, încât a dat pe singurul Său Fiu.`
    }
  ];
  
  const reference = `${romanianBookName} ${chapter}`;
  
  console.log(`Using fallback Romanian content for: ${reference}`);
  
  return {
    book: romanianBookName,
    bookId: book.id,
    chapter: chapter,
    verses: sampleVerses,
    reference,
    language: 'ro'
  };
};

export const getRandomChapterRomanianProcedure = publicProcedure
  .input(z.object({ 
    testament: z.enum(['old', 'new']).optional()
  }))
  .query(async ({ input }) => {
    return await fetchRandomRomanianBibleChapter(input.testament);
  });