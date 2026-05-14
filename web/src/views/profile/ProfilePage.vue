<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { profileApi } from '@/api/profile';
import BottomNavigation from '@/components/layout/BottomNavigation.vue';
import GoldUpgradeModal from '@/components/common/GoldUpgradeModal.vue';
import SuperLikeModal from '@/components/common/SuperLikeModal.vue';
import PlatinumUpgradeModal from '@/components/common/PlatinumUpgradeModal.vue';
import PlusUpgradeModal from '@/components/common/PlusUpgradeModal.vue';
import BoostModal from '@/components/common/BoostModal.vue';
import SubscriptionModal from '@/components/common/SubscriptionModal.vue';

const router = useRouter();
const auth = useAuthStore();
const userStore = useUserStore();

const profile = computed(() => userStore.profile);
const completeness = computed(() => userStore.completeness);

const carouselIndex = ref(0);
const showPhotosModal = ref(false);
const photoUploading = ref<Record<number, boolean>>({});
const photoError = ref('');
const photoInputs = ref<HTMLInputElement[]>([]);

const PHOTO_SLOTS = 6;
const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

const userPhotos = computed(() => profile.value?.photos || []);

function openPhotosModal() { showPhotosModal.value = true; }
function closePhotosModal() { showPhotosModal.value = false; }

function triggerPhotoPick(i: number) {
  photoInputs.value[i]?.click();
}

async function onPhotoFileChange(i: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  if (file.size > MAX_PHOTO_SIZE) { photoError.value = '图片不能超过 10MB'; return; }
  photoError.value = '';
  photoUploading.value = { ...photoUploading.value, [i]: true };
  try {
    await profileApi.uploadPhoto(file);
    await userStore.fetchProfile();
  } catch (err: unknown) {
    photoError.value = err instanceof Error ? err.message : '上传失败';
  } finally {
    photoUploading.value = { ...photoUploading.value, [i]: false };
  }
}

async function removeUserPhoto(id: number) {
  try { await profileApi.deletePhoto(id); } catch {}
  await userStore.fetchProfile();
}

// 个人简介弹窗
const showBioModal = ref(false);
const bioText = ref('');
const bioMaxLen = 500;

function openBioModal() {
  bioText.value = profile.value?.bio || '';
  showBioModal.value = true;
}

async function saveBio() {
  try {
    await profileApi.updateProfile({ bio: bioText.value });
    await userStore.fetchProfile();
  } catch {}
  showBioModal.value = false;
}

// 关于我（提示选择）弹窗
const showAboutMeModal = ref(false);
const aboutMePrompts = [
  '我：我已经长大成人了。还是我：',
  '如果我不在家，你会在...找到我。',
  '我的卡拉 OK 必唱曲目是...',
  '我的传记可能会名为...',
  '如果我的生命只剩 20 分钟，我会...',
  '排在我的心愿清单首位的是...',
  '我可以在...游戏中打败你。',
  '关于我的一个惊人事实是...',
  '大家会说我...',
  '给我发消息如果你也喜欢...',
  '我的初次约会愿望清单：',
  '我的一个既怪异又真实的经历是...',
  '和我约会的好处是...',
  '生命太短暂，不能浪费在...',
];

function openAboutMeModal() { showAboutMeModal.value = true; }

function selectPrompt(prompt: string) {
  bioText.value = prompt;
  showAboutMeModal.value = false;
  showBioModal.value = true;
}

// Boost 页面
const showBoostPage = ref(false);
const boostTab = ref<'boost' | 'prime' | 'super'>('boost');
const boostPlanIndex = ref(1);

// Gold 升级弹窗
const showGoldUpgrade = ref(false);
const showSuperLike = ref(false);
const showPlatinum = ref(false);
const showPlus = ref(false);
const showSubscription = ref(false);
const goldPlanSlide = ref(0);
const goldScrolledToBottom = ref(false);
const goldPlansData = [
  { period: '1 周', price: 'US$18.99/周', hot: true, save: '' },
  { period: '1 个月', price: 'US$9.99/周', hot: false, save: '节省 47%' },
  { period: '6 个月', price: 'US$5.83/周', hot: false, save: '节省 69%' },
];
function openGoldUpgrade() { showGoldUpgrade.value = true; goldPlanSlide.value = 0; goldScrolledToBottom.value = false; }
function onGoldBodyScroll(e: Event) { const el = e.target as HTMLElement; goldScrolledToBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 50; }

onMounted(async () => {
  try {
    if (!userStore.profile) await userStore.fetchProfile();
    await userStore.fetchCompleteness();
  } catch {}
});

const mainPhoto = computed(() => profile.value?.photos?.[0]?.url || '');

function goSettings() {
  router.push({ name: 'settings' });
}

function goEdit() {
  router.push({ name: 'profile-edit' });
}

async function handleLogout() {
  await auth.logout();
  userStore.reset();
  router.replace({ name: 'welcome' });
}
</script>

<template>
  <div class="page">
    <div class="scroll-area">
      <!-- 头部：头像 + 名字 + 设置 -->
      <section class="profile-header">
        <div class="header-row">
          <div class="avatar-wrap">
            <img v-if="mainPhoto" :src="mainPhoto" class="avatar" />
            <span v-else class="avatar-fallback">{{ profile?.name?.[0] ?? '?' }}</span>
          </div>
          <div class="name-block">
            <div class="name-row">
              <span class="name">{{ profile?.name || '' }}</span>
              <svg class="verified-badge" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#0064e0" d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.65.54-1.53.2-3.23-.97-4.4-1.17-1.17-2.87-1.51-4.4-.97C14.25 2.18 12.88 1.3 11.3 1.3s-2.95.88-3.65 2.18c-1.53-.54-3.23-.2-4.4.97-1.17 1.17-1.51 2.87-.97 4.4C1.3 9.55.42 10.92.42 12.5s.88 2.95 2.18 3.65c-.54 1.53-.2 3.23.97 4.4 1.17 1.17 2.87 1.51 4.4.97 0.7 1.3 2.07 2.18 3.65 2.18s2.95-.88 3.65-2.18c1.53.54 3.23.2 4.4-.97 1.17-1.17 1.51-2.87.97-4.4 1.3-.7 2.18-2.07 2.18-3.65z"/>
                <path fill="#fff" d="M9.735 15.824l-3.322-3.322-1.314 1.314 4.636 4.636 9.517-9.517-1.314-1.314z"/>
              </svg>
            </div>
            <button class="edit-btn press" @click="goEdit">
              <svg class="edit-btn-icon" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              编辑个人资料
            </button>
          </div>
          <button class="settings-icon press" @click="goSettings">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
        </div>
      </section>

      <!-- 完善度 -->
      <section class="completeness">
        <div class="progress-wrapper">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: completeness + '%' }"></div>
            <div class="progress-pill" :style="{ left: completeness + '%' }">
              {{ completeness }}<span class="progress-symbol">%</span>
            </div>
          </div>
        </div>
        <p class="bar-text">完善个人资料，让更多的人看到你！</p>
      </section>

      <!-- 引导卡片 -->
      <section class="guidance">
        <!-- SVG 渐变定义 -->
        <svg style="width:0;height:0;position:absolute;">
          <defs>
            <linearGradient id="refined-pink-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff8ea1" />
              <stop offset="100%" stop-color="#ff2d6c" />
            </linearGradient>
          </defs>
        </svg>

        <!-- 卡片1：照片 -->
        <div class="task-card" @click="openPhotosModal">
          <div class="tc-icon-wrap">
            <svg class="tc-icon-svg" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <span class="tc-percent">+28%</span>
          </div>
          <div class="tc-text">
            <h3>上传至少<span class="tc-bold">4</span>张照片</h3>
            <p>上传6张照片，至多可获双倍赞。</p>
          </div>
          <div class="tc-circle"><div class="tc-dashed"></div></div>
        </div>

        <!-- 卡片2：简介 -->
        <div class="task-card" @click="openBioModal">
          <div class="tc-icon-wrap">
            <svg class="tc-icon-svg" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            <span class="tc-percent">+20%</span>
          </div>
          <div class="tc-text">
            <h3>上传个人简介</h3>
            <p>添加自我介绍，配对数量提高至多25%。</p>
          </div>
          <div class="tc-circle"><div class="tc-dashed"></div></div>
        </div>

        <!-- 卡片3：关于我 -->
        <div class="task-card" @click="openAboutMeModal">
          <div class="tc-icon-wrap">
            <svg class="tc-icon-svg" viewBox="0 0 24 24">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
            <span class="tc-percent">+10%</span>
          </div>
          <div class="tc-text">
            <h3>添加一条"关于我"</h3>
            <p>展露个性，聊出火花。</p>
          </div>
          <div class="tc-circle"><div class="tc-dashed"></div></div>
        </div>
      </section>

      <!-- 功能入口 -->
      <section class="features">
        <div class="f-scroll no-scrollbar">
          <div class="f-card" @click="showSuperLike = true">
            <div class="f-plus">+</div>
            <div class="f-icon f-blue">★</div>
            <div class="f-label">0 个 Super Like</div>
            <div class="f-link" style="color: #42a5f5;">获得更多</div>
          </div>
          <div class="f-card" @click="showBoostPage = true">
            <div class="f-plus">+</div>
            <div class="f-icon f-purple"><svg width="28" height="28" viewBox="0 0 24 24" fill="#a644ff"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg></div>
            <div class="f-label">我的 Boost</div>
            <div class="f-link" style="color: #b74fff;">获得更多</div>
          </div>
          <div class="f-card" @click="showSubscription = true">
            <div class="f-plus">+</div>
            <div class="f-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="#fe3c72"><path d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"/></svg></div>
            <div class="f-link" style="color: #fe3c72; margin-top: 6px;">订阅套餐</div>
          </div>
        </div>
      </section>

      <!-- 会员升级 -->
      <section class="upgrade">
        <!-- Gold Card -->
        <div v-show="carouselIndex === 0" class="gold-card">
          <div class="gc-header">
            <div class="gc-logo-box">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="#EDB92E">
                <path d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"/>
              </svg>
              <span class="gc-logo-text">tinder</span>
              <span class="gc-badge-gold">GOLD</span>
            </div>
            <button class="gc-btn-upgrade press" @click="showGoldUpgrade = true">升级</button>
          </div>
          <div class="gc-features">
            <div class="gc-row gc-row-head">
              <div class="gc-feature-label">专属功能</div>
              <div class="gc-status-group">
                <div class="gc-status-cell">免费</div>
                <div class="gc-status-cell">Gold</div>
              </div>
            </div>
            <div class="gc-row">
              <div class="gc-feature-label">查看给你点赞的人</div>
              <div class="gc-status-group">
                <div class="gc-status-cell"><svg class="gc-icon-lock" viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z"/></svg></div>
                <div class="gc-status-cell"><svg class="gc-icon-check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
              </div>
            </div>
            <div class="gc-row">
              <div class="gc-feature-label">最佳精选</div>
              <div class="gc-status-group">
                <div class="gc-status-cell"><svg class="gc-icon-lock" viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z"/></svg></div>
                <div class="gc-status-cell"><svg class="gc-icon-check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
              </div>
            </div>
            <div class="gc-row">
              <div class="gc-feature-label">免费 Super Like</div>
              <div class="gc-status-group">
                <div class="gc-status-cell"><svg class="gc-icon-lock" viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z"/></svg></div>
                <div class="gc-status-cell"><svg class="gc-icon-check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
              </div>
            </div>
          </div>
          <div class="gc-view-all" @click="showGoldUpgrade = true">查看所有高级功能</div>
        </div>

        <!-- Platinum Card -->
        <div v-show="carouselIndex === 1" class="plat-card">
          <div class="plt-header">
            <div class="plt-logo-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#333"><path d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"/></svg>
              <span class="plt-logo-text">tinder</span>
              <span class="plt-badge">PLATINUM</span>
            </div>
            <button class="plt-btn-upgrade press" @click="showPlatinum = true">升级</button>
          </div>
          <div class="plt-features">
            <div class="plt-row plt-row-head">
              <div class="plt-feature-label">专属功能</div>
              <div class="plt-status-group">
                <div class="plt-status-cell">免费</div>
                <div class="plt-status-cell plt-label-bold">Platinum</div>
              </div>
            </div>
            <div class="plt-row">
              <div class="plt-feature-label">置顶赞</div>
              <div class="plt-status-group">
                <div class="plt-status-cell"><svg class="plt-icon-lock" viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z"/></svg></div>
                <div class="plt-status-cell"><svg class="plt-icon-check" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></div>
              </div>
            </div>
            <div class="plt-row">
              <div class="plt-feature-label">附加信息促配对</div>
              <div class="plt-status-group">
                <div class="plt-status-cell"><svg class="plt-icon-lock" viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z"/></svg></div>
                <div class="plt-status-cell"><svg class="plt-icon-check" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></div>
              </div>
            </div>
            <div class="plt-row">
              <div class="plt-feature-label">查看给你点赞的人</div>
              <div class="plt-status-group">
                <div class="plt-status-cell"><svg class="plt-icon-lock" viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z"/></svg></div>
                <div class="plt-status-cell"><svg class="plt-icon-check" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></div>
              </div>
            </div>
          </div>
          <div class="plt-view-all" @click="showPlatinum = true">查看所有高级功能</div>
        </div>

        <!-- Plus Card -->
        <div v-show="carouselIndex === 2" class="plus-card">
          <div class="pc-header">
            <div class="pc-logo-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fe3c72"><path d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"/></svg>
              <span class="pc-logo-text">tinder</span>
              <span class="pc-plus-sign">+</span>
            </div>
            <button class="pc-btn-upgrade press" @click="showPlus = true">升级</button>
          </div>
          <div class="pc-features">
            <div class="pc-row pc-row-head">
              <div class="pc-feature-label">专属功能</div>
              <div class="pc-status-group">
                <div class="pc-status-cell">免费</div>
                <div class="pc-status-cell">Plus</div>
              </div>
            </div>
            <div class="pc-row">
              <div class="pc-feature-label">无限点赞次数</div>
              <div class="pc-status-group">
                <div class="pc-status-cell"><svg class="pc-icon-lock" viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z"/></svg></div>
                <div class="pc-status-cell"><svg class="pc-icon-check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
              </div>
            </div>
            <div class="pc-row">
              <div class="pc-feature-label">无限倒回</div>
              <div class="pc-status-group">
                <div class="pc-status-cell"><svg class="pc-icon-lock" viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z"/></svg></div>
                <div class="pc-status-cell"><svg class="pc-icon-check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
              </div>
            </div>
            <div class="pc-row">
              <div class="pc-feature-label">位置漫游</div>
              <div class="pc-status-group">
                <div class="pc-status-cell"><svg class="pc-icon-lock" viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z"/></svg></div>
                <div class="pc-status-cell"><svg class="pc-icon-check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
              </div>
            </div>
          </div>
          <div class="pc-view-all" @click="showPlus = true">查看所有高级功能</div>
        </div>

        <div class="dots">
          <span class="dot" :class="{ active: carouselIndex === 0 }" @click="carouselIndex = 0"></span>
          <span class="dot" :class="{ active: carouselIndex === 1 }" @click="carouselIndex = 1"></span>
          <span class="dot" :class="{ active: carouselIndex === 2 }" @click="carouselIndex = 2"></span>
        </div>
      </section>
    </div>

    <!-- 个人简介编辑弹窗 -->
    <Transition name="slide-up">
      <div v-if="showBioModal" class="bio-modal">
        <header class="bio-header">
          <button class="bio-close press" @click="showBioModal = false">✕</button>
          <h2 class="bio-title">添加个人介绍</h2>
          <button class="bio-save press" @click="saveBio">✓</button>
        </header>
        <div class="bio-body">
          <div class="bio-input-wrap">
            <div class="bio-placeholder" v-if="!bioText">✨ 喜欢徒步和阅读，想在这里简简单单约个会，看看会怎样。</div>
            <textarea v-model="bioText" class="bio-textarea" :maxlength="bioMaxLen" placeholder=""></textarea>
            <span class="bio-counter">{{ bioText.length }}/{{ bioMaxLen }}</span>
          </div>
          <div class="bio-tip-wrap">
            <div class="bio-tip">
              <span class="bio-tip-icon">✨</span>
              <span class="bio-tip-label">个人介绍提示</span>
            </div>
            <p class="bio-tip-text">简短凝练的个人介绍才是好的。分享下你的兴趣、价值取向及交友期待。</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 关于我提示选择弹窗 -->
    <Transition name="slide-up">
      <div v-if="showAboutMeModal" class="aboutme-modal">
        <header class="aboutme-header">
          <button class="aboutme-close press" @click="showAboutMeModal = false">✕</button>
          <h2 class="aboutme-title">选择一条提示</h2>
        </header>
        <div class="aboutme-body">
          <div
            v-for="prompt in aboutMePrompts"
            :key="prompt"
            class="aboutme-item"
            @click="selectPrompt(prompt)"
          >{{ prompt }}</div>
        </div>
      </div>
    </Transition>

    <!-- Gold 升级弹窗 -->
    <GoldUpgradeModal v-if="showGoldUpgrade" @close="showGoldUpgrade = false" />

    <!-- Super Like 购买页 -->
    <SuperLikeModal v-if="showSuperLike" @close="showSuperLike = false" @open-gold="showSuperLike = false; showGoldUpgrade = true" />

    <!-- Platinum 升级弹窗 -->
    <PlatinumUpgradeModal v-if="showPlatinum" @close="showPlatinum = false" />

    <!-- Plus 升级弹窗 -->
    <PlusUpgradeModal v-if="showPlus" @close="showPlus = false" />

    <!-- 订阅套餐页面 -->
    <SubscriptionModal v-if="showSubscription" @close="showSubscription = false" />

    <!-- Boost 购买页面 -->
    <!-- Boost 购买页面 -->
    <BoostModal v-if="showBoostPage" @close="showBoostPage = false" @open-gold="showBoostPage = false; showGoldUpgrade = true" />

    <!-- 照片上传弹窗 -->
    <Transition name="slide-up">
      <div v-if="showPhotosModal" class="photos-modal">
        <header class="pm-header">
          <button class="pm-close press" @click="closePhotosModal">✕</button>
          <h2 class="pm-title">编辑照片</h2>
          <div style="width: 32px;"></div>
        </header>
        <div class="pm-body">
          <p class="pm-desc">上传 2 张照片，开始玩转 Tinder。添加 4 张或更多照片可以让你的个人资料脱颖而出。</p>
          <div class="pm-grid">
            <template v-for="i in PHOTO_SLOTS" :key="i">
              <div class="pm-slot" :class="{ 'pm-filled': userPhotos[i - 1] }">
                <template v-if="userPhotos[i - 1]">
                  <img :src="userPhotos[i - 1].url" class="pm-photo" />
                  <button class="pm-remove press" @click="removeUserPhoto(userPhotos[i - 1].id)">✕</button>
                </template>
                <template v-else>
                  <div v-if="photoUploading[i - 1]" class="pm-loading"><div class="pm-spinner"></div></div>
                  <input
                    :ref="(el: any) => el && (photoInputs[i - 1] = el)"
                    type="file"
                    accept="image/*"
                    class="pm-hidden-input"
                    @change="onPhotoFileChange(i - 1, $event)"
                  />
                </template>
                <button
                  v-if="!userPhotos[i - 1] && !photoUploading[i - 1]"
                  class="pm-add press"
                  @click="triggerPhotoPick(i - 1)"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#111" />
                    <path d="M12 6v12M6 12h12" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </template>
          </div>
          <p v-if="photoError" class="pm-error">{{ photoError }}</p>
        </div>
      </div>
    </Transition>

    <BottomNavigation theme="light" />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));
}

.scroll-area {
  padding: 8px 12px 4px;
}

/* ===== Header ===== */
.profile-header {
  margin-bottom: 0;
}

.header-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.avatar-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  flex: none;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
  font-size: 28px;
  font-weight: 700;
  color: #666;
}

.name-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name {
  font-size: 28px;
  font-weight: 600;
  color: #1c1f23;
  letter-spacing: -0.5px;
}

.verified-badge {
  width: 22px;
  height: 22px;
  margin-left: 4px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 25px;
  background: #000;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  width: fit-content;
}

.edit-btn-icon {
  width: 16px;
  height: 16px;
  fill: white;
}

.settings-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f565e;
  cursor: pointer;
}

.settings-icon svg {
  width: 28px;
  height: 28px;
}

/* ===== Completeness ===== */
.completeness {
  margin-top: 10px;
}

.progress-wrapper {
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 4px;
  background-color: #4e4e58;
  border-radius: 10px;
  overflow: visible;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #ff2d6c;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-pill {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #ff2d6c;
  color: white;
  padding: 2px 10px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: baseline;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(255, 45, 108, 0.2);
  transition: left 0.5s ease;
}

.progress-symbol {
  font-size: 9px;
  margin-left: 1px;
  font-weight: 500;
  opacity: 0.9;
}

.bar-text {
  text-align: center;
  font-size: 12px;
  color: #888;
  margin-top: 8px;
}

/* ===== Guidance Cards ===== */
.guidance {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background: #ffffff;
  width: 100%;
  border-radius: 24px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  box-sizing: border-box;
}

.tc-icon-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  min-width: 48px;
}

.tc-icon-svg {
  width: 34px;
  height: 34px;
  fill: url(#refined-pink-grad);
  filter: drop-shadow(0 2px 3px rgba(255, 61, 106, 0.2));
  margin-bottom: 2px;
}

.tc-percent {
  font-size: 11px;
  font-weight: 800;
  color: #ff3d6a;
  letter-spacing: -0.2px;
}

.tc-text {
  flex: 1;
}

.tc-text h3 {
  margin: 0 0 4px 0;
  font-size: 15.5px;
  color: #222222;
  font-weight: 600;
}

.tc-text p {
  margin: 0;
  font-size: 13px;
  color: #7d7d7d;
  line-height: 1.45;
  letter-spacing: 0.2px;
}

.tc-bold {
  font-weight: 900;
  color: #000;
  margin: 0 2px;
}

.tc-circle {
  margin-left: 10px;
}

.tc-dashed {
  width: 24px;
  height: 24px;
  border: 1.6px dashed #d8dce2;
  border-radius: 50%;
}

/* ===== Features ===== */
.features {
  margin-top: 12px;
}

.f-scroll {
  display: flex;
  gap: 8px;
}

.f-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 12px 6px 10px;
  text-align: center;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  min-width: 0;
}

.f-plus {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
  line-height: 1;
}

.f-icon {
  font-size: 28px;
  margin: 6px 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
}

.f-blue { color: #42a5f5; }
.f-purple { color: #b74fff; }
.f-red { color: #ff4458; }

.f-label {
  font-size: 11px;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 4px;
}

.f-link {
  font-size: 11px;
  color: #ff4458;
  font-weight: 600;
}

/* ===== Upgrade ===== */
.upgrade {
  margin-top: 12px;
}

.gold-card {
  width: 100%;
  background: linear-gradient(to bottom, #FFF0B5 0%, #FFF9E3 40%, #FFFFFF 100%);
  border-radius: 32px;
  padding: 20px 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.04), 0 2px 10px rgba(0, 0, 0, 0.02);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.gc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.gc-logo-box {
  display: flex;
  align-items: center;
  gap: -3px;
}

.gc-logo-text {
  font-size: 26px;
  font-weight: 800;
  color: #252525;
  letter-spacing: -1.5px;
  line-height: 1;
}

.gc-badge-gold {
  background-color: #EDB92E;
  color: #111;
  font-size: 10px;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 2px;
}

.gc-btn-upgrade {
  background-color: #EDB92E;
  color: #000;
  padding: 9px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 800;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(237, 185, 46, 0.15);
}

.gc-features {
  margin-bottom: 10px;
}

.gc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
}

.gc-row-head {
  font-weight: 800;
  font-size: 15px;
  padding-bottom: 6px;
  color: #252525;
}

.gc-feature-label {
  flex: 1;
  font-size: 15px;
  color: #252525;
  font-weight: 500;
}

.gc-status-group {
  display: flex;
  gap: 28px;
  width: 95px;
  justify-content: flex-end;
}

.gc-status-cell {
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
}

.gc-icon-lock {
  width: 15px;
  height: 15px;
  fill: #000000;
}

.gc-icon-check {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #000000;
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.gc-view-all {
  text-align: center;
  font-size: 14px;
  font-weight: 800;
  color: #252525;
  margin-top: 18px;
  cursor: pointer;
  opacity: 0.9;
}

/* Plus Card */
.plus-card {
  width: 100%;
  background: linear-gradient(to bottom, #ffcfcf 0%, #ffffff 100%);
  border-radius: 32px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
.pc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.pc-logo-box { display: flex; align-items: center; gap: 4px; }
.pc-logo-text { font-size: 28px; font-weight: 800; color: #333; letter-spacing: -1px; }
.pc-plus-sign { color: #fe3c72; font-size: 28px; font-weight: 300; margin-left: 2px; }
.pc-btn-upgrade { background: linear-gradient(to right, #ff4b63, #ff6b4a); color: #fff; border: none; padding: 9px 24px; border-radius: 25px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 12px rgba(255, 75, 99, 0.25); }
.pc-features { margin-bottom: 10px; }
.pc-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
.pc-row-head { font-weight: 600; font-size: 14px; color: #666; padding-bottom: 8px; }
.pc-feature-label { flex: 1; font-size: 15px; color: #333; font-weight: 500; }
.pc-status-group { display: flex; gap: 28px; width: 95px; justify-content: flex-end; }
.pc-status-cell { width: 35px; display: flex; justify-content: center; align-items: center; }
.pc-icon-lock { width: 15px; height: 15px; fill: #2d2d2d; }
.pc-icon-check { width: 18px; height: 18px; fill: none; stroke: #2d2d2d; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
.pc-view-all { text-align: center; margin-top: 24px; font-size: 15px; font-weight: 700; color: #222; cursor: pointer; letter-spacing: 0.5px; }

/* Platinum Card */
.plat-card {
  width: 100%;
  background: linear-gradient(180deg, #e2e4eb 0%, #ffffff 100%);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(255,255,255,0.6);
}
.plt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.plt-logo-box { display: flex; align-items: center; gap: 6px; }
.plt-logo-text { font-size: 28px; font-weight: 800; color: #222; letter-spacing: -1px; }
.plt-badge { background: #333; color: #fff; font-size: 10px; font-weight: 700; padding: 3px 6px; border-radius: 4px; margin-left: 4px; }
.plt-btn-upgrade { background: #333; color: #fff; padding: 10px 24px; border-radius: 25px; font-size: 15px; font-weight: 600; border: none; }
.plt-features { margin-bottom: 10px; }
.plt-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
.plt-row-head { padding-bottom: 8px; }
.plt-feature-label { flex: 1; font-size: 15px; color: #333; font-weight: 500; }
.plt-row-head .plt-feature-label { font-size: 13px; color: #666; }
.plt-status-group { display: flex; gap: 20px; width: 120px; justify-content: flex-end; }
.plt-status-cell { width: 40px; display: flex; justify-content: center; align-items: center; font-size: 13px; color: #666; }
.plt-label-bold { color: #222; font-weight: 700; }
.plt-icon-lock { width: 15px; height: 15px; fill: #333; }
.plt-icon-check { width: 18px; height: 18px; fill: none; stroke: #333; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.plt-view-all { text-align: center; margin-top: 25px; font-size: 14px; font-weight: 700; color: #333; cursor: pointer; letter-spacing: 0.5px; }

.dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
}

.dot.active {
  background: #111;
}

/* Photos Modal */
.photos-modal { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.pm-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #353333ff; }
.pm-close { width: 32px; height: 32px; font-size: 20px; color: #111; background: none; border: none; }
.pm-title { font-size: 18px; font-weight: 700; color: #111; margin: 0; }
.pm-body { flex: 1; padding: 20px; overflow-y: auto; }
.pm-desc { font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 20px; }
.pm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.pm-slot { aspect-ratio: 3 / 4; background: #f5f5f5; border: 2px dashed #ccc; border-radius: 12px; position: relative; overflow: visible; display: flex; align-items: center; justify-content: center; }
.pm-filled { border-style: solid; border-color: transparent; overflow: hidden; }
.pm-photo { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; }
.pm-remove { position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%; background: rgba(0,0,0,0.6); color: #fff; font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center; border: none; }
.pm-add { position: absolute; bottom: -6px; right: -6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; z-index: 2; background: none; border: none; }
.pm-loading { display: flex; align-items: center; justify-content: center; }
.pm-spinner { width: 20px; height: 20px; border: 2px solid #ddd; border-top-color: #111; border-radius: 50%; animation: pm-spin 0.6s linear infinite; }
@keyframes pm-spin { to { transform: rotate(360deg); } }
.pm-hidden-input { display: none; }
.pm-error { color: #f2385a; font-size: 13px; margin-top: 12px; text-align: center; }

/* Slide transition */
.slide-up-enter-active { animation: slideUp 0.3s ease; }
.slide-up-leave-active { animation: slideDown 0.3s ease; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }

/* Bio Modal */
.bio-modal { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.bio-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
.bio-close { width: 32px; height: 32px; font-size: 20px; color: #111; background: none; border: none; }
.bio-title { font-size: 18px; font-weight: 700; color: #111; margin: 0; }
.bio-save { width: 32px; height: 32px; font-size: 20px; color: #111; background: none; border: none; }
.bio-body { flex: 1; padding: 20px; }
.bio-input-wrap { position: relative; border: 1.5px solid #ddd; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
.bio-placeholder { position: absolute; top: 16px; left: 16px; right: 60px; font-size: 15px; color: #999; line-height: 1.6; pointer-events: none; }
.bio-textarea { width: 100%; min-height: 80px; border: none; outline: none; font-size: 15px; color: #111; line-height: 1.6; resize: none; background: transparent; position: relative; z-index: 1; }
.bio-counter { position: absolute; bottom: 12px; right: 16px; font-size: 13px; color: #999; }
.bio-tip-wrap { position: relative; border: 1.5px solid #111; border-radius: 12px; padding: 32px 16px 16px; }
.bio-tip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 9999px; background: #111; position: absolute; top: -16px; left: 12px; z-index: 2; }
.bio-tip-icon { font-size: 14px; }
.bio-tip-label { font-size: 13px; font-weight: 600; color: #fff; }
.bio-tip-text { font-size: 14px; color: #666; line-height: 1.6; margin: 0; }

/* About Me Modal */
.aboutme-modal { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.aboutme-header { display: flex; align-items: center; justify-content: center; padding: 16px 20px; position: relative; }
.aboutme-close { position: absolute; left: 20px; width: 32px; height: 32px; font-size: 20px; color: #111; background: none; border: none; }
.aboutme-title { font-size: 18px; font-weight: 700; color: #111; margin: 0; }
.aboutme-body { flex: 1; overflow-y: auto; padding: 0 20px; }
.aboutme-item { padding: 18px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px; color: #111; cursor: pointer; line-height: 1.5; }
.aboutme-item:last-child { border-bottom: none; }

/* Boost Page */
.boost-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.boost-page-super { background: linear-gradient(180deg, #7b2ff7 0%, #9b4dff 40%, #b366ff 70%, #d4a0ff 100%); }
.bp-header { padding: 16px 20px; }
.bp-close { width: 32px; height: 32px; font-size: 20px; color: #111; background: none; border: none; }
.boost-page-super .bp-close { color: #fff; }
.bp-body { flex: 1; overflow-y: auto; padding: 0 20px 24px; }
.bp-title { font-size: 28px; font-weight: 300; color: #111; margin: 0 0 16px; }
.boost-page-super .bp-title { color: #fff; }
.bp-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
.bp-tab { padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 600; color: #666; background: none; border: 1.5px solid #ddd; cursor: pointer; }
.bp-tab-active { background: #111; color: #fff; border-color: #111; }
.boost-page-super .bp-tab { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.7); }
.boost-page-super .bp-tab-active { background: #fff; color: #111; border-color: #fff; }
.bp-desc-card { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 24px; }
.bp-desc-super { background: rgba(255,255,255,0.1); border-radius: 16px; padding: 16px; }
.bp-desc-left { flex: 1; }
.bp-desc-left strong { font-size: 16px; color: #111; display: block; margin-bottom: 6px; }
.boost-page-super .bp-desc-left strong { color: #fff; }
.bp-desc-left p { font-size: 14px; color: #666; line-height: 1.5; margin: 0; }
.boost-page-super .bp-desc-left p { color: rgba(255,255,255,0.8); }
.bp-desc-icon { font-size: 18px; margin-bottom: 4px; }
.bp-icon-prime { color: #7b2ff7; }
.bp-icon-super { color: #fff; }
.bp-desc-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.bp-super-icon { width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
.bp-plans { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.bp-plan { border: 1.5px solid #e8e8e8; border-radius: 12px; padding: 16px 18px; cursor: pointer; transition: border-color 0.2s; }
.bp-plan-active { border-color: #7b2ff7; border-width: 2px; }
.bp-plan-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.bp-plan-best { font-size: 12px; font-weight: 600; color: #7b2ff7; }
.bp-plan-hot { font-size: 12px; font-weight: 600; color: #7b2ff7; }
.bp-plan-save { font-size: 12px; font-weight: 600; color: #666; padding: 2px 8px; border-radius: 6px; background: #f5f5f5; }
.bp-plan-row { display: flex; align-items: baseline; justify-content: space-between; }
.bp-plan-count { font-size: 20px; font-weight: 700; color: #111; }
.bp-count-purple { color: #7b2ff7; }
.bp-plan-price { font-size: 15px; font-weight: 600; color: #111; }
.bp-or { text-align: center; padding: 16px 0; position: relative; }
.bp-or::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee; }
.bp-or span { position: relative; background: #fff; padding: 0 12px; font-size: 14px; color: #999; }
.bp-gold-hint { border: 1px solid #eee; border-radius: 12px; padding: 16px; }
.bp-gold-hint-title { font-size: 13px; font-weight: 600; color: #111; text-align: center; margin: 0 0 12px; }
.bp-gold-row { display: flex; align-items: center; justify-content: space-between; }
.bp-gold-row span { font-size: 15px; font-weight: 500; color: #111; }
.bp-gold-btn { padding: 8px 16px; border-radius: 9999px; border: 1.5px solid #ddd; font-size: 13px; font-weight: 600; color: #111; background: #fff; }
.bp-footer { padding: 16px 20px 32px; }
.bp-footer-sub { text-align: center; font-size: 14px; color: #666; margin: 0 0 12px; }
.bp-buy-btn { width: 100%; height: 52px; border-radius: 9999px; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }
.bp-buy-purple { background: linear-gradient(135deg, #7b2ff7, #b366ff); color: #fff; }
.bp-buy-super { background: #111; color: #fff; }
.boost-page-super .bp-plan { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); }

/* Gold Upgrade Overlay (Profile) */
.gold-overlay { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.gold-hdr { display: flex; align-items: center; justify-content: center; padding: 16px 20px; position: relative; }
.gold-cls { position: absolute; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; background: none; border: none; }
.gold-brd { font-size: 18px; }
.gold-brd-text { font-weight: 700; font-style: italic; color: #111; }
.gold-bdg { background: linear-gradient(135deg, #d4a017, #f5c518); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; font-style: normal; margin-left: 4px; }
.gold-bdy { flex: 1; padding: 0 24px 24px; overflow-y: auto; }
.gold-ttl { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.4; }
.gold-sub { font-size: 14px; color: #666; margin: 0 0 16px; }
.gold-pls { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.gold-pl { padding: 18px; border-radius: 12px; border: 1.5px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; cursor: pointer; }
.gold-pl-active { border-color: #d4a017; }
.gpl-hot { font-size: 11px; color: #d4a017; font-weight: 600; }
.gpl-best { font-size: 11px; color: #d4a017; font-weight: 600; }
.gpl-period { font-size: 24px; font-weight: 800; color: #111; }
.gpl-price { font-size: 13px; color: #666; }
.gpl-save { display: inline-block; padding: 3px 8px; border-radius: 6px; background: #f0f0f0; font-size: 11px; color: #333; font-weight: 600; margin-top: 4px; }
.gold-disc { font-size: 11px; color: #999; line-height: 1.5; margin: 0; }
.gold-ftr { padding: 12px 20px 32px; }
.gold-buy { width: 100%; height: 52px; border-radius: 9999px; background: linear-gradient(135deg, #d4a017, #f5c518); color: #111; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }
.boost-page-super .bp-plan-active { border-color: #fff; background: rgba(255,255,255,0.15); }
.boost-page-super .bp-plan-count { color: #fff; }
.boost-page-super .bp-plan-price { color: rgba(255,255,255,0.9); }
.boost-page-super .bp-plan-best { color: #fff; }
.boost-page-super .bp-plan-hot { color: #fff; }
.boost-page-super .bp-plan-save { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); }
.boost-page-super .bp-plan-top { color: #fff; }
.boost-page-super .bp-footer-sub { color: rgba(255,255,255,0.7); }
</style>
