/**
 * SIDEBAR COMPONENT
 * Desktop: Cố định 240px bên trái, logo thương hiệu, menu điều hướng, switch theme.
 * Mobile (<768px): Ẩn sidebar desktop, render Bottom Navigation Bar.
 */

export function renderSidebar(store) {
  const currentTab = store.activeTab;
  const isDark = store.theme === 'dark';

  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: 'compass', badge: null },
    { id: 'wishlist', label: 'Wishlist', icon: 'bookmark', badge: store.places.filter(p => p.status === 'want').length },
    { id: 'planner', label: 'Lên kế hoạch', icon: 'calendar', badge: store.places.filter(p => p.status === 'scheduled').length },
    { id: 'explore', label: 'Khám phá AI', icon: 'sparkles', badge: 'Mới' },
    { id: 'group', label: 'Nhóm đi chung', icon: 'users', badge: '4' },
    { id: 'journal', label: 'Nhật ký đã đi', icon: 'book-open', badge: store.places.filter(p => p.status === 'visited').length }
  ];

  return `
    <!-- DESKTOP SIDEBAR (240px cố định) -->
    <aside class="hidden md:flex flex-col w-[240px] shrink-0 h-screen sticky top-0 bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] select-none z-30 transition-colors">
      <!-- Logo Branding -->
      <div class="h-18 px-5 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
        <a href="#home" onclick="window.app.navigate('home'); return false;" class="flex items-center gap-2.5 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B4A] to-[#FFA07A] flex items-center justify-center text-white shadow-md shadow-[#FF6B4A]/25 group-hover:scale-105 transition-transform">
            <i data-lucide="map-pin" class="w-5 h-5 stroke-[2.5]"></i>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-extrabold text-xl tracking-tight text-[var(--color-text-main)]">Đi Thôi</span>
              <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3D221B] dark:text-[#FF7B5C]">PRO</span>
            </div>
            <p class="text-[11px] text-[var(--color-text-muted)] font-medium">Bớt "mai mốt", đi ngay!</p>
          </div>
        </a>
      </div>

      <!-- Quick Action Button -->
      <div class="p-4 pb-2">
        <button onclick="window.app.openQuickAddModal()" class="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium text-sm shadow-md shadow-[#FF6B4A]/20 transition-all hover:shadow-lg active:scale-[0.98]">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>Thêm địa điểm</span>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div class="px-3 py-1.5 text-[11px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">Khám phá & Đi</div>
        ${menuItems.map(item => {
          const isActive = currentTab === item.id;
          return `
            <button onclick="window.app.navigate('${item.id}')" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
              isActive 
                ? 'bg-[#FFEBE6] text-[#FF6B4A] font-semibold dark:bg-[#3D221B] dark:text-[#FF7B5C]' 
                : 'text-[var(--color-text-main)] hover:bg-[var(--color-bg-subtle)] text-opacity-80 hover:text-opacity-100'
            }">
              <div class="flex items-center gap-3">
                <i data-lucide="${item.icon}" class="w-4 h-4 ${isActive ? 'text-[#FF6B4A] dark:text-[#FF7B5C]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)]'}"></i>
                <span>${item.label}</span>
              </div>
              ${item.badge !== null ? `
                <span class="text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive 
                    ? 'bg-[#FF6B4A] text-white' 
                    : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] group-hover:bg-[var(--color-border)]'
                }">
                  ${item.badge}
                </span>
              ` : ''}
            </button>
          `;
        }).join('')}
      </nav>

      <!-- Bottom User & Theme Toggle -->
      <div class="p-3 border-t border-[var(--color-border-subtle)] flex flex-col gap-2">
        <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--color-bg-subtle)]">
          <div class="flex items-center gap-2.5">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" class="w-8 h-8 rounded-full object-cover ring-2 ring-[#FF6B4A]/30" />
            <div class="overflow-hidden">
              <p class="text-xs font-semibold text-[var(--color-text-main)] truncate">Xuân Sơn</p>
              <p class="text-[10px] text-[var(--color-text-muted)] truncate">xuantrippr@dithoi.vn</p>
            </div>
          </div>
          <button onclick="window.app.toggleTheme()" title="Đổi giao diện Sáng / Tối" class="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-hover)] transition-colors">
            <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- MOBILE TOP APP BAR (<768px) -->
    <header class="md:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--color-bg-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Hamburger Menu Button -->
        <button 
          onclick="window.app.toggleMobileMenu(true)" 
          title="Mở menu danh mục"
          class="p-2 -ml-1 rounded-xl text-[var(--color-text-main)] hover:bg-[var(--color-bg-subtle)] active:scale-95 transition-all"
        >
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>

        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF6B4A] to-[#FFA07A] flex items-center justify-center text-white shadow-sm">
            <i data-lucide="map-pin" class="w-4 h-4 stroke-[2.5]"></i>
          </div>
          <span class="font-black text-base tracking-tight text-[var(--color-text-main)]">Đi Thôi</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Streak chip on mobile -->
        <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3D221B] dark:text-[#FF7B5C] text-xs font-bold">
          <span>🔥</span>
          <span>${store.streakWeeks} tuần</span>
        </div>

        <!-- Dark mode toggle -->
        <button onclick="window.app.toggleTheme()" class="p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
          <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-4 h-4"></i>
        </button>

        <!-- Avatar -->
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Avatar" class="w-7 h-7 rounded-full object-cover ring-2 ring-[#FF6B4A]/30" />
      </div>
    </header>

    <!-- MOBILE SLIDING DRAWER MENU (<768px) -->
    <div id="mobile-drawer-overlay" class="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden transition-opacity" onclick="window.app.toggleMobileMenu(false)">
      <div 
        id="mobile-drawer-content" 
        class="w-[280px] max-w-[85vw] h-full bg-[var(--color-bg-surface)] text-[var(--color-text-main)] border-r border-[var(--color-border)] p-5 flex flex-col justify-between shadow-2xl transform -translate-x-full transition-transform duration-300"
        onclick="event.stopPropagation()"
      >
        <div>
          <!-- Drawer Header -->
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border)]">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B4A] to-[#FFA07A] flex items-center justify-center text-white shadow-md">
                <i data-lucide="map-pin" class="w-5 h-5 stroke-[2.5]"></i>
              </div>
              <div>
                <span class="font-extrabold text-lg text-[var(--color-text-main)]">Đi Thôi</span>
                <p class="text-[11px] text-[var(--color-text-muted)]">Tất cả mục điều hướng</p>
              </div>
            </div>
            <button onclick="window.app.toggleMobileMenu(false)" class="p-1.5 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Drawer Navigation List (Đầy đủ 6 mục) -->
          <div class="space-y-1">
            <p class="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Danh mục ứng dụng</p>
            ${menuItems.map(item => {
              const isActive = currentTab === item.id;
              return `
                <button 
                  onclick="window.app.navigate('${item.id}'); window.app.toggleMobileMenu(false);" 
                  class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3D221B] dark:text-[#FF7B5C]' 
                      : 'text-[var(--color-text-main)] hover:bg-[var(--color-bg-subtle)]'
                  }"
                >
                  <div class="flex items-center gap-3">
                    <i data-lucide="${item.icon}" class="w-5 h-5 ${isActive ? 'text-[#FF6B4A]' : 'text-[var(--color-text-muted)]'}"></i>
                    <span>${item.label}</span>
                  </div>
                  ${item.badge !== null ? `
                    <span class="text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#FF6B4A] text-white' : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]'
                    }">
                      ${item.badge}
                    </span>
                  ` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Drawer User info & Action -->
        <div class="pt-4 border-t border-[var(--color-border)]">
          <div class="flex items-center gap-3 p-3 rounded-2xl bg-[var(--color-bg-subtle)]">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" class="w-10 h-10 rounded-full object-cover ring-2 ring-[#FF6B4A]/30" />
            <div class="overflow-hidden">
              <p class="text-xs font-bold text-[var(--color-text-main)]">Xuân Sơn</p>
              <p class="text-[11px] text-[var(--color-text-muted)]">xuantrippr@dithoi.vn</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MOBILE BOTTOM NAVIGATION TAB BAR (<768px) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] flex items-center justify-around py-1.5 px-1 shadow-lg">
      <!-- 1. Trang chủ -->
      <button onclick="window.app.navigate('home')" class="flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentTab === 'home' ? 'text-[#FF6B4A] font-bold' : 'text-[var(--color-text-muted)]'}">
        <i data-lucide="compass" class="w-5 h-5"></i>
        <span class="text-[10px] mt-0.5">Trang chủ</span>
      </button>

      <!-- 2. Wishlist -->
      <button onclick="window.app.navigate('wishlist')" class="flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentTab === 'wishlist' ? 'text-[#FF6B4A] font-bold' : 'text-[var(--color-text-muted)]'}">
        <div class="relative">
          <i data-lucide="bookmark" class="w-5 h-5"></i>
          <span class="absolute -top-1 -right-2 text-[9px] w-3.5 h-3.5 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center font-bold">
            ${store.places.filter(p => p.status === 'want').length}
          </span>
        </div>
        <span class="text-[10px] mt-0.5">Wishlist</span>
      </button>

      <!-- 3. Center Floating Plus Button -->
      <div class="flex items-center justify-center px-1">
        <button onclick="window.app.openQuickAddModal()" title="Thêm địa điểm nhanh" class="w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-[#FF6B4A] to-[#FFA07A] text-white flex items-center justify-center shadow-lg shadow-[#FF6B4A]/35 active:scale-95 transition-transform">
          <i data-lucide="plus" class="w-6 h-6 stroke-[2.5]"></i>
        </button>
      </div>

      <!-- 4. Kế hoạch -->
      <button onclick="window.app.navigate('planner')" class="flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentTab === 'planner' ? 'text-[#FF6B4A] font-bold' : 'text-[var(--color-text-muted)]'}">
        <i data-lucide="calendar" class="w-5 h-5"></i>
        <span class="text-[10px] mt-0.5">Kế hoạch</span>
      </button>

      <!-- 5. Menu / Xem tất cả (Nhóm, Nhật ký, Khám phá...) -->
      <button onclick="window.app.toggleMobileMenu(true)" class="flex flex-col items-center justify-center flex-1 py-1 transition-colors ${['explore', 'group', 'journal'].includes(currentTab) ? 'text-[#FF6B4A] font-bold' : 'text-[var(--color-text-muted)]'}">
        <i data-lucide="menu" class="w-5 h-5"></i>
        <span class="text-[10px] mt-0.5">Menu</span>
      </button>
    </nav>
  `;
}
