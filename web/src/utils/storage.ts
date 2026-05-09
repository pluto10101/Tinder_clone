/**
 * 轻量封装 LocalStorage，自动 JSON 序列化
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota errors
    }
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
};

export const StorageKeys = {
  token: 'tinder_token',
  userId: 'tinder_user_id',
  onboardingDone: 'tinder_onboarding_done',
  onboardingDraft: 'tinder_onboarding_draft',
  dailyLikes: 'tinder_daily_likes',
  dailySuperLikes: 'tinder_daily_super_likes',
  boostExpiresAt: 'tinder_boost_expires_at',
  filters: 'tinder_filters',
  offlineQueue: 'tinder_offline_queue',
} as const;
