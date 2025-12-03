import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface NavigationContextType {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  recentPages: string[];
  addRecentPage: (path: string) => void;
  favorites: string[];
  toggleFavorite: (path: string) => void;
  navigationHistory: string[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const MAX_RECENT_PAGES = 5;
const STORAGE_KEY_RECENT = "nav_recent_pages";
const STORAGE_KEY_FAVORITES = "nav_favorites";

export function NavigationProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentPages, setRecentPages] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_RECENT);
    if (stored) {
      try {
        setRecentPages(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent pages", e);
      }
    }

    const storedFavorites = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const addRecentPage = useCallback((path: string) => {
    setRecentPages((prev) => {
      const filtered = prev.filter((p) => p !== path);
      const updated = [path, ...filtered].slice(0, MAX_RECENT_PAGES);
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setNavigationHistory((prev) => [...prev, location.pathname]);

    if (location.pathname !== "/" && !location.pathname.startsWith("/auth")) {
      addRecentPage(location.pathname);
    }
  }, [location.pathname, addRecentPage]);

  const toggleFavorite = useCallback((path: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path];
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        recentPages,
        addRecentPage,
        favorites,
        toggleFavorite,
        navigationHistory,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
