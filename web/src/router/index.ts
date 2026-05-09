import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'welcome',
    component: () => import('@/views/welcome/WelcomePage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/login/phone',
    name: 'phone-login',
    component: () => import('@/views/welcome/PhoneLoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/login/verify',
    name: 'phone-verify',
    component: () => import('@/views/welcome/PhoneVerifyPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/guidelines',
    name: 'guidelines',
    component: () => import('@/views/welcome/CommunityGuidelinesPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('@/views/onboarding/OnboardingFlow.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/discover',
    name: 'discover',
    component: () => import('@/views/discover/DiscoveryPage.vue'),
    meta: { requiresAuth: true, tab: 'discover' },
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/views/explore/ExplorePage.vue'),
    meta: { requiresAuth: true, tab: 'explore' },
  },
  {
    path: '/likes',
    name: 'likes',
    component: () => import('@/views/likes/LikesPage.vue'),
    meta: { requiresAuth: true, tab: 'likes' },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/ChatListPage.vue'),
    meta: { requiresAuth: true, tab: 'chat' },
  },
  {
    path: '/chat/:id',
    name: 'chat-conversation',
    component: () => import('@/views/chat/ChatConversationPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/ProfilePage.vue'),
    meta: { requiresAuth: true, tab: 'profile' },
  },
  {
    path: '/profile/edit',
    name: 'profile-edit',
    component: () => import('@/views/profile/ProfileEditPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings/SettingsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/discover/preferences',
    name: 'discover-preferences',
    component: () => import('@/views/discover/PreferencesPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/discover/astro',
    name: 'astro-setup',
    component: () => import('@/views/discover/AstroSetupPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/discover/astro/result',
    name: 'astro-result',
    component: () => import('@/views/discover/AstroResultPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/discover/astro/compat',
    name: 'astro-compat',
    component: () => import('@/views/discover/AstroCompatPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/discover/music',
    name: 'music-setup',
    component: () => import('@/views/discover/MusicSetupPage.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'welcome' };
  }
  // 已登录但未完成引导 → 只允许访问 guidelines 和 onboarding
  if (
    auth.isAuthenticated &&
    !auth.onboardingComplete &&
    !['guidelines', 'onboarding'].includes(to.name as string) &&
    to.meta.requiresAuth
  ) {
    return { name: 'guidelines' };
  }
  // 已完成引导的用户访问引导页 → 跳去发现页
  if (
    ['onboarding', 'guidelines'].includes(to.name as string) &&
    auth.isAuthenticated &&
    auth.onboardingComplete
  ) {
    return { name: 'discover' };
  }
  // 已登录访问欢迎/登录页 → 跳对应位置
  if (
    auth.isAuthenticated &&
    ['welcome', 'phone-login', 'phone-verify'].includes(to.name as string)
  ) {
    return { name: auth.onboardingComplete ? 'discover' : 'guidelines' };
  }
});

export default router;
