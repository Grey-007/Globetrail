import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Mountain, Landmark, Building, Map, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import type { PlaceViewModel } from '../hooks/useHomeData';
import { locationRepository } from '@/core/di/injection';

export const PlaceCard: React.FC<{
  place: PlaceViewModel;
  onEdit: (place: PlaceViewModel) => void;
  onDelete: (place: PlaceViewModel) => void;
}> = ({ place, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  const getCategoryIcon = () => {
    switch (place.category.toLowerCase()) {
      case 'nature': return <Mountain className="w-5 h-5" />;
      case 'culture': return <Landmark className="w-5 h-5" />;
      case 'city': return <Building className="w-5 h-5" />;
      case 'food': return <MapPin className="w-5 h-5" />;
      default: return <Map className="w-5 h-5" />;
    }
  };

  const getPriorityColor = () => {
    switch (place.priority) {
      case 'high': return 'bg-error';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-accent-steel';
      default: return 'bg-transparent';
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await locationRepository.updatePlace({
      ...place.raw,
      isFavorite: !place.isFavorite
    });
  };

  const toggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await locationRepository.updatePlace({
      ...place.raw,
      status: place.status === 'visited' ? 'planning' : 'visited'
    });
  };

  return (
    <div 
      onClick={() => navigate(`/place/${place.id}`)}
      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-canvas relative overflow-hidden transition-colors hover:opacity-80 group cursor-pointer"
    >
      {/* Priority Indicator */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", getPriorityColor())} />
      
      {/* Thumbnail / Icon */}
      <div className="w-12 h-12 rounded-lg bg-fine-border/50 flex items-center justify-center shrink-0 text-text-muted">
        {getCategoryIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-text-main truncate">{place.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <button 
            onClick={toggleStatus}
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide uppercase transition-colors focus:outline-none",
              place.status === 'visited' 
                ? 'bg-success/20 text-success hover:bg-success/30' 
                : 'bg-fine-border text-text-muted hover:opacity-80'
            )}
          >
            {place.status}
          </button>
          <span className="text-xs text-text-muted flex items-center gap-1">
            {place.category}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(place); }}
          className="p-2 text-text-muted hover:text-text-main transition-colors focus:outline-none"
          aria-label="Edit place"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(place); }}
          className="p-2 text-text-muted hover:text-error transition-colors focus:outline-none"
          aria-label="Delete place"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <button 
        onClick={toggleFavorite}
        className="p-2 -mr-1 text-text-muted transition-colors focus:outline-none"
        aria-label={place.isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-transform active:scale-90", 
            place.isFavorite && "fill-current"
          )} 
          style={{ color: place.isFavorite ? 'var(--color-active-accent)' : undefined }}
        />
      </button>
    </div>
  );
};
