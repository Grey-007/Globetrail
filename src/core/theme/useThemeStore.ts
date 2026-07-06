import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccentColor = 'steel' | 'ice' | 'sage' | 'coral' | 'teal';

export const getAccentColorHex = (color: AccentColor): string => {
  switch (color) {
    case 'steel': return '#8E8E93';
    case 'ice': return '#A1C4FD';
    case 'sage': return '#8FBC8F';
    case 'coral': return '#FF7F50';
    case 'teal': return '#008080';
    default: return '#8E8E93';
  }
};

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
