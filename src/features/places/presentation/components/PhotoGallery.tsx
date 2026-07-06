import React, { useState, useRef } from 'react';
import { Camera, Maximize2, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/database/localDatabase';
import { Photo } from '@/features/places/domain/entities/Photo';
import { v4 as uuidv4 } from 'uuid';

interface PhotoGalleryProps {
  placeUuid: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ placeUuid }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

  const photos = useLiveQuery(
    () => db.photos.where('placeUuid').equals(placeUuid).toArray(),
    [placeUuid]
  ) || [];

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          const newPhoto: Photo = {
            uuid: uuidv4(),
            placeUuid,
            filePath: base64, // Using filePath to store base64 for local dev
            isCover: photos.length === 0 && i === 0,
            createdDate: new Date(),
            version: 1,
            isDeleted: false,
          };
          await db.photos.add(newPhoto);
        }
      };
      
      reader.readAsDataURL(file);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (uuid: string) => {
    await db.photos.delete(uuid);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-main tracking-wide flex items-center gap-2">
          <Camera className="w-5 h-5 text-text-muted" /> Photos
        </h3>
        <button 
          onClick={handleAddPhoto}
          className="text-sm text-text-muted hover:text-text-main transition-colors"
        >
          + Add
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple 
          onChange={handleFileChange}
        />
      </div>

      {photos.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full deboss flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-text-muted/50" />
          </div>
          <p className="text-text-main text-sm font-medium mb-1">No photos yet</p>
          <p className="text-text-muted text-xs mb-4">Capture your favorite moments.</p>
          <button 
            onClick={handleAddPhoto}
            className="text-xs font-medium px-4 py-2 rounded-full border border-border text-text-main hover:opacity-80 transition-colors"
          >
            Upload Photos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map(photo => (
            <div 
              key={photo.uuid} 
              className="group aspect-square bg-card border border-border rounded-xl relative overflow-hidden cursor-pointer"
              onClick={() => setFullscreenPhoto(photo.filePath)}
            >
              <img 
                src={photo.filePath} 
                alt="Place" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); setFullscreenPhoto(photo.filePath); }}
                  className="p-2 rounded-full deboss text-text-main hover:opacity-80"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(photo.uuid); }}
                  className="p-2 rounded-full bg-error/20 text-error hover:bg-error/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {photo.isCover && (
                <div className="absolute top-2 left-2 bg-canvas/80 px-2 py-0.5 rounded text-[10px] font-bold text-text-main uppercase tracking-wider backdrop-blur-md border border-border">
                  Cover
                </div>
              )}
            </div>
          ))}
          <div 
            onClick={handleAddPhoto}
            className="aspect-square bg-card border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-text-muted hover:opacity-80 transition-colors cursor-pointer"
          >
            <Camera className="w-6 h-6 mb-2 opacity-50" />
            <span className="text-xs font-medium">Add Photo</span>
          </div>
        </div>
      )}

      {fullscreenPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-canvas/95 flex flex-col items-center justify-center p-4"
          onClick={() => setFullscreenPhoto(null)}
        >
          <img 
            src={fullscreenPhoto} 
            alt="Fullscreen" 
            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
          />
        </div>
      )}
    </div>
  );
};
