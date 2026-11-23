import Storage from 'expo-sqlite/kv-store';
import type { Profile } from '../data/quiz';

const KEYS = {
  profile: 'auram.profile',
  favorites: 'auram.favorites',
  premium: 'auram.premium',
  streak: 'auram.streak',
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = Storage.getItemSync(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  Storage.setItemSync(key, JSON.stringify(value));
}

export const getProfile = (): Profile | null => readJson<Profile | null>(KEYS.profile, null);
export const saveProfile = (p: Profile) => writeJson(KEYS.profile, p);

export const getFavorites = (): string[] => readJson<string[]>(KEYS.favorites, []);
export const saveFavorites = (ids: string[]) => writeJson(KEYS.favorites, ids);

export const getPremiumFlag = (): boolean => readJson<boolean>(KEYS.premium, false);
export const savePremiumFlag = (v: boolean) => writeJson(KEYS.premium, v);

type Streak = { lastDay: string; count: number };

/** Records today's open and returns the current streak length in days. */
export function touchStreak(today: string, yesterday: string): number {
  const s = readJson<Streak | null>(KEYS.streak, null);
  let count = 1;
  if (s?.lastDay === today) count = s.count;
  else if (s?.lastDay === yesterday) count = s.count + 1;
  writeJson(KEYS.streak, { lastDay: today, count });
  return count;
}

export const resetAll = () => {
  Object.values(KEYS).forEach((k) => Storage.removeItemSync(k));
};
