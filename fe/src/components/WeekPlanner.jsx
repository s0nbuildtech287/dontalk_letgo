import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  Navigation, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Clock,
  Check,
  Edit3,
  CalendarDays,
  LayoutGrid,
  ListOrdered,
  X,
  ArrowRightLeft
} from 'lucide-react';
import L from 'leaflet';
import { useAppStore } from '../context/StoreContext';

export function WeekPlanner() {
  const { 
    weekPlans, 
    planDetails = {}, 
    places, 
    removeFromPlan, 
    assignToPlan,
    updatePlanDetail,
    setDetailPlace 
  } = useAppStore();

  const [weekOffset, setWeekOffset] = useState(0); // 0 = tuần này, 1 = tuần sau, -1 = tuần trước
  const [selectedDay, setSelectedDay] = useState("Thứ Bảy");
  const [plannerViewMode, setPlannerViewMode] = useState('single'); // 'single' | 'all'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // { place, dayName, time, note }

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  // Calculate week calendar dates
  const weekCalendar = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday...
    const distToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distToMonday + weekOffset * 7);

    const days = [
      "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"
    ];

    return days.map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      const fullDate = d.toISOString().split('T')[0];
      const isToday = fullDate === new Date().toISOString().split('T')[0];
      return { dayName, dateFormatted, fullDate, isToday, dateObj: d };
    });
  }, [weekOffset]);

  // Week header label (e.g. Tuần này: 12/10 – 18/10/2026)
  const weekLabel = useMemo(() => {
    const start = weekCalendar[0].dateFormatted;
    const end = weekCalendar[6].dateFormatted;
    const year = weekCalendar[0].dateObj.getFullYear();
    let prefix = `Tuần ${weekOffset > 0 ? `+${weekOffset}` : weekOffset}`;
    if (weekOffset === 0) prefix = 'Tuần này';
    if (weekOffset === 1) prefix = 'Tuần sau';
    if (weekOffset === -1) prefix = 'Tuần trước';
    return `${prefix} • ${start} – ${end}/${year}`;
  }, [weekCalendar, weekOffset]);

  // Current selected day's places with planDetails (sorted by time)
  const plannedPlaces = useMemo(() => {
    const ids = weekPlans[selectedDay] || [];
    const list = places
      .filter(p => ids.includes(p.id))
      .map(p => {
        const detailKey = `${selectedDay}-${p.id}`;
        const detail = planDetails[detailKey] || {};
        return {
          ...p,
          scheduledTime: detail.time || '09:00',
          planNote: detail.note || ''
        };
      });

    // Sort by scheduled time
    return list.sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''));
  }, [weekPlans, selectedDay, places, planDetails]);

  // Available places to add to plan (unvisited places in wishlist)
  const availablePlaces = useMemo(() => {
    return places.filter(p => p.status !== 'visited');
  }, [places]);

  // Initialize and update Map with Leaflet
  useEffect(() => {
    if (plannerViewMode !== 'single' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [21.0285, 105.8542], // Hanoi default center
        zoom: 12,
        attributionControl: false
      });

      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
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

        const customIcon = L.divIcon({
          className: 'planner-leaflet-marker',
          html: `
            <div style="background: linear-gradient(135deg, #FF6B4A, #FF8E53); color: white; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; box-shadow: 0 4px 10px rgba(255,107,74,0.4);">
              ${idx + 1}
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker(p.mapCoords, { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px;">
            <b style="color: #FF6B4A;">#${idx + 1} • ${p.scheduledTime}</b><br/>
            <b>${p.title}</b><br/>
            <span style="color: #666;">${p.location}</span>
          </div>
        `);
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
        opacity: 0.85
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
  }, [plannedPlaces, plannerViewMode, setDetailPlace]);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. TOP HEADER & WEEK NAVIGATOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-[#FFEBE6] dark:bg-[#3D221B] text-[#FF6B4A]">
              <CalendarDays className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase text-[#FF6B4A] tracking-wider">
              Lịch trình theo tuần
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
            {weekLabel}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Week switcher buttons */}
          <div className="flex items-center rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-1">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              title="Tuần trước"
              className="p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-surface)] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                weekOffset === 0 
                  ? 'bg-[var(--color-primary)] text-white shadow-xs' 
                  : 'text-[var(--color-text-main)] hover:bg-[var(--color-bg-surface)]'
              }`}
            >
              Tuần này
            </button>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              title="Tuần sau"
              className="p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-surface)] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View mode toggle (Single day vs 7 days) */}
          <div className="flex items-center rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-1">
            <button
              onClick={() => setPlannerViewMode('single')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                plannerViewMode === 'single'
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Xem ngày</span>
            </button>
            <button
              onClick={() => setPlannerViewMode('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                plannerViewMode === 'all'
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cả tuần</span>
            </button>
          </div>

          {/* Add place to plan button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs shadow-md shadow-[#FF6B4A]/25 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm vào lịch (Nhiều ngày)</span>
          </button>
        </div>
      </div>

      {/* 2. DAY SELECTOR TABS (HIỂN THỊ RÕ THỨ VÀ NGÀY THÁNG) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 select-none no-scrollbar">
        {weekCalendar.map((d) => {
          const count = (weekPlans[d.dayName] || []).length;
          const isSelected = selectedDay === d.dayName && plannerViewMode === 'single';

          return (
            <button
              key={d.dayName}
              onClick={() => {
                setSelectedDay(d.dayName);
                setPlannerViewMode('single');
              }}
              className={`shrink-0 px-4 py-3 rounded-2xl text-xs transition-all flex items-center gap-3 border ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md shadow-[#FF6B4A]/25'
                  : 'bg-[var(--color-bg-surface)] text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[#FF6B4A]/50'
              }`}
            >
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold">{d.dayName}</span>
                  {d.isToday && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white text-[#FF6B4A]' : 'bg-amber-500 text-white'
                    }`}>
                      Hôm nay
                    </span>
                  )}
                </div>
                <div className={`text-[11px] font-medium mt-0.5 ${
                  isSelected ? 'text-white/80' : 'text-[var(--color-text-muted)]'
                }`}>
                  {d.dateFormatted}
                </div>
              </div>

              {count > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/30 text-white' : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {count} điểm
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. VIEW MODE A: SINGLE DAY VIEW + ROUTE MAP */}
      {plannerViewMode === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Itinerary Timeline List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <div>
                <h3 className="text-lg font-black text-[var(--color-text-main)] flex items-center gap-2">
                  <span>Lộ trình {selectedDay}</span>
                  <span className="text-xs font-normal text-[var(--color-text-muted)]">
                    ({weekCalendar.find(d => d.dayName === selectedDay)?.dateFormatted})
                  </span>
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {plannedPlaces.length > 0 
                    ? `Đã sắp xếp ${plannedPlaces.length} điểm hẹn theo trình tự thời gian` 
                    : 'Chưa có điểm hẹn nào trong ngày này'}
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs font-bold text-[#FF6B4A] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm quán</span>
              </button>
            </div>

            {/* List or Empty State */}
            {plannedPlaces.length === 0 ? (
              <div className="p-10 rounded-3xl bg-[var(--color-bg-surface)] border-2 border-dashed border-[var(--color-border)] text-center">
                <Calendar className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold text-[var(--color-text-main)]">Hôm nay đang trống lịch!</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
                  Bấm nút bên dưới để chọn một hoặc nhiều địa điểm từ Wishlist thêm vào {selectedDay} nhé.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Chọn địa điểm lên lịch</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {plannedPlaces.map((p, idx) => (
                  <div 
                    key={p.id}
                    className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-xs hover:border-[#FF6B4A]/40 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Order & Time badge */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B4A] to-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                            {idx + 1}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* TIME BADGE (RÕ GIỜ) */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-black">
                              <Clock className="w-3.5 h-3.5" />
                              {p.scheduledTime}
                            </span>

                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]">
                              {p.priceText || p.priceRange || 'Tham khảo'}
                            </span>
                          </div>

                          <h4 
                            onClick={() => setDetailPlace(p)}
                            className="font-bold text-sm text-[var(--color-text-main)] hover:text-[#FF6B4A] mt-1.5 cursor-pointer"
                          >
                            {p.title}
                          </h4>

                          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#FF6B4A] shrink-0" />
                            <span className="truncate">{p.location}</span>
                          </p>

                          {p.planNote && (
                            <p className="text-xs italic text-[var(--color-text-main)]/80 mt-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-bg-subtle)] border-l-2 border-[#FF6B4A]">
                              📝 {p.planNote}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingItem({ place: p, dayName: selectedDay, time: p.scheduledTime, note: p.planNote })}
                          title="Sửa giờ & ghi chú"
                          className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[#FF6B4A] hover:bg-[var(--color-bg-subtle)] transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeFromPlan(p.id, selectedDay)}
                          title="Gỡ khỏi ngày này"
                          className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Route Map */}
          <div className="lg:col-span-5 rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-4 shadow-sm space-y-3 sticky top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FF6B4A]" />
                <h4 className="font-extrabold text-xs text-[var(--color-text-main)]">
                  Lộ trình di chuyển {selectedDay}
                </h4>
              </div>
              {plannedPlaces.length >= 2 && (
                <span className="text-[11px] font-bold text-[#FF6B4A] px-2 py-0.5 rounded-full bg-[#FFEBE6] dark:bg-[#3D221B]">
                  Đã nối lộ trình
                </span>
              )}
            </div>

            <div 
              ref={mapContainerRef} 
              className="h-80 w-full rounded-2xl overflow-hidden shadow-inner border border-[var(--color-border)]"
            ></div>

            <p className="text-[11px] text-[var(--color-text-muted)] text-center">
              {plannedPlaces.length >= 2 
                ? 'Tự động tính toán đường đi liên hoàn theo thứ tự giờ hẹn'
                : 'Thêm ít nhất 2 địa điểm vào ngày này để vẽ lộ trình di chuyển liên hoàn'}
            </p>
          </div>
        </div>
      ) : (
        /* 4. VIEW MODE B: 7-DAY WHOLE WEEK MATRIX OVERVIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {weekCalendar.map((d) => {
            const dayPlaces = (weekPlans[d.dayName] || []).map(pid => {
              const place = places.find(p => p.id === pid);
              const detail = planDetails[`${d.dayName}-${pid}`] || {};
              return {
                ...place,
                scheduledTime: detail.time || '09:00',
                planNote: detail.note || ''
              };
            }).filter(Boolean).sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''));

            return (
              <div 
                key={d.dayName}
                className={`p-4 rounded-3xl bg-[var(--color-bg-surface)] border transition-all flex flex-col justify-between min-h-[260px] ${
                  d.isToday 
                    ? 'border-[#FF6B4A] shadow-sm' 
                    : 'border-[var(--color-border)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--color-border-subtle)]">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-[var(--color-text-main)]">{d.dayName}</span>
                        {d.isToday && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500 text-white">
                            Hôm nay
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">{d.dateFormatted}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDay(d.dayName);
                        setPlannerViewMode('single');
                      }}
                      className="text-xs font-bold text-[#FF6B4A] hover:underline"
                    >
                      Xem chi tiết &rarr;
                    </button>
                  </div>

                  {dayPlaces.length === 0 ? (
                    <p className="text-xs text-[var(--color-text-muted)] py-6 text-center italic">
                      Trống lịch
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {dayPlaces.map((p, idx) => (
                        <div 
                          key={p.id}
                          onClick={() => setDetailPlace(p)}
                          className="p-2.5 rounded-xl bg-[var(--color-bg-subtle)] hover:bg-[#FFEBE6]/60 text-left transition-colors cursor-pointer border border-[var(--color-border-subtle)]"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                              ⏰ {p.scheduledTime}
                            </span>
                            <span className="text-[10px] text-[var(--color-text-muted)]">
                              #{idx + 1}
                            </span>
                          </div>
                          <h5 className="font-bold text-xs text-[var(--color-text-main)] truncate mt-0.5">
                            {p.title}
                          </h5>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedDay(d.dayName);
                    setIsAddModalOpen(true);
                  }}
                  className="mt-3 w-full py-1.5 rounded-xl border border-dashed border-[var(--color-border)] hover:border-[#FF6B4A] text-xs font-bold text-[var(--color-text-muted)] hover:text-[#FF6B4A] transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm quán</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. ADD PLACE TO MULTIPLE DAYS MODAL */}
      {isAddModalOpen && (
        <AddToPlanModal 
          availablePlaces={availablePlaces}
          defaultDay={selectedDay}
          weekCalendar={weekCalendar}
          onClose={() => setIsAddModalOpen(false)}
          onConfirm={(placeId, days, details) => {
            assignToPlan(placeId, days, details);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {/* 6. EDIT TIME & NOTE MODAL */}
      {editingItem && (
        <EditTimeModal
          item={editingItem}
          weekDays={weekCalendar.map(d => d.dayName)}
          onClose={() => setEditingItem(null)}
          onSave={(time, note, newDay) => {
            if (newDay && newDay !== editingItem.dayName) {
              removeFromPlan(editingItem.place.id, editingItem.dayName);
              assignToPlan(editingItem.place.id, newDay, { time, note });
            } else {
              updatePlanDetail(editingItem.place.id, editingItem.dayName, { time, note });
            }
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SUB-MODAL 1: ADD TO MULTIPLE DAYS
// -------------------------------------------------------------
function AddToPlanModal({ availablePlaces, defaultDay, weekCalendar, onClose, onConfirm }) {
  const [selectedPlaceId, setSelectedPlaceId] = useState(availablePlaces[0]?.id || '');
  const [selectedDays, setSelectedDays] = useState([defaultDay]);
  const [time, setTime] = useState('09:00');
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return availablePlaces.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availablePlaces, searchTerm]);

  const toggleDay = (dayName) => {
    setSelectedDays(prev => 
      prev.includes(dayName) 
        ? (prev.length > 1 ? prev.filter(d => d !== dayName) : prev)
        : [...prev, dayName]
    );
  };

  const selectWeekend = () => {
    setSelectedDays(['Thứ Bảy', 'Chủ Nhật']);
  };

  const selectAll = () => {
    setSelectedDays(weekCalendar.map(d => d.dayName));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedPlaceId || selectedDays.length === 0) return;
    onConfirm(selectedPlaceId, selectedDays, { time, note });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl p-6 select-none flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)] shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF6B4A]" />
            <h3 className="font-extrabold text-sm text-[var(--color-text-main)]">
              Lên lịch điểm hẹn (Chọn nhiều hôm)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Pick place */}
          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              1. Chọn địa điểm từ Wishlist:
            </label>
            <input 
              type="text" 
              placeholder="Tìm kiếm địa điểm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2 rounded-xl border border-[var(--color-border)] mb-2 focus:outline-none"
            />
            <div className="max-h-36 overflow-y-auto space-y-1 rounded-xl border border-[var(--color-border)] p-1">
              {filtered.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlaceId(p.id)}
                  className={`w-full p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                    selectedPlaceId === p.id 
                      ? 'bg-[#FF6B4A] text-white font-bold' 
                      : 'hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-main)]'
                  }`}
                >
                  <span className="truncate">{p.title}</span>
                  <span className="text-[10px] opacity-75">{p.priceText || ''}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Select multiple days */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[var(--color-text-main)] block">
                2. Chọn các hôm muốn đi (chọn được nhiều ngày):
              </label>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={selectWeekend} className="text-[10px] font-bold text-[#FF6B4A] hover:underline">
                  Cuối tuần
                </button>
                <span className="text-xs text-[var(--color-text-muted)]">•</span>
                <button type="button" onClick={selectAll} className="text-[10px] font-bold text-[var(--color-text-muted)] hover:underline">
                  Cả tuần
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {weekCalendar.map(d => {
                const isSelected = selectedDays.includes(d.dayName);
                return (
                  <button
                    key={d.dayName}
                    type="button"
                    onClick={() => toggleDay(d.dayName)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#FFEBE6] dark:bg-[#3D221B] border-[#FF6B4A] text-[#FF6B4A] font-bold'
                        : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-main)]'
                    }`}
                  >
                    <div className="text-xs">{d.dayName}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{d.dateFormatted}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
                3. Giờ hẹn cụ thể:
              </label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
                4. Ghi chú điểm hẹn:
              </label>
              <input 
                type="text" 
                placeholder="VD: Đặt bàn, ăn trưa..." 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[var(--color-border-subtle)]">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-text-muted)]">
              Hủy
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold shadow-sm">
              Lưu vào {selectedDays.length} ngày đã chọn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-MODAL 2: EDIT TIME & NOTE & MOVE DAY
// -------------------------------------------------------------
function EditTimeModal({ item, weekDays, onClose, onSave }) {
  const [time, setTime] = useState(item.time || '09:00');
  const [note, setNote] = useState(item.note || '');
  const [targetDay, setTargetDay] = useState(item.dayName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl p-6 select-none">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)]">
          <h3 className="font-extrabold text-sm text-[var(--color-text-main)]">
            Chỉnh sửa lịch hẹn
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5">
          <div>
            <span className="text-[11px] text-[var(--color-text-muted)]">Địa điểm:</span>
            <h4 className="font-bold text-sm text-[var(--color-text-main)]">{item.place.title}</h4>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              Thứ trong tuần:
            </label>
            <select
              value={targetDay}
              onChange={(e) => setTargetDay(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:outline-none"
            >
              {weekDays.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              Giờ hẹn cụ thể:
            </label>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-sm font-bold px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              Ghi chú:
            </label>
            <input 
              type="text" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Đặt bàn, ăn trưa..." 
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[var(--color-border-subtle)]">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-text-muted)]">
              Hủy
            </button>
            <button 
              onClick={() => onSave(time, note, targetDay)}
              className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold shadow-sm"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
