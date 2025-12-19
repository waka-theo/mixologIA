import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getCurrentUserId,
  getUser,
  getFavorites,
  getBadges,
  getActiveChallenge,
  initializeBadges,
  updateUserLastVisit,
  type User,
  type Favorite,
  type Badge,
  type Challenge
} from '../lib/supabase';
import { Cocktail } from '../lib/cocktailApi';

export type ViewType = 'home' | 'mybar' | 'slot' | 'detail' | 'favorites' | 'badges';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  userId: string | null;
  user: User | null;
  ageVerified: boolean;
  setAgeVerified: (verified: boolean) => void;
  selectedCocktail: (Cocktail & any) | null;
  setSelectedCocktail: (cocktail: (Cocktail & any) | null) => void;
  favorites: Favorite[];
  setFavorites: (favorites: Favorite[]) => void;
  badges: Badge[];
  setBadges: (badges: Badge[]) => void;
  activeChallenge: Challenge | null;
  setActiveChallenge: (challenge: Challenge | null) => void;
  viewedCocktails: Set<string>;
  addViewedCocktail: (id: string) => void;
  viewedCategories: Set<string>;
  addViewedCategory: (category: string) => void;
  slotUsageCount: number;
  incrementSlotUsage: () => void;
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  loading: boolean;
  refreshFavorites: () => Promise<void>;
  refreshBadges: () => Promise<void>;
  refreshChallenge: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ageVerified, setAgeVerifiedState] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState<(Cocktail & any) | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [viewedCocktails, setViewedCocktails] = useState<Set<string>>(new Set());
  const [viewedCategories, setViewedCategories] = useState<Set<string>>(new Set());
  const [slotUsageCount, setSlotUsageCount] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeApp() {
      try {
        const id = await getCurrentUserId();
        setUserId(id);

        const userData = await getUser(id);
        setUser(userData);
        setAgeVerifiedState(userData?.age_verified || false);

        if (userData?.age_verified) {
          await updateUserLastVisit(id);

          const [favs, bdgs, challenge] = await Promise.all([
            getFavorites(id),
            getBadges(id),
            getActiveChallenge(id)
          ]);

          if (bdgs.length === 0) {
            await initializeBadges(id);
            const initializedBadges = await getBadges(id);
            setBadges(initializedBadges);
          } else {
            setBadges(bdgs);
          }

          setFavorites(favs);
          setActiveChallenge(challenge);

          const slotBadge = bdgs.find(b => b.badge_type === 'aventurier_hasard');
          if (slotBadge) {
            setSlotUsageCount(slotBadge.progress);
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        addToast('error', 'Erreur lors du chargement de l\'application');
      } finally {
        setLoading(false);
      }
    }

    initializeApp();
  }, []);

  const setAgeVerified = (verified: boolean) => {
    setAgeVerifiedState(verified);
    if (verified && userId) {
      getFavorites(userId).then(setFavorites);
      getBadges(userId).then(setBadges);
      getActiveChallenge(userId).then(setActiveChallenge);
    }
  };

  const addViewedCocktail = (id: string) => {
    setViewedCocktails(prev => new Set([...prev, id]));
  };

  const addViewedCategory = (category: string) => {
    setViewedCategories(prev => new Set([...prev, category]));
  };

  const incrementSlotUsage = () => {
    setSlotUsageCount(prev => prev + 1);
  };

  const addToast = (type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, type, message };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshFavorites = async () => {
    if (userId) {
      const favs = await getFavorites(userId);
      setFavorites(favs);
    }
  };

  const refreshBadges = async () => {
    if (userId) {
      const bdgs = await getBadges(userId);
      setBadges(bdgs);
    }
  };

  const refreshChallenge = async () => {
    if (userId) {
      const challenge = await getActiveChallenge(userId);
      setActiveChallenge(challenge);
    }
  };

  const value: AppContextType = {
    currentView,
    setCurrentView,
    userId,
    user,
    ageVerified,
    setAgeVerified,
    selectedCocktail,
    setSelectedCocktail,
    favorites,
    setFavorites,
    badges,
    setBadges,
    activeChallenge,
    setActiveChallenge,
    viewedCocktails,
    addViewedCocktail,
    viewedCategories,
    addViewedCategory,
    slotUsageCount,
    incrementSlotUsage,
    toasts,
    addToast,
    removeToast,
    loading,
    refreshFavorites,
    refreshBadges,
    refreshChallenge
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
