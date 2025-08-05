import { createTRPCRouter } from "./create-context";
import { hiProcedure } from "./routes/example/hi/route";
import { getChapterProcedure } from "./routes/bible/getChapter/route";
import { getChapterRomanianProcedure } from "./routes/bible/getChapterRomanian/route";
import { getBibleVersionsProcedure } from "./routes/bible/getBibleVersions/route";
import { getBibleBooksProcedure } from "./routes/bible/getBibleBooks/route";
import { getVersesByMoodProcedure } from "./routes/bible/getVersesByMood/route";
import { getRandomChapterProcedure } from "./routes/bible/getRandomChapter/route";
import { getRandomChapterRomanianProcedure } from "./routes/bible/getRandomChapterRomanian/route";
import { getVerseTranslationProcedure } from "./routes/bible/getVerseTranslation/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  bible: createTRPCRouter({
    getChapter: getChapterProcedure,
    getChapterRomanian: getChapterRomanianProcedure,
    getBibleVersions: getBibleVersionsProcedure,
    getBibleBooks: getBibleBooksProcedure,
    getVersesByMood: getVersesByMoodProcedure,
    getRandomChapter: getRandomChapterProcedure,
    getRandomChapterRomanian: getRandomChapterRomanianProcedure,
    getVerseTranslation: getVerseTranslationProcedure,
  }),
});

export type AppRouter = typeof appRouter;