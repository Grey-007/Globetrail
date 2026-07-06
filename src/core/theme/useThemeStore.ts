import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccentColor = 'steel' | 'ice' | 'sage' | 'coral' | 'teal';
type SystemMode = 'system' | 'light' | 'dark';

interface ThemeState {
  accentColor: AccentColor;
  amoledMode: boolean;
  systemMode: SystemMode;
  setAccentColor: (color: AccentColor) => void;
  setAmoledMode: (enabled: boolean) => void;
  setSystemMode: (mode: SystemMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      accentColor: 'steel',
      amoledMode: true,
      systemMode: 'dark', // Default to dark for AMOLED
      setAccentColor: (color) => set({ accentColor: color }),
      setAmoledMode: (enabled) => set({ amoledMode: enabled }),
      setSystemMode: (mode) => set({ systemMode: mode }),
    }),
    {
      name: 'globetrail-theme-storage',
    }
  )
);
