/**
 * CHƯƠNG TRÌNH CHÍNH (APP CONTROLLER)
 * Điều phối render các màn hình, tương tác kéo thả, Leaflet Map và lưu trữ
 */

import { store } from './data/store.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderPlaceCard } from './components/PlaceCard.js';
import { renderFilterBar } from './components/FilterBar.js';
import { renderKanbanBoard } from './components/KanbanColumn.js';
import { renderRightPanel } from './components/MapPanel.js';
import { renderAIPlanner } from './components/AIPlanner.js';
import { renderModals } from './components/Modals.js';

class LetGoApp {
  constructor() {
    this.store = store;
    this.miniMap = null;
    this.mainMap = null;
    this.plannerMap = null;
    this.selectedPlannerDay = "Thứ Bảy";
    this.currentDraggedId = null;
  }

  init() {
    // Apply saved theme
    if (this.store.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Subscribe to store updates
    this.store.subscribe(() => {
      this.render();
    });

    // Initial render
    this.render();

    // Listen to hash changes for deep linking
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (['home', 'wishlist', 'planner', 'explore', 'group', 'journal'].includes(hash)) {
        this.store.setActiveTab(hash);
      }
    });

    // Check hash on load
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && ['home', 'wishlist', 'planner', 'explore', 'group', 'journal'].includes(initialHash)) {
      this.store.setActiveTab(initialHash);
    }
  }

  render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    appEl.innerHTML = `
      <div class="flex min-h-screen w-full bg-[var(--color-bg-base)] text-[var(--color-text-main)] transition-colors">
        <!-- CỘT 1: SIDEBAR TRÁI 240px CỐ ĐỊNH -->
        ${renderSidebar(this.store)}

        <!-- CỘT 2: NỘI DUNG CHÍNH (FLUID, FULL WIDTH, KHÔNG GIỚI HẠN MAX-WIDTH HẸP) -->
        <main class="flex-1 min-w-0 flex flex-col p-4 sm:p-6 lg:p-8 pt-18 md:pt-6 pb-28 md:pb-8 overflow-y-auto">
          <!-- Top Header Navigation & Quick Search -->
          <header class="flex items-center justify-between gap-4 mb-6 select-none">
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-black text-[var(--color-text-main)] tracking-tight">
                  ${this.getPageTitle()}
                </h1>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold">
                  ${this.store.places.length} điểm
                </span>
              </div>
              <p class="text-xs text-[var(--color-text-muted)] mt-0.5">${this.getPageSubtitle()}</p>
            </div>

            <!-- Header Quick Actions -->
            <div class="flex items-center gap-2.5">
              <button 
                onclick="window.app.openQuickAddModal()"
                class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/20 transition-all hover:shadow"
              >
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Thêm quán mới</span>
              </button>
            </div>
          </header>

          <!-- SCREEN VIEW CONTENT -->
          <div class="w-full flex-1">
            ${this.renderActiveScreen()}
          </div>
        </main>

        <!-- CỘT 3: PANEL PHẢI 340px (ẨN DƯỚI 1280px) -->
        ${renderRightPanel(this.store)}

        <!-- MODALS -->
        ${renderModals()}
      </div>
    `;

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Initialize Maps after DOM rendered
    setTimeout(() => {
      this.initMiniMap();
      if (this.store.activeTab === 'wishlist' && this.store.viewMode === 'map') {
        this.initMainMap();
      }
      if (this.store.activeTab === 'planner') {
        this.initPlannerMap();
      }
    }, 50);
  }

  getPageTitle() {
    switch (this.store.activeTab) {
      case 'home': return 'Xin chào Xuân Sơn 👋';
      case 'wishlist': return 'Danh sách Wishlist';
      case 'planner': return 'Lên kế hoạch tuần này';
      case 'explore': return 'Khám phá & Trợ lý AI';
      case 'group': return 'Nhóm đi chung: Hội Báo Sài Gòn';
      case 'journal': return 'Nhật ký kỷ niệm đã đi';
      default: return 'Đi Thôi';
    }
  }

  getPageSubtitle() {
    switch (this.store.activeTab) {
      case 'home': return 'Biến câu "bữa nào rảnh đi" thành hành trình thật!';
      case 'wishlist': return 'Tất cả địa điểm bạn đã lưu từ Google Maps, TikTok và bạn bè.';
      case 'planner': return 'Sắp xếp lịch trình các ngày, xem đường nối trên bản đồ.';
      case 'explore': return 'Khám phá quán mới hoặc để AI thiết kế lịch trình cho bạn.';
      case 'group': return 'Bình chọn địa điểm được cả nhóm yêu thích nhất.';
      case 'journal': return 'Khoảnh khắc, đánh giá sao và cảm nhận sau mỗi chuyến đi.';
      default: return '';
    }
  }

  renderActiveScreen() {
    switch (this.store.activeTab) {
      case 'home': return this.renderHomeScreen();
      case 'wishlist': return this.renderWishlistScreen();
      case 'planner': return this.renderPlannerScreen();
      case 'explore': return renderAIPlanner(this.store);
      case 'group': return this.renderGroupScreen();
      case 'journal': return this.renderJournalScreen();
      default: return this.renderHomeScreen();
    }
  }

  // 1. MÀN HÌNH TRANG CHỦ
  renderHomeScreen() {
    const overduePlaces = this.store.getOverduePlaces();
    const suggestedPlaces = this.store.getSuggestedPlaces();
    const recentWishlist = this.store.places.slice(0, 8);

    return `
      <div class="space-y-8">
        <!-- BANNER THÊM NHANH TRỰC TIẾP -->
        <div class="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#FF6B4A] via-[#FF7B5C] to-[#FFA07A] text-white shadow-lg shadow-[#FF6B4A]/20">
          <div class="relative z-10 max-w-3xl">
            <span class="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
              Bắt đầu ngay hôm nay
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Đừng để quán ngon chỉ nằm trong câu "mai mốt đi"!
            </h2>
            <p class="text-xs sm:text-sm text-white/90 mt-1.5 mb-5 max-w-xl">
              Thêm nhanh một quán bạn vừa thấy trên TikTok hoặc Google Maps để ứng dụng nhắc bạn lên lịch đi ngay cuối tuần này.
            </p>

            <!-- Ô THÊM NHANH (Dán link / Gõ tên) -->
            <form onsubmit="window.app.handleHomeQuickAdd(event)" class="flex flex-col sm:flex-row gap-2.5">
              <div class="relative flex-1">
                <i data-lucide="link" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                <input 
                  id="home-quick-input"
                  type="text" 
                  required
                  placeholder="Dán link Google Maps / TikTok hoặc gõ tên quán..." 
                  class="w-full bg-white text-gray-800 text-sm pl-10 pr-4 py-3 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-gray-400 font-medium"
                />
              </div>
              <button 
                type="submit" 
                class="px-6 py-3 rounded-2xl bg-[#2B2B2B] hover:bg-black text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
              >
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Thêm vào Wishlist</span>
              </button>
            </form>
          </div>

          <!-- Decorative Background Elements -->
          <div class="absolute -right-8 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        </div>

        <!-- MỤC "LƯU LÂU RỒI, ĐI CHƯA?" (>14 ngày chưa đi) -->
        ${overduePlaces.length > 0 ? `
          <section class="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 sm:p-6 transition-colors">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <i data-lucide="alarm-clock" class="w-5 h-5"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-extrabold text-base sm:text-lg text-[var(--color-text-main)]">Lưu lâu rồi, đi chưa?</h3>
                    <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                      ${overduePlaces.length} quán
                    </span>
                  </div>
                  <p class="text-xs text-[var(--color-text-muted)]">Các địa điểm bạn lưu hơn 2 tuần trước nhưng chưa lên lịch. Đi thôi kẻo nguội!</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
              ${overduePlaces.slice(0, 4).map(place => renderPlaceCard(place, { highlightOverdue: true })).join('')}
            </div>
          </section>
        ` : ''}

        <!-- HÀNG "GỢI Ý ĐI TUẦN NÀY" (Ngang) -->
        <section>
          <div class="flex items-center justify-between mb-3.5">
            <div>
              <h3 class="font-extrabold text-lg text-[var(--color-text-main)]">Gợi ý đi tuần này 🌟</h3>
              <p class="text-xs text-[var(--color-text-muted)]">Những địa điểm hợp thời tiết, đông vui và được đánh giá cao nhất</p>
            </div>
            <button onclick="window.app.navigate('explore')" class="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
              <span>Xem tất cả</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Horizontal scrollable row -->
          <div class="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none">
            ${suggestedPlaces.map(place => `
              <div class="w-[280px] shrink-0">
                ${renderPlaceCard(place)}
              </div>
            `).join('')}
          </div>
        </section>

        <!-- LƯỚI WISHLIST MỚI THÊM (CSS Grid auto-fill minmax(260px, 1fr)) -->
        <section>
          <div class="flex items-center justify-between mb-3.5">
            <div>
              <h3 class="font-extrabold text-lg text-[var(--color-text-main)]">Wishlist mới thêm gần đây</h3>
              <p class="text-xs text-[var(--color-text-muted)]">Lưới tự động mở rộng theo kích thước màn hình máy tính</p>
            </div>
            <button onclick="window.app.navigate('wishlist')" class="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
              <span>Quản lý Wishlist</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
            ${recentWishlist.map(place => renderPlaceCard(place)).join('')}
          </div>
        </section>
      </div>
    `;
  }

  // 2. MÀN HÌNH WISHLIST (3 CHẾ ĐỘ XEM)
  renderWishlistScreen() {
    const filtered = this.store.getFilteredPlaces();
    const mode = this.store.viewMode;

    return `
      <div>
        <!-- Thanh lọc ngang FilterBar -->
        ${renderFilterBar(this.store)}

        <!-- Active View Mode Content -->
        ${mode === 'grid' ? `
          ${filtered.length === 0 ? `
            <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl p-12 text-center">
              <i data-lucide="search-x" class="w-12 h-12 mx-auto text-[var(--color-text-muted)] mb-3 opacity-60"></i>
              <h4 class="text-base font-bold text-[var(--color-text-main)]">Không tìm thấy địa điểm phù hợp</h4>
              <p class="text-xs text-[var(--color-text-muted)] mt-1">Hãy thử xóa bộ lọc hoặc đổi từ khóa tìm kiếm</p>
              <button onclick="window.app.resetFilters()" class="mt-4 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold">
                Đặt lại bộ lọc
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
              ${filtered.map(place => renderPlaceCard(place)).join('')}
            </div>
          `}
        ` : ''}

        ${mode === 'kanban' ? `
          ${renderKanbanBoard(this.store)}
        ` : ''}

        ${mode === 'map' ? `
          <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3 px-2">
              <span class="text-xs font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                <i data-lucide="map-pin" class="w-4 h-4 text-[#FF6B4A]"></i>
                Hiển thị ${filtered.length} địa điểm trên bản đồ tương tác
              </span>
              <span class="text-xs text-[var(--color-text-muted)]">Click vào từng marker để xem quán</span>
            </div>
            <div id="main-map-container" class="w-full h-[620px] rounded-2xl overflow-hidden border border-[var(--color-border)]"></div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 3. MÀN HÌNH PLANNER (LÊN KẾ HOẠCH THEO NGÀY & ROUTE BẢN ĐỒ)
  renderPlannerScreen() {
    const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
    const currentDay = this.selectedPlannerDay;
    const planItemIds = this.store.weekPlans[currentDay] || [];
    const placesInDay = planItemIds.map(id => this.store.places.find(p => p.id === id)).filter(Boolean);
    const unassignedWantPlaces = this.store.places.filter(p => p.status === 'want');

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- CỘT TRÁI (7 CỘT): TIMELINE THEO NGÀY & KÉO THẢ TỪ WISHLIST -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Thanh chọn các ngày trong tuần -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            ${days.map(day => {
              const count = (this.store.weekPlans[day] || []).length;
              const isSelected = currentDay === day;
              return `
                <button 
                  onclick="window.app.selectPlannerDay('${day}')"
                  class="flex flex-col items-center min-w-[85px] py-2.5 px-3 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md shadow-[#FF6B4A]/25' 
                      : 'bg-[var(--color-bg-surface)] text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
                  }"
                >
                  <span class="text-xs font-bold">${day}</span>
                  <span class="text-[10px] mt-0.5 opacity-90">${count} điểm</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Timeline lịch trình của ngày được chọn -->
          <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl p-5 shadow-sm">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)]">
              <div>
                <h3 class="font-extrabold text-base text-[var(--color-text-main)]">Lịch trình: ${currentDay}</h3>
                <p class="text-xs text-[var(--color-text-muted)]">Kéo từ wishlist bên dưới hoặc bản đồ để thêm điểm</p>
              </div>
              <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                ${placesInDay.length} chặng dừng
              </span>
            </div>

            <!-- List chặng dừng -->
            <div class="space-y-3">
              ${placesInDay.length === 0 ? `
                <div class="p-8 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-center text-[var(--color-text-muted)]">
                  <i data-lucide="calendar-plus" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
                  <p class="text-sm font-semibold">Chưa có điểm nào cho ${currentDay}</p>
                  <p class="text-xs text-[var(--color-text-subtle)] mt-0.5">Chọn quán từ danh sách "Wishlist đang chờ" bên dưới để gán vào ngày này</p>
                </div>
              ` : `
                ${placesInDay.map((place, idx) => `
                  <div class="flex items-center gap-3 p-3 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] group">
                    <span class="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white font-black text-xs flex items-center justify-center shrink-0">
                      ${idx + 1}
                    </span>
                    <img src="${place.imageUrl}" alt="${place.title}" class="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-sm text-[var(--color-text-main)] truncate">${place.title}</h4>
                      <p class="text-xs text-[var(--color-text-muted)] truncate flex items-center gap-1 mt-0.5">
                        <i data-lucide="map-pin" class="w-3 h-3 text-[#FF6B4A]"></i>
                        ${place.location} • <span class="font-semibold text-[var(--color-primary)]">${place.priceText}</span>
                      </p>
                    </div>
                    <div class="flex items-center gap-1">
                      <button 
                        onclick="window.app.markVisited('${place.id}')"
                        title="Đã đi xong chặng này"
                        class="p-2 rounded-xl text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/40"
                      >
                        <i data-lucide="check" class="w-4 h-4"></i>
                      </button>
                      <button 
                        onclick="window.app.removeFromPlanner('${place.id}', '${currentDay}')"
                        title="Xóa khỏi ngày này"
                        class="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </div>
                `).join('')}
              `}
            </div>
          </div>

          <!-- Danh sách Wishlist chờ gán vào lịch -->
          <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl p-5 shadow-sm">
            <h3 class="font-bold text-sm text-[var(--color-text-main)] mb-1">Wishlist đang chờ (${unassignedWantPlaces.length})</h3>
            <p class="text-xs text-[var(--color-text-muted)] mb-3.5">Bấm nút "Gán vào ${currentDay}" để thêm điểm vào lịch</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              ${unassignedWantPlaces.slice(0, 6).map(place => `
                <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
                  <div class="flex items-center gap-2 min-w-0">
                    <img src="${place.imageUrl}" class="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-[var(--color-text-main)] truncate">${place.title}</p>
                      <p class="text-[11px] text-[var(--color-text-muted)] truncate">${place.location}</p>
                    </div>
                  </div>
                  <button 
                    onclick="window.app.assignToDay('${place.id}', '${currentDay}')"
                    class="px-2.5 py-1 rounded-lg bg-[var(--color-primary)] text-white text-[11px] font-bold shrink-0 hover:bg-[var(--color-primary-hover)]"
                  >
                    + Gán
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- CỘT PHẢI (5 CỘT): BẢN ĐỒ CÓ ROUTE CÁC ĐIỂM TRONG NGÀY -->
        <div class="lg:col-span-5 sticky top-6">
          <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3 px-2">
              <div class="flex items-center gap-2">
                <i data-lucide="navigation" class="w-4 h-4 text-[#FF6B4A]"></i>
                <h3 class="font-bold text-sm text-[var(--color-text-main)]">Route lộ trình: ${currentDay}</h3>
              </div>
              <span class="text-xs font-semibold text-[var(--color-primary)]">Đường nối GPS</span>
            </div>
            <!-- Leaflet Container with route Polyline -->
            <div id="planner-map-container" class="w-full h-[520px] rounded-2xl overflow-hidden border border-[var(--color-border)]"></div>
          </div>
        </div>
      </div>
    `;
  }

  // 5. MÀN HÌNH NHÓM (WISHLIST CHUNG + VOTE + AVATAR)
  renderGroupScreen() {
    const places = this.store.places;
    const members = this.store.groupMembers;

    return `
      <div class="space-y-6">
        <!-- Group Header Card -->
        <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3D221B]">Nhóm bạn thân</span>
              <h2 class="text-xl font-black text-[var(--color-text-main)]">Hội Báo Sài Gòn 🚀</h2>
            </div>
            <p class="text-xs text-[var(--color-text-muted)] mt-1">Cùng bình chọn những quán thích nhất để cả nhóm xách xe đi chung!</p>
          </div>

          <!-- Members Avatars -->
          <div class="flex items-center gap-3">
            <div class="flex -space-x-2 overflow-hidden">
              ${members.map(m => `
                <img src="${m.avatar}" alt="${m.name}" title="${m.name} (${m.role})" class="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover" />
              `).join('')}
            </div>
            <button onclick="alert('Đã sao chép link mời tham gia nhóm!')" class="px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-xs font-bold text-[var(--color-text-main)] hover:border-[var(--color-primary)] flex items-center gap-1.5">
              <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
              <span>Mời bạn</span>
            </button>
          </div>
        </div>

        <!-- Wishlist Chung & Bảng xếp hạng Vote -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-lg text-[var(--color-text-main)]">Danh sách đề cử đi chơi (Bình chọn)</h3>
              <p class="text-xs text-[var(--color-text-muted)]">Địa điểm nào nhiều vote nhất sẽ được ưu tiên lên lịch tuần tới</p>
            </div>
          </div>

          <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
            ${[...places].sort((a, b) => (b.votes || 0) - (a.votes || 0)).map(place => renderPlaceCard(place)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 6. MÀN HÌNH NHẬT KÝ (NHỮNG NƠI ĐÃ ĐI, ẢNH + ĐÁNH GIÁ SAO)
  renderJournalScreen() {
    const visitedPlaces = this.store.getVisitedPlaces();

    return `
      <div class="space-y-6">
        <!-- Journal Summary Banner -->
        <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-[var(--color-text-main)]">Dấu chân trải nghiệm ✨</h2>
            <p class="text-xs text-[var(--color-text-muted)] mt-1">Nơi lưu giữ từng khoảnh khắc, đánh giá sao và món ngon đã thưởng thức.</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-black text-emerald-600">${visitedPlaces.length}</span>
            <p class="text-xs text-[var(--color-text-muted)]">Nơi đã check-in</p>
          </div>
        </div>

        ${visitedPlaces.length === 0 ? `
          <div class="p-12 text-center bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl">
            <i data-lucide="award" class="w-12 h-12 mx-auto text-[var(--color-text-muted)] mb-3 opacity-50"></i>
            <h4 class="font-bold text-base text-[var(--color-text-main)]">Chưa có nhật ký nào</h4>
            <p class="text-xs text-[var(--color-text-muted)] mt-1">Khi bạn đi xong một quán, hãy bấm "Đã ghé quán" để viết kỷ niệm nhé!</p>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            ${visitedPlaces.map(place => `
              <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row">
                <img src="${place.imageUrl}" alt="${place.title}" class="w-full sm:w-48 h-48 sm:h-auto object-cover shrink-0" />
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Đã ghé • ${place.visitedDate || 'Gần đây'}
                      </span>
                      <div class="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
                        <span>${place.rating || 5}.0</span>
                      </div>
                    </div>
                    <h3 class="font-bold text-base text-[var(--color-text-main)] mb-1">${place.title}</h3>
                    <p class="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mb-3">
                      <i data-lucide="map-pin" class="w-3 h-3 text-[#FF6B4A]"></i>
                      ${place.location}
                    </p>
                    <p class="text-xs text-[var(--color-text-main)] bg-[var(--color-bg-subtle)] p-2.5 rounded-xl italic">
                      "${place.reviewNote || 'Quán rất ngon và không gian dễ chịu, chắc chắn sẽ quay lại!'}"
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                    <span class="text-xs text-[var(--color-text-muted)]">Chi phí: ${place.priceText}</span>
                    <button onclick="window.app.openReviewModal('${place.id}')" class="text-xs font-bold text-[var(--color-primary)] hover:underline">
                      Sửa cảm nhận
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // MAP INITIALIZATIONS (LEAFLET)
  initMiniMap() {
    const el = document.getElementById('mini-map-container');
    if (!el || !window.L) return;

    if (this.miniMap) {
      this.miniMap.remove();
      this.miniMap = null;
    }

    try {
      this.miniMap = window.L.map('mini-map-container', {
        zoomControl: false,
        attributionControl: false
      }).setView([10.7769, 106.7009], 11);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      }).addTo(this.miniMap);

      // Add pins
      this.store.places.forEach(p => {
        if (p.mapCoords) {
          const color = p.status === 'visited' ? '#10B981' : (p.status === 'scheduled' ? '#3B82F6' : '#FF6B4A');
          const circle = window.L.circleMarker(p.mapCoords, {
            radius: 6,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(this.miniMap);
          circle.bindPopup(`<b>${p.title}</b><br/><span style="font-size:11px;">${p.location}</span>`);
        }
      });
    } catch (e) {
      console.warn("Could not init mini map", e);
    }
  }

  initMainMap() {
    const el = document.getElementById('main-map-container');
    if (!el || !window.L) return;

    if (this.mainMap) {
      this.mainMap.remove();
      this.mainMap = null;
    }

    try {
      const filtered = this.store.getFilteredPlaces();
      this.mainMap = window.L.map('main-map-container').setView([10.7769, 106.7009], 12);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.mainMap);

      const markers = [];
      filtered.forEach(p => {
        if (p.mapCoords) {
          const color = p.status === 'visited' ? '#10B981' : (p.status === 'scheduled' ? '#3B82F6' : '#FF6B4A');
          const marker = window.L.circleMarker(p.mapCoords, {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.95
          }).addTo(this.mainMap);

          marker.bindPopup(`
            <div style="font-family:'Be Vietnam Pro',sans-serif; min-width: 180px;">
              <img src="${p.imageUrl}" style="width:100%; height:90px; object-fit:cover; border-radius:8px; margin-bottom:6px;" />
              <b style="font-size:13px; color:#2B2B2B;">${p.title}</b>
              <p style="font-size:11px; color:#736E66; margin:3px 0;">${p.location}</p>
              <div style="display:flex; justify-content:space-between; margin-top:6px;">
                <span style="font-size:11px; font-weight:bold; color:#FF6B4A;">${p.priceText}</span>
                <span style="font-size:11px; font-weight:bold;">${p.categoryLabel}</span>
              </div>
            </div>
          `);
          markers.push(marker);
        }
      });

      if (markers.length > 0) {
        const group = new window.L.featureGroup(markers);
        this.mainMap.fitBounds(group.getBounds().pad(0.15));
      }
    } catch (e) {
      console.warn("Could not init main map", e);
    }
  }

  initPlannerMap() {
    const el = document.getElementById('planner-map-container');
    if (!el || !window.L) return;

    if (this.plannerMap) {
      this.plannerMap.remove();
      this.plannerMap = null;
    }

    try {
      const planItemIds = this.store.weekPlans[this.selectedPlannerDay] || [];
      const placesInDay = planItemIds.map(id => this.store.places.find(p => p.id === id)).filter(Boolean);

      this.plannerMap = window.L.map('planner-map-container').setView([10.7769, 106.7009], 13);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(this.plannerMap);

      const latlngs = [];
      placesInDay.forEach((p, idx) => {
        if (p.mapCoords) {
          latlngs.push(p.mapCoords);
          const marker = window.L.marker(p.mapCoords).addTo(this.plannerMap);
          marker.bindPopup(`<b>Chặng ${idx + 1}: ${p.title}</b><br/>${p.location}`);
        }
      });

      if (latlngs.length > 1) {
        // Vẽ đường nối giữa các địa điểm trong ngày (Route Polyline)
        const polyline = window.L.polyline(latlngs, {
          color: '#FF6B4A',
          weight: 4,
          dashArray: '8, 8',
          opacity: 0.8
        }).addTo(this.plannerMap);
        this.plannerMap.fitBounds(polyline.getBounds().pad(0.2));
      } else if (latlngs.length === 1) {
        this.plannerMap.setView(latlngs[0], 14);
      }
    } catch (e) {
      console.warn("Could not init planner map", e);
    }
  }

  // NAVIGATION & ACTIONS
  navigate(tab) {
    this.store.setActiveTab(tab);
    window.location.hash = tab;
  }

  setViewMode(mode) {
    this.store.setViewMode(mode);
  }

  setCategoryFilter(cat) {
    this.store.setFilter('category', cat);
  }

  setFilter(key, val) {
    this.store.setFilter(key, val);
  }

  resetFilters() {
    this.store.resetFilters();
  }

  toggleTheme() {
    this.store.toggleTheme();
  }

  selectPlannerDay(day) {
    this.selectedPlannerDay = day;
    this.render();
  }

  assignToDay(placeId, day) {
    this.store.assignToPlan(placeId, day);
  }

  removeFromPlanner(placeId, day) {
    this.store.removeFromPlan(placeId, day);
  }

  // DRAG & DROP HANDLERS
  handleDragStart(event, placeId) {
    this.currentDraggedId = placeId;
    event.dataTransfer.setData('text/plain', placeId);
    event.currentTarget.classList.add('dragging');
  }

  handleDragEnd(event) {
    event.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.kanban-col-droppable').forEach(el => el.classList.remove('drag-over'));
  }

  handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  }

  handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
  }

  handleDrop(event, targetStatus) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    const placeId = event.dataTransfer.getData('text/plain') || this.currentDraggedId;
    if (placeId) {
      this.store.changeStatus(placeId, targetStatus);
    }
  }

  // MODAL HANDLERS
  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  }

  openQuickAddModal() {
    this.openModal('modal-quick-add');
  }

  handleSmartPaste(text) {
    if (!text) return;
    const titleEl = document.getElementById('qa-title');
    const locEl = document.getElementById('qa-location');

    // Smart recognition simulation for Google Maps or names
    if (text.includes('maps') || text.includes('goo.gl')) {
      if (titleEl && !titleEl.value) titleEl.value = "Quán mới từ Google Maps";
      if (locEl && !locEl.value) locEl.value = "TP. Hồ Chí Minh";
    } else if (text.length > 2) {
      if (titleEl && !titleEl.value) titleEl.value = text;
      if (locEl && !locEl.value) locEl.value = "TP. Hồ Chí Minh";
    }
  }

  handleQuickAddSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('qa-title').value;
    const location = document.getElementById('qa-location').value;
    const priceRange = document.getElementById('qa-price').value;
    const categoryEl = document.querySelector('input[name="qa-category"]:checked');
    const category = categoryEl ? categoryEl.value : 'an';

    const categoryLabels = {
      an: 'Ăn ngon',
      uong: 'Cà phê chill',
      choi: 'Chơi vui',
      dulich: 'Du lịch'
    };

    this.store.addPlace({
      title,
      location,
      priceRange,
      category,
      categoryLabel: categoryLabels[category] || 'Ăn ngon',
      priceText: priceRange === '$' ? 'Dưới 50k' : (priceRange === '$$' ? '50k - 200k' : 'Trên 200k'),
      status: 'want'
    });

    this.closeModal('modal-quick-add');
  }

  handleHomeQuickAdd(event) {
    event.preventDefault();
    const input = document.getElementById('home-quick-input');
    if (!input || !input.value.trim()) return;

    const val = input.value.trim();
    this.store.addPlace({
      title: val.startsWith('http') ? 'Địa điểm từ liên kết' : val,
      location: 'TP. Hồ Chí Minh',
      category: 'an',
      categoryLabel: 'Ăn ngon',
      priceRange: '$$',
      priceText: '50k - 150k',
      status: 'want',
      sourceLink: val.startsWith('http') ? val : ''
    });

    input.value = '';
    alert(`Đã thêm "${val}" vào Wishlist thành công!`);
  }

  openScheduleModal(placeId) {
    const place = this.store.places.find(p => p.id === placeId);
    if (!place) return;

    document.getElementById('schedule-place-id').value = placeId;
    document.getElementById('schedule-place-title').innerText = place.title;
    this.openModal('modal-schedule');
  }

  setScheduleTimeSlot(slot) {
    document.getElementById('schedule-time-val').value = slot;
    document.querySelectorAll('.time-slot-btn').forEach(btn => {
      btn.classList.remove('border-[var(--color-primary)]', 'bg-[#FFEBE6]', 'dark:bg-[#3D221B]');
    });
    if (event && event.currentTarget) {
      event.currentTarget.classList.add('border-[var(--color-primary)]', 'bg-[#FFEBE6]', 'dark:bg-[#3D221B]');
    }
  }

  handleScheduleSubmit(event) {
    event.preventDefault();
    const placeId = document.getElementById('schedule-place-id').value;
    const day = document.getElementById('schedule-day-select').value;
    const time = document.getElementById('schedule-time-val').value;

    this.store.assignToPlan(placeId, day);
    this.store.changeStatus(placeId, 'scheduled', { scheduledDayName: `${day} (${time})` });
    this.closeModal('modal-schedule');
  }

  markVisited(placeId) {
    this.openReviewModal(placeId);
  }

  openReviewModal(placeId) {
    const place = this.store.places.find(p => p.id === placeId);
    if (!place) return;

    document.getElementById('review-place-id').value = placeId;
    document.getElementById('review-place-title').innerText = place.title;
    document.getElementById('review-note-input').value = place.reviewNote || '';
    this.setRatingStar(place.rating ? Math.round(place.rating) : 5);
    this.openModal('modal-review');
  }

  setRatingStar(num) {
    document.getElementById('review-rating-val').value = num;
    document.querySelectorAll('.star-btn').forEach(btn => {
      const starVal = parseInt(btn.getAttribute('data-star') || '0', 10);
      const icon = btn.querySelector('svg, i');
      if (starVal <= num) {
        btn.classList.add('text-amber-400');
        if (icon) icon.classList.add('fill-amber-400');
      } else {
        btn.classList.remove('text-amber-400');
        if (icon) icon.classList.remove('fill-amber-400');
      }
    });
  }

  handleReviewSubmit(event) {
    event.preventDefault();
    const placeId = document.getElementById('review-place-id').value;
    const rating = parseFloat(document.getElementById('review-rating-val').value || '5');
    const note = document.getElementById('review-note-input').value;

    this.store.changeStatus(placeId, 'visited', {
      rating,
      reviewNote: note,
      visitedDate: new Date().toISOString().split('T')[0]
    });

    this.closeModal('modal-review');
  }

  deletePlace(placeId) {
    if (confirm("Bạn có chắc chắn muốn xóa địa điểm này khỏi danh sách?")) {
      this.store.deletePlace(placeId);
    }
  }

  toggleVote(placeId) {
    this.store.toggleVote(placeId);
  }

  sharePlace(placeId) {
    const place = this.store.places.find(p => p.id === placeId);
    if (!place) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Đi Thôi: Cùng ghé "${place.title}" tại ${place.location} nhé!`);
      alert(`Đã sao chép liên kết chia sẻ của "${place.title}"!`);
    } else {
      alert(`Chia sẻ: ${place.title} - ${place.location}`);
    }
  }

  viewPlaceDetail(placeId) {
    const place = this.store.places.find(p => p.id === placeId);
    if (!place) return;
    // Highlight or open options
    console.log("Viewing place:", place);
  }

  // AI TRIP GENERATOR
  setAIPrompt(text) {
    const input = document.getElementById('ai-prompt-input');
    if (input) input.value = text;
    this.generateAITrip();
  }

  generateAITrip() {
    const input = document.getElementById('ai-prompt-input');
    const prompt = input ? input.value : '1 ngày Đà Lạt 1 triệu';
    const container = document.getElementById('ai-result-container');
    if (!container) return;

    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="bg-[var(--color-bg-surface)] border border-[#FF6B4A]/40 rounded-3xl p-6 shadow-xl animate-fade-in space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3D221B]">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
            </span>
            <div>
              <h3 class="font-extrabold text-base text-[var(--color-text-main)]">Lịch trình AI tối ưu: "${prompt}"</h3>
              <p class="text-xs text-[var(--color-text-muted)]">Ngân sách dự kiến: ~950.000đ • 3 chặng dừng hoàn hảo</p>
            </div>
          </div>
          <button 
            onclick="window.app.saveAITripToWishlist()"
            class="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/20 transition-all flex items-center gap-1.5"
          >
            <i data-lucide="bookmark-plus" class="w-4 h-4"></i>
            <span>Lưu tất cả vào Wishlist</span>
          </button>
        </div>

        <!-- 3 Time steps -->
        <div class="space-y-3.5">
          <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
            <span class="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-xs shrink-0">07:00 - Sáng</span>
            <div class="flex-1">
              <h4 class="font-bold text-sm text-[var(--color-text-main)]">Săn mây Cầu Đất & Cà phê vợt sương sớm</h4>
              <p class="text-xs text-[var(--color-text-muted)] mt-0.5">Thưởng thức ly cà phê nóng giữa biển mây bồng bềnh, chi phí khoảng 65.000đ/người.</p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
            <span class="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-xs shrink-0">12:30 - Trưa</span>
            <div class="flex-1">
              <h4 class="font-bold text-sm text-[var(--color-text-main)]">Lẩu gà lá é Tao Ngộ & Tráng miệng dâu tây</h4>
              <p class="text-xs text-[var(--color-text-muted)] mt-0.5">Nồi lẩu nóng hổi thơm nồng ớt xiêm xanh và lá é giải cảm cực đã, khoảng 250.000đ/phần.</p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
            <span class="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-bold text-xs shrink-0">17:30 - Tối</span>
            <div class="flex-1">
              <h4 class="font-bold text-sm text-[var(--color-text-main)]">Gió Chiều Quán - BBQ bên hồ Tuyền Lâm ngắm hoàng hôn</h4>
              <p class="text-xs text-[var(--color-text-muted)] mt-0.5">Bếp than hồng nướng thịt thơm phức trong không khí se lạnh, khoảng 350.000đ/người.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  saveAITripToWishlist() {
    this.store.addPlace({
      title: "Săn mây Cầu Đất & Cà phê vợt",
      location: "Cầu Đất, Đà Lạt",
      category: "uong",
      categoryLabel: "Cà phê chill",
      priceRange: "$",
      priceText: "45k - 70k",
      status: "want",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      mapCoords: [11.8900, 108.5300]
    });
    alert("Đã lưu các điểm trong lịch trình AI vào Wishlist!");
    this.navigate('wishlist');
  }

  addPlaceToWishlistQuick(placeId) {
    const place = this.store.places.find(p => p.id === placeId);
    if (!place) return;
    this.store.changeStatus(placeId, 'want');
    alert(`Đã thêm "${place.title}" vào Wishlist!`);
  }
}

// Khởi tạo app toàn cục
window.app = new LetGoApp();
window.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
