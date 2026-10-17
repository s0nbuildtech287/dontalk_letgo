import React from 'react';
import { 
  Users, 
  Heart, 
  Crown, 
  Share2, 
  Plus, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';
import { PlaceCard } from './PlaceCard';

export function GroupView() {
  const { groupMembers, places, toggleVote, setIsQuickAddOpen } = useAppStore();

  // Sort places by votes descending
  const topVotedPlaces = [...places].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  return (
    <div className="space-y-8 pb-12">
      {/* Group Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-orange-500/15 via-rose-500/10 to-transparent border border-orange-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF6B4A] to-rose-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-[#FF6B4A]/25 shrink-0">
              🦁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
                  Hội Báo Sài Gòn
                </h2>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF6B4A] dark:bg-[#3D221B] dark:text-[#FF7B5C]">
                  4 thành viên
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Nhóm bạn thân hẹn hò ăn uống cuối tuần. Nơi nào nhiều vote nhất thì chốt đi!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Đã sao chép link mời nhóm vào bộ nhớ tạm!");
              }}
              className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs font-bold border border-[var(--color-border)] shadow-sm transition-all flex items-center gap-2"
            >
              <Share2 className="w-4 h-4 text-[var(--color-text-muted)]" />
              <span>Mời bạn bè</span>
            </button>
            <button 
              onClick={() => setIsQuickAddOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/25 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm quán cho nhóm</span>
            </button>
          </div>
        </div>

        {/* Member Avatars */}
        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--color-border-subtle)]">
          <span className="text-xs font-bold text-[var(--color-text-muted)]">Thành viên:</span>
          <div className="flex items-center -space-x-2">
            {groupMembers.map(m => (
              <img 
                key={m.id}
                src={m.avatar} 
                alt={m.name}
                title={m.name}
                className="w-8 h-8 rounded-full border-2 border-[var(--color-bg-surface)] object-cover"
              />
            ))}
          </div>
          <span className="text-xs text-[var(--color-text-muted)] ml-2">
            Đang hoạt động sôi nổi
          </span>
        </div>
      </div>

      {/* Top Voted Leaderboard */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h3 className="text-lg font-black text-[var(--color-text-main)]">
              Bảng Xếp Hạng Bình Chọn Của Nhóm
            </h3>
          </div>
          <span className="text-xs text-[var(--color-text-muted)]">
            Bấm nút tim để nâng thứ hạng quán
          </span>
        </div>

        {topVotedPlaces.length === 0 ? (
          <div className="p-10 rounded-3xl bg-[var(--color-bg-surface)] border-2 border-dashed border-[var(--color-border)] text-center">
            <Heart className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3 opacity-30" />
            <h4 className="font-extrabold text-sm text-[var(--color-text-main)]">Chưa có quán nào để bình chọn</h4>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
              Hãy thêm những quán ăn, cafe mà bạn muốn rủ nhóm cùng đi để mọi người cùng thả tim bình chọn!
            </p>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/25"
            >
              Thêm quán đề xuất ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topVotedPlaces.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
