import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useAppStore } from '../context/StoreContext';

export function FullMapView() {
  const { filteredPlaces, setDetailPlace } = useAppStore();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [10.7769, 106.7009],
        zoom: 13,
        attributionControl: false
      });

      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const bounds = [];
    filteredPlaces.forEach(p => {
      if (p.mapCoords && p.mapCoords.length === 2) {
        const markerColor = p.status === 'visited' ? '#10B981' : p.status === 'scheduled' ? '#3B82F6' : '#FF6B4A';
        const customIcon = L.divIcon({
          className: 'custom-full-leaflet-marker',
          html: `
            <div style="background-color: ${markerColor}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.35); cursor: pointer;">
              <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const marker = L.marker(p.mapCoords, { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; width: 190px; padding: 2px;">
            <img src="${p.imageUrl}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
            <b style="font-size: 13px; color: #1F2937; display: block; line-height: 1.2;">${p.title}</b>
            <p style="font-size: 11px; margin: 3px 0; color: #6B7280;">${p.location}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
              <span style="font-size: 11px; font-weight: bold; color: #FF6B4A;">${p.priceText || p.priceRange}</span>
              <span style="font-size: 10px; font-weight: 700; background: #FFF4E5; color: #B45309; padding: 1px 6px; border-radius: 4px;">${p.categoryLabel}</span>
            </div>
          </div>
        `);
        marker.on('click', () => setDetailPlace(p));
        markersRef.current.push(marker);
        bounds.push(p.mapCoords);
      }
    });

    if (bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } catch (e) {}
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [filteredPlaces, setDetailPlace]);

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-sm">
      <div 
        ref={mapContainerRef} 
        className="w-full h-[620px]"
      ></div>
    </div>
  );
}
