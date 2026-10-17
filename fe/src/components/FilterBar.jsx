import React from 'react';
import { 
  Search, 
  LayoutGrid, 
  Columns3, 
  Map, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';

export function FilterBar({ showViewMode = true }) {
  const { 
    filters, 
    setFilter, 
    resetFilters, 
    viewMode, 
    setViewMode,
    filteredPlaces 
  } = useAppStore();

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'an', label: '🍜 Ăn ngon' },
    { id: 'cafe', label: '☕ Cà phê' },
    { id: 'chill', label: '🍹 Quán chill' },
    { id: 'dulich', label: '🏕️ Du lịch & Cắm trại' },
    { id: 'workshop', label: '🎨 Workshop & Chơi' }
  ];

  const priceRanges = [
    { id: 'all', label: 'Mọi giá' },
    { id: '$', label: '$ (< 50k)' },
    { id: '$$', label: '$$ (50k - 200k)' },
    { id: '$$$', label: '$$$ (> 200k)' }
  ];

  const statuses = [
    { id: 'all', label: 'Tất cả trạng thái' },
    { id: 'want', label: '🧡 Muốn đi' },
    { id: 'scheduled', label: '💙 Đã lên lịch' },
    { id: 'visited', label: '💚 Đã đi' }
  ];

  const hasActiveFilter = 
    filters.category !== 'all' || 
    filters.priceRange !== 'all' || 
    filters.status !== 'all' || 
    filters.location !== 'all' || 
    filters.search.trim() !== '';

  return (
    <div className="space-y-3 mb-6 select-none">
      {/* Top Search & View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Tìm địa điểm, quận, món ăn, hoạt động, hashtag (#viewdep, #chill)..."
            className="w-full bg-[var(--color-bg-surface)] text-[var(--color-text-main)] text-xs pl-10 pr-9 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none transition-colors shadow-sm"
          />
          {filters.search && (
            <button 
              onClick={() => setFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[#FF6B4A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <label className="text-[11px] font-bold text-[var(--color-text-muted)] flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6B4A]" />
            <span className="hidden lg:inline">Sắp xếp:</span>
          </label>
          <select
            value={filters.sortBy || 'priority'}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            className="bg-[var(--color-bg-surface)] text-[var(--color-text-main)] text-xs font-bold py-2 px-2.5 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="priority">🔢 Theo STT (Thêm trước ưu tiên trước)</option>
            <option value="newest">⏱️ Mới thêm gần đây</option>
            <option value="rating">⭐ Đánh giá sao cao nhất</option>
            <option value="votes">❤️ Thả tim nhiều nhất</option>
            <option value="overdue">⏳ Ngâm lâu nhất</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        {showViewMode && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] self-end sm:self-auto shrink-0 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              title="Chế độ Lưới (Grid)"
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3B221D] dark:text-[#FF7B5C]' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Lưới</span>
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              title="Chế độ Bảng Kanban"
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban' 
                  ? 'bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3B221D] dark:text-[#FF7B5C]' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <Columns3 className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Kanban</span>
            </button>
            <button 
              onClick={() => setViewMode('map')}
              title="Chế độ Bản đồ"
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'map' 
                  ? 'bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3B221D] dark:text-[#FF7B5C]' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Bản đồ</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Chips Horizontally Scrollable */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {/* Reset filter button */}
        {hasActiveFilter && (
          <button 
            onClick={resetFilters}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Xoá lọc</span>
          </button>
        )}

        {/* Categories */}
        <div className="flex items-center gap-1.5 shrink-0">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setFilter('category', cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filters.category === cat.id
                  ? 'bg-[var(--color-primary)] text-white shadow-sm shadow-[#FF6B4A]/25'
                  : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-main)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[var(--color-border)] shrink-0"></div>

        {/* Price Ranges */}
        <div className="flex items-center gap-1.5 shrink-0">
          {priceRanges.map(p => (
            <button 
              key={p.id}
              onClick={() => setFilter('priceRange', p.id)}
              className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filters.priceRange === p.id
                  ? 'bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3B221D] dark:text-[#FF7B5C] font-bold border border-[#FF6B4A]/30'
                  : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:text-[var(--color-text-main)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[var(--color-border)] shrink-0"></div>

        {/* Statuses */}
        <div className="flex items-center gap-1.5 shrink-0">
          {statuses.map(st => (
            <button 
              key={st.id}
              onClick={() => setFilter('status', st.id)}
              className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filters.status === st.id
                  ? 'bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3B221D] dark:text-[#FF7B5C] font-bold border border-[#FF6B4A]/30'
                  : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:text-[var(--color-text-main)]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
