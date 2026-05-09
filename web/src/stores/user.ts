import { defineStore } from 'pinia';
import { ref } from 'vue';
import { profileApi } from '@/api/profile';
import type { CompletenessItem, Photo, UserProfile } from '@/types';

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null);
  const completeness = ref<number>(0);
  const completenessItems = ref<CompletenessItem[]>([]);

  async function fetchProfile() {
    profile.value = await profileApi.get();
    return profile.value;
  }

  async function updateProfile(patch: Partial<UserProfile>) {
    profile.value = await profileApi.update(patch);
    return profile.value;
  }

  async function uploadPhoto(file: File) {
    const photo = await profileApi.uploadPhoto(file);
    if (profile.value) profile.value.photos.push(photo);
    return photo;
  }

  async function deletePhoto(id: number) {
    await profileApi.deletePhoto(id);
    if (profile.value) {
      profile.value.photos = profile.value.photos.filter((p) => p.id !== id);
    }
  }

  async function reorderPhotos(ids: number[]) {
    const photos = await profileApi.reorderPhotos(ids);
    if (profile.value) profile.value.photos = photos;
    return photos;
  }

  async function fetchCompleteness() {
    const resp = await profileApi.completeness();
    completeness.value = resp.completeness;
    completenessItems.value = resp.items;
    return resp;
  }

  function reset() {
    profile.value = null;
    completeness.value = 0;
    completenessItems.value = [];
  }

  return {
    profile,
    completeness,
    completenessItems,
    fetchProfile,
    updateProfile,
    uploadPhoto,
    deletePhoto,
    reorderPhotos,
    fetchCompleteness,
    reset,
  };
});
