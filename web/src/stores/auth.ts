import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth';
import { storage, StorageKeys } from '@/utils/storage';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(storage.get<string | null>(StorageKeys.token, null));
  const userId = ref<number | null>(storage.get<number | null>(StorageKeys.userId, null));
  const onboardingComplete = ref<boolean>(
    storage.get<boolean>(StorageKeys.onboardingDone, false)
  );

  const isAuthenticated = computed(() => !!token.value && !!userId.value);

  function setSession(t: string, uid: number, onboardDone: boolean) {
    token.value = t;
    userId.value = uid;
    onboardingComplete.value = onboardDone;
    storage.set(StorageKeys.token, t);
    storage.set(StorageKeys.userId, uid);
    storage.set(StorageKeys.onboardingDone, onboardDone);
  }

  function setOnboardingComplete(done: boolean) {
    onboardingComplete.value = done;
    storage.set(StorageKeys.onboardingDone, done);
  }

  async function sendSms(phone: string) {
    return authApi.sendSms(phone);
  }

  async function verifySms(phone: string, code: string) {
    const resp = await authApi.verifySms(phone, code);
    setSession(resp.token, resp.user_id, resp.onboarding_complete);
    return resp;
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    token.value = null;
    userId.value = null;
    onboardingComplete.value = false;
    storage.remove(StorageKeys.token);
    storage.remove(StorageKeys.userId);
    storage.remove(StorageKeys.onboardingDone);
    storage.remove(StorageKeys.onboardingDraft);
  }

  return {
    token,
    userId,
    onboardingComplete,
    isAuthenticated,
    setSession,
    setOnboardingComplete,
    sendSms,
    verifySms,
    logout,
  };
});
