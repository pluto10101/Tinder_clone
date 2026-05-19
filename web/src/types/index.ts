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
  min_photos_filter: number;
  show_beyond_distance: boolean;
  show_beyond_age: boolean;
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
  // JSON 数组字段
  dating_purpose: string[];
  interests: string[];
  lifestyles: Record<string, string>;
  personality: string[];
  languages: string[];
  profile_extras: Record<string, string>;
  // 生活习惯独立列
  drinking: string | null;
  smoking: string | null;
  exercise: string | null;
  pets: string | null;
  // 性格独立列
  zodiac: string | null;
  communication_style: string | null;
  love_language: string | null;
  // 其他独立字段
  family_plan: string | null;
  social_media_activity: string | null;
  // 照片
  photos: Photo[];
  // 账号状态
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
