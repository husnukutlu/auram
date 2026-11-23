import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Profile } from '../data/quiz';
import * as store from './storage';

type AppState = {
  profile: Profile | null;
  premium: boolean;
  favorites: string[];
  setProfile: (p: Profile) => void;
  setPremium: (v: boolean) => void;
  toggleFavorite: (id: string) => void;
  reset: () => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(() => store.getProfile());
  const [premium, setPremiumState] = useState<boolean>(() => store.getPremiumFlag());
  const [favorites, setFavorites] = useState<string[]>(() => store.getFavorites());

  const setProfile = useCallback((p: Profile) => {
    store.saveProfile(p);
    setProfileState(p);
  }, []);

  const setPremium = useCallback((v: boolean) => {
    store.savePremiumFlag(v);
    setPremiumState(v);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
      store.saveFavorites(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    store.resetAll();
    setProfileState(null);
    setPremiumState(false);
    setFavorites([]);
  }, []);

  const value = useMemo(
    () => ({ profile, premium, favorites, setProfile, setPremium, toggleFavorite, reset }),
    [profile, premium, favorites, setProfile, setPremium, toggleFavorite, reset],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppStateProvider');
  return v;
}

/** Free users can keep up to this many favorites. */
export const FREE_FAVORITES_LIMIT = 10;
