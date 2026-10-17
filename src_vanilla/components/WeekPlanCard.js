/**
 * WEEK PLAN CARD COMPONENT
 * Hiển thị các sự kiện địa điểm đã lên lịch trong tuần
 */

export function renderWeekPlanItem(place, planInfo = {}) {
  return `
    <div 
      class="group flex items-center gap-3 p-2.5 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all cursor-pointer shadow-sm hover:shadow"
      onclick="window.app.viewPlaceDetail('${place.id}')"
    >
      <img 
        src="${place.imageUrl}" 
        alt="${place.title}" 
        class="w-12 h-12 rounded-lg object-cover shrink-0"
      />
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-[var(--color-text-main)] truncate group-hover:text-[var(--color-primary)] transition-colors">
          ${place.title}
        </h4>
        <div class="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] mt-0.5">
          <i data-lucide="clock" class="w-3 h-3 text-[#FF6B4A]"></i>
          <span>${place.scheduledDayName || 'Chủ Nhật này'}</span>
        </div>
      </div>
      <button 
        onclick="event.stopPropagation(); window.app.markVisited('${place.id}')"
        title="Đánh dấu đã đi"
        class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
      >
        <i data-lucide="check" class="w-4 h-4"></i>
      </button>
    </div>
  `;
}
