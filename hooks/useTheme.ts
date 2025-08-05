import { useSettingsStore } from '@/store/settingsStore';
import { lightTheme, darkTheme } from '@/constants/colors';

export const useTheme = () => {
  const { themeMode } = useSettingsStore();
  
  const colors = themeMode === 'light' ? lightTheme : darkTheme;
  
  return {
    colors,
    themeMode,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light',
  };
};