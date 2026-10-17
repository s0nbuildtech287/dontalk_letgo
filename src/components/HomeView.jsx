import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Calendar, 
  Flame, 
  Plus, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';
import { PlaceCard } from './PlaceCard';

export function HomeView() {
  const { 
    overduePlaces, 
    suggestedPlaces, 
    stats, 
    setActiveTab, 
    setIsQuickAddOpen,
    setSchedulingPlace
  } = useAppStore();

  return (
    <div className="space-y-8 pb-12">
      {/* 1. OVERDUE ALERT (NGÂM QUÁN QUÁ 14 NGÀY) */}
      {overduePlaces.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/30 shrink-0 animate-bounce">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-[var(--color-text-main)] flex items-center gap-2">
                  <span>Cảnh báo: Bạn đang ngâm {overduePlaces.length} quán quá 14 ngày!</span>
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Đừng để câu "hôm nào rảnh đi" trôi vào dĩ vãng. Lên lịch chốt kèo tuần này thôi!
                </p>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('wishlist')}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Xem tất cả quán chờ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {overduePlaces.slice(0, 3).map(p => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        </div>
      )}

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setActiveTab('wishlist')}
          className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-sm hover:border-[#FF6B4A]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-muted)] mb-1">
            <span>Muốn đi</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-2xl font-black text-[var(--color-text-main)]">
            {stats.want}
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)]">Chờ chốt kèo</span>
        </div>

        <div 
          onClick={() => setActiveTab('planner')}
          className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-sm hover:border-[#FF6B4A]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-muted)] mb-1">
            <span>Đã lên lịch</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {stats.scheduled}
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)]">Tuần này đi</span>
        </div>

        <div 
          onClick={() => setActiveTab('journal')}
          className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-sm hover:border-[#FF6B4A]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-muted)] mb-1">
            <span>Đã hoàn thành</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.visited}
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)]">Chuyến đi thành công</span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-muted)] mb-1">
            <span>Tỉ lệ hành động</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-[#FF6B4A]">
            {stats.conversionRate}%
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)]">Biến nói thành đi</span>
        </div>
      </div>

      {/* 3. SUGGESTIONS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-[var(--color-text-main)]">
              Gợi ý điểm hẹn tuần này ✨
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Những quán ăn ngon, cafe đẹp sẵn sàng cho ngày nghỉ
            </p>
          </div>

          <button 
            onClick={() => setActiveTab('wishlist')}
            className="text-xs font-bold text-[#FF6B4A] hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả Wishlist ({stats.want})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {suggestedPlaces.map(p => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
