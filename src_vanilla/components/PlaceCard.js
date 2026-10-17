/**
 * PLACE CARD COMPONENT
 * Card địa điểm chuẩn: ảnh 4:3, tag, badge trạng thái màu riêng, nút "Lên lịch" nổi bật & menu phụ
 * Hỗ trợ kéo thả (drag & drop) vào Planner hoặc Kanban
 */

export function renderPlaceCard(place, options = {}) {
  const { compact = false, showDragHandle = false, highlightOverdue = false } = options;

  // Status Badge styles & labels
  const statusConfig = {
    want: {
      label: 'Muốn đi',
      classes: 'bg-[#FFF4E5] text-[#B45309] border-[#FDE68A] dark:bg-[#382512] dark:text-[#FBBF24] dark:border-[#563919]',
      icon: 'bookmark'
    },
    scheduled: {
      label: 'Đã lên lịch',
      classes: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] dark:bg-[#142747] dark:text-[#60A5FA] dark:border-[#1E3A8A]',
      icon: 'calendar'
    },
    visited: {
      label: 'Đã đi',
      classes: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] dark:bg-[#113627] dark:text-[#34D399] dark:border-[#065F46]',
      icon: 'check-circle'
    }
  };

  const status = statusConfig[place.status] || statusConfig.want;
  const isOverdue = place.status === 'want' && (place.savedDaysAgo || 0) >= 14;

  return `
    <article 
      id="card-${place.id}"
      draggable="true" 
      ondragstart="window.app.handleDragStart(event, '${place.id}')"
      ondragend="window.app.handleDragEnd(event)"
      class="group relative flex flex-col bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden place-card-hover select-none transition-all duration-200 cursor-pointer ${
        highlightOverdue ? 'ring-2 ring-amber-400/50' : ''
      }"
      onclick="window.app.viewPlaceDetail('${place.id}')"
    >
      <!-- Media Header (Tỉ lệ 4:3) -->
      <div class="relative w-full aspect-[4/3] overflow-hidden bg-[var(--color-bg-subtle)]">
        <img 
          src="${place.imageUrl}" 
          alt="${place.title}" 
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'"
        />

        <!-- Overlay Gradient for text contrast -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-60 transition-opacity"></div>

        <!-- Top Badges: Category & Status -->
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/40 text-white shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]"></span>
            ${place.categoryLabel}
          </span>

          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${status.classes}">
            <i data-lucide="${status.icon}" class="w-3 h-3"></i>
            ${status.label}
          </span>
        </div>

        <!-- Overdue Alert Ribbon if saved > 14 days -->
        ${isOverdue ? `
          <div class="absolute bottom-2 left-2 right-2 bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-md text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg flex items-center justify-between shadow-md">
            <span class="flex items-center gap-1.5">
              <i data-lucide="clock" class="w-3 h-3"></i>
              Lưu ${place.savedDaysAgo} ngày trước
            </span>
            <span class="underline font-bold">Đi thôi kẻo nguội!</span>
          </div>
        ` : ''}

        <!-- Price Range pill on bottom right if not overdue banner -->
        ${!isOverdue ? `
          <div class="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
            ${place.priceText}
          </div>
        ` : ''}
      </div>

      <!-- Card Body Content -->
      <div class="flex-1 p-4 flex flex-col justify-between">
        <div>
          <!-- Title & Location -->
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <h3 class="font-bold text-base text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1" title="${place.title}">
              ${place.title}
            </h3>
          </div>

          <div class="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mb-3">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#FF6B4A] shrink-0"></i>
            <span class="truncate">${place.location}</span>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            ${(place.tags || []).slice(0, 3).map(tag => `
              <span class="text-[11px] px-2 py-0.5 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] font-medium">
                #${tag}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Action Footer -->
        <div class="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2" onclick="event.stopPropagation()">
          ${place.status !== 'scheduled' ? `
            <button 
              onclick="window.app.openScheduleModal('${place.id}')"
              class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-sm transition-all hover:shadow active:scale-95"
            >
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
              <span>Lên lịch</span>
            </button>
          ` : `
            <button 
              onclick="window.app.markVisited('${place.id}')"
              class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:shadow active:scale-95"
            >
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              <span>Đã ghé quán</span>
            </button>
          `}

          <!-- Quick Action Icons -->
          <div class="flex items-center gap-1">
            <button 
              onclick="window.app.toggleVote('${place.id}')" 
              title="Bình chọn thích (${place.votes || 0})"
              class="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[#FF6B4A] hover:bg-[var(--color-bg-subtle)] transition-colors flex items-center gap-1"
            >
              <i data-lucide="heart" class="w-4 h-4 ${place.votes > 10 ? 'fill-[#FF6B4A] text-[#FF6B4A]' : ''}"></i>
              <span class="text-xs font-bold">${place.votes || 0}</span>
            </button>

            <button 
              onclick="window.app.sharePlace('${place.id}')" 
              title="Chia sẻ"
              class="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-subtle)] transition-colors"
            >
              <i data-lucide="share-2" class="w-4 h-4"></i>
            </button>

            <button 
              onclick="window.app.deletePlace('${place.id}')" 
              title="Xóa khỏi danh sách"
              class="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}
