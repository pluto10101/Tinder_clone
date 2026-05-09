import { get, post } from './http';
import type { UserProfile } from '@/types';

export interface UserCard extends UserProfile {
  distance: number;
}

export interface SwipeResult {
  matched: boolean;
  match?: {
    id: number;
    user_a_id: number;
    user_b_id: number;
    match_type: string;
    matched_at: string;
  };
}

export const discoverApi = {
  getCards() {
    return get<UserCard[]>('/discover/cards');
  },
  swipe(target_user_id: number, action: 'like' | 'nope' | 'super_like') {
    return post<SwipeResult>('/discover/swipe', { target_user_id, action });
  },
  rewind() {
    return post<{ target_user_id: number }>('/discover/rewind');
  },
};
