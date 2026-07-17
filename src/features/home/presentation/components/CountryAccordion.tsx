import React, { useState } from 'react';
import { ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import type { CountryViewModel, PlaceViewModel } from '../hooks/useHomeData';
import { PlaceCard } from './PlaceCard';

export const CountryAccordion: React.FC<{
  country: CountryViewModel;
  onAddPlace: (countryId: string) => void;
  onEditCountry: (country: CountryViewModel) => void;
  onDeleteCountry: (country: CountryViewModel) => void;
  onEditPlace: (place: PlaceViewModel) => void;
  onDeletePlace: (place: PlaceViewModel) => void;
}> = ({ country, onAddPlace, onEditCountry, onDeleteCountry, onEditPlace, onDeletePlace }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden mb-4 group/accordion">
      <div className="flex items-center justify-between p-4 relative">
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="absolute inset-0 w-full h-full text-left focus:outline-none"
          aria-expanded={isExpanded}
        />
        <div className="flex items-center gap-3 z-10 pointer-events-none">
          <span className="text-2xl" aria-hidden="true">{country.flag}</span>
          <span className="font-semibold text-lg text-text-main tracking-wide">{country.name}</span>
        </div>
        <div className="flex items-center gap-3 z-10">
          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover/accordion:opacity-100 transition-opacity">
            <button
              onClick={() => onEditCountry(country)}
              className="p-2 text-text-muted hover:text-text-main transition-colors focus:outline-none"
              aria-label="Edit country"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteCountry(country)}
              className="p-2 text-text-muted hover:text-error transition-colors focus:outline-none"
              aria-label="Delete country"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <span className="text-text-muted font-mono text-sm pointer-events-none">
            {country.places.length} {country.places.length === 1 ? 'place' : 'places'}
          </span>
          <button
            onClick={() => onAddPlace(country.id)}
            className="p-1 rounded-full deboss text-text-main hover:text-accent transition-colors focus:outline-none ml-2"
            aria-label={`Add place to ${country.name}`}
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="pointer-events-none ml-1">
            <ChevronDown 
              className={cn(
                "w-5 h-5 text-text-muted transition-transform duration-300", 
                isExpanded && "rotate-180"
              )} 
            />
          </div>
        </div>
      </div>
      
      <div 
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 flex flex-col gap-3">
            {country.places.map(place => (
              <PlaceCard 
                key={place.id} 
                place={place} 
                onEdit={onEditPlace} 
                onDelete={onDeletePlace} 
              />
            ))}
            {country.places.length === 0 && (
              <div className="text-center py-6 text-sm text-text-muted border border-dashed border-border rounded-xl">
                No places added yet.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
