import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/constants/translations';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  isHydrated: boolean;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      isHydrated: false,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);