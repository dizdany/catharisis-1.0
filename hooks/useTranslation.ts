import { useLanguageStore } from '@/store/languageStore';
import { translations, verseTranslations, Language, VerseTranslation } from '@/constants/translations';

interface BibleVerseWithMood {
  id: string;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  mood?: string;
}

export function useTranslation() {
  const { language, isHydrated } = useLanguageStore();
  
  // Ensure we always have a valid language, fallback to 'en' if not hydrated or undefined
  const currentLanguage: Language = (isHydrated && language) ? language : 'en';
  
  const t = (key: keyof typeof translations.en, params?: Record<string, string>) => {
    try {
      // Ensure the language exists in translations, fallback to 'en'
      const lang = translations[currentLanguage] ? currentLanguage : 'en';
      let result = translations[lang][key] || translations.en[key];
      
      // If still no result, return the key itself as fallback
      if (!result) return key;
      
      // Replace template placeholders if params are provided
      if (params) {
        Object.keys(params).forEach(paramKey => {
          result = result.replace(`{${paramKey}}`, params[paramKey]);
        });
      }
      
      return result;
    } catch (error) {
      console.warn('Translation error for key:', key, error);
      return key;
    }
  };
  
  const translateVerse = (verse: BibleVerseWithMood): BibleVerseWithMood => {
    if (currentLanguage === 'en' || !isHydrated) return verse;
    
    // Check if the language exists in verseTranslations
    const languageTranslations = verseTranslations[currentLanguage];
    if (!languageTranslations) return verse;
    
    // Get the translated verse data
    const translatedVerse: VerseTranslation | undefined = languageTranslations[verse.id];
    if (!translatedVerse) return verse;
    
    return {
      ...verse,
      text: translatedVerse.text || verse.text,
      reference: translatedVerse.reference || verse.reference,
      book: translatedVerse.book || verse.book,
    };
  };
  
  const getCurrentLanguage = (): Language => {
    return currentLanguage;
  };
  
  return { t, translateVerse, language: getCurrentLanguage(), isHydrated };
}