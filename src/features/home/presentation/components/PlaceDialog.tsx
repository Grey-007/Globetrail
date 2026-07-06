import React, { useState, useEffect } from 'react';
import { Modal } from '@/core/components/Modal';
import { locationRepository } from '@/core/di/injection';
import { Place, Priority, PlaceStatus } from '../../domain/entities/Place';
import { CountryViewModel } from '../hooks/useHomeData';

interface PlaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  placeToEdit?: Place;
  countries: CountryViewModel[];
  defaultCountryId?: string;
}

export const PlaceDialog: React.FC<PlaceDialogProps> = ({ isOpen, onClose, placeToEdit, countries, defaultCountryId }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('City');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<PlaceStatus>('wishlist');
  const [countryId, setCountryId] = useState('');
  const [notes, setNotes] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(placeToEdit?.name || '');
      setCategory(placeToEdit?.category || 'City');
      setPriority(placeToEdit?.priority || 'medium');
      setStatus(placeToEdit?.status || 'wishlist');
      setCountryId(placeToEdit?.countryUuid || defaultCountryId || (countries.length > 0 ? countries[0].id : ''));
      setNotes(placeToEdit?.notes || '');
      setLatitude(placeToEdit?.latitude ? placeToEdit.latitude.toString() : '');
      setLongitude(placeToEdit?.longitude ? placeToEdit.longitude.toString() : '');
      setError('');
    }
  }, [isOpen, placeToEdit, defaultCountryId, countries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Place name is required.');
      return;
    }
    if (!countryId) {
      setError('Please select a country.');
      return;
    }
    
    const lat = parseFloat(latitude) || 0;
    const lng = parseFloat(longitude) || 0;

    if (placeToEdit) {
      const res = await locationRepository.updatePlace({
        ...placeToEdit,
        name: trimmedName,
        category,
        priority,
        status,
        countryUuid: countryId,
        notes: notes.trim(),
        latitude: lat,
        longitude: lng,
      });
      if (res.success === false) {
        setError(res.error.message);
        return;
      }
    } else {
      const res = await locationRepository.createPlace({
        name: trimmedName,
        category,
        priority,
        status,
        countryUuid: countryId,
        notes: notes.trim(),
        isFavorite: false,
        latitude: lat,
        longitude: lng,
        description: '',
      });
      if (res.success === false) {
        setError(res.error.message);
        return;
      }
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={placeToEdit ? 'Edit Place' : 'Add Place'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-error/10 text-error rounded-lg text-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Place Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-card-surface border border-fine-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="e.g. Kyoto"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Country</label>
          <select
            value={countryId}
            onChange={e => setCountryId(e.target.value)}
            className="w-full bg-card-surface border border-fine-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
          >
            {countries.map(c => (
              <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-card-surface border border-fine-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
            >
              <option value="City">City</option>
              <option value="Nature">Nature</option>
              <option value="Culture">Culture</option>
              <option value="Food">Food</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as PlaceStatus)}
              className="w-full bg-card-surface border border-fine-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
            >
              <option value="wishlist">Wishlist</option>
              <option value="visited">Visited</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Priority</label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as Priority[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${priority === p ? 'border-white text-white bg-white/10' : 'border-fine-border text-textMuted hover:bg-white/5'} transition-colors capitalize`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              className="w-full bg-card-surface border border-fine-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              placeholder="e.g. 35.0116"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              className="w-full bg-card-surface border border-fine-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              placeholder="e.g. 135.7681"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-card-surface border border-fine-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors min-h-[80px] resize-none"
            placeholder="Add any specific notes or ideas..."
          />
        </div>

        <div className="pt-4 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-white hover:bg-white/5 transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-medium text-white transition-colors focus:outline-none"
            style={{ backgroundColor: 'var(--color-active-accent)' }}
          >
            {placeToEdit ? 'Save Changes' : 'Add Place'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
