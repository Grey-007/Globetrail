/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { AppRouter } from '@/core/navigation/AppRouter';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { useEffect, useState } from 'react';
import { initDatabase } from '@/core/di/injection';

export default function App() {
  const { mode } = useThemeStore();
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    // Sync the mode to the document body class for tailwind styling overrides
    if (mode === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  }, [mode]);

  useEffect(() => {
    initDatabase().then(() => setIsDbInitialized(true));
  }, []);

  if (!isDbInitialized) {
    return null; // Or a splash screen
  }

  return <AppRouter />;
}

