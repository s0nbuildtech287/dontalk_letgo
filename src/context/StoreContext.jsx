import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_PLACES, INITIAL_GROUP_MEMBERS } from '../data/initialPlaces.js';

const STORAGE_KEY_PLACES = 'dithoi_places_v1';
const STORAGE_KEY_THEME = 'dithoi_theme_v1';
const STORAGE_KEY_PLANS = 'dithoi_plans_v1';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'light';
  });

  // Places state
  const [places, setPlaces] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLACES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    return INITIAL_PLACES;
  });

  // Week plans
  const [weekPlans, setWeekPlans] = useState(() => {
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

  // Sync hash with activeTab
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (['home', 'wishlist', 'planner', 'explore', 'group', 'journal'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const changeTab = (tab) => {
    window.location.hash = tab;
    setActiveTab(tab);
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

  // Place actions
  const addPlace = (placeData) => {
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
    setPlaces(prev => [newPlace, ...prev]);
    return newPlace;
  };

  const updatePlace = (id, updates) => {
    setPlaces(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePlace = (id) => {
    setPlaces(prev => prev.filter(p => p.id !== id));
    // Remove from week plans if exists
    setWeekPlans(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(day => {
        updated[day] = updated[day].filter(pid => pid !== id);
      });
      return updated;
    });
  };

  const changeStatus = (id, newStatus, extraData = {}) => {
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
  };

  const toggleVote = (id) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, votes: (p.votes || 0) + 1 };
      }
      return p;
    }));
  };

  const assignToPlan = (placeId, dayName) => {
    setWeekPlans(prev => {
      const dayList = prev[dayName] || [];
      if (!dayList.includes(placeId)) {
        return { ...prev, [dayName]: [...dayList, placeId] };
      }
      return prev;
    });
    changeStatus(placeId, 'scheduled', { scheduledDayName: dayName });
  };

  const removeFromPlan = (placeId, dayName) => {
    setWeekPlans(prev => {
      if (!prev[dayName]) return prev;
      return {
        ...prev,
        [dayName]: prev[dayName].filter(id => id !== placeId)
      };
    });
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
    setIsQuickAddOpen,
    detailPlace,
    setDetailPlace,
    editingPlace,
    setEditingPlace,
    schedulingPlace,
    setSchedulingPlace
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
