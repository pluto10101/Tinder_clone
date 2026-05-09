export type Gender = 'male' | 'female' | 'other';
export type Orientation = 'straight' | 'gay' | 'bisexual' | 'asexual' | 'other';
export type LookingFor = 'male' | 'female' | 'all';
export type MembershipTier = 'free' | 'plus' | 'gold' | 'platinum';

export interface Photo {
  id: number;
  url: string;
  sort_order: number;
}

export interface UserSettings {
  distance_max_km: number;
  age_min: number;
  age_max: number;
  gender_preference: LookingFor;
  show_gender: boolean;
  show_age: boolean;
  show_distance: boolean;
  show_orientation: boolean;
  show_online_status: boolean;
}

export interface UserProfile {
  id: number;
  phone: string;
  name: string | null;
  birthday: string | null;
  gender: Gender | null;
  sexual_orientation: Orientation | null;
  looking_for: LookingFor | null;
  bio: string | null;
  school: string | null;
  degree: string | null;
  job_title: string | null;
  company: string | null;
  city: string | null;
  height_cm: number | null;
  dating_purpose: string[];
  interests: string[];
  lifestyles: Record<string, string>;
  personality: string[];
  photos: Photo[];
  is_verified: boolean;
  membership: MembershipTier;
  membership_expires_at: string | null;
  stealth_mode: boolean;
  super_like_count: number;
  boost_count: number;
  read_receipt_count: number;
  onboarding_complete: boolean;
  settings: UserSettings;
  created_at: string;
}

export interface CompletenessItem {
  key: string;
  weight: number;
  done: boolean;
}

export interface CompletenessResponse {
  completeness: number;
  items: CompletenessItem[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
