import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  Navigation, 
  Sparkles,
  ChevronRight,
  Clock
} from 'lucide-react';
import L from 'leaflet';
import { useAppStore } from '../context/StoreContext';
import { PlaceCard } from './PlaceCard';

export function WeekPlanner() {
  const { 
    weekPlans, 
    places, 
    removeFromPlan, 
    assignToPlan,
    setDetailPlace,
    setIsQuickAddOpen 
  } = useAppStore();

  const days = [
    "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"
  ];

  const [selectedDay, setSelectedDay] = useState("Thứ Bảy");
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  const plannedPlaceIds = weekPlans[selectedDay] || [];
  const plannedPlaces = places.filter(p => plannedPlaceIds.includes(p.id));

  // Available places to add to this day (places in want status)
  const availablePlaces = places.filter(p => !plannedPlaceIds.includes(p.id));

  // Initialize and update Map with Polyline
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [10.7769, 106.7009],
        zoom: 12,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers & polyline
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const coords = [];

    plannedPlaces.forEach((p, idx) => {
      if (p.mapCoords && p.mapCoords.length === 2) {
        coords.push(p.mapCoords);

        // Marker with number 1, 2, 3
        const customIcon = L.divIcon({
          className: 'planner-leaflet-marker',
          html: `
            <div style="background-color: #FF6B4A; color: white; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; box-shadow: 0 3px 8px rgba(0,0,0,0.3);">
              ${idx + 1}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(p.mapCoords, { icon: customIcon }).addTo(map);
        marker.bindPopup(`<b>${idx + 1}. ${p.title}</b><br/>${p.location}`);
        marker.on('click', () => setDetailPlace(p));
        markersRef.current.push(marker);
      }
    });

    // Draw route polyline if 2+ places
    if (coords.length >= 2) {
      polylineRef.current = L.polyline(coords, {
        color: '#FF6B4A',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.8
      }).addTo(map);
    }

    if (coords.length > 0) {
      try {
        map.fitBounds(coords, { padding: [40, 40], maxZoom: 14 });
      } catch (e) {}
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [plannedPlaces, setDetailPlace]);

  return (
    <div className="space-y-6 pb-12">
      {/* Day Selector Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 select-none no-scrollbar">
        {days.map(day => {
          const count = (weekPlans[day] || []).length;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[#FF6B4A]/25'
                  : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <span>{day}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/30 text-white' : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Plan list + Route Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Itinerary list (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[var(--color-text-main)]">
                Lộ trình {selectedDay}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {plannedPlaces.length > 0 
                  ? `Đã sắp xếp ${plannedPlaces.length} điểm đến liên hoàn` 
                  : 'Chưa có điểm hẹn nào trong ngày này'}
              </p>
            </div>
          </div>

          {plannedPlaces.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[var(--color-bg-surface)] border-2 border-dashed border-[var(--color-border)] text-center">
              <Calendar className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-[var(--color-text-main)]">Hôm nay đang trống lịch!</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
                Chọn một quán từ danh sách bên dưới hoặc thêm quán mới để cùng bạn bè vi vu nhé.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {plannedPlaces.map((p, idx) => (
                <div 
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-sm hover:border-[#FF6B4A]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#FFEBE6] dark:bg-[#3D221B] text-[#FF6B4A] flex items-center justify-center font-black text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 
                        onClick={() => setDetailPlace(p)}
                        className="font-bold text-xs sm:text-sm text-[var(--color-text-main)] hover:text-[#FF6B4A] truncate cursor-pointer"
                      >
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#FF6B4A] shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]">
                      {p.priceRange}
                    </span>
                    <button 
                      onClick={() => removeFromPlan(p.id, selectedDay)}
                      title="Gỡ khỏi ngày này"
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add more places to this day */}
          <div className="pt-4 border-t border-[var(--color-border)]">
            <h4 className="text-xs font-black uppercase text-[var(--color-text-muted)] tracking-wider mb-3">
              Thêm nhanh vào {selectedDay}
            </h4>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {availablePlaces.slice(0, 5).map(p => (
                <button
                  key={p.id}
                  onClick={() => assignToPlan(p.id, selectedDay)}
                  className="shrink-0 flex items-center gap-2 p-2 px-3 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] hover:border-[#FF6B4A] text-left transition-colors text-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF6B4A]" />
                  <span className="font-bold text-[var(--color-text-main)] truncate max-w-[120px]">{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Route Map (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#FF6B4A]" />
              <h4 className="font-extrabold text-xs text-[var(--color-text-main)]">
                Bản đồ lộ trình di chuyển
              </h4>
            </div>
            {plannedPlaces.length >= 2 && (
              <span className="text-[11px] font-bold text-[#FF6B4A]">
                Đường nối liền
              </span>
            )}
          </div>

          <div 
            ref={mapContainerRef} 
            className="h-80 w-full rounded-2xl overflow-hidden shadow-inner border border-[var(--color-border)]"
          ></div>

          <p className="text-[11px] text-[var(--color-text-muted)] mt-3 text-center">
            {plannedPlaces.length >= 2 
              ? 'Tự động tính toán đường đi tối ưu giữa các địa điểm theo thứ tự'
              : 'Thêm ít nhất 2 địa điểm vào ngày này để vẽ lộ trình di chuyển'}
          </p>
        </div>
      </div>
    </div>
  );
}
