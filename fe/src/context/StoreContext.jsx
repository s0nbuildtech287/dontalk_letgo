import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  FALLBACK_PLACES, 
  FALLBACK_WEEK_PLANS, 
  FALLBACK_PLAN_DETAILS, 
  INITIAL_GROUP_MEMBERS 
} from '../data/initialPlaces.js';
import { api } from '../api/client.js';

const STORAGE_KEY_USER_PLACES = 'letgoo_user_places_v2';
const STORAGE_KEY_THEME = 'letgoo_theme_v2';
const STORAGE_KEY_USER_PLANS = 'letgoo_user_plans_v2';
const STORAGE_KEY_USER = 'letgoo_user_v2';
const STORAGE_KEY_USER_PLAN_DETAILS = 'letgoo_user_plan_details_v2';

export function normalizePlace(p) {
  if (!p || typeof p !== 'object') return p;
  let tags = [];
  if (Array.isArray(p.tags)) {
    tags = p.tags;
  } else if (typeof p.tags === 'string') {
    const trimmed = p.tags.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        tags = Array.isArray(parsed) ? parsed : [];
      } catch {
        tags = trimmed.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
      }
    } else if (trimmed) {
      tags = trimmed.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
    }
  }

  let mapCoords = p.mapCoords;
  if (typeof mapCoords === 'string') {
    try {
      const parsed = JSON.parse(mapCoords);
      if (Array.isArray(parsed) && parsed.length === 2) mapCoords = parsed;
    } catch {
      const parts = mapCoords.split(',').map(Number);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) mapCoords = parts;
    }
  }

  return {
    ...p,
    tags,
    mapCoords: Array.isArray(mapCoords) && mapCoords.length === 2 ? mapCoords : [10.7769, 106.7009]
  };
}

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

  // User's own places (persisted in DB/Google Sheets & localStorage, empty initially)
  const [userPlaces, setUserPlaces] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_PLACES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.map(normalizePlace);
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    return [];
  });

  // User's own week plans
  const [userWeekPlans, setUserWeekPlans] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_PLANS);
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

  // User's own plan details (time, note, date)
  const [userPlanDetails, setUserPlanDetails] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_PLAN_DETAILS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // EFFECTIVE DATA:
  // If currentUser is logged in: show user's own data (empty initially so user adds their own)
  // If not logged in (!currentUser): show fallback preview (5 món + 5 địa điểm) so guests can view & experience
  const places = useMemo(() => {
    const raw = currentUser ? userPlaces : FALLBACK_PLACES;
    return Array.isArray(raw) ? raw.map(normalizePlace) : [];
  }, [currentUser, userPlaces]);

  const weekPlans = useMemo(() => {
    return currentUser ? userWeekPlans : FALLBACK_WEEK_PLANS;
  }, [currentUser, userWeekPlans]);

  const planDetails = useMemo(() => {
    return currentUser ? userPlanDetails : FALLBACK_PLAN_DETAILS;
  }, [currentUser, userPlanDetails]);

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
    sortBy: 'priority',
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

  // Sync user places with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_PLACES, JSON.stringify(userPlaces));
    } catch (e) {
      console.error("Failed to save places to localStorage", e);
    }
  }, [userPlaces]);

  // Sync user week plans with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_PLANS, JSON.stringify(userWeekPlans));
    } catch (e) {
      console.error("Failed to save plans to localStorage", e);
    }
  }, [userWeekPlans]);

  // Sync user plan details with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_PLAN_DETAILS, JSON.stringify(userPlanDetails));
    } catch (e) {}
  }, [userPlanDetails]);

  // Load initial data from PostgreSQL backend / Google Sheet on mount
  useEffect(() => {
    let active = true;
    api.places.getAll().then(data => {
      if (active && Array.isArray(data)) {
        const normalized = data.map(normalizePlace);
        setUserPlaces(normalized);
        try {
          localStorage.setItem(STORAGE_KEY_USER_PLACES, JSON.stringify(normalized));
        } catch (e) {}
      }
    });
    api.plans.getAll().then(data => {
      if (active && data && typeof data === 'object') {
        setUserWeekPlans(data);
        try {
          localStorage.setItem(STORAGE_KEY_USER_PLANS, JSON.stringify(data));
        } catch (e) {}
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
      sortBy: 'priority',
      search: ''
    });
  };

  // Place actions (Guarded by auth and synced with PostgreSQL / Google Sheets)
  const addPlace = (placeData) => {
    if (!checkAuth('thêm địa điểm')) return null;

    const nextStt = userPlaces.length + 1;
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
      stt: nextStt,
      rating: (placeData.rating !== undefined && placeData.rating !== null) ? Number(placeData.rating) : 4.5,
      reviewNote: placeData.reviewNote || "",
      imageUrl: placeData.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      mapCoords: placeData.mapCoords || [10.7769, 106.7009],
      votes: 1,
      sourceLink: placeData.sourceLink || "",
      tags: placeData.tags || ["Mới thêm", "Cuối tuần"],
      suggestedWeek: false,
      scheduledDate: placeData.scheduledDate || null
    };
    setUserPlaces(prev => [...prev, newPlace]);
    // Persist to backend / Google Sheet
    api.places.create(newPlace);
    return newPlace;
  };

  const updatePlace = (id, updates) => {
    if (!checkAuth('cập nhật địa điểm')) return;
    setUserPlaces(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    api.places.update(id, updates);
  };

  const deletePlace = (id) => {
    if (!checkAuth('xóa địa điểm')) return;
    setUserPlaces(prev => prev.filter(p => p.id !== id));
    // Remove from week plans if exists
    setUserWeekPlans(prev => {
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
    setUserPlaces(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, status: newStatus, ...extraData };
        if (newStatus === 'visited') {
          updated.suggestedWeek = false;
          updated.scheduledDate = null;
          updated.scheduledDayName = null;
          if (!updated.visitedDate) {
            updated.visitedDate = new Date().toISOString().split('T')[0];
          }
        }
        return updated;
      }
      return p;
    }));

    if (newStatus === 'visited') {
      setUserWeekPlans(prev => {
        const nextPlans = { ...prev };
        Object.keys(nextPlans).forEach(day => {
          nextPlans[day] = (nextPlans[day] || []).filter(pid => pid !== id);
        });
        return nextPlans;
      });
    }

    api.places.changeStatus(id, { status: newStatus, ...extraData });
  };

  const toggleVote = (id) => {
    if (!checkAuth('bình chọn')) return;
    setUserPlaces(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, votes: (p.votes || 0) + 1 };
      }
      return p;
    }));
    api.places.vote(id);
  };

  const assignToPlan = (placeId, dayNames, options = {}) => {
    if (!checkAuth('lên lịch trình')) return;
    const days = Array.isArray(dayNames) ? dayNames : [dayNames];
    if (days.length === 0) return;

    setUserWeekPlans(prev => {
      const updated = { ...prev };
      days.forEach(day => {
        const dayList = updated[day] || [];
        if (!dayList.includes(placeId)) {
          updated[day] = [...dayList, placeId];
        }
      });
      return updated;
    });

    setUserPlanDetails(prev => {
      const updated = { ...prev };
      days.forEach(day => {
        const key = `${day}-${placeId}`;
        updated[key] = {
          time: options.time || updated[key]?.time || '09:00',
          note: options.note !== undefined ? options.note : (updated[key]?.note || ''),
          date: options.date || updated[key]?.date || ''
        };
      });
      return updated;
    });

    changeStatus(placeId, 'scheduled', { scheduledDayName: days.join(', ') });
    days.forEach(day => api.plans.assign(placeId, day));
  };

  const removeFromPlan = (placeId, dayName) => {
    if (!checkAuth('xóa khỏi lịch trình')) return;
    setUserWeekPlans(prev => {
      if (!prev[dayName]) return prev;
      return {
        ...prev,
        [dayName]: prev[dayName].filter(id => id !== placeId)
      };
    });

    setUserPlanDetails(prev => {
      const updated = { ...prev };
      delete updated[`${dayName}-${placeId}`];
      return updated;
    });

    api.plans.remove(placeId, dayName);
  };

  const updatePlanDetail = (placeId, dayName, updates = {}) => {
    setUserPlanDetails(prev => {
      const key = `${dayName}-${placeId}`;
      return {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          ...updates
        }
      };
    });
  };

  // Computed values
  const filteredPlaces = useMemo(() => {
    // 1. Chỉ các địa điểm chưa đi (want hoặc scheduled) mới có STT ưu tiên (#1, #2, #3...)
    let unvisitedCounter = 0;
    const withDynamicStt = places.map((p) => {
      if (p.status !== 'visited') {
        unvisitedCounter++;
        return {
          ...p,
          stt: unvisitedCounter
        };
      }
      return {
        ...p,
        stt: null
      };
    });

    const result = withDynamicStt.filter(p => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.priceRange !== 'all' && p.priceRange !== filters.priceRange) return false;
      if (filters.status !== 'all') {
        if (p.status !== filters.status) return false;
      } else {
        // Mặc định trong Wishlist: Không hiện các địa điểm đã đi ('visited')
        if (p.status === 'visited') return false;
      }
      if (filters.location !== 'all') {
        if (!p.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      }
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const inTitle = p.title && p.title.toLowerCase().includes(q);
        const inLoc = p.location && p.location.toLowerCase().includes(q);
        const inTags = Array.isArray(p.tags) && p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q));
        if (!inTitle && !inLoc && !inTags) return false;
      }
      return true;
    });

    // Sorting by user preference
    result.sort((a, b) => {
      if (filters.sortBy === 'priority') {
        return (a.stt || 9999) - (b.stt || 9999);
      }
      if (filters.sortBy === 'newest') {
        return (b.stt || 0) - (a.stt || 0);
      }
      if (filters.sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (filters.sortBy === 'votes') {
        return (b.votes || 0) - (a.votes || 0);
      }
      if (filters.sortBy === 'overdue') {
        return (b.savedDaysAgo || 0) - (a.savedDaysAgo || 0);
      }
      return (a.stt || 9999) - (b.stt || 9999);
    });

    return result;
  }, [places, filters]);

  const overduePlaces = useMemo(() => {
    return places.filter(p => p.status === 'want' && (p.savedDaysAgo || 0) >= 14);
  }, [places]);

  const suggestedPlaces = useMemo(() => {
    let unvisitedCounter = 0;
    return places
      .filter(p => p.status !== 'visited')
      .map(p => {
        unvisitedCounter++;
        return { ...p, stt: unvisitedCounter };
      })
      .filter(p => p.suggestedWeek || p.status === 'want')
      .slice(0, 6);
  }, [places]);

  const scheduledPlaces = useMemo(() => {
    return places.filter(p => p.status === 'scheduled');
  }, [places]);

  const visitedPlaces = useMemo(() => {
    return places
      .filter(p => p.status === 'visited')
      .map(p => ({ ...p, stt: null }));
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
    planDetails,
    updatePlanDetail,
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
