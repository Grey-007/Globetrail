import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Globe2, Plus } from 'lucide-react';
import { useHomeData, CountryViewModel, PlaceViewModel } from './hooks/useHomeData';
import { CountryAccordion } from './components/CountryAccordion';
import { CountryDialog } from './components/CountryDialog';
import { PlaceDialog } from './components/PlaceDialog';
import { ConfirmDialog } from '@/core/components/ConfirmDialog';
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
      <header className="sticky top-0 z-10 bg-canvas-black/80 backdrop-blur-md border-b border-fine-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe2 className="w-6 h-6" style={{ color: 'var(--color-active-accent)' }} />
          <span className="font-display font-semibold tracking-tight text-lg text-white">GlobeTrail</span>
        </div>
        <div className="flex items-center gap-3 text-textMuted">
          <button className="p-2 hover:text-white transition-colors focus:outline-none">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:text-white transition-colors focus:outline-none">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

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
            <div className="text-center text-textMuted py-8">Loading data...</div>
          ) : countries.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-fine-border rounded-2xl">
              <p className="text-textMuted mb-4">You haven't added any countries yet.</p>
              <button
                onClick={handleAddCountry}
                className="px-6 py-3 rounded-full font-medium text-white transition-transform active:scale-95 focus:outline-none"
                style={{ backgroundColor: 'var(--color-active-accent)' }}
              >
                Add Your First Country
              </button>
            </div>
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
        <motion.button 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
          onClick={() => handleAddPlace()}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform z-20 focus:outline-none"
          style={{ backgroundColor: 'var(--color-active-accent)' }}
          aria-label="Add Place"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
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
