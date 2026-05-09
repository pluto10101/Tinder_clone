import { del, get, post, put, BASE_URL } from './http';
import type { CompletenessResponse, Photo, UserProfile } from '@/types';
import axios from 'axios';
import { storage, StorageKeys } from '@/utils/storage';

export const profileApi = {
  get() {
    return get<UserProfile>('/profile');
  },
  update(patch: Partial<UserProfile>) {
    return put<UserProfile>('/profile', patch);
  },
  uploadPhoto(file: File) {
    const form = new FormData();
    form.append('photo', file);
    const token = storage.get<string | null>(StorageKeys.token, null);
    const userId = storage.get<number | null>(StorageKeys.userId, null);
    return axios
      .post(`${BASE_URL}/profile/photos`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userId ? { 'X-User-Id': String(userId) } : {}),
        },
      })
      .then((resp) => {
        const body = resp.data;
        if (body?.code === 0) return body.data as Photo;
        throw new Error(body?.message || '上传失败');
      });
  },
  deletePhoto(id: number) {
    return del<object>(`/profile/photos/${id}`);
  },
  reorderPhotos(ids: number[]) {
    return put<Photo[]>('/profile/photos/reorder', { ids });
  },
  completeness() {
    return get<CompletenessResponse>('/profile/completeness');
  },
};
