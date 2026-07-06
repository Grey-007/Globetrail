import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Edit3, Trash2, Heart, Share, MapPin, Calendar, Clock, Map, AlignLeft, Camera, Paperclip } from 'lucide-react';
import { usePlaceDetails } from './hooks/usePlaceDetails';
import { locationRepository } from '@/core/di/injection';
import { ConfirmDialog, AppBar, StatusChip } from '@/core/components';
import { PlaceDialog } from '@/features/home/presentation/components/PlaceDialog';
import { cn } from '@/core/utils/cn';
import { useHomeData } from '@/features/home/presentation/hooks/useHomeData';

import { TravelJournalEditor } from './components/TravelJournalEditor';
import { PhotoGallery } from './components/PhotoGallery';

export default function PlaceDetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { place, country, isLoading } = usePlaceDetails(id);
  const { data: countries } = useHomeData();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas-black text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center text-textMuted">Loading...</div>
      </div>
    );
  }

  if (!place || !country) {
    return (
      <div className="min-h-screen bg-canvas-black text-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-textMuted">
          <p>Place not found.</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    const res = await locationRepository.deletePlace(place.uuid);
    if (res.success !== false) {
      navigate(-1);
    } else {
      alert(res.error.message);
    }
  };

  const toggleFavorite = async () => {
    await locationRepository.updatePlace({
      ...place,
      isFavorite: !place.isFavorite
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const getPriorityColor = () => {
    switch (place.priority) {
      case 'high': return 'bg-error text-error';
      case 'medium': return 'bg-warning text-warning';
      case 'low': return 'bg-accent-steel text-accent-steel';
      default: return 'bg-transparent';
    }
  };

  return (
    <div className="min-h-screen bg-canvas-black text-white flex flex-col overflow-x-hidden">
      {/* App Bar */}
      <AppBar 
        title=""
        leading={
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full text-textMuted hover:text-white transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        }
        trailing={
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleFavorite} 
              className="p-2 rounded-full text-textMuted hover:text-white transition-colors focus:outline-none"
            >
              <Heart 
                className={cn("w-5 h-5 transition-transform active:scale-90", place.isFavorite && "fill-current")} 
                style={{ color: place.isFavorite ? 'var(--color-active-accent)' : undefined }}
              />
            </button>
            <button 
              onClick={() => {}} 
              className="p-2 rounded-full text-textMuted hover:text-white transition-colors focus:outline-none"
            >
              <Share className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsEditOpen(true)} 
              className="p-2 rounded-full text-textMuted hover:text-white transition-colors focus:outline-none"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <main className="flex-1 p-4 pb-24 max-w-2xl mx-auto w-full space-y-8">
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">{country.flagEmoji}</span>
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-white mb-1">
                {place.name}
              </h1>
              <div className="text-textMuted flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{country.countryName}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <StatusChip 
              status={place.status} 
              variant={place.status as any} 
            />
            <StatusChip 
              status={place.category} 
              variant="neutral" 
            />
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-white/5 border-white/10",
            )}>
              <div className={cn("w-2 h-2 rounded-full", getPriorityColor().split(' ')[0])} />
              <span className="text-[10px] font-bold tracking-wider uppercase text-textMuted">
                {place.priority} Priority
              </span>
            </div>
          </div>
        </motion.section>

        {/* Overview Section */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card-surface border border-fine-border rounded-2xl p-5 space-y-6"
        >
          <div>
             <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
               Tags
             </h3>
             <div className="flex flex-wrap gap-2">
               <button className="text-xs px-3 py-1 rounded-full border border-dashed border-fine-border text-textMuted hover:text-white transition-colors">
                 + Add Tag
               </button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-fine-border/50">
            <div>
              <span className="text-xs text-textMuted flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Added
              </span>
              <p className="text-sm font-medium">{formatDate(place.createdDate)}</p>
            </div>
            <div>
              <span className="text-xs text-textMuted flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5" /> Last Edited
              </span>
              <p className="text-sm font-medium">{formatDate(place.updatedDate)}</p>
            </div>
            {place.visitDate && (
              <div>
                <span className="text-xs text-textMuted flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5" /> Visited
                </span>
                <p className="text-sm font-medium">{formatDate(place.visitDate)}</p>
              </div>
            )}
            {place.futureTripDate && (
              <div>
                <span className="text-xs text-textMuted flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5" /> Future Trip
                </span>
                <p className="text-sm font-medium">{formatDate(place.futureTripDate)}</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Photos */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PhotoGallery placeUuid={place.uuid} />
        </motion.section>

        {/* Travel Journal */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-textMuted" /> Travel Journal
            </h3>
          </div>
          
          <TravelJournalEditor place={place} />
        </motion.section>

        {/* Location / Map Placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <Map className="w-5 h-5 text-textMuted" /> Location
            </h3>
          </div>
          <div className="h-48 bg-card-surface border border-fine-border rounded-xl flex flex-col items-center justify-center text-textMuted relative overflow-hidden group">
            <Map className="w-8 h-8 mb-3 opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <span className="text-sm font-medium z-10 relative">Map Integration Coming Soon</span>
            
            {/* Coordinates if available */}
            {(place.latitude !== 0 || place.longitude !== 0) && (
              <div className="absolute bottom-3 left-4 text-xs font-mono opacity-60">
                {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
          </div>
        </motion.section>

        {/* Attachments Placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-textMuted" /> Attachments
            </h3>
            <button className="text-sm text-textMuted hover:text-white transition-colors">
              + Add
            </button>
          </div>
          <div className="bg-card-surface border border-dashed border-fine-border rounded-xl p-6 text-center">
            <p className="text-textMuted text-sm mb-2">No documents attached.</p>
            <p className="text-textMuted/60 text-xs">PDFs, tickets, and bookings coming soon.</p>
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-8"
        >
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="w-full py-4 rounded-xl border border-error/20 bg-error/5 text-error font-medium hover:bg-error/10 hover:border-error/30 transition-colors focus:outline-none flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete Place
          </button>
        </motion.section>

      </main>

      <PlaceDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        placeToEdit={place}
        countries={countries}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Delete Place"
        message={`Are you sure you want to delete ${place.name}? This cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
