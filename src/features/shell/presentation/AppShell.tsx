import React, { useMemo } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Globe, Search, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { motion, AnimatePresence } from 'motion/react';

// Lazy load screens
const HomeScreen = React.lazy(() => import('@/features/home/presentation/HomeScreen'));
const GlobeScreen = React.lazy(() => import('@/features/globe/presentation/GlobeScreen'));
const SearchScreen = React.lazy(() => import('@/features/search/presentation/SearchScreen'));
const StatisticsScreen = React.lazy(() => import('@/features/statistics/presentation/StatisticsScreen'));
const SettingsScreen = React.lazy(() => import('@/features/settings/presentation/SettingsScreen'));

function TabContainer({ children, isActive }: { children: React.ReactNode, isActive: boolean }) {
  return (
    <div 
      className={cn(
        "w-full h-full absolute inset-0 overflow-y-auto overflow-x-hidden transition-opacity duration-300",
        isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
      )}
    >
      {children}
    </div>
  );
}

export default function AppShell() {
  const location = useLocation();

  const navItems = useMemo(() => [
    { to: "/", icon: Home, label: "Home", isTab: true },
    { to: "/globe", icon: Globe, label: "Globe", isTab: true },
    { to: "/search", icon: Search, label: "Search", isTab: true },
    { to: "/statistics", icon: BarChart2, label: "Stats", isTab: true },
    { to: "/settings", icon: Settings, label: "Settings", isTab: true }
  ], []);

  const isTabActive = (path: string) => location.pathname === path;
  const isAnyTabActive = navItems.some(item => isTabActive(item.to));

  return (
    <div 
      className={cn(
        "min-h-screen w-full flex flex-col font-sans transition-colors duration-300",
      )}
    >
      <div className="flex-1 relative overflow-hidden">
        {/* Tab Screens - Always mounted to preserve state */}
        <React.Suspense fallback={<div className="h-full w-full bg-canvas" />}>
          <TabContainer isActive={isTabActive('/')}>
            <HomeScreen />
          </TabContainer>
          <TabContainer isActive={isTabActive('/globe')}>
            <GlobeScreen />
          </TabContainer>
          <TabContainer isActive={isTabActive('/search')}>
            <SearchScreen />
          </TabContainer>
          <TabContainer isActive={isTabActive('/statistics')}>
            <StatisticsScreen />
          </TabContainer>
          <TabContainer isActive={isTabActive('/settings')}>
            <SettingsScreen />
          </TabContainer>
        </React.Suspense>

        {/* Non-Tab Screens (e.g. Place Details) */}
        <AnimatePresence>
          {!isAnyTabActive && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-20 bg-canvas overflow-y-auto"
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAnyTabActive && (
          <motion.nav 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="absolute bottom-4 left-4 right-4 z-30 pb-safe"
          >
            <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2 relative emboss rounded-full bg-card">
              {navItems.map((item) => {
                const active = isTabActive(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors relative z-10",
                      active ? "text-accent" : "text-text-muted hover:text-text-main"
                    )}
                  >
                    <item.icon 
                      className="w-5 h-5 transition-transform duration-300" 
                      strokeWidth={active ? 2.5 : 2}
                      style={{ 
                        transform: active ? 'translateY(-2px)' : 'none'
                      }}
                    />
                    <span className={cn(
                      "text-[10px] font-medium tracking-wide transition-all duration-300",
                      active ? "opacity-100" : "opacity-0 scale-75 absolute -bottom-4"
                    )}>
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

