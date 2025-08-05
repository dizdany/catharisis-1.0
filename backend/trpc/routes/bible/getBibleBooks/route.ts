import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { translations, Language } from "@/constants/translations";

interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  testament: 'old' | 'new';
  order: number;
}

// Standard Bible books with chapter counts
const fetchBibleBooks = async (language: Language = 'en'): Promise<BibleBook[]> => {
  const getTranslatedName = (bookId: string): string => {
    const translationKey = bookId as keyof typeof translations.en;
    return translations[language]?.[translationKey] || translations.en[translationKey] || bookId;
  };

  const standardBooks: BibleBook[] = [
    // Old Testament
    { id: 'genesis', name: getTranslatedName('genesis'), chapters: 50, testament: 'old', order: 1 },
    { id: 'exodus', name: getTranslatedName('exodus'), chapters: 40, testament: 'old', order: 2 },
    { id: 'leviticus', name: getTranslatedName('leviticus'), chapters: 27, testament: 'old', order: 3 },
    { id: 'numbers', name: getTranslatedName('numbers'), chapters: 36, testament: 'old', order: 4 },
    { id: 'deuteronomy', name: getTranslatedName('deuteronomy'), chapters: 34, testament: 'old', order: 5 },
    { id: 'joshua', name: getTranslatedName('joshua'), chapters: 24, testament: 'old', order: 6 },
    { id: 'judges', name: getTranslatedName('judges'), chapters: 21, testament: 'old', order: 7 },
    { id: 'ruth', name: getTranslatedName('ruth'), chapters: 4, testament: 'old', order: 8 },
    { id: '1samuel', name: getTranslatedName('1samuel'), chapters: 31, testament: 'old', order: 9 },
    { id: '2samuel', name: getTranslatedName('2samuel'), chapters: 24, testament: 'old', order: 10 },
    { id: '1kings', name: getTranslatedName('1kings'), chapters: 22, testament: 'old', order: 11 },
    { id: '2kings', name: getTranslatedName('2kings'), chapters: 25, testament: 'old', order: 12 },
    { id: '1chronicles', name: getTranslatedName('1chronicles'), chapters: 29, testament: 'old', order: 13 },
    { id: '2chronicles', name: getTranslatedName('2chronicles'), chapters: 36, testament: 'old', order: 14 },
    { id: 'ezra', name: getTranslatedName('ezra'), chapters: 10, testament: 'old', order: 15 },
    { id: 'nehemiah', name: getTranslatedName('nehemiah'), chapters: 13, testament: 'old', order: 16 },
    { id: 'esther', name: getTranslatedName('esther'), chapters: 10, testament: 'old', order: 17 },
    { id: 'job', name: getTranslatedName('job'), chapters: 42, testament: 'old', order: 18 },
    { id: 'psalms', name: getTranslatedName('psalms'), chapters: 150, testament: 'old', order: 19 },
    { id: 'proverbs', name: getTranslatedName('proverbs'), chapters: 31, testament: 'old', order: 20 },
    { id: 'ecclesiastes', name: getTranslatedName('ecclesiastes'), chapters: 12, testament: 'old', order: 21 },
    { id: 'song', name: getTranslatedName('song'), chapters: 8, testament: 'old', order: 22 },
    { id: 'isaiah', name: getTranslatedName('isaiah'), chapters: 66, testament: 'old', order: 23 },
    { id: 'jeremiah', name: getTranslatedName('jeremiah'), chapters: 52, testament: 'old', order: 24 },
    { id: 'lamentations', name: getTranslatedName('lamentations'), chapters: 5, testament: 'old', order: 25 },
    { id: 'ezekiel', name: getTranslatedName('ezekiel'), chapters: 48, testament: 'old', order: 26 },
    { id: 'daniel', name: getTranslatedName('daniel'), chapters: 12, testament: 'old', order: 27 },
    { id: 'hosea', name: getTranslatedName('hosea'), chapters: 14, testament: 'old', order: 28 },
    { id: 'joel', name: getTranslatedName('joel'), chapters: 3, testament: 'old', order: 29 },
    { id: 'amos', name: getTranslatedName('amos'), chapters: 9, testament: 'old', order: 30 },
    { id: 'obadiah', name: getTranslatedName('obadiah'), chapters: 1, testament: 'old', order: 31 },
    { id: 'jonah', name: getTranslatedName('jonah'), chapters: 4, testament: 'old', order: 32 },
    { id: 'micah', name: getTranslatedName('micah'), chapters: 7, testament: 'old', order: 33 },
    { id: 'nahum', name: getTranslatedName('nahum'), chapters: 3, testament: 'old', order: 34 },
    { id: 'habakkuk', name: getTranslatedName('habakkuk'), chapters: 3, testament: 'old', order: 35 },
    { id: 'zephaniah', name: getTranslatedName('zephaniah'), chapters: 3, testament: 'old', order: 36 },
    { id: 'haggai', name: getTranslatedName('haggai'), chapters: 2, testament: 'old', order: 37 },
    { id: 'zechariah', name: getTranslatedName('zechariah'), chapters: 14, testament: 'old', order: 38 },
    { id: 'malachi', name: getTranslatedName('malachi'), chapters: 4, testament: 'old', order: 39 },

    // New Testament
    { id: 'matthew', name: getTranslatedName('matthew'), chapters: 28, testament: 'new', order: 40 },
    { id: 'mark', name: getTranslatedName('mark'), chapters: 16, testament: 'new', order: 41 },
    { id: 'luke', name: getTranslatedName('luke'), chapters: 24, testament: 'new', order: 42 },
    { id: 'john', name: getTranslatedName('john'), chapters: 21, testament: 'new', order: 43 },
    { id: 'acts', name: getTranslatedName('acts'), chapters: 28, testament: 'new', order: 44 },
    { id: 'romans', name: getTranslatedName('romans'), chapters: 16, testament: 'new', order: 45 },
    { id: '1corinthians', name: getTranslatedName('1corinthians'), chapters: 16, testament: 'new', order: 46 },
    { id: '2corinthians', name: getTranslatedName('2corinthians'), chapters: 13, testament: 'new', order: 47 },
    { id: 'galatians', name: getTranslatedName('galatians'), chapters: 6, testament: 'new', order: 48 },
    { id: 'ephesians', name: getTranslatedName('ephesians'), chapters: 6, testament: 'new', order: 49 },
    { id: 'philippians', name: getTranslatedName('philippians'), chapters: 4, testament: 'new', order: 50 },
    { id: 'colossians', name: getTranslatedName('colossians'), chapters: 4, testament: 'new', order: 51 },
    { id: '1thessalonians', name: getTranslatedName('1thessalonians'), chapters: 5, testament: 'new', order: 52 },
    { id: '2thessalonians', name: getTranslatedName('2thessalonians'), chapters: 3, testament: 'new', order: 53 },
    { id: '1timothy', name: getTranslatedName('1timothy'), chapters: 6, testament: 'new', order: 54 },
    { id: '2timothy', name: getTranslatedName('2timothy'), chapters: 4, testament: 'new', order: 55 },
    { id: 'titus', name: getTranslatedName('titus'), chapters: 3, testament: 'new', order: 56 },
    { id: 'philemon', name: getTranslatedName('philemon'), chapters: 1, testament: 'new', order: 57 },
    { id: 'hebrews', name: getTranslatedName('hebrews'), chapters: 13, testament: 'new', order: 58 },
    { id: 'james', name: getTranslatedName('james'), chapters: 5, testament: 'new', order: 59 },
    { id: '1peter', name: getTranslatedName('1peter'), chapters: 5, testament: 'new', order: 60 },
    { id: '2peter', name: getTranslatedName('2peter'), chapters: 3, testament: 'new', order: 61 },
    { id: '1john', name: getTranslatedName('1john'), chapters: 5, testament: 'new', order: 62 },
    { id: '2john', name: getTranslatedName('2john'), chapters: 1, testament: 'new', order: 63 },
    { id: '3john', name: getTranslatedName('3john'), chapters: 1, testament: 'new', order: 64 },
    { id: 'jude', name: getTranslatedName('jude'), chapters: 1, testament: 'new', order: 65 },
    { id: 'revelation', name: getTranslatedName('revelation'), chapters: 22, testament: 'new', order: 66 },
  ];

  return standardBooks;
};

export const getBibleBooksProcedure = publicProcedure
  .input(z.object({ 
    testament: z.enum(['old', 'new']).optional(),
    language: z.enum(['en', 'es', 'ro']).optional()
  }))
  .query(async ({ input }) => {
    const books = await fetchBibleBooks(input.language || 'en');
    
    if (input.testament) {
      return books.filter(book => book.testament === input.testament);
    }
    
    return books;
  });