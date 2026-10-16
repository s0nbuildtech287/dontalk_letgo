/**
 * FILTER BAR COMPONENT
 * Thanh lọc ngang danh mục (ăn/uống/chơi/du lịch), khu vực, giá, trạng thái
 * & Chuyển đổi 3 chế độ xem: Grid ảnh | Kanban 3 cột | Bản đồ tương tác
 */

export function renderFilterBar(store) {
  const { filters, viewMode } = store;

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'an', label: '🍜 Ăn ngon' },
    { id: 'uong', label: '☕ Cà phê chill' },
    { id: 'choi', label: '🎯 Chơi vui' },
    { id: 'dulich', label: '🌿 Du lịch' }
  ];

  const locations = [
    { id: 'all', label: 'Mọi khu vực' },
    { id: 'TP. Hồ Chí Minh', label: 'Sài Gòn' },
    { id: 'Hà Nội', label: 'Hà Nội' },
    { id: 'Đà Lạt', label: 'Đà Lạt' },
    { id: 'Hội An', label: 'Hội An' },
    { id: 'Đồng Nai', label: 'Đồng Nai' }
  ];

  const priceRanges = [
    { id: 'all', label: 'Mọi mức giá' },
    { id: '$', label: '$ (Dưới 50k)' },
    { id: '$$', label: '$$ (50k - 200k)' },
    { id: '$$$', label: '$$$ (Trên 200k)' }
  ];

  const statuses = [
    { id: 'all', label: 'Mọi trạng thái' },
    { id: 'want', label: '📌 Muốn đi' },
    { id: 'scheduled', label: '🗓️ Đã lên lịch' },
    { id: 'visited', label: '✅ Đã đi' }
  ];

  return `
    <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl p-4 shadow-sm mb-6 flex flex-col gap-3.5 transition-colors">
      <!-- Top Row: Category Tabs & View Switcher -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Category Pill Selector -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          ${categories.map(cat => {
            const isActive = filters.category === cat.id;
            return `
              <button 
                onclick="window.app.setCategoryFilter('${cat.id}')"
                class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-[var(--color-primary)] text-white shadow-sm shadow-[#FF6B4A]/25' 
                    : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-hover)]'
                }"
              >
                ${cat.label}
              </button>
            `;
          }).join('')}
        </div>

        <!-- 3 View Mode Switchers: Grid / Kanban / Map -->
        <div class="flex items-center p-1 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] self-end sm:self-auto">
          <button 
            onclick="window.app.setViewMode('grid')" 
            title="Dạng lưới ảnh"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid' 
                ? 'bg-[var(--color-bg-surface)] text-[var(--color-primary)] shadow-sm' 
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }"
          >
            <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">Lưới ảnh</span>
          </button>

          <button 
            onclick="window.app.setViewMode('kanban')" 
            title="Dạng Kanban 3 cột theo trạng thái"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban' 
                ? 'bg-[var(--color-bg-surface)] text-[var(--color-primary)] shadow-sm' 
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }"
          >
            <i data-lucide="columns-3" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">Kanban</span>
          </button>

          <button 
            onclick="window.app.setViewMode('map')" 
            title="Bản đồ các địa điểm"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'map' 
                ? 'bg-[var(--color-bg-surface)] text-[var(--color-primary)] shadow-sm' 
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }"
          >
            <i data-lucide="map" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">Bản đồ</span>
          </button>
        </div>
      </div>

      <!-- Bottom Row: Dropdown Filters & Search -->
      <div class="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[var(--color-border-subtle)]">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Location select -->
          <div class="relative">
            <select 
              onchange="window.app.setFilter('location', this.value)"
              class="appearance-none bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs font-medium pl-3 pr-8 py-1.5 rounded-xl border border-transparent focus:border-[var(--color-primary)] focus:outline-none cursor-pointer"
            >
              ${locations.map(loc => `
                <option value="${loc.id}" ${filters.location === loc.id ? 'selected' : ''}>${loc.label}</option>
              `).join('')}
            </select>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
          </div>

          <!-- Price range select -->
          <div class="relative">
            <select 
              onchange="window.app.setFilter('priceRange', this.value)"
              class="appearance-none bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs font-medium pl-3 pr-8 py-1.5 rounded-xl border border-transparent focus:border-[var(--color-primary)] focus:outline-none cursor-pointer"
            >
              ${priceRanges.map(pr => `
                <option value="${pr.id}" ${filters.priceRange === pr.id ? 'selected' : ''}>${pr.label}</option>
              `).join('')}
            </select>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
          </div>

          <!-- Status select -->
          <div class="relative">
            <select 
              onchange="window.app.setFilter('status', this.value)"
              class="appearance-none bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs font-medium pl-3 pr-8 py-1.5 rounded-xl border border-transparent focus:border-[var(--color-primary)] focus:outline-none cursor-pointer"
            >
              ${statuses.map(st => `
                <option value="${st.id}" ${filters.status === st.id ? 'selected' : ''}>${st.label}</option>
              `).join('')}
            </select>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
          </div>

          <!-- Reset Filter if active -->
          ${(filters.category !== 'all' || filters.location !== 'all' || filters.priceRange !== 'all' || filters.status !== 'all' || filters.search) ? `
            <button 
              onclick="window.app.resetFilters()" 
              class="text-xs text-[var(--color-primary)] hover:underline font-semibold flex items-center gap-1 px-2 py-1"
            >
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i>
              Đặt lại
            </button>
          ` : ''}
        </div>

        <!-- Keyword Search Input -->
        <div class="relative w-full sm:w-64">
          <i data-lucide="search" class="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input 
            type="text" 
            placeholder="Tìm theo tên quán, món ăn..." 
            value="${filters.search || ''}"
            oninput="window.app.setFilter('search', this.value)"
            class="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs pl-8 pr-3 py-1.5 rounded-xl border border-transparent focus:border-[var(--color-primary)] focus:outline-none placeholder-[var(--color-text-subtle)]"
          />
        </div>
      </div>
    </div>
  `;
}
