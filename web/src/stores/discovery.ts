import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { discoverApi, type UserCard, type SwipeResult } from '@/api/discover';
import { storage } from '@/utils/storage';

export const useDiscoveryStore = defineStore('discovery', () => {
  const cards = ref<UserCard[]>([]);
  const currentIndex = ref(0);
  const isEmpty = ref(false);
  const loading = ref(false);
  const lastSwiped = ref<UserCard | null>(null);
  const totalLikes = ref(0);

  // 每日计数
  const dailyLikesKey = 'tinder_daily_likes';

  function getDailyLikes(): number {
    const data = storage.get<{ date: string; count: number }>(dailyLikesKey, { date: '', count: 0 });
    const today = new Date().toISOString().slice(0, 10);
    if (data.date !== today) return 0;
    return data.count;
  }

  function incrementDailyLikes() {
    const today = new Date().toISOString().slice(0, 10);
    const data = storage.get<{ date: string; count: number }>(dailyLikesKey, { date: today, count: 0 });
    if (data.date !== today) {
      storage.set(dailyLikesKey, { date: today, count: 1 });
    } else {
      storage.set(dailyLikesKey, { date: today, count: data.count + 1 });
    }
  }

  const currentCard = computed(() => cards.value[currentIndex.value] || null);
  const nextCard = computed(() => cards.value[currentIndex.value + 1] || null);
  const thirdCard = computed(() => cards.value[currentIndex.value + 2] || null);

  async function fetchCards() {
    if (loading.value) return;
    loading.value = true;
    try {
      const data = await discoverApi.getCards();
      if (data.length === 0) {
        isEmpty.value = true;
      } else {
        cards.value = [...cards.value, ...data];
        isEmpty.value = false;
      }
    } catch {
      // ignore
    } finally {
      loading.value = false;
    }
  }

  async function swipe(action: 'like' | 'nope' | 'super_like'): Promise<SwipeResult | null> {
    const card = currentCard.value;
    if (!card) return null;

    lastSwiped.value = card;
    currentIndex.value += 1;

    if (action === 'like' || action === 'super_like') {
      incrementDailyLikes();
      totalLikes.value += 1;
    }

    // 预取更多卡片
    if (cards.value.length - currentIndex.value < 5) {
      fetchCards();
    }

    try {
      const result = await discoverApi.swipe(card.id, action);
      return result;
    } catch {
      return null;
    }
  }

  async function rewind() {
    if (!lastSwiped.value) return;
    try {
      await discoverApi.rewind();
      currentIndex.value = Math.max(0, currentIndex.value - 1);
      lastSwiped.value = null;
    } catch {}
  }

  return {
    cards,
    currentIndex,
    isEmpty,
    loading,
    lastSwiped,
    totalLikes,
    currentCard,
    nextCard,
    thirdCard,
    fetchCards,
    swipe,
    rewind,
    getDailyLikes,
  };
});
