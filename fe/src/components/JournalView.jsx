import React from 'react';
import { 
  BookHeart, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Star, 
  Sparkles,
  Trophy
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';
import { PlaceCard } from './PlaceCard';

export function JournalView() {
  const { visitedPlaces, setActiveTab } = useAppStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Journal Hero Stats */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
                  Kỷ Niệm & Hành Trình Đã Đi
                </h2>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {visitedPlaces.length} chuyến đi
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Lưu giữ những khoảnh khắc đẹp, món ăn ngon và cảm xúc sau mỗi chuyến vi vu!
              </p>
            </div>
          </div>

          {visitedPlaces.length === 0 && (
            <button 
              onClick={() => setActiveTab('wishlist')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all"
            >
              Chọn địa điểm đi ngay hôm nay
            </button>
          )}
        </div>
      </div>

      {/* Visited Places Grid */}
      {visitedPlaces.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[var(--color-bg-surface)] border-2 border-dashed border-[var(--color-border)] text-center">
          <BookHeart className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="font-extrabold text-sm text-[var(--color-text-main)]">Chưa có chuyến đi nào được hoàn thành</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
            Sau khi đi chơi về, hãy bấm nút <strong>"Đã đi rồi"</strong> trên mỗi địa điểm để lưu vào nhật ký này nhé!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visitedPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
