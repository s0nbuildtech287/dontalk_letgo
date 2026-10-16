/**
 * RIGHT PANEL COMPONENT (340px)
 * Xuất hiện cố định bên phải ở desktop >= 1280px (xl screen)
 * Chứa: Mini Map các điểm đã lưu, Kế hoạch tuần này, Thống kê biến "mai mốt" thành đi thật, Streak đi chơi
 */

import { renderWeekPlanItem } from './WeekPlanCard.js';

export function renderRightPanel(store) {
  const stats = store.getStats();
  const scheduledPlaces = store.getScheduledPlaces();
  const streak = store.streakWeeks;

  return `
    <aside class="hidden xl:flex flex-col w-[340px] shrink-0 h-screen sticky top-0 bg-[var(--color-bg-surface)] border-l border-[var(--color-border)] overflow-y-auto p-5 space-y-6 z-20 transition-colors">
      <!-- Section 1: Streak Đi Chơi 🔥 -->
      <div class="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#FF6B4A]/10 via-[#FFA07A]/10 to-transparent border border-[#FF6B4A]/30">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-2xl streak-flame">🔥</span>
            <div>
              <h3 class="font-extrabold text-sm text-[var(--color-text-main)]">Streak Đi Chơi</h3>
              <p class="text-[11px] text-[var(--color-text-muted)]">Không ở nhà cuối tuần</p>
            </div>
          </div>
          <span class="text-lg font-black text-[#FF6B4A]">${streak} tuần</span>
        </div>
        <div class="w-full bg-[var(--color-bg-subtle)] h-2 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-[#FF6B4A] to-amber-400 h-full rounded-full transition-all duration-500" style="width: 80%"></div>
        </div>
        <p class="text-[11px] text-[var(--color-text-muted)] mt-2 italic">
          "Tuyệt vời! Bạn đã duy trì bước chân trải nghiệm suốt tháng qua."
        </p>
      </div>

      <!-- Section 2: Mini Map (Bản đồ các điểm đã lưu) -->
      <div>
        <div class="flex items-center justify-between mb-2.5">
          <div class="flex items-center gap-2">
            <i data-lucide="map" class="w-4 h-4 text-[#FF6B4A]"></i>
            <h3 class="font-bold text-sm text-[var(--color-text-main)]">Bản đồ điểm hẹn</h3>
          </div>
          <button 
            onclick="window.app.navigate('wishlist'); window.app.setViewMode('map');"
            class="text-[11px] font-semibold text-[var(--color-primary)] hover:underline"
          >
            Mở rộng
          </button>
        </div>

        <!-- Interactive / Preview Leaflet Container -->
        <div class="relative w-full h-44 rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm">
          <div id="mini-map-container" class="w-full h-full z-10 bg-[var(--color-bg-subtle)]"></div>
          
          <div class="absolute bottom-2 left-2 z-20 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium flex items-center gap-1.5 pointer-events-none">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>${store.places.length} điểm đã ghim</span>
          </div>
        </div>
      </div>

      <!-- Section 3: Kế hoạch tuần này -->
      <div>
        <div class="flex items-center justify-between mb-2.5">
          <div class="flex items-center gap-2">
            <i data-lucide="calendar-days" class="w-4 h-4 text-[#FF6B4A]"></i>
            <h3 class="font-bold text-sm text-[var(--color-text-main)]">Kế hoạch tuần này</h3>
          </div>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3D221B] dark:text-[#FF7B5C]">
            ${scheduledPlaces.length} điểm
          </span>
        </div>

        <div class="space-y-2.5">
          ${scheduledPlaces.length === 0 ? `
            <div class="p-4 rounded-xl border border-dashed border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
              Chưa có lịch tuần này. Kéo một quán từ wishlist vào nhé!
            </div>
          ` : `
            ${scheduledPlaces.slice(0, 4).map(place => renderWeekPlanItem(place)).join('')}
          `}
        </div>
      </div>

      <!-- Section 4: Thống kê "Biến mai mốt thành đi thật" -->
      <div class="bg-[var(--color-bg-subtle)] rounded-2xl p-4 border border-[var(--color-border)] space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Chuyển hóa mong muốn</h3>
          <span class="text-xs font-extrabold text-[#FF6B4A]">${stats.conversionRate}%</span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-[var(--color-border)] h-2 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${stats.conversionRate}%"></div>
        </div>

        <!-- 3 Stats Counters -->
        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--color-border-subtle)] text-center">
          <div>
            <p class="text-base font-extrabold text-[var(--color-text-main)]">${stats.want}</p>
            <p class="text-[10px] text-[var(--color-text-muted)]">Đang ủ mưu</p>
          </div>
          <div>
            <p class="text-base font-extrabold text-blue-600 dark:text-blue-400">${stats.scheduled}</p>
            <p class="text-[10px] text-[var(--color-text-muted)]">Đã hẹn lịch</p>
          </div>
          <div>
            <p class="text-base font-extrabold text-emerald-600 dark:text-emerald-400">${stats.visited}</p>
            <p class="text-[10px] text-[var(--color-text-muted)]">Đã đi thật</p>
          </div>
        </div>
      </div>
    </aside>
  `;
}
