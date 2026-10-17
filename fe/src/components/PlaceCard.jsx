import React from 'react';
import { 
  Heart, 
  MapPin, 
  Star, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  AlertTriangle,
  MoreVertical,
  Trash2,
  Edit3
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';
import { getSourceInfo } from './Modals';

export function PlaceCard({ place }) {
  const { 
    toggleVote, 
    changeStatus, 
    setSchedulingPlace, 
    setDetailPlace,
    setEditingPlace,
    deletePlace 
  } = useAppStore();

  const isOverdue = place.status === 'want' && (place.savedDaysAgo || 0) >= 14;
  const sourceInfo = getSourceInfo(place.sourceLink);

  const getStatusBadge = () => {
    switch (place.status) {
      case 'want':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF4E5] text-[#B45309] dark:bg-[#3B2813] dark:text-[#FBBF24]">
            <Clock className="w-3 h-3" />
            <span>Muốn đi</span>
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#1D4ED8] dark:bg-[#1E293B] dark:text-[#60A5FA]">
            <Calendar className="w-3 h-3" />
            <span>{place.scheduledDayName || 'Đã lên lịch'}</span>
          </span>
        );
      case 'visited':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#047857] dark:bg-[#064E3B] dark:text-[#34D399]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã đi</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:border-[#FF6B4A]/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* IMAGE CONTAINER 4:3 */}
      <div 
        onClick={() => setDetailPlace(place)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-bg-subtle)] cursor-pointer"
      >
        <img 
          src={place.imageUrl} 
          alt={place.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-black/60 text-white backdrop-blur-md">
            {place.categoryLabel || 'Ăn uống'}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-stone-800 dark:bg-stone-900/90 dark:text-stone-200 backdrop-blur-md">
            {place.priceText || place.priceRange || 'Tùy chọn'}
          </span>
        </div>

        {/* Top Right Vote Heart */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleVote(place.id);
          }}
          title="Bình chọn địa điểm này"
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md text-stone-700 dark:text-stone-200 hover:text-[#FF6B4A] hover:scale-110 active:scale-95 transition-all text-xs font-bold shadow"
        >
          <Heart className={`w-3.5 h-3.5 fill-[#FF6B4A] text-[#FF6B4A]`} />
          <span>{place.votes || 1}</span>
        </button>

        {/* Overdue Warning Badge */}
        {isOverdue && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-extrabold shadow-md animate-pulse">
            <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
            <span>Ngâm {place.savedDaysAgo} ngày chưa đi!</span>
          </div>
        )}
      </div>

      {/* CARD BODY */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Status & Rating line */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {getStatusBadge()}
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{place.rating || 4.5}</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => setDetailPlace(place)}
            className="font-bold text-sm text-[var(--color-text-main)] group-hover:text-[#FF6B4A] transition-colors line-clamp-1 cursor-pointer"
          >
            {place.title}
          </h3>

          {/* Location */}
          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0" />
            <span className="truncate">{place.location}</span>
          </p>

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {place.tags.slice(0, 2).map((t, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] font-medium">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Review source link badge */}
          {place.sourceLink && sourceInfo && (
            <div className="mt-2.5">
              <a 
                href={place.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${sourceInfo.color} hover:opacity-90 shadow-xs transition-all`}
                title={`Mở bài viết gốc trên ${sourceInfo.label}`}
              >
                <span>{sourceInfo.icon}</span>
                <span>{sourceInfo.label}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
              </a>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2">
          {/* Quick status transition button */}
          {place.status === 'want' && (
            <button 
              onClick={() => setSchedulingPlace(place)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Lên lịch đi</span>
            </button>
          )}

          {place.status === 'scheduled' && (
            <button 
              onClick={() => changeStatus(place.id, 'visited')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã đi rồi</span>
            </button>
          )}

          {place.status === 'visited' && (
            <button 
              onClick={() => setDetailPlace(place)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[var(--color-bg-subtle)] hover:bg-[#FFEBE6] text-[#FF6B4A] text-xs font-bold transition-all text-center"
            >
              Xem nhật ký
            </button>
          )}

          {/* Action icon menu */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setEditingPlace(place)}
              title="Sửa địa điểm"
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[#FF6B4A] hover:bg-[var(--color-bg-subtle)] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => {
                if (window.confirm(`Xóa địa điểm "${place.title}" khỏi danh sách?`)) {
                  deletePlace(place.id);
                }
              }}
              title="Xóa"
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
