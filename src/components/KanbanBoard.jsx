import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  CalendarPlus,
  Plus
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';
import { PlaceCard } from './PlaceCard';

export function KanbanBoard() {
  const { 
    filteredPlaces, 
    changeStatus, 
    setSchedulingPlace, 
    setIsQuickAddOpen 
  } = useAppStore();

  const [draggedId, setDraggedId] = useState(null);

  const columns = [
    {
      id: 'want',
      title: 'Muốn đi (Wishlist)',
      subtitle: 'Nơi lưu từ TikTok, bạn bè',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      items: filteredPlaces.filter(p => p.status === 'want')
    },
    {
      id: 'scheduled',
      title: 'Đã lên lịch',
      subtitle: 'Đã chốt ngày trong tuần',
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      items: filteredPlaces.filter(p => p.status === 'scheduled')
    },
    {
      id: 'visited',
      title: 'Đã đi (Chiến thắng)',
      subtitle: 'Kỷ niệm & đánh giá thực tế',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      items: filteredPlaces.filter(p => p.status === 'visited')
    }
  ];

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (id) {
      if (targetStatus === 'scheduled') {
        const place = filteredPlaces.find(p => p.id === id);
        if (place) {
          setSchedulingPlace(place);
        }
      } else {
        changeStatus(id, targetStatus);
      }
    }
    setDraggedId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-8">
      {columns.map(col => {
        const Icon = col.icon;
        return (
          <div 
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col rounded-3xl bg-[var(--color-bg-subtle)] border ${col.borderColor} p-4 min-h-[500px] transition-colors`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${col.bgColor} ${col.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[var(--color-text-main)] flex items-center gap-2">
                    <span>{col.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] font-bold">
                      {col.items.length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{col.subtitle}</p>
                </div>
              </div>

              {col.id === 'want' && (
                <button 
                  onClick={() => setIsQuickAddOpen(true)}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[#FF6B4A] hover:bg-[var(--color-bg-surface)] transition-colors"
                  title="Thêm quán mới vào Wishlist"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Items */}
            <div className="space-y-4 flex-1">
              {col.items.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-border)] rounded-2xl p-4 text-center">
                  <p className="text-xs text-[var(--color-text-muted)]">Kéo thả quán vào đây</p>
                </div>
              ) : (
                col.items.map(place => (
                  <div 
                    key={place.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, place.id)}
                    className="cursor-grab active:cursor-grabbing transition-transform"
                  >
                    <PlaceCard place={place} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
