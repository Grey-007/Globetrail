import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Globe2, MapPin, Heart, Briefcase, ChevronRight, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHomeData, CountryViewModel, PlaceViewModel } from './hooks/useHomeData';
import { useStatisticsData } from '@/features/statistics/presentation/hooks/useStatisticsData';
import { useThemeStore } from '@/core/theme/useThemeStore';

export default function HomeScreen() {
  const { data: countries, isLoading: isHomeLoading } = useHomeData();
  const { data: statsData, isLoading: isStatsLoading } = useStatisticsData();
  const navigate = useNavigate();

  if (isHomeLoading || isStatsLoading || !statsData) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center text-text-muted">Loading...</div>;
  }

  const { overview } = statsData;

  // Find some recent places (we'll just take the first few for now)
  const allPlaces = countries.flatMap(c => c.places);
  const recentPlaces = [...allPlaces].sort((a, b) => b.raw.updatedDate.getTime() - a.raw.updatedDate.getTime()).slice(0, 3);
  
  // Find an upcoming plan
  const upcomingPlaces = allPlaces.filter(p => p.raw.futureTripDate && p.status === 'planning')
    .sort((a, b) => (a.raw.futureTripDate?.getTime() || 0) - (b.raw.futureTripDate?.getTime() || 0));
  const nextTrip = upcomingPlaces[0];

  return (
    <div className="min-h-full pb-28 pt-12 px-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-widest text-text-main flex items-center gap-1">
            G L O B E <Globe2 className="w-5 h-5 mx-0.5 text-accent" /> R A I L
          </h1>
          <p className="text-text-muted text-sm mt-1">Your World, Your Journey</p>
        </div>
        <button className="w-12 h-12 rounded-full emboss flex items-center justify-center text-text-main active:scale-95 transition-transform" onClick={() => navigate('/settings')}>
          <Settings2 className="w-5 h-5" />
        </button>
      </header>

      {/* Search Bar */}
      <div 
        className="deboss rounded-full flex items-center px-5 py-4 mb-10 cursor-text"
        onClick={() => navigate('/search')}
      >
        <Search className="w-5 h-5 text-text-muted mr-3" />
        <span className="text-text-muted text-sm flex-1">Search countries, places...</span>
        <SlidersHorizontal className="w-5 h-5 text-text-main" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-3 mb-10">
        <MetricCard icon={<Globe2 className="w-6 h-6 text-[#5b7a54]" />} title="COUNTRIES" value={overview.totalCountries} subtitle="of 195" />
        <MetricCard icon={<MapPin className="w-6 h-6 text-[#c76d47]" />} title="PLACES" value={overview.totalPlaces} subtitle="Saved" />
        <MetricCard icon={<Heart className="w-6 h-6 text-[#a83232] fill-current" />} title="FAVORITES" value={overview.favorites} subtitle="Places" />
        <MetricCard icon={<Briefcase className="w-6 h-6 text-[#4a6b8c] fill-current" />} title="VISITED" value={overview.visitedPlaces} subtitle="Places" />
      </div>

      {/* Map Card */}
      <div 
        className="emboss rounded-3xl p-5 mb-10 relative overflow-hidden cursor-pointer group"
        onClick={() => navigate('/globe')}
      >
        <div className="w-full h-48 rounded-xl deboss mb-4 relative overflow-hidden bg-black/10 dark:deboss">
          <div className="absolute inset-0 opacity-40 bg-[url('https://unpkg.com/three-globe/example/img/earth-topology.png')] bg-cover bg-center mix-blend-overlay"></div>
          {/* Simple pins */}
          <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
          <div className="absolute top-1/4 right-1/3 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
          {/* Compass Graphic Placeholder */}
          <div className="absolute bottom-2 left-2 w-16 h-16 rounded-full emboss flex items-center justify-center border-2 border-accent/20 bg-card">
            <div className="w-2 h-12 bg-accent rotate-45 rounded-full relative">
              <div className="absolute top-0 w-full h-1/2 bg-red-500/80 rounded-t-full"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-main font-medium">The world is your playground.</p>
            <p className="text-text-muted text-sm">Keep exploring, keep discovering.</p>
          </div>
          <button className="w-10 h-10 rounded-full emboss flex items-center justify-center group-hover:scale-105 transition-transform">
            <ChevronRight className="w-5 h-5 text-text-main" />
          </button>
        </div>
      </div>

      {/* Recent Places */}
      {recentPlaces.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-text-main font-medium text-sm tracking-wider uppercase">Recent Places</h2>
            <button className="text-text-main text-sm">View All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
            {recentPlaces.map(place => (
              <div key={place.id} className="min-w-[160px] w-[160px] emboss rounded-2xl p-2 shrink-0 cursor-pointer" onClick={() => navigate(`/place/${place.id}`)}>
                <div className="w-full h-32 rounded-xl deboss mb-3 overflow-hidden relative bg-black/10 dark:deboss">
                   <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 backdrop-blur-md">
                     <Heart className={`w-4 h-4 ${place.isFavorite ? 'fill-white text-text-main' : 'text-text-main/80'}`} />
                   </div>
                </div>
                <div className="px-2 pb-2">
                  <h3 className="text-text-main font-semibold truncate">{place.name}</h3>
                  <p className="text-text-muted text-xs truncate mb-2">{countries.find(c => c.id === place.countryId)?.name}</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${place.status === 'visited' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                    <span className="text-text-main text-xs capitalize">{place.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Plans */}
      {nextTrip && (
        <div className="mb-10">
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-text-main font-medium text-sm tracking-wider uppercase">Upcoming Plans</h2>
            <button className="text-text-main text-sm">View All</button>
          </div>
          <div className="emboss rounded-3xl p-4 flex items-center relative overflow-hidden" onClick={() => navigate(`/place/${nextTrip.id}`)}>
            <div className="deboss rounded-2xl p-3 flex flex-col items-center justify-center w-20 shrink-0 border-r border-dashed border-border mr-4">
              <span className="text-accent text-xs font-bold tracking-widest uppercase">{nextTrip.raw.futureTripDate?.toLocaleString('default', { month: 'short' })}</span>
              <span className="text-text-main text-2xl font-serif">{nextTrip.raw.futureTripDate?.getDate()}</span>
              <span className="text-text-muted text-xs">{nextTrip.raw.futureTripDate?.getFullYear()}</span>
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-text-main font-semibold truncate">{nextTrip.name} Trip</h3>
              <p className="text-text-muted text-xs truncate mb-2">{countries.find(c => c.id === nextTrip.countryId)?.name}</p>
              <div className="flex items-center text-text-muted text-xs gap-1">
                <span>👥 2</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-xl deboss bg-black/10 shrink-0"></div>
            {/* Buckle graphic */}
            <div className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center border-l border-border bg-black/5">
               <div className="w-4 h-6 border-2 border-accent rounded-sm"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, title, value, subtitle }: { icon: React.ReactNode, title: string, value: number, subtitle: string }) {
  return (
    <div className="emboss rounded-2xl p-3 flex flex-col items-center justify-center text-center">
      <div className="mb-2">{icon}</div>
      <div className="text-[9px] font-bold text-text-main tracking-widest mb-1 w-full truncate">{title}</div>
      <div className="text-2xl font-serif text-text-main leading-none mb-1">{value}</div>
      <div className="text-[9px] text-text-muted">{subtitle}</div>
    </div>
  );
}

