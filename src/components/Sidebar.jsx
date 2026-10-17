import React from 'react';
import { 
  Home, 
  Bookmark, 
  CalendarDays, 
  Sparkles, 
  Users, 
  BookHeart, 
  Plus, 
  Sun, 
  Moon, 
  MapPin, 
  Compass,
  Footprints
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';

export function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    setIsQuickAddOpen,
    stats,
    overduePlaces
  } = useAppStore();

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home, badge: overduePlaces.length > 0 ? `${overduePlaces.length} chờ` : null, badgeColor: 'bg-amber-500' },
    { id: 'wishlist', label: 'Wishlist Quán', icon: Bookmark, badge: stats.want > 0 ? stats.want : null },
    { id: 'planner', label: 'Kế hoạch tuần', icon: CalendarDays, badge: stats.scheduled > 0 ? stats.scheduled : null, badgeColor: 'bg-blue-500' },
    { id: 'explore', label: 'Khám phá & AI', icon: Sparkles, highlight: true },
    { id: 'group', label: 'Nhóm đi chung', icon: Users, badge: 'Hot' },
    { id: 'journal', label: 'Kỷ niệm đã đi', icon: BookHeart, badge: stats.visited > 0 ? stats.visited : null, badgeColor: 'bg-emerald-500' }
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (240px CỐ ĐỊNH) */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] select-none z-30 transition-colors">
        {/* LOGO BRAND */}
        <div className="p-5 pb-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B4A] to-[#FFA07A] flex items-center justify-center text-white shadow-md shadow-[#FF6B4A]/25 group-hover:scale-105 transition-transform">
              <Footprints className="w-5 h-5 -rotate-12" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-[var(--color-text-main)] block leading-none">
                Đi Thôi<span className="text-[#FF6B4A]">!</span>
              </span>
              <span className="text-[10px] font-semibold text-[var(--color-text-muted)] tracking-wider uppercase mt-1 block">
                Let Go Now
              </span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
            className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[#FF6B4A] hover:bg-[var(--color-bg-subtle)] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* QUICK ADD BUTTON */}
        <div className="p-4 pb-2">
          <button 
            onClick={() => setIsQuickAddOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8C69] hover:from-[#E85736] hover:to-[#FF6B4A] text-white font-bold text-xs shadow-md shadow-[#FF6B4A]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm quán mới</span>
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#38221D] dark:text-[#FF7B5C] font-bold shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-main)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B4A]' : 'opacity-70'} ${item.highlight ? 'text-amber-500' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white ${item.badgeColor || 'bg-[#FF6B4A]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* USER PROFILE CARD */}
        <div className="p-3 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--color-bg-subtle)]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-[#FF6B4A] flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-stone-800">
              S
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[var(--color-text-main)] truncate">Xuân Sơn</p>
              <p className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF6B4A]" /> TP. Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--color-bg-surface)] border-t border-[var(--color-border)] flex items-center justify-around px-2 z-40 select-none shadow-lg">
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-14 py-1 gap-1 transition-colors relative ${
                isActive ? 'text-[#FF6B4A]' : 'text-[var(--color-text-muted)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold leading-none">{item.label.split(' ')[0]}</span>
              {item.badge && (
                <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#FF6B4A]"></span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
