import type { Gender, LookingFor, Photo } from '@/types';

export interface OnboardingDraft {
  name: string;
  birthday: string;
  gender: Gender | '';
  show_gender: boolean;
  sexual_orientation: string[];
  show_orientation: boolean;
  looking_for: LookingFor | '';
  distance_max_km: number;
  dating_purpose: string[];
  school: string;
  degree: string;
  show_education: boolean;
  lifestyles: Record<string, string>;
  personality: string[];
  interests: string[];
  photos: Photo[];
  bio: string;
}

export function emptyDraft(): OnboardingDraft {
  return {
    name: '',
    birthday: '',
    gender: '',
    show_gender: true,
    sexual_orientation: [],
    show_orientation: false,
    looking_for: '',
    distance_max_km: 50,
    dating_purpose: [],
    school: '',
    degree: '',
    show_education: true,
    lifestyles: {},
    personality: [],
    interests: [],
    photos: [],
    bio: '',
  };
}

export interface StepDef {
  key: string;
  title: string;
  required: boolean;
  skippable: boolean;
  isValid: (d: OnboardingDraft) => boolean;
}

export const STEPS: StepDef[] = [
  {
    key: 'name',
    title: '你的名字是什么？',
    required: true,
    skippable: false,
    isValid: (d) => d.name.trim().length >= 1 && d.name.trim().length <= 20,
  },
  {
    key: 'birthday',
    title: '你的生日是哪一天？',
    required: true,
    skippable: false,
    isValid: (d) => {
      if (!d.birthday) return false;
      const b = new Date(d.birthday);
      if (Number.isNaN(b.getTime())) return false;
      const age = Math.floor((Date.now() - b.getTime()) / (365.25 * 24 * 3600 * 1000));
      return age >= 18 && age <= 100;
    },
  },
  {
    key: 'gender',
    title: '你的性别是什么？',
    required: true,
    skippable: false,
    isValid: (d) => !!d.gender,
  },
  {
    key: 'orientation',
    title: '你的性向是什么？',
    required: false,
    skippable: true,
    isValid: () => true,
  },
  {
    key: 'preference',
    title: '你想结识什么样的会员？',
    required: true,
    skippable: false,
    isValid: (d) => !!d.looking_for,
  },
  {
    key: 'distance',
    title: '你希望结识多远的人？',
    required: false,
    skippable: true,
    isValid: () => true,
  },
  {
    key: 'purpose',
    title: '你想要查找什么？',
    required: true,
    skippable: false,
    isValid: (d) => d.dating_purpose.length > 0,
  },
  {
    key: 'education',
    title: '说说你的教育背景',
    required: false,
    skippable: true,
    isValid: () => true,
  },
  {
    key: 'lifestyle',
    title: '',
    required: false,
    skippable: true,
    isValid: () => true,
  },
  {
    key: 'personality',
    title: '怎样才是真正的你？',
    required: false,
    skippable: true,
    isValid: () => true,
  },
  {
    key: 'interests',
    title: '你的兴趣是什么？',
    required: false,
    skippable: true,
    isValid: () => true,
  },
  {
    key: 'photos',
    title: '添加你的近照',
    required: false,
    skippable: true,
    isValid: (d) => d.photos.length >= 1,
  },
  {
    key: 'bio',
    title: '更多展示自己的风采',
    required: false,
    skippable: true,
    isValid: () => true,
  },
];
