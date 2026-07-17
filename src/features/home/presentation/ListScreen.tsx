import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, ArrowLeft, MapPin } from 'lucide-react';

import { AppBar, FAB, FilterChip, EmptyState, LoadingIndicator } from '@/core/components';
import { useHomeData } from './hooks/useHomeData';
import { locationRepository } from '@/core/di/injection';
import { CountryAccordion } from './components/CountryAccordion';
import { CountryDialog } from './components/CountryDialog';
import { PlaceDialog } from './components/PlaceDialog';
import type { Place } from '../domain/entities/Place';
import type { Country } from '../domain/entities/Country';

type FilterType = 'all' | 'visited' | 'planning' | 'favorites';

export default function ListScreen() {
  const navigate = useNavigate();
  const { data: countries, isLoading } = useHomeData();
  
  const [filterType, setFilterType] = useState<FilterType>('all');
  
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
  
  const [editingCountry, setEditingCountry] = useState<Country | undefined>(undefined);
  const [editingPlace, setEditingPlace] = useState<Place | undefined>(undefined);
  const [defaultCountryId, setDefaultCountryId] = useState<string | undefined>(undefined);

  // Filter countries based on places
  const filteredCountries = useMemo(() => {
    return countries.map(country => {
      const filteredPlaces = country.places.filter(place => {
        if (filterType === 'visited') return place.status === 'visited';
        if (filterType === 'planning') return place.status === 'planning';
        if (filterType === 'favorites') return place.isFavorite;
        return true;
      });
      return { ...country, places: filteredPlaces };
    }).filter(country => filterType === 'all' || country.places.length > 0);
  }, [countries, filterType]);

  const handleAddCountry = () => {
    setEditingCountry(undefined);
    setIsCountryDialogOpen(true);
  };

  const handleEditCountry = (countryView: any) => {
    setEditingCountry(countryView.raw);
    setIsCountryDialogOpen(true);
  };

  const handleDeleteCountry = async (countryView: any) => {
    await locationRepository.deleteCountry(countryView.id);
  };

  const handleAddPlace = (countryId: string) => {
    setDefaultCountryId(countryId);
    setEditingPlace(undefined);
    setIsPlaceDialogOpen(true);
  };

  const handleEditPlace = (placeView: any) => {
    setEditingPlace(placeView.raw);
    setIsPlaceDialogOpen(true);
  };

  const handleDeletePlace = async (placeView: any) => {
    await locationRepository.deletePlace(placeView.id);
  };

  return (
    <div className="min-h-full pb-28 pt-4 px-6 bg-canvas">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full text-text-muted hover:text-text-main transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-serif text-3xl font-bold tracking-widest text-text-main">
          ALL PLACES
        </h1>
      </header>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 -mx-6 px-6">
        <FilterChip 
          label="All" 
          selected={filterType === 'all'} 
          onClick={() => setFilterType('all')} 
          icon={<Filter className="w-4 h-4" />}
        />
        <FilterChip 
          label="Visited" 
          selected={filterType === 'visited'} 
          onClick={() => setFilterType('visited')} 
        />
        <FilterChip 
          label="Planning" 
          selected={filterType === 'planning'} 
          onClick={() => setFilterType('planning')} 
        />
        <FilterChip 
          label="Favorites" 
          selected={filterType === 'favorites'} 
          onClick={() => setFilterType('favorites')} 
        />
      </div>

      {/* Country List */}
      <section 
        className="space-y-4"
      >
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <LoadingIndicator />
          </div>
        ) : filteredCountries.length === 0 ? (
          <div className="mt-8">
            <EmptyState 
              icon={<MapPin className="w-8 h-8" />}
              title={filterType === 'all' ? 'No Destinations Yet' : 'No Places Found'}
              description={filterType === 'all' 
                ? 'Start your journey by adding a country and places you want to visit.' 
                : 'Try changing your filters to see more places.'}
            />
          </div>
        ) : (
          filteredCountries.map(country => (
            <CountryAccordion 
              key={country.id} 
              country={country} 
              onAddPlace={() => handleAddPlace(country.id)}
              onEditCountry={handleEditCountry}
              onDeleteCountry={handleDeleteCountry}
              onEditPlace={handleEditPlace}
              onDeletePlace={handleDeletePlace}
            />
          ))
        )}
      </section>

      {/* Floating Action Button */}
      <FAB 
        icon={<Plus className="w-6 h-6" />} 
        onClick={handleAddCountry}
        aria-label="Add Country"
      />

      {/* Dialogs */}
      <CountryDialog 
        isOpen={isCountryDialogOpen}
        onClose={() => setIsCountryDialogOpen(false)}
        countryToEdit={editingCountry}
      />

      <PlaceDialog
        isOpen={isPlaceDialogOpen}
        onClose={() => setIsPlaceDialogOpen(false)}
        countries={countries}
        defaultCountryId={defaultCountryId}
        placeToEdit={editingPlace}
      />
    </div>
  );
}
