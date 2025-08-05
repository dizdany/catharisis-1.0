import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodType } from '@/constants/verses';

interface MoodState {
  selectedMood: MoodType | null;
  setMood: (mood: MoodType) => void;
  resetMood: () => void;
  lastSelectedMood: MoodType | null;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      selectedMood: null,
      lastSelectedMood: null,
      setMood: (mood) => {
        const { selectedMood: currentMood } = get();
        set({ 
          selectedMood: mood, 
          lastSelectedMood: currentMood 
        });
      },
      resetMood: () => set({ selectedMood: null }),
    }),
    {
      name: 'mood-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        // Don't persist selectedMood - it should always start as null
        // Don't persist lastSelectedMood either to ensure clean start
      }),
      // Ensure selectedMood is always null on hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.selectedMood = null;
          state.lastSelectedMood = null;
        }
      },
    }
  )
);