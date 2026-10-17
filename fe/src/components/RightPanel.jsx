import React, { useEffect, useRef } from 'react';
import { 
  Flame, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import L from 'leaflet';
import { useAppStore } from '../context/StoreContext';

export function RightPanel() {
  const { 
    places, 
    weekPlans, 
    stats, 
    streakWeeks, 
    setActiveTab, 
    setDetailPlace 
  } = useAppStore();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Setup Leaflet Mini Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [10.7769, 106.7009],
        zoom: 12,
        zoomControl: false,
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

    // Add markers
    const bounds = [];
    places.forEach(p => {
      if (p.mapCoords && p.mapCoords.length === 2) {
        const markerColor = p.status === 'visited' ? '#10B981' : p.status === 'scheduled' ? '#3B82F6' : '#FF6B4A';
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker(p.mapCoords, { icon: customIcon }).addTo(map);
        marker.bindPopup(`<b>${p.title}</b><br/><span style="font-size: 11px;">${p.location}</span>`);
        marker.on('click', () => setDetailPlace(p));
        markersRef.current.push(marker);
        bounds.push(p.mapCoords);
      }
    });

    if (bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 14 });
      } catch (e) {}
    } else {
      map.setView([10.7769, 106.7009], 12);
    }

    // Leaflet needs resize trigger when parent container renders
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [places, setDetailPlace]);

  // Flatten planned places for display
  const plannedEntries = Object.entries(weekPlans).filter(([day, ids]) => ids && ids.length > 0);

  return (
    <aside className="hidden xl:flex flex-col w-[340px] shrink-0 h-screen sticky top-0 bg-[var(--color-bg-surface)] border-l border-[var(--color-border)] p-5 space-y-6 overflow-y-auto select-none z-20 transition-colors">
      {/* 1. STREAK ĐI CHƠI */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-orange-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500 text-white shadow-sm shadow-orange-500/30">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[var(--color-text-main)]">
                Streak: {streakWeeks} tuần liên tiếp
              </h3>
              <p className="text-[11px] text-[var(--color-text-muted)]">Cuối tuần không nằm nhà!</p>
            </div>
          </div>
          <span className="text-xs font-black text-orange-500 bg-orange-100 dark:bg-orange-950/60 px-2.5 py-0.5 rounded-full">
            🔥 Đang cháy
          </span>
        </div>

        {/* 4 dots for streak */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[1, 2, 3, 4].map(w => (
            <div key={w} className="flex flex-col items-center gap-1">
              <div className="w-full h-2 rounded-full bg-orange-500"></div>
              <span className="text-[10px] text-[var(--color-text-muted)] font-medium">T{w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BẢN ĐỒ MINI */}
      <div className="rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-3">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF6B4A]" />
            <h4 className="font-extrabold text-xs text-[var(--color-text-main)]">Bản đồ điểm hẹn</h4>
          </div>
          <button 
            onClick={() => {
              setActiveTab('wishlist');
            }}
            className="text-[11px] font-bold text-[#FF6B4A] hover:underline flex items-center gap-0.5"
          >
            <span>Mở rộng</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Map Container */}
        <div 
          ref={mapContainerRef} 
          className="h-44 w-full rounded-xl overflow-hidden shadow-inner border border-[var(--color-border)]"
        ></div>

        <p className="text-[11px] text-[var(--color-text-muted)] mt-2 px-1 text-center">
          Ghim <strong className="text-[var(--color-text-main)]">{places.length}</strong> toạ độ quán yêu thích
        </p>
      </div>

      {/* 3. KẾ HOẠCH TUẦN NÀY */}
      <div className="rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-500" />
            <h4 className="font-extrabold text-xs text-[var(--color-text-main)]">Tuần này đi đâu?</h4>
          </div>
          <button 
            onClick={() => setActiveTab('planner')}
            className="text-[11px] font-bold text-blue-500 hover:underline"
          >
            Chi tiết
          </button>
        </div>

        {plannedEntries.length === 0 ? (
          <div className="text-center py-6 px-2">
            <p className="text-xs text-[var(--color-text-muted)]">Chưa có quán nào được lên lịch cho tuần này.</p>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className="mt-2 text-xs font-bold text-[#FF6B4A] hover:underline"
            >
              Chọn quán lên lịch ngay
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {plannedEntries.map(([day, ids]) => {
              const dayPlaces = places.filter(p => ids.includes(p.id));
              if (dayPlaces.length === 0) return null;
              return (
                <div key={day} className="rounded-xl bg-[var(--color-bg-surface)] p-2.5 border border-[var(--color-border-subtle)] shadow-sm">
                  <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 block mb-1">
                    {day}
                  </span>
                  <div className="space-y-1">
                    {dayPlaces.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => setDetailPlace(p)}
                        className="text-xs font-bold text-[var(--color-text-main)] hover:text-[#FF6B4A] truncate cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate">{p.title}</span>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-2 shrink-0">{p.priceRange}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. CHỈ SỐ CHUYỂN HÓA (HÀNH ĐỘNG THẬT) */}
      <div className="rounded-2xl p-4 bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[var(--color-text-muted)] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            Tỉ lệ biến "mai mốt" thành "đi thật"
          </span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            {stats.conversionRate}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${stats.conversionRate}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-2">
          <span>{stats.visited} đã đi</span>
          <span>{stats.scheduled} đã lên lịch</span>
          <span>{stats.want} muốn đi</span>
        </div>
      </div>
    </aside>
  );
}
