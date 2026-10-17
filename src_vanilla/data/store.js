/**
 * QUẢN LÝ TRẠNG THÁI ỨNG DỤNG (STORE)
 * Lưu trữ đồng bộ vào LocalStorage, phát sự kiện cập nhật để re-render linh hoạt
 */

import { INITIAL_PLACES, INITIAL_GROUP_MEMBERS } from './initialPlaces.js';

const STORAGE_KEY_PLACES = 'dithoi_places_v1';
const STORAGE_KEY_THEME = 'dithoi_theme_v1';
const STORAGE_KEY_PLANS = 'dithoi_plans_v1';

class AppStore {
  constructor() {
    this.listeners = [];
    this.places = this.loadPlaces();
    this.groupMembers = INITIAL_GROUP_MEMBERS;
    this.activeTab = 'home'; // home, wishlist, planner, explore, group, journal
    this.viewMode = 'grid'; // grid, kanban, map
    this.filters = {
      category: 'all',
      location: 'all',
      priceRange: 'all',
      status: 'all',
      search: ''
    };
    this.theme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
    this.weekPlans = this.loadPlans();
    this.streakWeeks = 4; // 4 tuần liên tiếp ra ngoài
  }

  loadPlaces() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLACES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    return INITIAL_PLACES;
  }

  savePlaces() {
    try {
      localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(this.places));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
    this.notify();
  }

  loadPlans() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLANS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      "Thứ Hai": ["place-7"],
      "Thứ Ba": [],
      "Thứ Tư": [],
      "Thứ Năm": [],
      "Thứ Sáu": ["place-9"],
      "Thứ Bảy": ["place-11"],
      "Chủ Nhật": ["place-2"]
    };
  }

  savePlans() {
    try {
      localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(this.weekPlans));
    } catch (e) {}
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.notify();
  }

  toggleTheme() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.notify();
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.notify();
  }

  setFilter(key, value) {
    this.filters[key] = value;
    this.notify();
  }

  resetFilters() {
    this.filters = {
      category: 'all',
      location: 'all',
      priceRange: 'all',
      status: 'all',
      search: ''
    };
    this.notify();
  }

  // Quản lý Place
  addPlace(placeData) {
    const newPlace = {
      id: "place-" + Date.now(),
      title: placeData.title || "Địa điểm mới",
      location: placeData.location || "TP. Hồ Chí Minh",
      category: placeData.category || "an",
      categoryLabel: placeData.categoryLabel || "Ăn ngon",
      priceRange: placeData.priceRange || "$$",
      priceText: placeData.priceText || "50k - 100k",
      status: placeData.status || "want",
      savedDaysAgo: 0,
      rating: placeData.rating || 4.5,
      reviewNote: placeData.reviewNote || "",
      imageUrl: placeData.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      mapCoords: placeData.mapCoords || [10.7769, 106.7009],
      votes: 1,
      sourceLink: placeData.sourceLink || "",
      tags: placeData.tags || ["Mới thêm", "Cuối tuần"],
      suggestedWeek: false,
      scheduledDate: placeData.scheduledDate || null
    };
    this.places.unshift(newPlace);
    this.savePlaces();
    return newPlace;
  }

  updatePlace(id, updates) {
    this.places = this.places.map(p => p.id === id ? { ...p, ...updates } : p);
    this.savePlaces();
  }

  deletePlace(id) {
    this.places = this.places.filter(p => p.id !== id);
    // Xoá khỏi planner nếu có
    Object.keys(this.weekPlans).forEach(day => {
      this.weekPlans[day] = this.weekPlans[day].filter(pid => pid !== id);
    });
    this.savePlaces();
    this.savePlans();
  }

  changeStatus(id, newStatus, extraData = {}) {
    this.places = this.places.map(p => {
      if (p.id === id) {
        const updated = { ...p, status: newStatus, ...extraData };
        if (newStatus === 'visited' && !updated.visitedDate) {
          updated.visitedDate = new Date().toISOString().split('T')[0];
        }
        return updated;
      }
      return p;
    });
    this.savePlaces();
  }

  toggleVote(id) {
    this.places = this.places.map(p => {
      if (p.id === id) {
        return { ...p, votes: (p.votes || 0) + 1 };
      }
      return p;
    });
    this.savePlaces();
  }

  assignToPlan(placeId, dayName) {
    if (!this.weekPlans[dayName]) this.weekPlans[dayName] = [];
    if (!this.weekPlans[dayName].includes(placeId)) {
      this.weekPlans[dayName].push(placeId);
    }
    this.changeStatus(placeId, 'scheduled', { scheduledDayName: dayName });
    this.savePlans();
  }

  removeFromPlan(placeId, dayName) {
    if (this.weekPlans[dayName]) {
      this.weekPlans[dayName] = this.weekPlans[dayName].filter(id => id !== placeId);
      this.savePlans();
    }
  }

  // Thống kê & Tính toán logic
  getFilteredPlaces() {
    return this.places.filter(p => {
      if (this.filters.category !== 'all' && p.category !== this.filters.category) return false;
      if (this.filters.priceRange !== 'all' && p.priceRange !== this.filters.priceRange) return false;
      if (this.filters.status !== 'all' && p.status !== this.filters.status) return false;
      if (this.filters.location !== 'all') {
        if (!p.location.toLowerCase().includes(this.filters.location.toLowerCase())) return false;
      }
      if (this.filters.search.trim()) {
        const q = this.filters.search.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(q);
        const inLoc = p.location.toLowerCase().includes(q);
        const inTags = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inLoc && !inTags) return false;
      }
      return true;
    });
  }

  getOverduePlaces() {
    // Các mục lưu quá 14 ngày mà vẫn ở trạng thái "want" (Muốn đi)
    return this.places.filter(p => p.status === 'want' && (p.savedDaysAgo || 0) >= 14);
  }

  getSuggestedPlaces() {
    return this.places.filter(p => p.suggestedWeek || p.status === 'want').slice(0, 5);
  }

  getScheduledPlaces() {
    return this.places.filter(p => p.status === 'scheduled');
  }

  getVisitedPlaces() {
    return this.places.filter(p => p.status === 'visited');
  }

  getStats() {
    const total = this.places.length;
    const want = this.places.filter(p => p.status === 'want').length;
    const scheduled = this.places.filter(p => p.status === 'scheduled').length;
    const visited = this.places.filter(p => p.status === 'visited').length;
    const conversionRate = total > 0 ? Math.round((visited / total) * 100) : 0;
    return { total, want, scheduled, visited, conversionRate };
  }
}

export const store = new AppStore();
