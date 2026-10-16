/**
 * KANBAN COLUMN COMPONENT
 * 3 cột theo vòng đời: Muốn đi (Want) -> Đã lên lịch (Scheduled) -> Đã đi (Visited)
 * Hỗ trợ kéo thả (drag & drop) HTML5 native mượt mà
 */

import { renderPlaceCard } from './PlaceCard.js';

export function renderKanbanBoard(store) {
  const filtered = store.getFilteredPlaces();

  const columns = [
    {
      id: 'want',
      title: 'Muốn đi',
      subtitle: 'Nung nấu ý định',
      badgeColor: 'bg-[#FFF4E5] text-[#B45309] border-[#FDE68A] dark:bg-[#382512] dark:text-[#FBBF24]',
      icon: 'bookmark',
      items: filtered.filter(p => p.status === 'want')
    },
    {
      id: 'scheduled',
      title: 'Đã lên lịch',
      subtitle: 'Sắp lên đường',
      badgeColor: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] dark:bg-[#142747] dark:text-[#60A5FA]',
      icon: 'calendar',
      items: filtered.filter(p => p.status === 'scheduled')
    },
    {
      id: 'visited',
      title: 'Đã đi',
      subtitle: 'Biến lời hứa thành thật',
      badgeColor: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] dark:bg-[#113627] dark:text-[#34D399]',
      icon: 'check-circle-2',
      items: filtered.filter(p => p.status === 'visited')
    }
  ];

  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      ${columns.map(col => `
        <div 
          class="flex flex-col bg-[var(--color-bg-subtle)]/70 border border-[var(--color-border)] rounded-2xl p-4 min-h-[500px] kanban-col-droppable transition-all"
          ondragover="window.app.handleDragOver(event)"
          ondragleave="window.app.handleDragLeave(event)"
          ondrop="window.app.handleDrop(event, '${col.id}')"
        >
          <!-- Column Header -->
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border)]">
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg ${col.badgeColor} border">
                <i data-lucide="${col.icon}" class="w-4 h-4"></i>
              </span>
              <div>
                <h3 class="font-bold text-sm text-[var(--color-text-main)]">${col.title}</h3>
                <p class="text-[11px] text-[var(--color-text-muted)]">${col.subtitle}</p>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-main)] shadow-sm">
              ${col.items.length}
            </span>
          </div>

          <!-- Cards List -->
          <div class="flex-1 flex flex-col gap-3.5">
            ${col.items.length === 0 ? `
              <div class="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--color-border)] rounded-xl text-center text-[var(--color-text-muted)]">
                <i data-lucide="inbox" class="w-6 h-6 mb-2 opacity-50"></i>
                <p class="text-xs">Chưa có địa điểm nào</p>
                <p class="text-[10px] text-[var(--color-text-subtle)] mt-0.5">Kéo thẻ vào đây để đổi trạng thái</p>
              </div>
            ` : `
              ${col.items.map(place => renderPlaceCard(place)).join('')}
            `}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
