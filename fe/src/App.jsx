import React from 'react';
import { useAppStore } from './context/StoreContext';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { HomeView } from './components/HomeView';
import { WishlistView } from './components/WishlistView';
import { WeekPlanner } from './components/WeekPlanner';
import { AIPlanner } from './components/AIPlanner';
import { GroupView } from './components/GroupView';
import { JournalView } from './components/JournalView';
import { Modals } from './components/Modals';
import { LandingPage } from './components/LandingPage';
import { Plus, Footprints, Sparkles, LogIn } from 'lucide-react';

export function App() {
  const { 
    activeTab, 
    places, 
    setIsQuickAddOpen, 
    isLandingPage, 
    openLanding, 
    currentUser,
    setIsLoginModalOpen 
  } = useAppStore();

  if (isLandingPage) {
    return (
      <>
        <LandingPage />
        <Modals />
      </>
    );
  }

  const getPageInfo = () => {
    switch (activeTab) {
      case 'home':
        return {
          title: currentUser ? `Xin chào ${currentUser.name} 👋` : 'Chào mừng bạn đến với LetGoo 👋',
          subtitle: currentUser 
            ? 'Biến câu "bữa nào rảnh đi" thành hành trình thật!' 
            : 'Khám phá địa điểm hot & vi vu cuối tuần (Đăng nhập để lưu lịch trình)',
          countText: `${places.length} điểm`
        };
      case 'wishlist':
        return {
          title: 'Danh sách Wishlist',
          subtitle: 'Tất cả địa điểm bạn đã lưu từ Google Maps, TikTok và bạn bè.',
          countText: `${places.length} điểm`
        };
      case 'planner':
        return {
          title: 'Lên kế hoạch tuần này',
          subtitle: 'Sắp xếp lịch trình các ngày, xem lộ trình nối trên bản đồ.',
          countText: 'Tuần này'
        };
      case 'explore':
        return {
          title: 'Khám phá & Trợ lý AI',
          subtitle: 'Khám phá địa điểm mới hoặc để AI thiết kế lịch trình tối ưu theo ngân sách.',
          countText: 'AI Powered'
        };
      case 'group':
        return {
          title: 'Nhóm đi chung: Hội Báo Sài Gòn',
          subtitle: 'Bình chọn địa điểm được cả nhóm yêu thích nhất.',
          countText: '4 thành viên'
        };
      case 'journal':
        return {
          title: 'Nhật ký kỷ niệm đã đi',
          subtitle: 'Khoảnh khắc, đánh giá sao và cảm nhận sau mỗi chuyến đi.',
          countText: 'Kỷ niệm'
        };
      default:
        return {
          title: 'LetGoo',
          subtitle: "Don't Talk, Let's Go!",
          countText: ''
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="flex min-h-screen w-full bg-[var(--color-bg-base)] text-[var(--color-text-main)] transition-colors">
      {/* CỘT 1: SIDEBAR TRÁI 240px */}
      <Sidebar />

      {/* CỘT 2: NỘI DUNG CHÍNH (FLUID, FULL WIDTH) */}
      <main className="flex-1 min-w-0 flex flex-col p-4 sm:p-6 lg:p-8 pt-[70px] md:pt-6 pb-[85px] md:pb-8 overflow-y-auto">
        {/* Mobile Top App Bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--color-bg-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] px-4 flex items-center justify-between z-30 select-none">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="LetGoo Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="font-black text-lg text-[var(--color-text-main)]">
              Let<span className="text-[#FF6B4A]">Goo</span>!
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!currentUser && (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-[#FF6B4A]/30 text-[#FF6B4A] hover:bg-[#FFEBE6] text-xs font-bold transition-colors"
              >
                Đăng nhập
              </button>
            )}
            <button 
              onClick={() => setIsQuickAddOpen(true)}
              className="p-2 rounded-xl bg-[var(--color-primary)] text-white shadow-sm active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Header */}
        <header className="flex items-center justify-between gap-4 mb-6 select-none">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)] tracking-tight">
                {pageInfo.title}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] dark:bg-[#3D221B] dark:text-[#FF7B5C] font-bold">
                {pageInfo.countText}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {pageInfo.subtitle}
            </p>
          </div>

          {/* Header Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={openLanding}
              title="Xem trang giới thiệu"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[#FF6B4A] border border-[var(--color-border)] text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Trang giới thiệu</span>
            </button>

            {!currentUser && (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-[#FF6B4A]/30 text-[#FF6B4A] hover:bg-[#FFEBE6] dark:hover:bg-[#3D221B] text-xs font-bold shadow-sm hover:shadow transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            )}

            <button 
              onClick={() => setIsQuickAddOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/20 transition-all hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm địa điểm mới</span>
            </button>
          </div>
        </header>

        {/* SCREEN CONTENT */}
        <div className="w-full flex-1">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'wishlist' && <WishlistView />}
          {activeTab === 'planner' && <WeekPlanner />}
          {activeTab === 'explore' && <AIPlanner />}
          {activeTab === 'group' && <GroupView />}
          {activeTab === 'journal' && <JournalView />}
        </div>
      </main>

      {/* CỘT 3: PANEL PHẢI 340px (ẨN MÀN HÌNH DƯỚI 1280px) */}
      <RightPanel />

      {/* MODALS */}
      <Modals />
    </div>
  );
}
