import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MoodDisplayMode = 'emoji' | 'text';
export type ThemeMode = 'light' | 'dark';

interface SettingsState {
  moodDisplayMode: MoodDisplayMode;
  setMoodDisplayMode: (mode: MoodDisplayMode) => void;
  randomReadingEnabled: boolean;
  setRandomReadingEnabled: (enabled: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isHydrated: boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Theme and mood display are ON by default for better user experience
      moodDisplayMode: 'emoji', // Show mood as emoji by default
      randomReadingEnabled: false,
      themeMode: 'light', // Light theme enabled by default
      isHydrated: false,
      setMoodDisplayMode: (mode) => set({ moodDisplayMode: mode }),
      setRandomReadingEnabled: (enabled) => set({ randomReadingEnabled: enabled }),
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);