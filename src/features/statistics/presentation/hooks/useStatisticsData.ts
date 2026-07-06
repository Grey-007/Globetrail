import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/database/localDatabase';
import { useMemo } from 'react';

export function useStatisticsData() {
  const data = useLiveQuery(async () => {
    const countries = await db.countries.toArray();
    const places = await db.places.toArray();

    const countryMap = new Map();
    countries.forEach(c => countryMap.set(c.uuid, c));

    // Basic Metrics
    const totalCountries = countries.length;
    const totalPlaces = places.length;
    
    let visitedPlaces = 0;
    let wishlistPlaces = 0;
    let favoritePlaces = 0;

    // Charts Data
    const placesPerCountryMap = new Map<string, number>();
    const priorityDistribution = { high: 0, medium: 0, low: 0 };
    const statusDistribution = { visited: 0, planning: 0, booked: 0, archived: 0 };
    
    // Insights
    let mostSavedCountry = { name: 'None', count: 0 };

    places.forEach(p => {
      if (p.status === 'visited') visitedPlaces++;
      if (p.status === 'planning') wishlistPlaces++;
      if (p.isFavorite) favoritePlaces++;

      if (p.priority in priorityDistribution) {
        priorityDistribution[p.priority as keyof typeof priorityDistribution]++;
      }
      
      if (p.status in statusDistribution) {
        statusDistribution[p.status as keyof typeof statusDistribution]++;
      }

      const count = (placesPerCountryMap.get(p.countryUuid) || 0) + 1;
      placesPerCountryMap.set(p.countryUuid, count);
      
      if (count > mostSavedCountry.count) {
        const c = countryMap.get(p.countryUuid);
        if (c) {
          mostSavedCountry = { name: c.countryName, count };
        }
      }
    });

    const placesPerCountry = Array.from(placesPerCountryMap.entries())
      .map(([uuid, count]) => ({
        name: countryMap.get(uuid)?.countryName || 'Unknown',
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5

    // Progress
    const worldCompletion = (totalCountries / 195) * 100;
    const visitedCountriesSet = new Set(places.filter(p => p.status === 'visited').map(p => p.countryUuid));
    
    // Achievements
    const achievements = [
      { id: 'first_place', title: 'First Place Saved', unlocked: totalPlaces > 0 },
      { id: 'first_country', title: 'First Country Completed', unlocked: visitedCountriesSet.size > 0 },
      { id: 'ten_favorites', title: '10 Favorites', unlocked: favoritePlaces >= 10 },
      { id: 'hundred_places', title: '100 Places Saved', unlocked: totalPlaces >= 100 },
    ];

    return {
      overview: {
        totalCountries,
        totalPlaces,
        visitedPlaces,
        wishlistPlaces,
        favorites: favoritePlaces,
        visitedCountries: visitedCountriesSet.size
      },
      charts: {
        placesPerCountry,
        priority: [
          { name: 'High', value: priorityDistribution.high },
          { name: 'Medium', value: priorityDistribution.medium },
          { name: 'Low', value: priorityDistribution.low },
        ],
        status: [
          { name: 'Visited', value: statusDistribution.visited },
          { name: 'Planning', value: statusDistribution.planning },
          { name: 'Booked', value: statusDistribution.booked },
        ]
      },
      progress: {
        worldCompletion,
      },
      achievements,
      insights: {
        mostSavedCountry
      }
    };
  });

  return { data, isLoading: data === undefined };
}
