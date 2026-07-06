import React, { useRef, useEffect, useState } from 'react';
import GlobeGL from 'react-globe.gl';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { Place } from '@/features/home/domain/entities/Place';
import { useWindowSize } from '@/core/hooks/useWindowSize';
import { LocateFixed, ZoomIn, ZoomOut } from 'lucide-react';

interface GlobeComponentProps {
  places: Place[];
  onPinClick: (place: Place) => void;
  filteredPlaces?: Place[]; // if we want to show all but highlight filtered, or only show filtered
}

export const Globe: React.FC<GlobeComponentProps> = ({ places, onPinClick, filteredPlaces = places }) => {
  const globeEl = useRef<any>();
  const { accentColor } = useThemeStore();
  const { width, height } = useWindowSize();
  
  // Custom marker generator
  const getMarkerHtml = (place: Place) => {
    const el = document.createElement('div');
    const isFavorite = place.isFavorite;
    const color = isFavorite ? `var(--color-accent-${accentColor})` : '#ffffff';
    
    // Create a beautiful pin
    el.innerHTML = `
      <div class="cursor-pointer" style="width: 24px; height: 24px; transform: translate(-50%, -50%); position: relative;">
        <div class="animate-ping" style="position: absolute; inset: 0; border-radius: 50%; opacity: 0.2; background-color: ${color};"></div>
        <div style="position: absolute; inset: 4px; border-radius: 50%; background-color: ${color}; box-shadow: 0 0 10px rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; border-radius: 50%; background-color: #000;"></div>
        </div>
      </div>
    `;
    
    el.onclick = () => {
      onPinClick(place);
      
      // Animate camera to the pin
      if (globeEl.current) {
        globeEl.current.pointOfView({
          lat: place.latitude,
          lng: place.longitude,
          altitude: 1.5,
        }, 1000);
      }
    };
    
    return el;
  };

  useEffect(() => {
    if (globeEl.current) {
      // Configure controls
      const controls = globeEl.current.controls();
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
    }
  }, []);

  const handleZoomIn = () => {
    if (globeEl.current) {
      const currentPos = globeEl.current.pointOfView();
      globeEl.current.pointOfView({ ...currentPos, altitude: Math.max(0.1, currentPos.altitude - 0.5) }, 500);
    }
  };

  const handleZoomOut = () => {
    if (globeEl.current) {
      const currentPos = globeEl.current.pointOfView();
      globeEl.current.pointOfView({ ...currentPos, altitude: Math.min(4, currentPos.altitude + 0.5) }, 500);
    }
  };

  const handleReset = () => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000);
    }
  };

  return (
    <div className="w-full h-full cursor-move relative">
      <GlobeGL
        ref={globeEl}
        width={width}
        height={height - 64} // subtract bottom nav height roughly
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        htmlElementsData={filteredPlaces}
        htmlElement={getMarkerHtml as any}
        htmlLat="latitude"
        htmlLng="longitude"
        htmlAltitude={0.01}
        atmosphereColor={`var(--color-accent-${accentColor})`}
        atmosphereAltitude={0.15}
      />
      
      {/* Floating Controls */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-3 pointer-events-auto">
        <button 
          onClick={handleZoomIn}
          className="w-12 h-12 bg-card-surface/80 backdrop-blur-md border border-fine-border rounded-full flex items-center justify-center text-textMuted hover:text-white transition-colors shadow-lg focus:outline-none"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-12 h-12 bg-card-surface/80 backdrop-blur-md border border-fine-border rounded-full flex items-center justify-center text-textMuted hover:text-white transition-colors shadow-lg focus:outline-none"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button 
          onClick={handleReset}
          className="w-12 h-12 bg-card-surface/80 backdrop-blur-md border border-fine-border rounded-full flex items-center justify-center text-textMuted hover:text-white transition-colors shadow-lg focus:outline-none"
          aria-label="Reset View"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
