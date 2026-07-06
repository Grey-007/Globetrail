import { motion } from 'motion/react';
import { useStatisticsData } from './hooks/useStatisticsData';
import { PriorityChart, StatusChart, PlacesPerCountryChart } from './components/Charts';
import { AchievementsList } from './components/Achievements';
import { ProgressRing } from './components/ProgressRings';
import { Loader2, Globe2, MapPin, Trophy, BarChart3, TrendingUp } from 'lucide-react';
import { useThemeStore } from '@/core/theme/useThemeStore';

export default function StatisticsScreen() {
  const { data, isLoading } = useStatisticsData();

  if (isLoading || !data) {
    return (
      <div className="min-h-full pb-24 bg-canvas flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-text-muted animate-spin" />
      </div>
    );
  }

  const { overview, charts, progress, achievements, insights } = data;

  return (
    <div className="min-h-full pb-24 px-6 pt-12">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-widest text-text-main">
          INSIGHTS
        </h1>
      </header>
      
      <div className="space-y-8">
        
        {/* Progress Section */}
        <section>
          <div className="emboss rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Globe2 className="w-24 h-24" />
            </div>
            <h3 className="text-sm font-medium tracking-wide text-text-muted mb-6 uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Global Progress
            </h3>
            <div className="flex items-center justify-around">
              <ProgressRing progress={progress.worldCompletion} size={140} strokeWidth={12} label="World" />
              <div className="flex flex-col gap-4">
                <div className="deboss rounded-2xl p-4 text-center min-w-[100px]">
                  <div className="text-2xl font-serif text-text-main leading-none mb-1">{overview.visitedCountries}</div>
                  <div className="text-[9px] uppercase tracking-widest text-text-muted">Countries Visited</div>
                </div>
                <div className="deboss rounded-2xl p-4 text-center min-w-[100px]">
                  <div className="text-2xl font-serif text-text-main leading-none mb-1">{overview.totalCountries}</div>
                  <div className="text-[9px] uppercase tracking-widest text-text-muted">Countries Tracked</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="emboss rounded-3xl p-6">
            <h3 className="text-sm font-medium tracking-wide text-text-muted mb-6 uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Status
            </h3>
            {overview.totalPlaces > 0 ? (
              <StatusChart data={charts.status} />
            ) : (
              <div className="h-48 flex items-center justify-center text-text-muted text-sm deboss rounded-2xl">No places yet</div>
            )}
          </div>
          
          <div className="emboss rounded-3xl p-6">
            <h3 className="text-sm font-medium tracking-wide text-text-muted mb-6 uppercase">Priority</h3>
            {overview.totalPlaces > 0 ? (
              <PriorityChart data={charts.priority} />
            ) : (
              <div className="h-48 flex items-center justify-center text-text-muted text-sm deboss rounded-2xl">No places yet</div>
            )}
          </div>
        </section>

        <section>
          <div className="emboss rounded-3xl p-6">
            <h3 className="text-sm font-medium tracking-wide text-text-muted mb-6 uppercase">Top Countries</h3>
            <PlacesPerCountryChart data={charts.placesPerCountry} />
          </div>
        </section>
        
        {/* Insights Snippets */}
        {insights.mostSavedCountry.count > 0 && (
          <section>
             <div className="emboss rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full deboss flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-widest font-medium mb-1">Most Saved Country</div>
                  <div className="text-text-main font-medium">{insights.mostSavedCountry.name} <span className="text-text-muted text-sm font-normal">({insights.mostSavedCountry.count} places)</span></div>
                </div>
             </div>
          </section>
        )}

        {/* Achievements */}
        <section>
          <h3 className="text-sm font-medium tracking-wide text-text-muted mb-4 uppercase flex items-center gap-2 px-2">
            <Trophy className="w-4 h-4" /> Achievements
          </h3>
          <AchievementsList achievements={achievements} />
        </section>

      </div>
    </div>
  );
}

