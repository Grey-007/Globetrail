import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Globe, Search, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { useThemeStore } from '@/core/theme/useThemeStore';

export default function AppShell() {
  const { amoledMode, accentColor } = useThemeStore();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/globe", icon: Globe, label: "Globe" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/statistics", icon: BarChart2, label: "Stats" },
    { to: "/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col font-sans transition-colors duration-300",
      amoledMode ? "bg-canvas-black text-white" : "bg-slate-gray text-white"
    )}>
      {/* Dynamic accent color variable injection for Tailwind */}
      <div 
        className="flex-1 overflow-x-hidden overflow-y-auto relative pb-20"
        style={{
          '--color-active-accent': `var(--color-accent-${accentColor})`
        } as React.CSSProperties}
      >
        <Outlet />
      </div>

      <nav className="fixed bottom-0 w-full border-t border-fine-border bg-canvas-black/90 backdrop-blur-md pb-safe">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors",
                isActive ? "text-white" : "text-textMuted hover:text-white/80"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    className="w-6 h-6 transition-transform duration-200" 
                    strokeWidth={isActive ? 2.5 : 2}
                    style={{ color: isActive ? `var(--color-accent-${accentColor})` : undefined }}
                  />
                  <span className={cn(
                    "text-[10px] font-medium tracking-wide",
                    isActive ? "opacity-100" : "opacity-0 scale-75"
                  )}
                  style={{ color: isActive ? `var(--color-accent-${accentColor})` : undefined }}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
