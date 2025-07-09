import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  colors: {
    background: '#FFFFFF',
    primary: '#116466',
    secondary: '#D9B08C',
    accent: '#FFCB9A',
    lightBackground: '#F5F5F5',
    textPrimary: '#2C3531',
    textSecondary: '#666666',
    error: '#FF6B6B',
    cardBackground: '#FFFFFF',
    border: '#E0E0E0',
    buttonText: '#FFFFFF',
    buttonBackground: '#116466',
  },
};

export const darkTheme = {
  colors: {
    background: '#2C3531',
    primary: '#116466',
    secondary: '#D9B08C',
    accent: '#FFCB9A',
    lightBackground: '#D1E8E2',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1E8E2',
    error: '#FF6B6B',
    cardBackground: '#3C4A3F',
    border: '#4A5A4F',
    buttonText: '#FFFFFF',
    buttonBackground: '#116466',
  },
};

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  colors: typeof lightTheme.colors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      colors: darkTheme.colors,
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({
          theme: newTheme,
          colors: newTheme === 'light' ? lightTheme.colors : darkTheme.colors,
        });
      },
      setTheme: (theme: Theme) => {
        set({
          theme,
          colors: theme === 'light' ? lightTheme.colors : darkTheme.colors,
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 