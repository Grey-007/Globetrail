/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { AppRouter } from '@/core/navigation/AppRouter';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { useEffect, useState } from 'react';
import { initDatabase } from '@/core/di/injection';

export default function App() {
  const { amoledMode } = useThemeStore();
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    // Sync the AMOLED mode to the document body class for tailwind styling overrides
    if (!amoledMode) {
      document.documentElement.classList.add('theme-slate');
    } else {
      document.documentElement.classList.remove('theme-slate');
    }
  }, [amoledMode]);

  useEffect(() => {
    initDatabase().then(() => setIsDbInitialized(true));
  }, []);

  if (!isDbInitialized) {
    return null; // Or a splash screen
  }

  return <AppRouter />;
}

