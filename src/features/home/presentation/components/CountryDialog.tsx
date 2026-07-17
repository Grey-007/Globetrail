import React, { useState, useEffect } from 'react';
import { Modal } from '@/core/components/Modal';
import { locationRepository } from '@/core/di/injection';
import { Country } from '../../domain/entities/Country';

interface CountryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  countryToEdit?: Country;
}

export const CountryDialog: React.FC<CountryDialogProps> = ({ isOpen, onClose, countryToEdit }) => {
  const [name, setName] = useState('');
  const [flag, setFlag] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(countryToEdit?.countryName || '');
      setFlag(countryToEdit?.flagEmoji || '');
      setError('');
    }
  }, [isOpen, countryToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Country name is required.');
      return;
    }
    
    if (countryToEdit) {
      const res = await locationRepository.updateCountry({
        ...countryToEdit,
        countryName: trimmedName,
        flagEmoji: flag.trim() || '🏳️',
      });
      if (res.success === false) {
        setError(res.error.message);
        return;
      }
    } else {
      const res = await locationRepository.createCountry({
        countryName: trimmedName,
        flagEmoji: flag.trim() || '🏳️',
        isoCode: trimmedName.substring(0, 2).toUpperCase(),
        continent: 'Unknown'
      });
      if (res.success === false) {
        setError(res.error.message);
        return;
      }
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={countryToEdit ? 'Edit Country' : 'Add Country'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 deboss bg-canvas text-error rounded-lg text-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Country Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-white transition-colors"
            placeholder="e.g. Japan"
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Flag Emoji (Optional)</label>
          <input
            type="text"
            value={flag}
            onChange={e => setFlag(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-white transition-colors"
            placeholder="e.g. 🇯🇵"
          />
        </div>

        <div className="pt-4 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-text-main hover:text-accent transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-medium text-text-main transition-colors focus:outline-none"
            style={{ backgroundColor: 'var(--color-active-accent)' }}
          >
            {countryToEdit ? 'Save Changes' : 'Add Country'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
