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
  const { amoledMode, accentColor } = useThemeStore();
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
    <div className={cn(
      "min-h-screen w-full flex flex-col font-sans transition-colors duration-300",
      amoledMode ? "bg-canvas-black text-white" : "bg-slate-gray text-white"
    )}>
      <div 
        className="flex-1 relative overflow-hidden"
        style={{
          '--color-active-accent': `var(--color-accent-${accentColor})`
        } as React.CSSProperties}
      >
        {/* Tab Screens - Always mounted to preserve state */}
        <React.Suspense fallback={<div className="h-full w-full bg-canvas-black" />}>
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
              className="absolute inset-0 z-20 bg-canvas-black overflow-y-auto"
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
            className="absolute bottom-0 w-full z-30 border-t border-fine-border bg-canvas-black/90 backdrop-blur-md pb-safe"
          >
            <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4 relative">
              {navItems.map((item) => {
                const active = isTabActive(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors relative z-10",
                      active ? "text-white" : "text-textMuted hover:text-white/80"
                    )}
                  >
                    <item.icon 
                      className="w-6 h-6 transition-transform duration-300" 
                      strokeWidth={active ? 2.5 : 2}
                      style={{ 
                        color: active ? `var(--color-accent-${accentColor})` : undefined,
                        transform: active ? 'translateY(-2px)' : 'none'
                      }}
                    />
                    <span className={cn(
                      "text-[10px] font-medium tracking-wide transition-all duration-300",
                      active ? "opacity-100" : "opacity-0 scale-75 absolute -bottom-4"
                    )}
                    style={{ color: active ? `var(--color-accent-${accentColor})` : undefined }}
                    >
                      {item.label}
                    </span>
                    
                    {/* Active Indicator */}
                    {active && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-b-full bg-[var(--color-active-accent)] shadow-[0_0_8px_var(--color-active-accent)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
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
