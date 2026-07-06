import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Globe2, Plus, MapPin } from 'lucide-react';
import { useHomeData, CountryViewModel, PlaceViewModel } from './hooks/useHomeData';
import { CountryAccordion } from './components/CountryAccordion';
import { CountryDialog } from './components/CountryDialog';
import { PlaceDialog } from './components/PlaceDialog';
import { ConfirmDialog, AppBar, EmptyState, LoadingIndicator, FAB } from '@/core/components';
import { locationRepository } from '@/core/di/injection';

export default function HomeScreen() {
  const { data: countries, isLoading } = useHomeData();
  
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  const [countryToEdit, setCountryToEdit] = useState<CountryViewModel | undefined>(undefined);
  
  const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState<PlaceViewModel | undefined>(undefined);
  const [defaultCountryId, setDefaultCountryId] = useState<string | undefined>(undefined);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ title: '', message: '', onConfirm: () => {} });

  const handleAddCountry = () => {
    setCountryToEdit(undefined);
    setIsCountryDialogOpen(true);
  };

  const handleEditCountry = (country: CountryViewModel) => {
    setCountryToEdit(country);
    setIsCountryDialogOpen(true);
  };

  const handleDeleteCountry = (country: CountryViewModel) => {
    setConfirmConfig({
      title: 'Delete Country',
      message: `Are you sure you want to delete ${country.name}? This cannot be undone.`,
      onConfirm: async () => {
        const res = await locationRepository.deleteCountry(country.id);
        if (res.success === false) {
          alert(res.error.message);
        }
      }
    });
    setIsConfirmOpen(true);
  };

  const handleAddPlace = (countryId?: string) => {
    setPlaceToEdit(undefined);
    setDefaultCountryId(countryId);
    setIsPlaceDialogOpen(true);
  };

  const handleEditPlace = (place: PlaceViewModel) => {
    setPlaceToEdit(place);
    setDefaultCountryId(undefined);
    setIsPlaceDialogOpen(true);
  };

  const handleDeletePlace = (place: PlaceViewModel) => {
    setConfirmConfig({
      title: 'Delete Place',
      message: `Are you sure you want to delete ${place.name}? This cannot be undone.`,
      onConfirm: async () => {
        const res = await locationRepository.deletePlace(place.id);
        if (res.success === false) {
          alert(res.error.message);
        }
      }
    });
    setIsConfirmOpen(true);
  };

  return (
    <div className="min-h-full pb-24">
      {/* App Bar */}
      <AppBar
        title="GlobeTrail"
        leading={<Globe2 className="w-6 h-6 text-active-accent" style={{ color: 'var(--color-active-accent)' }} />}
        trailing={
          <div className="flex items-center gap-1 text-textMuted">
            <button className="p-2 hover:text-white transition-colors focus:outline-none">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:text-white transition-colors focus:outline-none">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        }
      />

      {/* Main Content */}
      <main className="p-4 md:p-6 max-w-2xl mx-auto">
        {/* Greeting Section */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 mt-4"
        >
          <div className="flex justify-between items-end mb-2">
            <h1 className="font-display text-3xl font-medium tracking-tight text-white">
              Your Travel Journal
            </h1>
            <button
              onClick={handleAddCountry}
              className="text-sm font-medium hover:text-white transition-colors focus:outline-none"
              style={{ color: 'var(--color-active-accent)' }}
            >
              + Country
            </button>
          </div>
          <p className="text-textMuted">
            Collect places you want to visit.
          </p>
        </motion.section>

        {/* Country List */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="py-12">
              <LoadingIndicator message="Loading your journal..." />
            </div>
          ) : countries.length === 0 ? (
            <EmptyState
              icon={<MapPin className="w-8 h-8" />}
              title="No Countries Yet"
              description="Start building your travel journal by adding the first country you want to visit."
              action={
                <button
                  onClick={handleAddCountry}
                  className="px-6 py-3 rounded-full font-medium text-canvas-black transition-transform active:scale-95 focus:outline-none"
                  style={{ backgroundColor: 'var(--color-active-accent)' }}
                >
                  Add Your First Country
                </button>
              }
            />
          ) : (
            countries.map(country => (
              <CountryAccordion 
                key={country.id} 
                country={country} 
                onAddPlace={handleAddPlace}
                onEditCountry={handleEditCountry}
                onDeleteCountry={handleDeleteCountry}
                onEditPlace={handleEditPlace}
                onDeletePlace={handleDeletePlace}
              />
            ))
          )}
        </motion.section>
      </main>

      {/* Floating Action Button */}
      {countries.length > 0 && (
        <FAB
          icon={<Plus className="w-6 h-6" />}
          onClick={() => handleAddPlace()}
          aria-label="Add Place"
        />
      )}

      {/* Dialogs */}
      <CountryDialog 
        isOpen={isCountryDialogOpen} 
        onClose={() => setIsCountryDialogOpen(false)} 
        countryToEdit={countryToEdit?.raw} 
      />
      
      <PlaceDialog
        isOpen={isPlaceDialogOpen}
        onClose={() => setIsPlaceDialogOpen(false)}
        placeToEdit={placeToEdit?.raw}
        countries={countries}
        defaultCountryId={defaultCountryId}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
