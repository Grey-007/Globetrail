import React, { useRef, useEffect, useState } from 'react';
import GlobeGL from 'react-globe.gl';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { Place } from '@/features/home/domain/entities/Place';
import { GlobePlace } from '../hooks/useGlobeData';
import { useWindowSize } from '@/core/hooks/useWindowSize';
import { LocateFixed, ZoomIn, ZoomOut } from 'lucide-react';

interface GlobeComponentProps {
  places: GlobePlace[];
  onPinClick: (place: GlobePlace) => void;
  filteredPlaces?: GlobePlace[]; // if we want to show all but highlight filtered, or only show filtered
}

export const Globe: React.FC<GlobeComponentProps> = ({ places, onPinClick, filteredPlaces = places }) => {
  const globeEl = useRef<any>(null);
  const { mode } = useThemeStore();
  const { width, height } = useWindowSize();
  
  const accentHex = mode === 'dark' ? '#C5A059' : '#8B6B3D';
  
  // Custom marker generator
  const getMarkerHtml = (place: GlobePlace) => {
    const el = document.createElement('div');
    const color = accentHex;
    
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.8));">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
        <circle cx="12" cy="10" r="3" fill="#000"></circle>
      </svg>
    `;

    el.innerHTML = `
      <div class="cursor-pointer group" style="position: relative; transform: translate(-50%, -100%);">
        ${svgIcon}
        <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-card border border-border backdrop-blur-sm text-text-main text-[10px] font-medium rounded whitespace-nowrap pointer-events-none z-50">
          ${place.name}
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
        globeImageUrl={mode === 'dark' ? "//unpkg.com/three-globe/example/img/earth-dark.jpg" : "//unpkg.com/three-globe/example/img/earth-day.jpg"}
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl={mode === 'dark' ? "//unpkg.com/three-globe/example/img/night-sky.png" : undefined}
        htmlElementsData={filteredPlaces}
        htmlElement={getMarkerHtml as any}
        htmlLat="latitude"
        htmlLng="longitude"
        htmlAltitude={0.01}
        atmosphereColor={accentHex}
        atmosphereAltitude={0.25}
      />
      
      {/* Floating Controls */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-3 pointer-events-auto">
        <button 
          onClick={handleZoomIn}
          className="w-12 h-12 emboss rounded-full flex items-center justify-center text-text-muted hover:text-text-main transition-colors focus:outline-none"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-12 h-12 emboss rounded-full flex items-center justify-center text-text-muted hover:text-text-main transition-colors focus:outline-none"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button 
          onClick={handleReset}
          className="w-12 h-12 emboss rounded-full flex items-center justify-center text-text-muted hover:text-text-main transition-colors focus:outline-none"
          aria-label="Reset View"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

