import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

interface BibleVersion {
  id: string;
  name: string;
  language: string;
  languageCode: string;
}

// Available Bible versions for different languages
const BIBLE_VERSIONS: BibleVersion[] = [
  // English versions
  { id: 'kjv', name: 'King James Version', language: 'English', languageCode: 'en' },
  { id: 'niv', name: 'New International Version', language: 'English', languageCode: 'en' },
  { id: 'esv', name: 'English Standard Version', language: 'English', languageCode: 'en' },
  
  // Romanian versions
  { id: 'cornilescu', name: 'Cornilescu', language: 'Română', languageCode: 'ro' },
  { id: 'ntlr', name: 'Noua Traducere în Limba Română', language: 'Română', languageCode: 'ro' },
  
  // Spanish versions
  { id: 'rvr1960', name: 'Reina-Valera 1960', language: 'Español', languageCode: 'es' },
  { id: 'nvi', name: 'Nueva Versión Internacional', language: 'Español', languageCode: 'es' },
];

export const getBibleVersionsProcedure = publicProcedure
  .input(z.object({ 
    languageCode: z.string().optional()
  }))
  .query(async ({ input }) => {
    if (input.languageCode) {
      return BIBLE_VERSIONS.filter(version => version.languageCode === input.languageCode);
    }
    return BIBLE_VERSIONS;
  });