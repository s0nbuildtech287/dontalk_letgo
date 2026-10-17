import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_PLACES, INITIAL_GROUP_MEMBERS } from '../data/initialPlaces.js';
import { api } from '../api/client.js';

const STORAGE_KEY_PLACES = 'letgoo_places_v2';
const STORAGE_KEY_THEME = 'letgoo_theme_v2';
const STORAGE_KEY_PLANS = 'letgoo_plans_v2';
const STORAGE_KEY_USER = 'letgoo_user_v2';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // Current logged in user (xu4ns0n, maihuong)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'light';
  });

  // Places state (Empty by default so user can test adding fresh data)
  const [places, setPlaces] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLACES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    return [];
  });

  // Week plans (Empty by default)
  const [weekPlans, setWeekPlans] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLANS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      "Thứ Hai": [],
      "Thứ Ba": [],
      "Thứ Tư": [],
      "Thứ Năm": [],
      "Thứ Sáu": [],
      "Thứ Bảy": [],
      "Chủ Nhật": []
    };
  });

  const [isLandingPage, setIsLandingPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash === 'welcome' || !hash;
  });

  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'wishlist', 'planner', 'explore', 'group', 'journal'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  const [viewMode, setViewMode] = useState('grid'); // grid, kanban, map
  const [streakWeeks] = useState(4);
  const [groupMembers] = useState(INITIAL_GROUP_MEMBERS);

  const [filters, setFilters] = useState({
    category: 'all',
    location: 'all',
    priceRange: 'all',
    status: 'all',
    search: ''
  });

  // Modal states
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [detailPlace, setDetailPlace] = useState(null);
  const [editingPlace, setEditingPlace] = useState(null);
  const [schedulingPlace, setSchedulingPlace] = useState(null);

  // Sync theme with DOM & localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync places with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(places));
    } catch (e) {
      console.error("Failed to save places to localStorage", e);
    }
  }, [places]);

  // Sync week plans with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(weekPlans));
    } catch (e) {
      console.error("Failed to save plans to localStorage", e);
    }
  }, [weekPlans]);

  // Load initial data from PostgreSQL backend on mount
  useEffect(() => {
    let active = true;
    api.places.getAll().then(data => {
      if (active && Array.isArray(data)) {
        setPlaces(data);
      }
    });
    api.plans.getAll().then(data => {
      if (active && data && typeof data === 'object') {
        setWeekPlans(data);
      }
    });
    return () => { active = false; };
  }, []);

  // Sync hash with activeTab and landing page
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'welcome' || !hash) {
        setIsLandingPage(true);
      } else if (['home', 'wishlist', 'planner', 'explore', 'group', 'journal'].includes(hash)) {
        setIsLandingPage(false);
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const changeTab = (tab) => {
    setIsLandingPage(false);
    window.location.hash = tab;
    setActiveTab(tab);
  };

  const enterApp = () => {
    setIsLandingPage(false);
    window.location.hash = 'home';
    setActiveTab('home');
  };

  const handleSetIsQuickAddOpen = (open) => {
    if (open && !currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsQuickAddOpen(open);
  };

  const handleSetEditingPlace = (place) => {
    if (place && !currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingPlace(place);
  };

  const handleSetSchedulingPlace = (place) => {
    if (place && !currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    setSchedulingPlace(place);
  };

  const checkAuth = (actionName = 'thao tác này') => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return false;
    }
    return true;
  };

  const login = (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if ((cleanUser === 'xu4ns0n' || cleanUser === 'maihuong') && cleanPass === '123') {
      const userData = cleanUser === 'xu4ns0n' ? {
        username: 'xu4ns0n',
        name: 'Xuân Sơn',
        gender: 'male',
        role: 'Captain',
        avatarText: 'S',
        avatarBg: 'from-amber-400 to-[#FF6B4A]'
      } : {
        username: 'maihuong',
        name: 'Mai Hương',
        gender: 'female',
        role: 'Co-Pilot',
        avatarText: 'H',
        avatarBg: 'from-rose-400 to-[#FF6B4A]'
      };

      setCurrentUser(userData);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      setIsLoginModalOpen(false);
      if (isLandingPage) {
        setIsLandingPage(false);
        window.location.hash = 'home';
        setActiveTab('home');
      }
      return { success: true };
    }
    return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    setIsLandingPage(true);
    window.location.hash = 'welcome';
  };

  const openLanding = () => {
    setIsLandingPage(true);
    window.location.hash = 'welcome';
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      location: 'all',
      priceRange: 'all',
      status: 'all',
      search: ''
    });
  };

  // Place actions (Guarded by auth and synced with PostgreSQL)
  const addPlace = (placeData) => {
    if (!checkAuth('thêm địa điểm')) return null;

    const newPlace = {
      id: "place-" + Date.now(),
      title: placeData.title || "Địa điểm mới",
      location: placeData.location || "TP. Hồ Chí Minh",
      category: placeData.category || "an",
      categoryLabel: placeData.categoryLabel || "Ăn ngon",
      priceRange: placeData.priceRange || "$$",
      priceText: placeData.priceText || placeData.priceRange || "50k - 100k",
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
    setPlaces(prev => [newPlace, ...prev]);
    // Persist to PostgreSQL backend
    api.places.create(newPlace);
    return newPlace;
  };

  const updatePlace = (id, updates) => {
    if (!checkAuth('cập nhật địa điểm')) return;
    setPlaces(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    api.places.update(id, updates);
  };

  const deletePlace = (id) => {
    if (!checkAuth('xóa địa điểm')) return;
    setPlaces(prev => prev.filter(p => p.id !== id));
    // Remove from week plans if exists
    setWeekPlans(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(day => {
        updated[day] = updated[day].filter(pid => pid !== id);
      });
      return updated;
    });
    api.places.delete(id);
  };

  const changeStatus = (id, newStatus, extraData = {}) => {
    if (!checkAuth('thay đổi trạng thái')) return;
    setPlaces(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, status: newStatus, ...extraData };
        if (newStatus === 'visited' && !updated.visitedDate) {
          updated.visitedDate = new Date().toISOString().split('T')[0];
        }
        return updated;
      }
      return p;
    }));
    api.places.changeStatus(id, { status: newStatus, ...extraData });
  };

  const toggleVote = (id) => {
    if (!checkAuth('bình chọn')) return;
    setPlaces(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, votes: (p.votes || 0) + 1 };
      }
      return p;
    }));
    api.places.vote(id);
  };

  const assignToPlan = (placeId, dayName) => {
    if (!checkAuth('lên lịch trình')) return;
    setWeekPlans(prev => {
      const dayList = prev[dayName] || [];
      if (!dayList.includes(placeId)) {
        return { ...prev, [dayName]: [...dayList, placeId] };
      }
      return prev;
    });
    changeStatus(placeId, 'scheduled', { scheduledDayName: dayName });
    api.plans.assign(placeId, dayName);
  };

  const removeFromPlan = (placeId, dayName) => {
    if (!checkAuth('xóa khỏi lịch trình')) return;
    setWeekPlans(prev => {
      if (!prev[dayName]) return prev;
      return {
        ...prev,
        [dayName]: prev[dayName].filter(id => id !== placeId)
      };
    });
    api.plans.remove(placeId, dayName);
  };

  // Computed values
  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.priceRange !== 'all' && p.priceRange !== filters.priceRange) return false;
      if (filters.status !== 'all' && p.status !== filters.status) return false;
      if (filters.location !== 'all') {
        if (!p.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      }
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(q);
        const inLoc = p.location.toLowerCase().includes(q);
        const inTags = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inLoc && !inTags) return false;
      }
      return true;
    });
  }, [places, filters]);

  const overduePlaces = useMemo(() => {
    return places.filter(p => p.status === 'want' && (p.savedDaysAgo || 0) >= 14);
  }, [places]);

  const suggestedPlaces = useMemo(() => {
    return places.filter(p => p.suggestedWeek || p.status === 'want').slice(0, 6);
  }, [places]);

  const scheduledPlaces = useMemo(() => {
    return places.filter(p => p.status === 'scheduled');
  }, [places]);

  const visitedPlaces = useMemo(() => {
    return places.filter(p => p.status === 'visited');
  }, [places]);

  const stats = useMemo(() => {
    const total = places.length;
    const want = places.filter(p => p.status === 'want').length;
    const scheduled = places.filter(p => p.status === 'scheduled').length;
    const visited = places.filter(p => p.status === 'visited').length;
    const conversionRate = total > 0 ? Math.round((visited / total) * 100) : 0;
    return { total, want, scheduled, visited, conversionRate };
  }, [places]);

  const value = {
    theme,
    toggleTheme,
    places,
    filteredPlaces,
    overduePlaces,
    suggestedPlaces,
    scheduledPlaces,
    visitedPlaces,
    stats,
    weekPlans,
    // Auth
    currentUser,
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    logout,
    isLandingPage,
    enterApp,
    openLanding,
    activeTab,
    setActiveTab: changeTab,
    viewMode,
    setViewMode,
    filters,
    setFilter,
    resetFilters,
    streakWeeks,
    groupMembers,
    addPlace,
    updatePlace,
    deletePlace,
    changeStatus,
    toggleVote,
    assignToPlan,
    removeFromPlan,
    // Modals
    isQuickAddOpen,
    setIsQuickAddOpen: handleSetIsQuickAddOpen,
    detailPlace,
    setDetailPlace,
    editingPlace,
    setEditingPlace: handleSetEditingPlace,
    schedulingPlace,
    setSchedulingPlace: handleSetSchedulingPlace
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within a StoreProvider');
  }
  return context;
}
