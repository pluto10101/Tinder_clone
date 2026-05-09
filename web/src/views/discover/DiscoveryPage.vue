<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useDiscoveryStore } from '@/stores/discovery';
import BottomNavigation from '@/components/layout/BottomNavigation.vue';
import GoldUpgradeModal from '@/components/common/GoldUpgradeModal.vue';
import SuperLikeModal from '@/components/common/SuperLikeModal.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const discovery = useDiscoveryStore();

const showMatchModal = ref(false);
const matchedUser = ref<any>(null);
const likesNeeded = ref(10);
const isFullMode = computed(() => discovery.totalLikes >= 10);
const activeNavTab = ref('recommend');
const showAstroModal = ref(false);
const astroSetup = ref(false);
const showCompatSheet = ref(false); // 是否已设置过占星术
const showMusicModal = ref(false);
const musicSetup = ref(false);
const showMusicPlaylist = ref(false);
const musicPlaying = ref(true);
const showGroupDateOverlay = ref(false);
const groupDateSlide = ref(0);
const showRewindUpgrade = ref(false);
const showSendMessage = ref(false);
const sendMessageText = ref('');
const showFriendsPage = ref(false);
const showGroupInfo = ref(false);
const showGroupSettings = ref(false);
const groupSettingShowInfo = ref(true);
const groupSettingShowFriends = ref(true);
const groupSettingShowProfile = ref(true);
const groupSetup = ref(false);
const showBoostPage = ref(false);
const boostTab = ref<'boost' | 'prime' | 'super'>('boost');
const boostPlanIndex = ref(1);

// Gold 升级弹窗
const showGoldUpgrade = ref(false);
const goldPlanSlide = ref(0);
const goldScrolledToBottom = ref(false);
const goldPlansData = [
  { period: '1 周', price: 'US$18.99/周', hot: true, save: '' },
  { period: '1 个月', price: 'US$9.99/周', hot: false, save: '节省 47%' },
  { period: '6 个月', price: 'US$5.83/周', hot: false, save: '节省 69%' },
];
function openGoldUpgrade() { showGoldUpgrade.value = true; goldPlanSlide.value = 0; goldScrolledToBottom.value = false; }
function onGoldBodyScroll(e: Event) { const el = e.target as HTMLElement; goldScrolledToBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 50; }

// Match suggestion popup
const showMatchSuggestion = ref(false);
const matchSuggestionUser = ref({ name: 'Nick Leon', photo: 'https://picsum.photos/seed/suggest1/150/150' });
const showSuperLikePage = ref(false);

// 不定时触发 match suggestion
let matchSuggestionTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleMatchSuggestion() {
  const delay = 15000 + Math.random() * 30000; // 15-45秒随机
  matchSuggestionTimer = setTimeout(() => {
    if (activeNavTab.value === 'recommend' && !showMatchModal.value && !showGroupDateOverlay.value && !showBoostPage.value && !showUserDetail.value && !showAstroModal.value) {
      showMatchSuggestion.value = true;
    }
    scheduleMatchSuggestion();
  }, delay);
}
function dismissMatchSuggestion() { showMatchSuggestion.value = false; }
function onSuperLikeFromSuggestion() { showMatchSuggestion.value = false; showSuperLikePage.value = true; }
const showUserDetail = ref(false);
const detailPhotoIndex = ref(0);

function openUserDetail() {
  if (!currentCard.value) return;
  detailPhotoIndex.value = 0;
  showUserDetail.value = true;
}
function closeUserDetail() { showUserDetail.value = false; }
function detailPrevPhoto() { if (detailPhotoIndex.value > 0) detailPhotoIndex.value--; }
function detailNextPhoto() {
  const photos = currentCard.value?.photos || [];
  if (detailPhotoIndex.value < photos.length - 1) detailPhotoIndex.value++;
}

// 模拟当前用户的音乐列表（从 localStorage 读取或使用默认）
const userMusicSongs = ref<Array<{ id: number; name: string; artist: string; cover: string }>>([]);
const currentPlayingSong = computed(() => userMusicSongs.value[0] || null);

function loadMusicData() {
  const saved = localStorage.getItem('tinder_music_songs');
  const enabled = localStorage.getItem('tinder_music_enabled');
  if (saved) {
    userMusicSongs.value = JSON.parse(saved);
  }
  if (enabled === 'true') {
    musicSetup.value = true;
  }
}

function onNavTabClick(tab: string) {
  if (tab === 'group' && !groupSetup.value) {
    showFriendsPage.value = true;
    activeNavTab.value = 'group';
    return;
  }
  if (tab === 'astro' && !astroSetup.value) {
    showAstroModal.value = true;
    activeNavTab.value = 'astro';
    return;
  }
  if (tab === 'music' && !musicSetup.value) {
    showMusicModal.value = true;
    activeNavTab.value = 'music';
    return;
  }
  activeNavTab.value = tab;
}

function closeFriendsPage() { showFriendsPage.value = false; groupSetup.value = true; }

function astroLater() {
  showAstroModal.value = false;
  activeNavTab.value = 'recommend';
}

function astroContinue() {
  showAstroModal.value = false;
  astroSetup.value = true;
  router.push({ name: 'astro-setup' });
}

function musicLater() {
  showMusicModal.value = false;
  activeNavTab.value = 'recommend';
}

function musicContinue() {
  showMusicModal.value = false;
  musicSetup.value = true;
  router.push({ name: 'music-setup' });
}

onMounted(async () => {
  try {
    if (!userStore.profile) await userStore.fetchProfile();
    await discovery.fetchCards();
    likesNeeded.value = Math.max(0, 10 - discovery.totalLikes);
    // 从星座结果页返回时自动切换到占星术标签
    if (route.query.tab === 'astro') {
      activeNavTab.value = 'astro';
      astroSetup.value = true;
    }
    // 从音乐设置页返回时自动切换到音乐标签
    if (route.query.tab === 'music') {
      activeNavTab.value = 'music';
      musicSetup.value = true;
    }
    // 加载音乐数据
    loadMusicData();
    // 启动 match suggestion 定时器
    scheduleMatchSuggestion();
  } catch {}
});

const currentCard = computed(() => discovery.currentCard);
const nextCard = computed(() => discovery.nextCard);
const photoIndex = ref(0);
function prevPhoto() { if (photoIndex.value > 0) photoIndex.value--; }
function nextPhoto() {
  const photos = currentCard.value?.photos || [];
  if (photoIndex.value < photos.length - 1) photoIndex.value++;
}
function getAge(birthday: string | null): number | null {
  if (!birthday) return null;
  const b = new Date(birthday);
  if (Number.isNaN(b.getTime())) return null;
  return Math.floor((Date.now() - b.getTime()) / (365.25 * 24 * 3600 * 1000));
}

// 拖拽
const animating = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const cardTransition = ref('');

const THRESHOLD_X = 0.4;
const THRESHOLD_Y = 0.3;
const ROTATION_FACTOR = 0.1;
const MAX_ROTATION = 15;

const rotation = computed(() => Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, offsetX.value * ROTATION_FACTOR)));
const stampType = computed<'nope'|'like'|'super'|''>(() => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (offsetY.value < -(h * THRESHOLD_Y) && Math.abs(offsetY.value) > Math.abs(offsetX.value)) return 'super';
  if (offsetX.value > w * THRESHOLD_X * 0.5) return 'like';
  if (offsetX.value < -(w * THRESHOLD_X * 0.5)) return 'nope';
  return '';
});
const stampOpacity = computed(() => Math.min(Math.abs(offsetX.value) / (window.innerWidth * THRESHOLD_X), 0.8));

// 拖动时按钮高亮状态
const activeBtn = computed<'rewind'|'nope'|'super'|'like'|'send'|''>(() => {
  if (!isDragging.value) return '';
  const w = window.innerWidth;
  const h = window.innerHeight;
  // 向上拖动优先判断 super like
  if (offsetY.value < -(h * 0.15) && Math.abs(offsetY.value) > Math.abs(offsetX.value)) return 'super';
  if (offsetX.value > w * THRESHOLD_X * 0.3) return 'like';
  if (offsetX.value < -(w * THRESHOLD_X * 0.3)) return 'nope';
  return '';
});

// 按钮缩放比例
function btnScale(btn: string): number {
  if (activeBtn.value !== btn) return 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  let progress = 0;
  if (btn === 'super') {
    progress = Math.min(Math.abs(offsetY.value) / (h * THRESHOLD_Y), 1);
  } else {
    progress = Math.min(Math.abs(offsetX.value) / (w * THRESHOLD_X), 1);
  }
  return 1 + progress * 0.3;
}

function onPointerDown(e: PointerEvent) {
  if (animating.value || !currentCard.value) return;
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  offsetX.value = 0;
  offsetY.value = 0;
  cardTransition.value = '';
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
}
function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return;
  offsetX.value = e.clientX - startX.value;
  offsetY.value = e.clientY - startY.value;
}
function onPointerUp() {
  if (!isDragging.value) return;
  isDragging.value = false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (offsetX.value > w * THRESHOLD_X) flyOut('like');
  else if (offsetX.value < -(w * THRESHOLD_X)) flyOut('nope');
  else if (offsetY.value < -(h * THRESHOLD_Y) && Math.abs(offsetY.value) > Math.abs(offsetX.value)) flyOut('super_like');
  else springBack();
}
function springBack() {
  cardTransition.value = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  offsetX.value = 0;
  offsetY.value = 0;
  setTimeout(() => { cardTransition.value = ''; }, 500);
}
async function flyOut(action: 'like'|'nope'|'super_like') {
  animating.value = true;
  const dir = action === 'nope' ? -1 : action === 'like' ? 1 : 0;
  cardTransition.value = 'transform 0.3s cubic-bezier(0.4, 0, 1, 1)';
  offsetX.value = dir * window.innerWidth * 1.5;
  offsetY.value = action === 'super_like' ? -window.innerHeight * 1.5 : offsetY.value;
  await new Promise(r => setTimeout(r, 300));
  cardTransition.value = '';
  offsetX.value = 0;
  offsetY.value = 0;
  photoIndex.value = 0;
  const result = await discovery.swipe(action);
  likesNeeded.value = Math.max(0, 10 - discovery.totalLikes);
  if (result?.matched && result.match) {
    matchedUser.value = discovery.lastSwiped;
    showMatchModal.value = true;
  } else if (activeNavTab.value === 'group' && (action === 'like' || action === 'super_like')) {
    // 抱团约会模式下右滑弹出抱团约会引导，不弹配对界面
    showGroupDateOverlay.value = true;
    groupDateSlide.value = 0;
  }
  animating.value = false;
}
function doSwipe(action: 'like'|'nope'|'super_like') {
  if (animating.value || !currentCard.value) return;
  flyOut(action);
}
function closeMatch() { showMatchModal.value = false; matchedUser.value = null; }
const matchMessage = ref('');
function sendMatchMessage() {
  if (!matchMessage.value.trim()) return;
  // 发送消息后关闭配对弹窗，跳转到聊天
  const msg = matchMessage.value.trim();
  matchMessage.value = '';
  showMatchModal.value = false;
  matchedUser.value = null;
  router.push({ name: 'chat' });
}
function sendMatchEmoji(emoji: string) {
  matchMessage.value = emoji;
  sendMatchMessage();
}
function doSendMessage() {
  if (!sendMessageText.value.trim()) return;
  // 发送初印象消息后，执行右滑并关闭面板
  sendMessageText.value = '';
  showSendMessage.value = false;
  doSwipe('like');
}

function closeGroupDate() { showGroupDateOverlay.value = false; }
function groupDateLater() { showGroupDateOverlay.value = false; }
function groupDateInvite() { showGroupDateOverlay.value = false; router.push({ name: 'chat', query: { openFriends: '1' } }); }
function closeShareSheet() { showShareSheet.value = false; showGroupDateOverlay.value = false; }

const showShareSheet = ref(false);
function nextGroupSlide() { if (groupDateSlide.value < 2) groupDateSlide.value++; }
function prevGroupSlide() { if (groupDateSlide.value > 0) groupDateSlide.value--; }

let gdTouchStartX = 0;
function gdTouchStart(e: TouchEvent) { gdTouchStartX = e.touches[0].clientX; }
function gdTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - gdTouchStartX;
  if (dx < -50) nextGroupSlide();
  else if (dx > 50) prevGroupSlide();
}
</script>

<template>
  <div class="page">
    <!-- 满10赞：顶部导航栏 -->
    <div v-if="isFullMode" class="top-nav">
      <button class="filter-btn press" @click="router.push({ name: 'discover-preferences' })">
        <svg class="filter-icon" viewBox="0 0 24 24">
          <circle cx="7" cy="8" r="2.5" />
          <line x1="11" y1="8" x2="19" y2="8" />
          <line x1="5" y1="16" x2="13" y2="16" />
          <circle cx="17" cy="16" r="2.5" />
        </svg>
      </button>
      <div class="nav-tabs no-scrollbar">
        <button class="nav-tab" :class="{ active: activeNavTab === 'recommend' }" @click="onNavTabClick('recommend')">为你推荐</button>
        <button class="nav-tab" :class="{ active: activeNavTab === 'group' }" @click="onNavTabClick('group')">抱团约会</button>
        <button class="nav-tab" :class="{ active: activeNavTab === 'astro' }" @click="onNavTabClick('astro')">
          占星术
          <span v-if="astroSetup && activeNavTab === 'astro'" class="tab-edit" @click.stop="router.push({ name: 'astro-setup' })">✎</span>
        </button>
        <button class="nav-tab" :class="{ active: activeNavTab === 'music' }" @click="onNavTabClick('music')">
          音乐
          <span v-if="musicSetup && activeNavTab === 'music'" class="tab-edit" @click.stop="router.push({ name: 'music-setup' })">✎</span>
        </button>
      </div>
      <button class="boost-btn press" @click="showBoostPage = true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#a644ff"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
      </button>
    </div>
    <!-- 未满10赞：绿色提示条 -->
    <div v-else-if="likesNeeded > 0" class="top-banner">
      <div class="banner-icon">💚</div>
      <div class="banner-text">
        <div class="banner-title">了解喜欢的类型</div>
        <div class="banner-sub">再点 {{ likesNeeded }} 个赞，了解详情</div>
      </div>
    </div>

    <!-- 卡片区域 -->
    <div class="card-area">
      <!-- 抱团约会模式 -->
      <template v-if="isFullMode && activeNavTab === 'group'">
        <div
          class="group-card"
          :style="{ transform: `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg)`, transition: cardTransition }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <div class="group-photos">
            <div class="group-photo-half">
              <img :src="currentCard?.photos[0]?.url || 'https://via.placeholder.com/400x800'" draggable="false" />
            </div>
            <div class="group-photo-half">
              <img :src="nextCard?.photos[0]?.url || 'https://via.placeholder.com/400x800'" draggable="false" />
            </div>
          </div>
          <!-- 滑动印章 -->
          <div v-if="stampType === 'nope'" class="stamp stamp-nope" :style="{ opacity: stampOpacity }">NOPE</div>
          <div v-if="stampType === 'like'" class="stamp stamp-like" :style="{ opacity: stampOpacity }">LIKE</div>
          <div v-if="stampType === 'super'" class="stamp stamp-super" :style="{ opacity: stampOpacity }">SUPER</div>
          <div class="group-info">
            <div class="group-names">
              <span class="info-name" style="font-size: 20px;">{{ currentCard?.name || 'Carey' }}</span>
              <span class="info-age" style="font-size: 18px;">{{ getAge(currentCard?.birthday || null) || 21 }}</span>
              <span class="info-verified">✓</span>
              <span style="color: #fff; margin: 0 6px;">与</span>
              <span class="info-name" style="font-size: 20px;">{{ nextCard?.name || '江江' }}</span>
              <span class="info-age" style="font-size: 18px;">{{ getAge(nextCard?.birthday || null) || 24 }}</span>
              <span class="info-verified">✓</span>
            </div>
          </div>
          <!-- 提示条 -->
          <div class="group-tip">
            <span class="group-tip-icon">💕</span>
            <div class="group-tip-text">
              <div style="font-weight: 600; font-size: 13px; color: #111;">试下抱团约会新功能。</div>
              <div style="font-size: 12px; color: #666;">快去和其他双人组合配对聊天。</div>
            </div>
          </div>
        </div>
      </template>

      <!-- 普通推荐模式 -->
      <template v-else>
      <div v-if="nextCard" class="card-bg">
        <img :src="nextCard.photos[0]?.url" class="card-photo" />
      </div>
      <div
        v-if="currentCard"
        class="card"
        :style="{ transform: `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg)`, transition: cardTransition }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <img :src="currentCard.photos[photoIndex]?.url || currentCard.photos[0]?.url" class="card-photo" draggable="false" />
        <div v-if="currentCard.photos.length > 1" class="photo-indicators">
          <div v-for="(_, i) in currentCard.photos" :key="i" class="indicator" :class="{ active: i === photoIndex }"></div>
        </div>
        <div class="photo-tap-left" @click.stop="prevPhoto"></div>
        <div class="photo-tap-right" @click.stop="nextPhoto"></div>
        <div v-if="stampType === 'nope'" class="stamp stamp-nope" :style="{ opacity: stampOpacity }">NOPE</div>
        <div v-if="stampType === 'like'" class="stamp stamp-like" :style="{ opacity: stampOpacity }">LIKE</div>
        <div v-if="stampType === 'super'" class="stamp stamp-super" :style="{ opacity: stampOpacity }">SUPER</div>
        <div class="card-info" :style="{ pointerEvents: isDragging ? 'none' : 'auto' }">
          <div class="active-tag">{{ isFullMode ? '最近活跃' : '活跃' }}</div>
          <div class="info-row">
            <span class="info-name">{{ currentCard.name }}</span>
            <span class="info-age">{{ getAge(currentCard.birthday) }}</span>
            <span v-if="currentCard.is_verified" class="info-verified">✓</span>
            <button class="info-up-btn" @click.stop="openUserDetail">
              <svg class="info-arrow-svg" viewBox="0 0 24 24"><path d="M12 4L4 12h4.5v8h7v-8H20L12 4z" /></svg>
            </button>
          </div>
          <div v-if="isFullMode" class="info-meta">
            <span v-if="currentCard.distance">📍 距离 {{ currentCard.distance }} 公里</span>
            <span v-if="currentCard.school">🎓 {{ currentCard.school }}</span>
          </div>
          <!-- 占星术模式：星座匹配信息 -->
          <div v-if="activeNavTab === 'astro' && astroSetup" class="astro-match-info">
            <span class="astro-tag">🌟 摩羯座 ♑</span>
            <span class="astro-compat-dots">● ● ―― ――</span>
            <p class="astro-compat-text">
              水瓶座和<em>摩羯座</em> · 无论是派对还是约会，制定计划是你的拿手好戏。
              <a href="#" class="astro-link" @click.prevent="showCompatSheet = true">查看适配性 ›</a>
            </p>
          </div>
          <!-- 音乐模式：歌曲提示 -->
          <div v-if="activeNavTab === 'music' && musicSetup && currentPlayingSong" class="music-hint">
            <span class="music-hint-icon">♪</span>
            <span class="music-hint-text">你们都在反复听 {{ currentPlayingSong.name }}</span>
          </div>
          <div v-if="currentCard.bio" class="info-desc">{{ currentCard.bio }}</div>
          <!-- 音乐模式：播放器条 -->
          <div v-if="activeNavTab === 'music' && musicSetup && currentPlayingSong" class="music-player-bar" @click.stop="showMusicPlaylist = true">
            <img :src="currentPlayingSong.cover" class="mpb-cover" />
            <div class="mpb-info">
              <div class="mpb-name">{{ currentPlayingSong.name }}</div>
              <div class="mpb-artist">{{ currentPlayingSong.artist }}</div>
              <div class="mpb-spotify"><span class="mpb-spotify-dot">●</span> 在 Spotify 上播放</div>
            </div>
            <button class="mpb-play press" @click.stop="musicPlaying = !musicPlaying">{{ musicPlaying ? '⏸' : '▶' }}</button>
          </div>
        </div>
      </div>
      <div v-if="!currentCard && !discovery.loading" class="empty-state">
        <p>附近暂时没有新的人了</p>
        <button class="empty-btn press">扩大距离范围</button>
      </div>
      </template>
    </div>

    <!-- 满10赞：5个按钮（拖动时联动高亮） -->
    <div v-if="isFullMode" class="action-bar action-bar-full">
      <button class="icon-btn btn-sm press" :style="{ transform: `scale(${btnScale('rewind')})` }" @click="showRewindUpgrade = true" :disabled="animating">
        <svg viewBox="0 0 24 24"><path class="fill-undo" d="M12.5 3.5c-4.14 0-7.5 3.36-7.5 7.5H2l3.84 4.1a.5.5 0 0 0 .73 0L10.5 11H7.5c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5c-1.38 0-2.63-.56-3.53-1.47l-1.41 1.41c1.27 1.27 3.01 2.06 4.94 2.06 3.87 0 7-3.13 7-7s-3.13-7-7-7z"/></svg>
      </button>
      <button class="icon-btn btn-lg press" :class="{ 'btn-glow-nope': activeBtn === 'nope' }" :style="{ transform: `scale(${btnScale('nope')})` }" @click="doSwipe('nope')" :disabled="animating">
        <svg viewBox="0 0 24 24"><path class="fill-nope" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
      <button class="icon-btn btn-sm press" :class="{ 'btn-glow-star': activeBtn === 'super' }" :style="{ transform: `scale(${btnScale('super')})` }" @click="doSwipe('super_like')" :disabled="animating">
        <svg viewBox="0 0 24 24"><path class="fill-star" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </button>
      <button class="icon-btn btn-lg press" :class="{ 'btn-glow-like': activeBtn === 'like' }" :style="{ transform: `scale(${btnScale('like')})` }" @click="doSwipe('like')" :disabled="animating">
        <svg viewBox="0 0 24 24"><path class="fill-like" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </button>
      <button class="icon-btn btn-sm press" :style="{ transform: `scale(${btnScale('send')})` }" @click="showSendMessage = true" :disabled="animating || activeNavTab === 'group'">
        <svg viewBox="0 0 24 24"><path class="fill-boost" d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></svg>
      </button>
      <!-- SVG Gradients -->
      <svg width="0" height="0" style="position:absolute;">
        <defs>
          <linearGradient id="grad-nope" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff5d73"/><stop offset="100%" stop-color="#ee0b66"/></linearGradient>
          <linearGradient id="grad-like" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d3f96e"/><stop offset="100%" stop-color="#17e297"/></linearGradient>
          <linearGradient id="grad-star" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#51ccff"/><stop offset="100%" stop-color="#1786ff"/></linearGradient>
          <linearGradient id="grad-boost" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3d8bff"/><stop offset="100%" stop-color="#1a5fff"/></linearGradient>
        </defs>
      </svg>
    </div>
    <!-- 未满10赞：2个按钮 -->
    <div v-else class="action-bar">
      <button class="icon-btn btn-lg press" :class="{ 'btn-glow-nope': activeBtn === 'nope' }" :style="{ transform: `scale(${btnScale('nope')})` }" @click="doSwipe('nope')" :disabled="animating">
        <svg viewBox="0 0 24 24"><path class="fill-nope" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
      <button class="icon-btn btn-lg press" :class="{ 'btn-glow-like': activeBtn === 'like' }" :style="{ transform: `scale(${btnScale('like')})` }" @click="doSwipe('like')" :disabled="animating">
        <svg viewBox="0 0 24 24"><path class="fill-like" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </button>
      <svg width="0" height="0" style="position:absolute;">
        <defs>
          <linearGradient id="grad-nope" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff5d73"/><stop offset="100%" stop-color="#ee0b66"/></linearGradient>
          <linearGradient id="grad-like" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d3f96e"/><stop offset="100%" stop-color="#17e297"/></linearGradient>
        </defs>
      </svg>
    </div>

    <!-- 匹配覆盖层 -->
    <Transition name="match-fade">
      <div v-if="showMatchModal" class="match-overlay">
        <button class="match-close press" @click="closeMatch">✕</button>

        <!-- 星星装饰 -->
        <div class="match-sparkle">✦ ✦</div>

        <!-- 背景爱心层 -->
        <div class="match-heart-bg">
          <svg class="mh-layer mh-1" viewBox="0 0 32 29.6"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/></svg>
          <svg class="mh-layer mh-2" viewBox="0 0 32 29.6"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/></svg>
          <svg class="mh-layer mh-3" viewBox="0 0 32 29.6"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/></svg>
        </div>

        <!-- 中间区域：头像 + 文字 -->
        <div class="match-center">
          <div class="match-avatars">
            <img :src="userStore.profile?.photos[0]?.url || 'https://picsum.photos/seed/matchme/200/200'" class="match-av match-av-l" />
            <img :src="matchedUser?.photos[0]?.url || 'https://picsum.photos/seed/matchthem/200/200'" class="match-av match-av-r" />
          </div>
          <div class="match-text-group">
            <span class="match-its">IT'S A</span>
            <h1 class="match-word">Match</h1>
            <p class="match-sub">您已与 <strong>{{ matchedUser?.name }}</strong> 配对</p>
          </div>
        </div>

        <!-- 底部：输入框 + 表情 -->
        <div class="match-bottom">
          <div class="match-input-row">
            <input class="match-input" v-model="matchMessage" placeholder="说点什么" @keyup.enter="sendMatchMessage" />
            <button class="match-send-btn" @click="sendMatchMessage">发送</button>
          </div>
          <div class="match-emojis">
            <button class="emoji-btn press" @click="sendMatchEmoji('👋')">👋</button>
            <button class="emoji-btn press" @click="sendMatchEmoji('😊')">😊</button>
            <button class="emoji-btn press" @click="sendMatchEmoji('❤️')">❤️</button>
            <button class="emoji-btn press" @click="sendMatchEmoji('😍')">😍</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 抱团约会引导覆盖层 -->
    <Transition name="match-fade">
      <div v-if="showGroupDateOverlay" class="group-date-overlay">
        <button class="gd-close press" @click="closeGroupDate">✕</button>

        <!-- 轮播区域 -->
        <div class="gd-carousel" @touchstart.passive="gdTouchStart" @touchend.passive="gdTouchEnd">
          <!-- Slide 1: 获得抱团约会体验资格 -->
          <div v-show="groupDateSlide === 0" class="gd-slide">
            <div class="gd-illustration gd-illust-1">
              <!-- 圆角矩形框 -->
              <div class="gd-frame">
                <!-- 左侧照片组 -->
                <div class="gd-frame-left">
                  <img src="https://picsum.photos/seed/gd1/200/260" class="gd-frame-photo gd-fp-1" />
                  <img src="https://picsum.photos/seed/gd2/200/260" class="gd-frame-photo gd-fp-2" />
                </div>
                <!-- 中间虚线卡片 -->
                <div class="gd-frame-center">
                  <div class="gd-dashed-card">
                    <span class="gd-dashed-icon">👤</span>
                  </div>
                </div>
                <!-- 右侧照片组 -->
                <div class="gd-frame-right">
                  <img src="https://picsum.photos/seed/gd3/200/260" class="gd-frame-photo gd-fp-3" />
                  <img src="https://picsum.photos/seed/gd4/200/260" class="gd-frame-photo gd-fp-4" />
                </div>
              </div>
              <!-- X 和 心形按钮 -->
              <div class="gd-action-icons">
                <div class="gd-icon-circle gd-icon-nope">✕</div>
                <div class="gd-icon-circle gd-icon-like">💚</div>
              </div>
            </div>
            <h2 class="gd-title">获得抱团约会体验资格，快来试试！</h2>
            <p class="gd-desc">有朋友在旁总是很加分，连约会都是！和朋友结伴出行，为初次约会减压。</p>
          </div>

          <!-- Slide 2: 加入聊天群 -->
          <div v-show="groupDateSlide === 1" class="gd-slide">
            <div class="gd-illustration gd-illust-2">
              <div class="gd-frame gd-frame-chat">
                <!-- 左上 -->
                <div class="gd-chat-person gd-cp-tl">
                  <img src="https://picsum.photos/seed/gd5/100/100" class="gd-chat-img" />
                  <span class="gd-bubble gd-bubble-dark">●●●</span>
                </div>
                <!-- 右上 -->
                <div class="gd-chat-person gd-cp-tr">
                  <img src="https://picsum.photos/seed/gd6/100/100" class="gd-chat-img" />
                  <span class="gd-bubble gd-bubble-wave">👋</span>
                </div>
                <!-- 左下 -->
                <div class="gd-chat-person gd-cp-bl">
                  <img src="https://picsum.photos/seed/gd7/100/100" class="gd-chat-img" />
                  <span class="gd-bubble gd-bubble-blue">●●●</span>
                </div>
                <!-- 右下 (占位) -->
                <div class="gd-chat-person gd-cp-br">
                  <div class="gd-chat-placeholder">
                    <span class="gd-chat-placeholder-icon">👤</span>
                    <span class="gd-chat-plus">＋</span>
                  </div>
                </div>
              </div>
            </div>
            <h2 class="gd-title">加入聊天群</h2>
            <p class="gd-desc">匹配成功后，在聊天群里先聊起来。</p>
          </div>

          <!-- Slide 3: 一起出去玩 -->
          <div v-show="groupDateSlide === 2" class="gd-slide">
            <div class="gd-illustration gd-illust-3">
              <div class="gd-frame">
                <div class="gd-frame-left">
                  <img src="https://picsum.photos/seed/gd8/200/260" class="gd-frame-photo gd-fp-1" />
                  <img src="https://picsum.photos/seed/gd9/200/260" class="gd-frame-photo gd-fp-2" />
                </div>
                <div class="gd-frame-center">
                  <div class="gd-dashed-card">
                    <span class="gd-dashed-icon">👤</span>
                  </div>
                </div>
                <div class="gd-frame-right">
                  <img src="https://picsum.photos/seed/gd10/200/260" class="gd-frame-photo gd-fp-3" />
                  <img src="https://picsum.photos/seed/gd11/200/260" class="gd-frame-photo gd-fp-4" />
                </div>
              </div>
              <div class="gd-action-icons">
                <div class="gd-icon-circle gd-icon-nope">✕</div>
                <div class="gd-icon-circle gd-icon-like">💚</div>
              </div>
            </div>
            <h2 class="gd-title">一起出去玩</h2>
            <p class="gd-desc">约上朋友，来一场轻松愉快的双人约会。</p>
          </div>
        </div>

        <!-- 轮播指示点 -->
        <div class="gd-dots" @click.stop>
          <span class="gd-dot" :class="{ active: groupDateSlide === 0 }" @click="groupDateSlide = 0"></span>
          <span class="gd-dot" :class="{ active: groupDateSlide === 1 }" @click="groupDateSlide = 1"></span>
          <span class="gd-dot" :class="{ active: groupDateSlide === 2 }" @click="groupDateSlide = 2"></span>
        </div>

        <!-- 底部按钮 -->
        <div class="gd-actions">
          <button class="gd-btn-invite press" @click="groupDateInvite">邀请好友</button>
          <button class="gd-btn-later press" @click="groupDateLater">以后再说</button>
        </div>
      </div>
    </Transition>

    <!-- 分享面板 -->
    <Transition name="sheet-fade">
      <div v-if="showShareSheet" class="share-mask" @click.self="closeShareSheet">
        <div class="share-sheet">
          <h3 class="share-title">分享</h3>
          <div class="share-grid">
            <div class="share-item">
              <div class="share-icon share-icon-wechat">💬</div>
              <span class="share-label">微信：发送给朋友</span>
            </div>
            <div class="share-item">
              <div class="share-icon share-icon-favorites">📦</div>
              <span class="share-label">添加到微信收藏</span>
            </div>
            <div class="share-item">
              <div class="share-icon share-icon-qq-fav">⭐</div>
              <span class="share-label">保存到QQ收藏</span>
            </div>
            <div class="share-item">
              <div class="share-icon share-icon-qq-pc">🖥️</div>
              <span class="share-label">QQ：发送到我的电脑</span>
            </div>
            <div class="share-item">
              <div class="share-icon share-icon-qq">🐧</div>
              <span class="share-label">QQ：发送给</span>
            </div>
            <div class="share-item">
              <div class="share-icon share-icon-xianyu">🐟</div>
              <span class="share-label">闲鱼搜索</span>
            </div>
            <div class="share-item">
              <div class="share-icon share-icon-map">📍</div>
              <span class="share-label">高德地图</span>
            </div>
            <div class="share-item">
              <div class="share-icon share-icon-youdao">📖</div>
              <span class="share-label">网易有道词</span>
            </div>
          </div>
          <button class="share-cancel press" @click="closeShareSheet">取消</button>
        </div>
      </div>
    </Transition>

    <!-- 查看适配性底部面板 -->
    <Transition name="sheet-fade">
      <div v-if="showCompatSheet" class="sheet-mask" @click.self="showCompatSheet = false">
        <div class="compat-sheet">
          <div class="compat-header">
            <div class="compat-header-bg">
              <span class="cst cst1">✦</span>
              <span class="cst cst2">✦</span>
              <span class="cst cst3">✧</span>
            </div>
            <div class="compat-header-content">
              <div class="sheet-handle" style="background: rgba(255,255,255,0.4);"></div>
              <div class="compat-top-row">
                <button class="compat-close press" @click="showCompatSheet = false">✕</button>
                <button class="compat-info press">ⓘ</button>
              </div>
              <div class="compat-brand">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 6 8 6 13.5C6 17.6 9 21 12 21C15 21 18 17.6 18 13.5C18 10 15.5 8 15.5 8C15.5 8 15 12 13 12C13 12 14 7 12 2Z" fill="#fff"/></svg>
                <span style="font-size: 12px; font-style: italic; color: #fff;">tinder</span>
                <span style="font-size: 11px; color: rgba(255,255,255,0.6); margin-left: 4px;">占星术</span>
              </div>
              <h3 class="compat-sheet-title">你和 {{ currentCard?.name || 'Niio' }}</h3>
              <!-- 个性对比卡片 -->
              <div class="compat-compare-card">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                  <span>☀️</span><strong style="color: #fff; font-size: 13px;">个性对比</strong>
                </div>
                <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 0 0 6px;">你: 水瓶座 ♒ ，{{ currentCard?.name || 'Niio' }}: <span style="color: #e8a838;">天蝎座 ♏</span></p>
                <p style="font-size: 14px; color: #fff; line-height: 1.5; margin: 0;">不像其他人，你们乐于改变。你们总在进步，努力成为最好的自己。</p>
              </div>
              <div class="dots" style="margin-top: 10px;">
                <span class="dot active"></span><span class="dot"></span><span class="dot"></span>
              </div>
            </div>
          </div>

          <!-- 白色滚动区域 -->
          <div class="compat-body">
            <h4 class="cb-title">你的宇宙火花</h4>
            <div class="spark-grid">
              <div class="spark-col"><div class="spark-name">心电感应</div><div class="spark-bar"><span class="sb-fill" style="width: 40%;"></span></div></div>
              <div class="spark-col"><div class="spark-name">传播学</div><div class="spark-bar"><span class="sb-fill" style="width: 60%;"></span></div></div>
              <div class="spark-col"><div class="spark-name">情感</div><div class="spark-bar spark-bar-locked"><span class="sb-gray"></span>🔒</div></div>
              <div class="spark-col"><div class="spark-name">火花指数</div><div class="spark-bar spark-bar-locked"><span class="sb-gray"></span>🔒</div></div>
            </div>

            <h4 class="cb-title">元素组合</h4>
            <div class="elem-grid">
              <div class="elem-item"><span class="elem-icon">🔥</span><div><div class="elem-name">火象</div><div class="elem-desc">激情与行动</div></div><span class="elem-pct" style="color: #f2385a;">0%</span></div>
              <div class="elem-item"><span class="elem-icon">🌍</span><div><div class="elem-name">土象</div><div class="elem-desc">现实与实际</div></div><span class="elem-pct" style="color: #f2385a;">0%</span></div>
              <div class="elem-item"><span class="elem-icon">🌬️</span><div><div class="elem-name">风象</div><div class="elem-desc">交流与创造</div></div><span class="elem-pct" style="color: #b74fff;">50%</span></div>
              <div class="elem-item"><span class="elem-icon">💧</span><div><div class="elem-name">水象</div><div class="elem-desc">情感与本能</div></div><span class="elem-pct" style="color: #42a5f5;">50%</span></div>
            </div>

            <div class="explain-box">
              <strong>星座元素解释如下</strong>
              <p>风趣幽默的谈吐会拉近彼此的距离。</p>
            </div>

            <button class="detail-btn press" @click="showCompatSheet = false; router.push({ name: 'astro-setup' })">查看细节</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 占星术弹窗 -->
    <Transition name="sheet-fade">
      <div v-if="showAstroModal" class="astro-modal-overlay" @click.self="astroLater">
        <div class="astro-modal">
          <div class="astro-modal-header">
            <div class="astro-modal-controls">
              <button class="astro-modal-close press" @click="astroLater">✕</button>
              <span class="astro-modal-stars">✦ ✦ ✦</span>
            </div>
            <div class="astro-modal-icons">
              <span class="ami ami-cloud">☁️</span>
              <span class="ami ami-sun">☀️</span>
              <span class="ami ami-moon">🌙</span>
            </div>
          </div>
          <div class="astro-modal-body">
            <h2 class="astro-modal-title">探索星座板块</h2>
            <p class="astro-modal-desc">星座板块提供精简有趣的分析，看你和配对对象的气场合不合。</p>
            <button class="astro-modal-btn-primary press" @click="astroContinue">开启探索之旅</button>
            <button class="astro-modal-btn-secondary press" @click="astroLater">以后再说</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 音乐模式底部弹窗 -->
    <Transition name="sheet-fade">
      <div v-if="showMusicModal" class="sheet-mask" @click.self="musicLater">
        <div class="sheet">
          <div class="sheet-handle"></div>
          <button class="sheet-close press" @click="musicLater">✕</button>
          <!-- 音乐插图 -->
          <div class="music-illustration">
            <div class="music-bg"></div>
            <div class="music-icons">
              <span class="music-note-l">♪</span>
              <span class="music-earphone">🎧</span>
              <span class="music-cd">💿</span>
              <span class="music-earphone">🎧</span>
              <span class="music-note-r">♫</span>
            </div>
            <div class="music-notes-float">♪ ♫ ♪</div>
          </div>
          <h2 class="sheet-title">音乐模式上线啦</h2>
          <p class="sheet-desc">在音乐模式下，潜在配对对象可以查看你的播放列表。寻找志趣相投的人，用音乐作为开场白。</p>
          <button class="sheet-btn-primary press" @click="musicContinue">继续</button>
          <button class="sheet-btn-text press" @click="musicLater">以后再说</button>
        </div>
      </div>
    </Transition>

    <!-- 音乐播放列表面板 -->
    <Transition name="sheet-fade">
      <div v-if="showMusicPlaylist" class="sheet-mask" @click.self="showMusicPlaylist = false">
        <div class="music-playlist-sheet">
          <div class="mpl-header">
            <div class="mpl-header-bg">
              <span class="mpl-note mpl-n1">♪</span>
              <span class="mpl-note mpl-n2">♫</span>
              <span class="mpl-note mpl-n3">🎵</span>
            </div>
            <div class="mpl-header-content">
              <div class="sheet-handle" style="background: rgba(255,255,255,0.4);"></div>
              <button class="mpl-close press" @click="showMusicPlaylist = false">✕</button>
              <h3 class="mpl-title">{{ userStore.profile?.name || '我' }}的音乐</h3>
            </div>
          </div>
          <div class="mpl-body">
            <div v-for="song in userMusicSongs" :key="song.id" class="mpl-item">
              <img :src="song.cover" class="mpl-item-cover" />
              <div class="mpl-item-info">
                <div class="mpl-item-name">{{ song.name }}</div>
                <div class="mpl-item-artist">{{ song.artist }}</div>
                <div class="mpl-item-spotify"><span class="mpl-spotify-dot">●</span> 在 Spotify 上播放</div>
              </div>
              <button class="mpl-item-play press">▶</button>
            </div>
            <div v-if="userMusicSongs.length === 0" class="mpl-empty">
              <p>还没有添加音乐</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 回退升级提示 (Tinder Plus) -->
    <Transition name="match-fade">
      <div v-if="showRewindUpgrade" class="rewind-overlay">
        <button class="rewind-close press" @click="showRewindUpgrade = false">✕</button>
        <div class="rewind-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 6 8 6 13.5C6 17.6 9 21 12 21C15 21 18 17.6 18 13.5C18 10 15.5 8 15.5 8C15.5 8 15 12 13 12C13 12 14 7 12 2Z" fill="#FD297B"/></svg>
          <span class="rewind-brand-text">tinder<span class="rewind-plus">+</span></span>
        </div>
        <h2 class="rewind-title">无限倒回。你可以撤回操作，再给自己一次机会！</h2>
        <p class="rewind-subtitle">选择一个套餐</p>
        <div class="rewind-plans">
          <div class="rewind-plan rewind-plan-active">
            <span class="plan-hot">热门</span>
            <span class="plan-period">1 周</span>
            <span class="plan-price">US$12.99/周</span>
            <span class="plan-check">✓</span>
          </div>
          <div class="rewind-plan">
            <span class="plan-period">1 个月</span>
            <span class="plan-price">US$6.24/周</span>
          </div>
        </div>
        <div class="rewind-dots"><span class="rd active"></span><span class="rd"></span><span class="rd"></span></div>
        <div class="rewind-features">
          <div class="rewind-features-title">Tinder Plus™ 高级功能</div>
          <div class="rf-item"><span class="rf-check">✓</span><span class="rf-text"><strong>无限点赞</strong></span></div>
          <div class="rf-item"><span class="rf-check">✓</span><span class="rf-text"><strong>无限倒回</strong></span></div>
          <div class="rf-item"><span class="rf-check">✓</span><span class="rf-text"><strong>无限位置漫游模式*</strong><br/><span class="rf-sub">你可以和世界各地的用户配对聊天。*含限制条件。<a href="#">了解更多</a></span></span></div>
          <div class="rf-item"><span class="rf-check">✓</span><span class="rf-text"><strong>管理你的个人资料</strong><br/><span class="rf-sub">仅显示你想公布的信息。</span></span></div>
          <div class="rf-item"><span class="rf-check">✓</span><span class="rf-text"><strong>限制谁可以看到你</strong><br/><span class="rf-sub">你可以管理谁可以看到你。</span></span></div>
        </div>
        <p class="rewind-disclaimer">当您点击"继续"后，我们将向您收取费用，您的订阅会以相同的套餐期限和价格自动续订，直至您在 Play 商店设置中取消自动续订。点击即表示您同意我们的<a href="#">条款</a>。</p>
        <button class="rewind-buy-btn press" @click="showRewindUpgrade = false">以 US$12.99 的总价继续操作</button>
      </div>
    </Transition>

    <!-- Boost 购买页面 -->
    <Transition name="slide-up">
      <div v-if="showBoostPage" class="boost-page" :class="{ 'boost-page-super': boostTab === 'super' }">
        <header class="bp-header">
          <button class="bp-close press" @click="showBoostPage = false">✕</button>
        </header>
        <div class="bp-body">
          <h1 class="bp-title">选择 Boost</h1>
          <!-- Tab 导航 -->
          <div class="bp-tabs">
            <button class="bp-tab" :class="{ 'bp-tab-active': boostTab === 'boost' }" @click="boostTab = 'boost'; boostPlanIndex = 1">Boost</button>
            <button class="bp-tab" :class="{ 'bp-tab-active': boostTab === 'prime' }" @click="boostTab = 'prime'; boostPlanIndex = 1">优时 Boost</button>
            <button class="bp-tab" :class="{ 'bp-tab-active': boostTab === 'super' }" @click="boostTab = 'super'; boostPlanIndex = 1">Super Boost</button>
          </div>

          <!-- Boost Tab -->
          <template v-if="boostTab === 'boost'">
            <div class="bp-desc-card">
              <div class="bp-desc-left">
                <div class="bp-desc-icon">⚡</div>
                <strong>Boost</strong>
                <p>成为当地的最佳个人资料，30 分钟内帮你收获更多点赞。</p>
              </div>
              <img src="https://picsum.photos/seed/boostav/60/60" class="bp-desc-avatar" />
            </div>
            <div class="bp-plans">
              <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 0 }" @click="boostPlanIndex = 0">
                <div class="bp-plan-top"><span class="bp-plan-best">最划算</span><span class="bp-plan-save">节省 40%</span></div>
                <div class="bp-plan-row"><span class="bp-plan-count">20 Boost</span><span class="bp-plan-price">US$1.99/个</span></div>
              </div>
              <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 1 }" @click="boostPlanIndex = 1">
                <div class="bp-plan-row"><span class="bp-plan-count">10 Boost</span><span class="bp-plan-price">US$5.99/个</span></div>
              </div>
              <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 2 }" @click="boostPlanIndex = 2">
                <div class="bp-plan-row"><span class="bp-plan-count">3 Boost</span><span class="bp-plan-price">US$3.33/个</span></div>
              </div>
            </div>
            <div class="bp-or"><span>或</span></div>
            <div class="bp-gold-hint">
              <p class="bp-gold-hint-title">每月免费赠送 1 个 Boost</p>
              <div class="bp-gold-row">
                <span>🔥 开通 Tinder Gold®</span>
                <button class="bp-gold-btn press" @click="showBoostPage = false; showGoldUpgrade = true">选择</button>
              </div>
            </div>
          </template>

          <!-- 优时 Boost Tab -->
          <template v-if="boostTab === 'prime'">
            <div class="bp-desc-card">
              <div class="bp-desc-left">
                <div class="bp-desc-icon bp-icon-prime">🕐</div>
                <strong>优时 Boost</strong>
                <p>我们会在用户最活跃的时段一键 Boost，让更多的潜在配对对象看到你。</p>
              </div>
              <img src="https://picsum.photos/seed/boostav2/60/60" class="bp-desc-avatar" />
            </div>
            <div class="bp-plans">
              <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 0 }" @click="boostPlanIndex = 0">
                <div class="bp-plan-top"><span class="bp-plan-save">节省 25%</span></div>
                <div class="bp-plan-row"><span class="bp-plan-count">5 优时 Boost</span><span class="bp-plan-price">US$11.99/个</span></div>
              </div>
              <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 1 }" @click="boostPlanIndex = 1">
                <div class="bp-plan-top"><span class="bp-plan-save">节省 12%</span></div>
                <div class="bp-plan-row"><span class="bp-plan-count">3 优时 Boost</span><span class="bp-plan-price">US$13.99/个</span></div>
              </div>
              <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 2 }" @click="boostPlanIndex = 2">
                <div class="bp-plan-row"><span class="bp-plan-count">1 优时 Boost</span><span class="bp-plan-price">US$15.99</span></div>
              </div>
            </div>
            <div class="bp-or"><span>或</span></div>
            <div class="bp-gold-hint">
              <p class="bp-gold-hint-title">每月免费赠送 1 个 Boost</p>
              <div class="bp-gold-row">
                <span>🔥 开通 Tinder Gold®</span>
                <button class="bp-gold-btn press" @click="showBoostPage = false; showGoldUpgrade = true">选择</button>
              </div>
            </div>
          </template>

          <!-- Super Boost Tab -->
          <template v-if="boostTab === 'super'">
            <div class="bp-desc-card bp-desc-super">
              <div class="bp-desc-left">
                <div class="bp-desc-icon bp-icon-super">⚡</div>
                <strong>Super Boost</strong>
                <p>Super Boost 助你冲到前排，让更多人有机会认识你。</p>
              </div>
              <div class="bp-super-icon">⚡</div>
            </div>
            <div class="bp-plans">
              <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 0 }" @click="boostPlanIndex = 0">
                <div class="bp-plan-top"><span class="bp-plan-best">最划算</span><span class="bp-plan-save">节省 35%</span></div>
                <div class="bp-plan-row"><span class="bp-plan-count bp-count-purple">12 小时</span><span class="bp-plan-price">US$129.99</span></div>
              </div>
              <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 1 }" @click="boostPlanIndex = 1">
                <div class="bp-plan-top"><span class="bp-plan-hot">热门</span><span class="bp-plan-save">节省 30%</span></div>
                <div class="bp-plan-row"><span class="bp-plan-count bp-count-purple">6 小时</span><span class="bp-plan-price">US$69.99</span></div>
              </div>
              <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 2 }" @click="boostPlanIndex = 2">
                <div class="bp-plan-row"><span class="bp-plan-count bp-count-purple">3 小时</span><span class="bp-plan-price">US$49.99</span></div>
              </div>
            </div>
          </template>
        </div>

        <!-- 底部按钮 -->
        <footer class="bp-footer">
          <template v-if="boostTab === 'super'">
            <p class="bp-footer-sub">订阅用户专享。</p>
            <button class="bp-buy-btn bp-buy-super press" @click="showBoostPage = false">解锁 Super Boost</button>
          </template>
          <template v-else>
            <button class="bp-buy-btn bp-buy-purple press" @click="showBoostPage = false">以 US${{ boostTab === 'boost' ? '59.99' : '41.99' }} 的总价继续操作</button>
          </template>
        </footer>
      </div>
    </Transition>

    <!-- Match Suggestion 弹窗 -->
    <Transition name="match-fade">
      <div v-if="showMatchSuggestion" class="ms-overlay" @click.self="dismissMatchSuggestion">
        <div class="ms-card">
          <div class="ms-header">
            <span class="ms-heart ms-h1">❤</span>
            <span class="ms-heart ms-h2">❤</span>
            <span class="ms-heart ms-h3">❤</span>
            <div class="ms-avatars">
              <img :src="userStore.profile?.photos[0]?.url || 'https://picsum.photos/seed/msme/150/150'" class="ms-avatar ms-avatar-left" />
              <img :src="matchSuggestionUser.photo" class="ms-avatar ms-avatar-right" />
            </div>
          </div>
          <div class="ms-content">
            <div class="ms-title">你和 <strong>{{ matchSuggestionUser.name }}</strong> 应该会很来电</div>
            <p class="ms-desc">根据我们对你的个人资料的了解，你应该很快就会配对成功。</p>
            <button class="ms-btn ms-btn-super press" @click="onSuperLikeFromSuggestion">发送 Super Like</button>
            <button class="ms-btn ms-btn-cancel press" @click="dismissMatchSuggestion">不，谢谢</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Super Like 购买页（从 suggestion 触发） -->
    <!-- Super Like 购买页 -->
    <SuperLikeModal v-if="showSuperLikePage" @close="showSuperLikePage = false" @open-gold="showSuperLikePage = false; showGoldUpgrade = true" />

    <!-- 发送消息面板 -->
    <Transition name="match-fade">
      <div v-if="showSendMessage" class="send-overlay">
        <div class="send-header">
          <button class="send-close press" @click="showSendMessage = false">✕</button>
          <div class="send-count">0</div>
        </div>
        <div class="send-body">
          <div class="send-tip">
            <span class="send-tip-icon">➤</span>
            <span class="send-tip-text">配对成功率提高最多五倍</span>
          </div>
          <p class="send-desc">发送初印象，率先赢得好感。发送信息。看看是否能配对成功。</p>
          <div class="send-card-preview">
            <img :src="currentCard?.photos[0]?.url || 'https://picsum.photos/seed/send1/300/400'" class="send-card-img" />
            <span class="send-card-count">1/{{ currentCard?.photos?.length || 1 }}</span>
          </div>
        </div>
        <div class="send-input-row">
          <input class="send-input" v-model="sendMessageText" placeholder="填写信息" @keyup.enter="doSendMessage" />
          <button class="send-submit press" @click="doSendMessage">发送</button>
        </div>
      </div>
    </Transition>

    <!-- Gold 升级弹窗 -->
    <GoldUpgradeModal v-if="showGoldUpgrade" @close="showGoldUpgrade = false" />

    <!-- 老友记页面 -->
    <Transition name="slide-up">
      <div v-if="showFriendsPage" class="fp-page">
        <header class="fp-nav">
          <button class="fp-back press" @click="closeFriendsPage">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span class="fp-title">《 老友记 》</span>
          <button class="fp-settings press" @click="showGroupSettings = true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
          </button>
        </header>
        <div class="fp-body">
          <div class="fp-section-header">
            <h3>抱团约会的好友栏</h3>
            <span class="fp-count">0/3</span>
          </div>
          <div class="fp-invite-box" @click="showShareSheet = true">
            <div class="fp-user-placeholder">
              <div class="fp-avatar-dashed">
                <svg viewBox="0 0 24 24" fill="#99a2ad" width="24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <span class="fp-invite-text">邀请好友</span>
            </div>
            <span class="fp-plus">＋</span>
          </div>
          <p class="fp-info">你可以和至多 3 位好友组团，参加抱团约会。<a href="#" class="fp-link" @click.prevent="showGroupInfo = true">了解更多</a></p>
          <span class="fp-bold-title">邀请好友一起配对</span>
          <p class="fp-sub-info">已经给 1 组抱团约会对子点了赞。现在邀请一位好友，看看能不能配对成功。</p>
          <div class="fp-match-preview">
            <div class="fp-share-tag" @click="showShareSheet = true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
            </div>
            <div class="fp-half fp-half-left">
              <img src="https://picsum.photos/seed/sw1/400/700" class="fp-half-img" />
              <div class="fp-bottom-grad"></div>
              <span class="fp-name-label">Carey ✓</span>
            </div>
            <div class="fp-half fp-half-right">
              <img src="https://picsum.photos/seed/sw2/400/700" class="fp-half-img" />
              <div class="fp-bottom-grad"></div>
              <span class="fp-name-label">江江 ✓</span>
            </div>
          </div>
        </div>
        <div class="fp-footer">
          <button class="fp-btn press" @click="showShareSheet = true">邀 请 好 友</button>
        </div>
      </div>
    </Transition>

    <!-- 抱团约会了解更多底部弹窗 -->
    <Transition name="sheet-fade">
      <div v-if="showGroupInfo" class="gi-mask" @click.self="showGroupInfo = false">
        <div class="gi-sheet">
          <div class="gi-handle"></div>
          <button class="gi-close press" @click="showGroupInfo = false">✕</button>
          <div class="gi-illustration">
            <img src="https://picsum.photos/seed/groupinfo/280/180" class="gi-img" />
          </div>
          <h2 class="gi-title">和好友组对，去抱团约会</h2>
          <div class="gi-features">
            <div class="gi-feat">
              <span class="gi-feat-icon">✉️</span>
              <div class="gi-feat-text"><strong>邀请朋友</strong><p>和好友组对，最多三人，去抱团约会</p></div>
            </div>
            <div class="gi-feat">
              <span class="gi-feat-icon">◎</span>
              <div class="gi-feat-text"><strong>添加约会活动</strong><span class="gi-feat-badge">更新</span><p>你想和抱团约会那一对玩什么，请选择。</p></div>
            </div>
            <div class="gi-feat">
              <span class="gi-feat-icon">📞</span>
              <div class="gi-feat-text"><strong>一人滑动，两人配对</strong><p>邀请接受后，你可以独自查看抱团约会对象。</p></div>
            </div>
            <div class="gi-feat">
              <span class="gi-feat-icon">❤️</span>
              <div class="gi-feat-text"><strong>配对只需一个赞</strong><p>每对中的任何人点赞都能配对成功。</p></div>
            </div>
            <div class="gi-feat">
              <span class="gi-feat-icon">💬</span>
              <div class="gi-feat-text"><strong>加入群聊</strong><p>先感受下群聊的气氛，再决定要不要线下见面。</p></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 抱团约会设置页面 -->
    <Transition name="slide-up">
      <div v-if="showGroupSettings" class="gs-page">
        <header class="gs-header">
          <button class="gs-back press" @click="showGroupSettings = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span class="gs-title">抱团约会</span>
          <div style="width: 24px;"></div>
        </header>
        <div class="gs-body">
          <div class="gs-card">
            <div class="gs-card-row">
              <span class="gs-card-label">在好友个人资料中显示我的信息</span>
              <label class="gs-toggle"><input type="checkbox" v-model="groupSettingShowInfo" /><span class="gs-slider"></span></label>
            </div>
          </div>
          <p class="gs-hint">抱团约会好友的个人资料上可能会出现你的名字和照片。</p>

          <div class="gs-card">
            <div class="gs-card-row">
              <span class="gs-card-label">在个人资料中显示我的好友</span>
              <label class="gs-toggle"><input type="checkbox" v-model="groupSettingShowFriends" /><span class="gs-slider"></span></label>
            </div>
          </div>
          <p class="gs-hint">你的个人资料上可能会出现抱团约会好友的名字和照片。</p>

          <div class="gs-card">
            <div class="gs-card-row">
              <span class="gs-card-label">显示抱团约会个人资料</span>
              <label class="gs-toggle"><input type="checkbox" v-model="groupSettingShowProfile" /><span class="gs-slider"></span></label>
            </div>
          </div>
          <p class="gs-hint">功能关闭后，抱团约会个人资料将不会在"为你推荐"版块出现。</p>
        </div>
      </div>
    </Transition>

    <!-- 用户详情页 -->
    <Transition name="slide-up">
      <div v-if="showUserDetail && currentCard" class="ud-page">
        <header class="ud-header">
          <div class="ud-name-row">
            <span class="ud-name">{{ currentCard.name }}，{{ getAge(currentCard.birthday) }}</span>
            <span v-if="currentCard.is_verified" class="ud-verified">✓</span>
          </div>
          <button class="ud-down press" @click="closeUserDetail">⬇</button>
        </header>

        <div class="ud-body">
          <!-- 照片区域 -->
          <div class="ud-photo-area">
            <img :src="currentCard.photos[detailPhotoIndex]?.url || currentCard.photos[0]?.url" class="ud-photo" />
            <div v-if="currentCard.photos.length > 1" class="ud-indicators">
              <div v-for="(_, i) in currentCard.photos" :key="i" class="ud-ind" :class="{ active: i === detailPhotoIndex }"></div>
            </div>
            <div class="ud-tap-left" @click="detailPrevPhoto"></div>
            <div class="ud-tap-right" @click="detailNextPhoto"></div>
          </div>

          <!-- 我想要 -->
          <div v-if="currentCard.dating_purpose && currentCard.dating_purpose.length" class="ud-section">
            <div class="ud-section-header"><span>🔍</span> 我想要</div>
            <div class="ud-purpose">😍 {{ currentCard.dating_purpose.join('、') }}</div>
          </div>

          <!-- 关于我 -->
          <div v-if="currentCard.bio" class="ud-section">
            <div class="ud-section-header"><span>❝</span> 关于我</div>
            <p class="ud-bio">{{ currentCard.bio }}</p>
          </div>

          <!-- 关键信息 -->
          <div class="ud-section" v-if="currentCard.distance || currentCard.school || currentCard.job_title || currentCard.city || currentCard.height_cm">
            <div class="ud-section-header"><span>📋</span> 关键信息</div>
            <div v-if="currentCard.distance" class="ud-info-item">📍 {{ currentCard.distance }}公里以内</div>
            <div v-if="currentCard.school" class="ud-info-item">🎓 {{ currentCard.school }}</div>
            <div v-if="currentCard.job_title" class="ud-info-item">💼 {{ currentCard.job_title }}<span v-if="currentCard.company"> · {{ currentCard.company }}</span></div>
            <div v-if="currentCard.city" class="ud-info-item">🏙️ {{ currentCard.city }}</div>
            <div v-if="currentCard.height_cm" class="ud-info-item">📏 {{ currentCard.height_cm }} cm</div>
          </div>

          <!-- 兴趣 -->
          <div v-if="currentCard.interests && currentCard.interests.length" class="ud-section">
            <div class="ud-section-header"><span>🎯</span> 兴趣</div>
            <div class="ud-tags">
              <span v-for="tag in currentCard.interests" :key="tag" class="ud-tag">{{ tag }}</span>
            </div>
          </div>

          <!-- 生活方式 -->
          <div v-if="currentCard.lifestyles && Object.keys(currentCard.lifestyles).length" class="ud-section">
            <div class="ud-section-header"><span>🌿</span> 生活方式</div>
            <div class="ud-tags">
              <span v-for="(val, key) in currentCard.lifestyles" :key="key" class="ud-tag">{{ key }}: {{ val }}</span>
            </div>
          </div>

          <!-- 性格 -->
          <div v-if="currentCard.personality && currentCard.personality.length" class="ud-section">
            <div class="ud-section-header"><span>✨</span> 性格</div>
            <div class="ud-tags">
              <span v-for="p in currentCard.personality" :key="p" class="ud-tag">{{ p }}</span>
            </div>
          </div>

          <!-- 屏蔽/举报 -->
          <div class="ud-block">屏蔽 {{ currentCard.name }}</div>
          <div class="ud-report">举报 {{ currentCard.name }}</div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="ud-actions">
          <button class="ud-btn-white ud-btn-wlg press" @click="closeUserDetail(); doSwipe('nope')">
            <svg viewBox="0 0 24 24"><path class="ud-fill-nope" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
          <button class="ud-btn-white ud-btn-wsm press" @click="closeUserDetail(); doSwipe('super_like')">
            <svg viewBox="0 0 24 24"><path class="ud-fill-star" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </button>
          <button class="ud-btn-white ud-btn-wlg press" @click="closeUserDetail(); doSwipe('like')">
            <svg viewBox="0 0 24 24"><path class="ud-fill-like" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <!-- SVG Gradients for detail buttons -->
          <svg width="0" height="0" style="position:absolute;">
            <defs>
              <linearGradient id="ud-grad-nope" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff5e92"/><stop offset="100%" stop-color="#ff3d52"/></linearGradient>
              <linearGradient id="ud-grad-star" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#43cbff"/><stop offset="100%" stop-color="#1786ff"/></linearGradient>
              <linearGradient id="ud-grad-like" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d7f141"/><stop offset="100%" stop-color="#22d07c"/></linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </Transition>

    <BottomNavigation />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh; background: #000; display: flex; flex-direction: column;
  padding-bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));
  position: relative; overflow: hidden; user-select: none; touch-action: none;
}

/* Top Nav (full mode) */
.top-nav {
  position: absolute; top: 8px; left: 8px; right: 8px; z-index: 20;
  display: flex; align-items: center; padding: 12px 15px; gap: 5px;
  background: none;
  border-radius: 32px 32px 0 0;
}
/* Top scrim gradient overlay */
.page::before {
  content: '';
  position: absolute; top: 8px; left: 8px; right: 8px; height: 140px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%);
  border-radius: 32px 32px 0 0;
  z-index: 15;
  pointer-events: none;
}
.filter-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity 0.2s; }
.filter-btn:active { opacity: 0.6; }
.filter-icon { width: 24px; height: 24px; stroke: #d1d1cf; stroke-width: 2.8; stroke-linecap: round; fill: none; }
.nav-tabs { display: flex; gap: 5px; flex: 1; overflow-x: auto; }
.nav-tab {
  padding: 7px 14px; border-radius: 20px; font-size: 14px; font-weight: 600;
  color: #9a9a9a; white-space: nowrap; background: transparent;
  border: none; transition: all 0.2s;
}
.nav-tab.active { background: rgba(255,255,255,0.15); color: #fff; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.tab-edit { margin-left: 4px; font-size: 12px; opacity: 0.7; }
.boost-btn { color: #a644ff; font-size: 20px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }

/* Top Banner (pre-10) */
.top-banner {
  position: absolute; top: 8px; left: 12px; right: 12px; z-index: 20;
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,0.95); border-radius: 12px; padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.banner-icon { font-size: 24px; }
.banner-title { font-size: 14px; font-weight: 600; color: #111; }
.banner-sub { font-size: 12px; color: #666; }

/* Card Area */
.card-area { flex: 1; position: relative; overflow: visible; margin: 8px 8px 0 8px; }
.card-bg { position: absolute; inset: 0; overflow: hidden; transform: scale(0.95); opacity: 0.5; border-radius: 32px; }
.card { position: absolute; inset: 0; overflow: hidden; will-change: transform; cursor: grab; border-radius: 32px; background: #222; }
.card:active { cursor: grabbing; }
.card-photo { width: 100%; height: 100%; object-fit: cover; pointer-events: none; display: block; }

.photo-indicators { position: absolute; top: 56px; left: 33%; right: 33%; display: flex; gap: 2px; z-index: 25; }
.indicator { flex: 1; height: 2.5px; border-radius: 1.5px; background: rgba(255,255,255,0.3); transition: background 0.2s; }
.indicator.active { background: #fff; }

.photo-tap-left { position: absolute; top: 0; left: 0; width: 35%; height: 100%; z-index: 4; }
.photo-tap-right { position: absolute; top: 0; right: 0; width: 65%; height: 100%; z-index: 4; }

.stamp {
  position: absolute; top: 20%; left: 50%; transform: translateX(-50%) rotate(-20deg);
  font-size: 42px; font-weight: 900; z-index: 6; pointer-events: none;
  padding: 8px 16px; border: 4px solid; border-radius: 8px; letter-spacing: 4px;
}
.stamp-nope { color: #f2385a; border-color: #f2385a; transform: translateX(-50%) rotate(20deg); }
.stamp-like { color: #4cdc8f; border-color: #4cdc8f; transform: translateX(-50%) rotate(-20deg); }
.stamp-super { color: #42a5f5; border-color: #42a5f5; transform: translateX(-50%) rotate(0deg); }

.card-info {
  position: absolute; bottom: 0; left: 0; right: 0; padding: 25px; padding-top: 80px;
  background: linear-gradient(to top,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,0.9) 15%,
    rgba(0,0,0,0.5) 45%,
    rgba(0,0,0,0.2) 70%,
    rgba(0,0,0,0) 100%);
  z-index: 5;
}
.active-tag { display: inline-flex; align-items: center; justify-content: center; padding: 4px 14px; border-radius: 100px; background-color: #f1fcf6; color: #1a5d4e; font-size: 13px; font-weight: 700; margin-bottom: 8px; white-space: nowrap; }
.info-row { display: flex; align-items: baseline; gap: 6px; }
.info-name { font-size: 26px; font-weight: 700; color: #fff; }
.info-age { font-size: 22px; font-weight: 400; color: #fff; }
.info-verified { width: 18px; height: 18px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; }
.info-up-btn { margin-left: auto; width: 38px; height: 38px; border-radius: 50%; background: rgba(10, 10, 10, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #fff; display: flex; align-items: center; justify-content: center; pointer-events: auto; border: none; cursor: pointer; box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.15), 0 4px 10px rgba(0, 0, 0, 0.3); transition: transform 0.1s ease; }
.info-up-btn:active { transform: scale(0.9); }
.info-arrow-svg { width: 22px; height: 22px; fill: #ffffff; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); }
.info-meta { display: flex; gap: 12px; margin-top: 4px; font-size: 12px; color: rgba(255,255,255,0.75); }
.info-desc { font-size: 13px; color: rgba(255,255,255,0.85); margin-top: 4px; line-height: 1.4; }

/* Astro match info */
.astro-match-info { margin-top: 8px; }
.astro-tag {
  display: inline-block; padding: 3px 10px; border-radius: 6px;
  background: rgba(232, 168, 56, 0.2); color: #e8a838;
  font-size: 12px; font-weight: 600; margin-bottom: 4px;
}
.astro-compat-dots { display: inline-block; margin-left: 8px; font-size: 10px; color: rgba(255,255,255,0.5); letter-spacing: 2px; }
.astro-compat-text { font-size: 12px; color: rgba(255,255,255,0.8); line-height: 1.5; margin: 4px 0 0; }
.astro-compat-text em { color: #e8a838; font-style: italic; font-weight: 600; }
.astro-link { color: #e8a838; font-weight: 600; text-decoration: underline; margin-left: 4px; pointer-events: auto; cursor: pointer; }

.empty-state { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #999; font-size: 16px; gap: 16px; }
.empty-btn { padding: 12px 24px; border-radius: 9999px; border: 1.5px solid #666; color: #fff; font-size: 14px; font-weight: 600; }

/* Action Bar - Glassmorphism */
.action-bar { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 8px 30px 20px; background: transparent; margin-top: -20px; position: relative; z-index: 10; }
.action-bar-full { gap: 12px; }
.icon-btn { border: none; outline: none; cursor: pointer; border-radius: 50%; display: flex; justify-content: center; align-items: center; position: relative; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.15), inset 0 -3px 6px rgba(0, 0, 0, 0.2); transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.btn-sm { width: 54px; height: 54px; }
.btn-lg { width: 78px; height: 78px; }
.icon-btn svg { width: 58%; height: 58%; filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3)); }
.icon-btn:active { transform: scale(0.9); background: rgba(255, 255, 255, 0.12); }
.icon-btn:disabled { opacity: 0.5; }
.fill-nope { fill: url(#grad-nope); }
.fill-like { fill: url(#grad-like); }
.fill-star { fill: url(#grad-star); }
.fill-boost { fill: url(#grad-boost); }
.fill-undo { fill: #8a8e97; }
.btn-glow-nope { box-shadow: 0 0 20px rgba(238, 11, 102, 0.5), 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.15), inset 0 -3px 6px rgba(0, 0, 0, 0.2); background: rgba(238, 11, 102, 0.2); }
.btn-glow-like { box-shadow: 0 0 20px rgba(23, 226, 151, 0.5), 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.15), inset 0 -3px 6px rgba(0, 0, 0, 0.2); background: rgba(23, 226, 151, 0.2); }
.btn-glow-star { box-shadow: 0 0 20px rgba(23, 134, 255, 0.5), 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.15), inset 0 -3px 6px rgba(0, 0, 0, 0.2); background: rgba(23, 134, 255, 0.2); }

/* Match Overlay */
.match-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: linear-gradient(180deg, #1fa855 0%, #147a3c 40%, #0a3d1e 65%, #111 80%, #111 100%);
  display: flex; flex-direction: column; align-items: center;
  overflow: hidden;
}
.match-close { position: absolute; top: 20px; left: 20px; width: 36px; height: 36px; color: #fff; font-size: 24px; font-weight: 300; z-index: 100; background: none; border: none; }

/* Sparkle decoration */
.match-sparkle { position: absolute; top: 28%; right: 15%; color: #fff; font-size: 20px; opacity: 0.8; z-index: 5; }

/* Heart background layers */
.match-heart-bg { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); width: 100%; height: 60%; z-index: 1; display: flex; align-items: center; justify-content: center; }
.mh-layer { position: absolute; left: 50%; transform: translateX(-50%); fill: rgba(255, 255, 255, 0.15); filter: blur(1px); }
.mh-1 { width: 420px; opacity: 0.2; top: 0; }
.mh-2 { width: 320px; opacity: 0.35; top: 50px; }
.mh-3 { width: 240px; opacity: 0.5; top: 90px; }

/* Avatars + Text group - centered vertically in top 65% */
.match-center { position: absolute; top: 30%; left: 50%; transform: translate(-50%, 0); display: flex; flex-direction: column; align-items: center; z-index: 10; }
.match-avatars { display: flex; margin-bottom: 8px; }
.match-av { width: 130px; height: 130px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.8); object-fit: cover; box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
.match-av-l { margin-right: -16px; z-index: 2; }
.match-av-r { z-index: 1; }

/* Text */
.match-text-group { text-align: center; color: #fff; }
.match-its { font-family: 'Georgia', serif; font-weight: 900; font-style: italic; font-size: 22px; display: block; margin-bottom: -10px; letter-spacing: 1px; }
.match-word { font-family: 'Georgia', serif; font-weight: 900; font-style: italic; font-size: 72px; margin: 0; text-shadow: 1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 #000, 4px 4px 0 #000, 5px 5px 0 #000; color: #fff; }
.match-sub { font-size: 16px; margin-top: 6px; letter-spacing: 1px; opacity: 0.9; font-weight: 500; color: #fff; }

/* Bottom section - input + emojis below match text */
.match-bottom { display: flex; flex-direction: column; align-items: center; gap: 20px; z-index: 20; padding: 0 24px; position: absolute; bottom: 20%; left: 0; right: 0; }
.match-input-row { display: flex; width: 100%; max-width: 360px; background: #fff; border-radius: 9999px; overflow: hidden; }
.match-input { flex: 1; border: 0; padding: 14px 18px; font-size: 15px; color: #111; background: transparent; outline: none; }
.match-input::placeholder { color: #999; }
.match-send-btn { padding: 14px 18px; font-size: 15px; font-weight: 600; color: #333; background: transparent; border: none; }

/* Emojis */
.match-emojis { display: flex; gap: 12px; }
.emoji-btn { width: 72px; height: 44px; border-radius: 9999px; background: #222; border: 1.5px solid #444; font-size: 20px; display: flex; align-items: center; justify-content: center; }

.match-fade-enter-active, .match-fade-leave-active { transition: opacity 0.3s; }
.match-fade-enter-from, .match-fade-leave-to { opacity: 0; }

/* Astro Sheet */
.sheet-mask { position: fixed; inset: 0; z-index: 90; background: rgba(0,0,0,0.6); display: flex; align-items: flex-end; justify-content: center; }
.sheet {
  width: 100%; max-width: 480px; background: #fff; border-radius: 24px 24px 0 0;
  padding: 0 0 32px; position: relative; text-align: center;
  animation: sheetUp 0.3s ease;
}
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.sheet-handle { width: 36px; height: 4px; border-radius: 2px; background: #ccc; margin: 10px auto 0; }
.sheet-close { position: absolute; top: 20px; left: 20px; width: 28px; height: 28px; font-size: 16px; color: #fff; z-index: 5; }
.astro-illustration {
  width: 100%; height: 220px; margin-bottom: 24px;
  background: linear-gradient(135deg, #2d1b69 0%, #5a2d9e 30%, #3a1580 60%, #1a0a3e 100%);
  border-radius: 24px 24px 0 0;
  display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
}
.astro-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 60%, rgba(180,120,255,0.2), transparent 70%),
              radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.05), transparent 50%);
}
.astro-icons { display: flex; align-items: center; gap: 24px; font-size: 48px; position: relative; z-index: 1; }
.astro-cloud { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }
.astro-sun { filter: drop-shadow(0 0 12px rgba(255,180,0,0.5)); }
.astro-moon { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }
.astro-stars { position: absolute; top: 15px; right: 25px; color: #fff; font-size: 16px; letter-spacing: 12px; opacity: 0.9; }
.sheet-title { font-size: 24px; font-weight: 700; color: #111; margin: 0 0 10px; padding: 0 24px; }
.sheet-desc { font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 28px; padding: 0 32px; }
.sheet-btn-primary {
  width: calc(100% - 48px); height: 52px; border-radius: 9999px;
  background: #fff; border: 1.5px solid #111; font-size: 16px; font-weight: 600; color: #111;
  margin: 0 24px 14px;
}
.sheet-btn-text { font-size: 15px; font-weight: 600; color: #666; padding: 8px; }
.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.2s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }

/* Compat Sheet */
.compat-sheet {
  width: 100%; max-width: 480px; max-height: 90vh;
  background: #f8f8f8; border-radius: 24px 24px 0 0;
  display: flex; flex-direction: column; overflow: hidden;
  animation: sheetUp 0.3s ease;
}
.compat-header { position: relative; }
.compat-header-bg {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, #2a1060 0%, #3a1a7a 60%, #5a2d9e 100%);
  border-radius: 24px 24px 0 0;
}
.cst { position: absolute; color: #fff; opacity: 0.7; }
.cst1 { top: 15%; left: 20%; font-size: 14px; }
.cst2 { top: 10%; right: 25%; font-size: 18px; }
.cst3 { top: 30%; right: 15%; font-size: 10px; }
.compat-header-content { position: relative; z-index: 5; padding: 8px 20px 20px; }
.compat-top-row { display: flex; justify-content: space-between; margin: 8px 0 10px; }
.compat-close { width: 28px; height: 28px; color: #fff; font-size: 16px; }
.compat-info { width: 28px; height: 28px; color: #fff; font-size: 14px; border: 1px solid rgba(255,255,255,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.compat-brand { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
.compat-sheet-title { font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 14px; }
.compat-compare-card { background: rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; backdrop-filter: blur(4px); }

.compat-body { flex: 1; overflow-y: auto; padding: 20px; }
.cb-title { font-size: 16px; font-weight: 700; color: #111; margin: 0 0 12px; }
.spark-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
.spark-col {}
.spark-name { font-size: 12px; color: #666; margin-bottom: 5px; }
.spark-bar { height: 7px; background: #eee; border-radius: 4px; overflow: hidden; display: flex; align-items: center; position: relative; }
.sb-fill { height: 100%; background: #f2385a; border-radius: 4px; }
.sb-gray { height: 100%; width: 100%; background: #e0e0e0; border-radius: 4px; }
.spark-bar-locked { font-size: 9px; justify-content: flex-end; padding-right: 4px; }

.elem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
.elem-item { display: flex; align-items: center; gap: 8px; }
.elem-icon { font-size: 28px; }
.elem-name { font-size: 13px; font-weight: 600; color: #111; }
.elem-desc { font-size: 11px; color: #888; }
.elem-pct { margin-left: auto; font-size: 13px; font-weight: 700; }

.explain-box { background: #fff; border-radius: 12px; padding: 14px; text-align: center; margin-bottom: 20px; border: 1px solid #eee; }
.explain-box strong { font-size: 14px; color: #111; display: block; margin-bottom: 4px; }
.explain-box p { font-size: 13px; color: #666; margin: 0; line-height: 1.5; }

.detail-btn { width: 100%; height: 52px; border-radius: 9999px; background: #fff; border: 1.5px solid #111; font-size: 16px; font-weight: 600; color: #111; }

/* Group Date (抱团约会) */
.group-card {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  will-change: transform; cursor: grab; touch-action: none;
}
.group-card:active { cursor: grabbing; }
.group-photos {
  flex: 1; display: flex; gap: 2px; overflow: hidden;
}
.group-photo-half {
  flex: 1; overflow: hidden; border-radius: 4px;
}
.group-photo-half img {
  width: 100%; height: 100%; object-fit: cover;
}
.group-info {
  padding: 12px 16px 4px;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 100%);
  margin-top: -60px; position: relative; z-index: 5;
}
.group-names {
  display: flex; align-items: baseline; gap: 4px; flex-wrap: wrap;
}
.group-tip {
  display: flex; align-items: center; gap: 10px;
  background: #fff; border-radius: 12px; margin: 8px 12px 12px; padding: 12px 14px;
}
.group-tip-icon { font-size: 20px; }
.group-tip-text { flex: 1; }

/* Group Date Overlay */
.group-date-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: linear-gradient(180deg, #FD297B 0%, #FF5864 25%, #FF655B 45%, #111 70%, #111 100%);
  display: flex; flex-direction: column; align-items: center;
  padding: 24px; overflow: hidden;
}
.gd-close { position: absolute; top: 20px; left: 20px; width: 36px; height: 36px; color: #fff; font-size: 22px; font-weight: 300; z-index: 5; }

.gd-carousel { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; }
.gd-slide { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; }

.gd-illustration {
  width: 280px; height: 280px; margin-bottom: 32px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;
}

/* 圆角矩形框 */
.gd-frame {
  width: 220px; height: 200px; border: 2px solid rgba(255,255,255,0.3); border-radius: 20px;
  position: relative; display: flex; align-items: center; justify-content: center;
}
.gd-frame-chat {
  display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px; padding: 16px;
}

/* Slide 1 & 3: 照片布局 */
.gd-frame-left { position: absolute; left: -30px; top: 10px; display: flex; flex-direction: column; gap: 6px; }
.gd-frame-right { position: absolute; right: -30px; top: 10px; display: flex; flex-direction: column; gap: 6px; }
.gd-frame-center { display: flex; align-items: center; justify-content: center; }
.gd-frame-photo { width: 70px; height: 88px; border-radius: 10px; object-fit: cover; border: 2px solid rgba(255,255,255,0.4); }
.gd-fp-1 { transform: rotate(-8deg); }
.gd-fp-2 { transform: rotate(-4deg); }
.gd-fp-3 { transform: rotate(4deg); }
.gd-fp-4 { transform: rotate(8deg); }

/* 虚线卡片 */
.gd-dashed-card {
  width: 72px; height: 96px; border-radius: 12px;
  border: 2.5px dashed rgba(255,255,255,0.6); background: rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
}
.gd-dashed-icon { font-size: 32px; opacity: 0.5; }

/* X 和心形按钮 */
.gd-action-icons { display: flex; gap: 16px; margin-top: -10px; position: relative; z-index: 2; }
.gd-icon-circle { width: 48px; height: 48px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.gd-icon-nope { color: #f2385a; font-weight: 700; font-size: 22px; }
.gd-icon-like { font-size: 22px; }

/* Slide 2: 聊天群布局 */
.gd-chat-person { display: flex; align-items: center; justify-content: center; position: relative; }
.gd-chat-img { width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; }
.gd-bubble { position: absolute; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 700; white-space: nowrap; }
.gd-bubble-dark { top: -6px; left: -6px; background: #333; color: #fff; }
.gd-bubble-wave { top: -6px; right: -6px; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
.gd-bubble-blue { bottom: -6px; left: -6px; background: #42a5f5; color: #fff; }
.gd-chat-placeholder { width: 68px; height: 68px; border-radius: 50%; border: 2.5px dashed rgba(255,255,255,0.5); background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; position: relative; }
.gd-chat-placeholder-icon { font-size: 24px; opacity: 0.5; }
.gd-chat-plus { position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; border-radius: 50%; background: #f2385a; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.gd-cp-tl { grid-area: 1 / 1; }
.gd-cp-tr { grid-area: 1 / 2; }
.gd-cp-bl { grid-area: 2 / 1; }
.gd-cp-br { grid-area: 2 / 2; }

.gd-title { font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 12px; line-height: 1.4; max-width: 300px; }
.gd-desc { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0; max-width: 280px; }

.gd-dots { display: flex; gap: 8px; margin: 24px 0; }
.gd-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); cursor: pointer; transition: background 0.2s; }
.gd-dot.active { background: #fff; }

.gd-actions { width: 100%; max-width: 340px; display: flex; flex-direction: column; align-items: center; gap: 12px; padding-bottom: 24px; }
.gd-btn-invite {
  width: 100%; height: 52px; border-radius: 9999px;
  background: #fff; color: #111; font-size: 16px; font-weight: 600;
}
.gd-btn-later { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.8); padding: 8px; }

/* 分享面板 */
.share-mask { position: fixed; inset: 0; z-index: 110; background: rgba(0,0,0,0.4); display: flex; align-items: flex-end; justify-content: center; }
.share-sheet { width: 100%; max-width: 480px; background: #f5f5f5; border-radius: 16px 16px 0 0; padding: 20px 16px 32px; animation: sheetUp 0.3s ease; }
.share-title { font-size: 18px; font-weight: 600; color: #111; text-align: center; margin: 0 0 20px; }
.share-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 8px; margin-bottom: 20px; }
.share-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.share-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.share-icon-wechat { background: #07c160; }
.share-icon-favorites { background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb); }
.share-icon-qq-fav { background: #1296db; }
.share-icon-qq-pc { background: #1296db; }
.share-icon-qq { background: #fff; border: 1px solid #eee; }
.share-icon-xianyu { background: #ffe100; }
.share-icon-map { background: linear-gradient(135deg, #a8e6cf, #88d8f7); }
.share-icon-youdao { background: #d0021b; color: #fff; }
.share-label { font-size: 11px; color: #666; text-align: center; line-height: 1.3; max-width: 72px; }
.share-cancel { width: 100%; height: 48px; border-radius: 12px; background: #fff; color: #111; font-size: 16px; font-weight: 500; border: none; }

/* Boost Page */
.boost-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.boost-page-super { background: linear-gradient(180deg, #7b2ff7 0%, #9b4dff 40%, #b366ff 70%, #d4a0ff 100%); }
.bp-header { padding: 16px 20px; }
.bp-close { width: 32px; height: 32px; font-size: 20px; color: #111; background: none; border: none; }
.boost-page-super .bp-close { color: #fff; }
.bp-body { flex: 1; overflow-y: auto; padding: 0 20px 24px; }
.bp-title { font-size: 28px; font-weight: 300; color: #111; margin: 0 0 16px; }
.boost-page-super .bp-title { color: #fff; }

/* Tabs */
.bp-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
.bp-tab { padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 600; color: #666; background: none; border: 1.5px solid #ddd; cursor: pointer; }
.bp-tab-active { background: #111; color: #fff; border-color: #111; }
.boost-page-super .bp-tab { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.7); }
.boost-page-super .bp-tab-active { background: #fff; color: #111; border-color: #fff; }

/* Description card */
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

/* Plans */
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

/* Or divider */
.bp-or { text-align: center; padding: 16px 0; position: relative; }
.bp-or::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee; }
.bp-or span { position: relative; background: #fff; padding: 0 12px; font-size: 14px; color: #999; }

/* Gold hint */
.bp-gold-hint { border: 1px solid #eee; border-radius: 12px; padding: 16px; }
.bp-gold-hint-title { font-size: 13px; font-weight: 600; color: #111; text-align: center; margin: 0 0 12px; }
.bp-gold-row { display: flex; align-items: center; justify-content: space-between; }
.bp-gold-row span { font-size: 15px; font-weight: 500; color: #111; }
.bp-gold-btn { padding: 8px 16px; border-radius: 9999px; border: 1.5px solid #ddd; font-size: 13px; font-weight: 600; color: #111; background: #fff; }

/* Footer */
.bp-footer { padding: 16px 20px 32px; }
.bp-footer-sub { text-align: center; font-size: 14px; color: #666; margin: 0 0 12px; }
.bp-buy-btn { width: 100%; height: 52px; border-radius: 9999px; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }
.bp-buy-purple { background: linear-gradient(135deg, #7b2ff7, #b366ff); color: #fff; }
.bp-buy-super { background: #111; color: #fff; }
.boost-page-super .bp-plan { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); }
.boost-page-super .bp-plan-active { border-color: #fff; background: rgba(255,255,255,0.15); }
.boost-page-super .bp-plan-count { color: #fff; }
.boost-page-super .bp-plan-price { color: rgba(255,255,255,0.9); }
.boost-page-super .bp-plan-best { color: #fff; }
.boost-page-super .bp-plan-hot { color: #fff; }
.boost-page-super .bp-plan-save { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); }
.boost-page-super .bp-plan-top { color: #fff; }
.boost-page-super .bp-footer-sub { color: rgba(255,255,255,0.7); }

/* Match Suggestion Popup */
.ms-overlay { position: fixed; inset: 0; z-index: 95; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; padding: 24px; }
.ms-card { width: 100%; max-width: 350px; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
.ms-header { background: linear-gradient(180deg, #d8eeff 0%, #ffffff 100%); padding: 40px 20px 20px; position: relative; display: flex; justify-content: center; }
.ms-heart { position: absolute; color: #fff; opacity: 0.8; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05)); }
.ms-h1 { top: 20px; left: 40px; font-size: 15px; }
.ms-h2 { top: 30px; right: 50px; font-size: 18px; }
.ms-h3 { bottom: 40px; right: 30px; font-size: 14px; }
.ms-avatars { display: flex; align-items: center; }
.ms-avatar { width: 90px; height: 90px; border-radius: 50%; border: 3px solid #fff; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.ms-avatar-left { margin-right: -10px; z-index: 2; }
.ms-avatar-right { z-index: 1; }
.ms-content { padding: 0 30px 30px; text-align: center; }
.ms-title { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 15px; }
.ms-desc { font-size: 14px; color: #777; line-height: 1.6; margin: 0 0 30px; padding: 0 10px; }
.ms-btn { display: block; width: 100%; padding: 15px 0; border-radius: 30px; font-size: 18px; font-weight: 700; cursor: pointer; border: none; }
.ms-btn-super { background: linear-gradient(90deg, #4bd4ff 0%, #20baff 100%); color: #fff; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(59, 197, 248, 0.3); }
.ms-btn-cancel { background: #fff; color: #444; border: 2px solid #e0e0e0; }

/* Super Like Purchase Page */
.sl-purchase-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.slp-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
.slp-close { width: 32px; height: 32px; font-size: 18px; color: #111; background: none; border: none; }
.slp-title { font-size: 16px; font-weight: 600; color: #111; }
.slp-body { flex: 1; padding: 0 24px; overflow-y: auto; }
.slp-heading { font-size: 22px; font-weight: 700; color: #111; line-height: 1.4; margin: 0 0 20px; }
.slp-subtitle { font-size: 14px; color: #666; margin: 0 0 16px; }
.slp-plans { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.slp-plan { border: 1.5px solid #e8e8e8; border-radius: 12px; padding: 16px 18px; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.slp-plan-active { border-color: #42a5f5; border-width: 2px; }
.slp-hot { font-size: 11px; font-weight: 700; color: #42a5f5; }
.slp-count { font-size: 18px; font-weight: 700; color: #111; flex: 1; }
.slp-price { font-size: 14px; font-weight: 600; color: #111; }
.slp-save { font-size: 11px; color: #666; padding: 2px 8px; border-radius: 6px; background: #f5f5f5; width: 100%; }
.slp-or { text-align: center; padding: 16px 0; position: relative; }
.slp-or::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee; }
.slp-or span { position: relative; background: #fff; padding: 0 12px; font-size: 14px; color: #999; }
.slp-gold-hint { border: 1px solid #eee; border-radius: 12px; padding: 16px; }
.slp-gold-title { font-size: 13px; font-weight: 600; color: #111; text-align: center; margin: 0 0 12px; }
.slp-gold-row { display: flex; align-items: center; justify-content: space-between; }
.slp-gold-row span { font-size: 15px; font-weight: 500; color: #111; }
.slp-gold-btn { padding: 8px 16px; border-radius: 9999px; border: 1.5px solid #ddd; font-size: 13px; font-weight: 600; color: #111; background: #fff; }
.slp-footer { padding: 16px 24px 32px; }
.slp-buy { width: 100%; height: 52px; border-radius: 9999px; background: linear-gradient(90deg, #4bd4ff, #20baff); color: #fff; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }

/* Gold Upgrade Overlay */
.gold-overlay { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.gold-header { display: flex; align-items: center; justify-content: center; padding: 16px 20px; position: relative; }
.gold-close { position: absolute; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; background: none; border: none; }
.gold-brand { font-size: 18px; }
.gold-brand-text { font-weight: 700; font-style: italic; color: #111; }
.gold-badge { background: linear-gradient(135deg, #d4a017, #f5c518); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; font-style: normal; margin-left: 4px; }
.gold-body { flex: 1; padding: 0 24px 24px; overflow-y: auto; }
.gold-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.4; }
.gold-subtitle { font-size: 14px; color: #666; margin: 0 0 16px; }
.gold-plans { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.gold-plan { padding: 18px; border-radius: 12px; border: 1.5px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; position: relative; cursor: pointer; }
.gold-plan-active { border-color: #d4a017; }
.gp-hot { font-size: 11px; color: #d4a017; font-weight: 600; }
.gp-best { font-size: 11px; color: #d4a017; font-weight: 600; }
.gp-period { font-size: 24px; font-weight: 800; color: #111; }
.gp-price { font-size: 13px; color: #666; }
.gp-save { display: inline-block; padding: 3px 8px; border-radius: 6px; background: #f0f0f0; font-size: 11px; color: #333; font-weight: 600; margin-top: 4px; }
.gold-disclaimer { font-size: 11px; color: #999; line-height: 1.5; margin: 0; }
.gold-footer { padding: 12px 20px 32px; }
.gold-buy-full { width: 100%; height: 52px; border-radius: 9999px; background: linear-gradient(135deg, #d4a017, #f5c518); color: #111; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }

/* Astro Modal */
.astro-modal-overlay { position: fixed; inset: 0; z-index: 95; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; }

/* Friends Page (老友记) */
.fp-page { position: fixed; inset: 0; z-index: 100; background: #f3f4f8; display: flex; flex-direction: column; }
.fp-nav { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f3f4f8; }
.fp-back { color: #1a1a1a; background: none; border: none; }
.fp-title { font-size: 19px; font-weight: 600; color: #1a1a1a; letter-spacing: 0.5px; }
.fp-settings { color: #4f565e; background: none; border: none; }
.fp-body { flex: 1; padding: 0 20px; overflow-y: auto; }
.fp-section-header { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 12px; }
.fp-section-header h3 { font-size: 15px; font-weight: 600; color: #444; margin: 0; }
.fp-count { color: #999; font-size: 15px; font-weight: 500; }
.fp-invite-box { background: #fff; border-radius: 20px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 18px; }
.fp-user-placeholder { display: flex; align-items: center; }
.fp-avatar-dashed { width: 48px; height: 48px; border-radius: 50%; background: #f0f2f5; border: 1.5px dashed #ccc; display: flex; align-items: center; justify-content: center; margin-right: 14px; }
.fp-avatar-dashed svg { width: 24px; height: 24px; }
.fp-invite-text { font-size: 16px; font-weight: 600; color: #1a1a1a; }
.fp-plus { font-size: 24px; color: #b0b0b0; font-weight: 300; }
.fp-info { font-size: 14px; color: #555; line-height: 1.5; margin-bottom: 25px; }
.fp-link { color: #3261d4; font-weight: 600; text-decoration: none; border-bottom: 1px solid #3261d4; margin-left: 4px; }
.fp-bold-title { display: block; font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
.fp-sub-info { font-size: 13px; color: #777; margin-bottom: 20px; }
.fp-match-preview { width: 170px; height: 230px; background: #fff; border-radius: 16px; overflow: hidden; position: relative; display: flex; box-shadow: 0 8px 20px rgba(0,0,0,0.06); }
.fp-share-tag { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; background: rgba(0,0,0,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 5; cursor: pointer; }
.fp-half { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.fp-half-left { border-right: 1px solid rgba(255,255,255,0.2); }
.fp-half-right { }
.fp-half-img { width: 100%; height: 100%; object-fit: cover; }
.fp-preview-avatar { width: 35px; height: 35px; }
.fp-bottom-grad { position: absolute; bottom: 0; width: 100%; height: 40%; background: linear-gradient(transparent, rgba(0,0,0,0.5)); }
.fp-name-label { position: absolute; bottom: 12px; left: 10px; color: #fff; font-size: 13px; font-weight: 600; z-index: 5; text-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.fp-footer { position: sticky; bottom: 0; padding: 20px; background: #f3f4f8; }
.fp-btn { width: 100%; background: #000; color: #fff; border: none; padding: 16px; border-radius: 50px; font-size: 17px; font-weight: 600; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
.astro-modal { width: 100%; max-width: 480px; background: #fff; border-radius: 32px 32px 0 0; overflow: hidden; box-shadow: 0 -10px 40px rgba(0,0,0,0.15); animation: sheetUp 0.3s ease; }
.astro-modal-header { background: linear-gradient(135deg, #512da8 0%, #311b92 100%); height: 240px; position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.astro-modal-header::before { content: ''; position: absolute; width: 150%; height: 150%; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%); top: -25%; left: -25%; }
.astro-modal-controls { position: absolute; top: 20px; width: 100%; padding: 0 20px; display: flex; justify-content: space-between; box-sizing: border-box; z-index: 10; }
.astro-modal-close { color: rgba(255,255,255,0.7); font-size: 24px; background: none; border: none; }
.astro-modal-stars { color: rgba(255,255,255,0.9); letter-spacing: 5px; font-size: 14px; }
.astro-modal-icons { display: flex; align-items: center; gap: 25px; z-index: 5; }
.ami { filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3)); animation: amiFloat 3s ease-in-out infinite; }
.ami-cloud { font-size: 45px; animation-delay: 0.5s; opacity: 0.9; }
.ami-sun { font-size: 55px; animation-delay: 0s; }
.ami-moon { font-size: 45px; animation-delay: 1s; }
@keyframes amiFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
.astro-modal-body { padding: 40px 30px; text-align: center; }
.astro-modal-title { margin: 0 0 15px; font-size: 24px; color: #2d3436; font-weight: 700; letter-spacing: 1px; }
.astro-modal-desc { margin: 0 0 40px; font-size: 15px; line-height: 1.6; color: #636e72; }
.astro-modal-btn-primary { display: block; width: 100%; padding: 16px; background: linear-gradient(90deg, #8e24aa 0%, #512da8 100%); color: #fff; border: none; border-radius: 50px; font-size: 18px; font-weight: 600; cursor: pointer; box-shadow: 0 10px 20px rgba(81, 45, 168, 0.3); margin-bottom: 20px; }
.astro-modal-btn-secondary { background: transparent; border: none; color: #95a5a6; font-size: 16px; cursor: pointer; }

/* Music Illustration */
.music-illustration {
  width: 100%; height: 220px; margin-bottom: 24px;
  background: linear-gradient(135deg, #1a3a8a 0%, #4a6fd8 30%, #6b8de8 60%, #3a5fc0 100%);
  border-radius: 24px 24px 0 0;
  display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
}
.music-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 60%, rgba(120,160,255,0.3), transparent 70%),
              radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.08), transparent 50%);
}
.music-icons { display: flex; align-items: center; gap: 12px; font-size: 48px; position: relative; z-index: 1; }
.music-note-l { font-size: 32px; color: #fff; opacity: 0.8; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
.music-note-r { font-size: 32px; color: #fff; opacity: 0.8; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
.music-earphone { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }
.music-cd { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }
.music-notes-float { position: absolute; top: 15px; right: 25px; color: #fff; font-size: 16px; letter-spacing: 12px; opacity: 0.7; }

/* Music hint on card */
.music-hint { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
.music-hint-icon { font-size: 14px; color: #fff; }
.music-hint-text { font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 500; }

/* Music player bar */
.music-player-bar {
  display: flex; align-items: center; gap: 10px; margin-top: 10px;
  padding: 8px 10px; border-radius: 10px;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(8px);
  cursor: pointer; pointer-events: auto;
}
.mpb-cover { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; }
.mpb-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.mpb-name { font-size: 13px; font-weight: 600; color: #fff; }
.mpb-artist { font-size: 11px; color: rgba(255,255,255,0.7); }
.mpb-spotify { font-size: 10px; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 3px; }
.mpb-spotify-dot { color: #1DB954; font-size: 8px; }
.mpb-play { width: 36px; height: 36px; font-size: 18px; color: #fff; display: flex; align-items: center; justify-content: center; }

/* Music Playlist Sheet */
.music-playlist-sheet {
  width: 100%; max-width: 480px; max-height: 85vh;
  background: #fff; border-radius: 24px 24px 0 0;
  display: flex; flex-direction: column; overflow: hidden;
  animation: sheetUp 0.3s ease;
}
.mpl-header { position: relative; }
.mpl-header-bg {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, #1a3a8a 0%, #4a6fd8 60%, #6b8de8 100%);
  border-radius: 24px 24px 0 0;
}
.mpl-note { position: absolute; color: #fff; opacity: 0.6; }
.mpl-n1 { top: 20%; left: 15%; font-size: 18px; }
.mpl-n2 { top: 15%; right: 20%; font-size: 22px; }
.mpl-n3 { top: 40%; right: 35%; font-size: 14px; }
.mpl-header-content { position: relative; z-index: 5; padding: 8px 20px 24px; }
.mpl-close { width: 28px; height: 28px; color: #fff; font-size: 16px; margin: 12px 0 16px; }
.mpl-title { font-size: 22px; font-weight: 700; color: #fff; margin: 0; }

.mpl-body { flex: 1; overflow-y: auto; padding: 16px 20px 32px; }
.mpl-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 0; border-bottom: 1px solid #f0f0f0;
}
.mpl-item:last-child { border-bottom: none; }
.mpl-item-cover { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; }
.mpl-item-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.mpl-item-name { font-size: 15px; font-weight: 600; color: #111; }
.mpl-item-artist { font-size: 13px; color: #666; }
.mpl-item-spotify { font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px; }
.mpl-spotify-dot { color: #1DB954; font-size: 8px; }
.mpl-item-play { width: 36px; height: 36px; font-size: 18px; color: #111; display: flex; align-items: center; justify-content: center; }
.mpl-empty { text-align: center; padding: 40px 0; color: #999; font-size: 14px; }

/* Rewind Upgrade Overlay */
.rewind-overlay {
  position: fixed; inset: 0; z-index: 100; background: #fff;
  display: flex; flex-direction: column; padding: 20px 24px;
  overflow-y: auto;
}
.rewind-close { position: absolute; top: 20px; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; }
.rewind-brand { display: flex; align-items: center; gap: 4px; justify-content: center; margin: 16px 0 20px; }
.rewind-brand-text { font-size: 18px; font-weight: 700; font-style: italic; color: #111; }
.rewind-plus { color: #FD297B; }
.rewind-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.3; text-align: left; }
.rewind-subtitle { font-size: 14px; color: #666; margin: 0 0 16px; }
.rewind-plans { display: flex; gap: 12px; margin-bottom: 16px; }
.rewind-plan {
  flex: 1; padding: 16px; border-radius: 12px; border: 1.5px solid #e8e8e8;
  display: flex; flex-direction: column; gap: 4px; position: relative;
}
.rewind-plan-active { border-color: #FD297B; }
.plan-hot { font-size: 11px; color: #FD297B; font-weight: 600; }
.plan-period { font-size: 22px; font-weight: 800; color: #111; }
.plan-price { font-size: 13px; color: #666; }
.plan-check { position: absolute; top: 12px; right: 12px; color: #FD297B; font-size: 16px; }
.rewind-dots { display: flex; gap: 8px; justify-content: center; margin: 12px 0 20px; }
.rd { width: 8px; height: 8px; border-radius: 50%; background: #ddd; }
.rd.active { background: #111; }
.rewind-features { border: 1px solid #eee; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.rewind-features-title { font-size: 13px; color: #666; text-align: center; margin-bottom: 14px; border: 1px solid #eee; border-radius: 8px; padding: 6px 12px; display: inline-block; }
.rf-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
.rf-check { color: #111; font-size: 14px; margin-top: 2px; }
.rf-text { font-size: 14px; color: #111; line-height: 1.4; }
.rf-text strong { font-weight: 700; }
.rf-sub { font-size: 12px; color: #888; font-weight: 400; }
.rf-sub a { color: #42a5f5; text-decoration: underline; }
.rewind-disclaimer { font-size: 11px; color: #999; line-height: 1.5; margin: 0 0 16px; }
.rewind-disclaimer a { color: #42a5f5; text-decoration: underline; }
.rewind-buy-btn {
  width: 100%; height: 52px; border-radius: 9999px;
  background: linear-gradient(135deg, #FD297B, #FF655B); color: #fff;
  font-size: 15px; font-weight: 600;
}

/* Send Message Overlay */
.send-overlay {
  position: fixed; inset: 0; z-index: 100; background: #111;
  display: flex; flex-direction: column;
}
.send-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px;
}
.send-close { width: 32px; height: 32px; font-size: 18px; color: #fff; }
.send-count { width: 32px; height: 32px; border-radius: 50%; background: #333; color: #fff; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; }
.send-body { flex: 1; padding: 0 20px; overflow-y: auto; }
.send-tip { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.send-tip-icon { color: #42a5f5; font-size: 16px; }
.send-tip-text { font-size: 14px; color: #42a5f5; font-weight: 600; }
.send-desc { font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0 0 20px; }
.send-card-preview { position: relative; width: 260px; border-radius: 12px; overflow: hidden; border: 3px solid #42a5f5; }
.send-card-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
.send-card-count { position: absolute; top: 10px; right: 10px; padding: 3px 8px; border-radius: 6px; background: rgba(0,0,0,0.5); color: #fff; font-size: 11px; font-weight: 600; }
.send-input-row {
  display: flex; align-items: center; gap: 0;
  margin: 16px 20px; background: #fff; border-radius: 9999px; overflow: hidden;
}
.send-input { flex: 1; border: 0; padding: 14px 18px; font-size: 14px; color: #111; background: transparent; outline: none; }
.send-input::placeholder { color: #999; }
.send-submit { padding: 14px 18px; font-size: 14px; font-weight: 600; color: #42a5f5; background: transparent; }

/* 用户详情页 */
.ud-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.ud-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
.ud-name-row { display: flex; align-items: center; gap: 8px; }
.ud-name { font-size: 22px; font-weight: 800; color: #111; }
.ud-verified { width: 20px; height: 20px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }
.ud-down { width: 36px; height: 36px; border-radius: 50%; background: #111; color: #fff; font-size: 14px; display: flex; align-items: center; justify-content: center; }

.ud-body { flex: 1; overflow-y: auto; }
.ud-photo-area { position: relative; width: 100%; aspect-ratio: 3/4; }
.ud-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.ud-indicators { position: absolute; top: 8px; left: 12px; right: 12px; display: flex; gap: 3px; z-index: 5; }
.ud-ind { flex: 1; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.4); }
.ud-ind.active { background: #fff; }
.ud-tap-left { position: absolute; top: 0; left: 0; width: 35%; height: 100%; z-index: 4; }
.ud-tap-right { position: absolute; top: 0; right: 0; width: 65%; height: 100%; z-index: 4; }

.ud-section { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.ud-section-header { font-size: 13px; color: #888; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.ud-purpose { font-size: 15px; color: #111; padding: 10px 14px; background: #f8f8f8; border-radius: 10px; }
.ud-bio { font-size: 14px; color: #333; line-height: 1.6; margin: 0; white-space: pre-line; }
.ud-info-item { font-size: 14px; color: #333; margin-bottom: 6px; }
.ud-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.ud-tag { padding: 6px 14px; border-radius: 9999px; border: 1px solid #ddd; font-size: 13px; color: #333; }
.ud-block { text-align: center; padding: 16px 20px; font-size: 15px; font-weight: 600; color: #111; cursor: pointer; }
.ud-report { text-align: center; padding: 0 20px 20px; font-size: 15px; font-weight: 600; color: #f2385a; cursor: pointer; }

.ud-actions { display: flex; align-items: center; justify-content: center; gap: 15px; padding: 14px 0; border-top: 1px solid #f0f0f0; background: #fff; }
.ud-btn-white { background-color: #ffffff; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; border: 1px solid rgba(0, 0, 0, 0.05); padding: 0; outline: none; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); transition: all 0.2s ease; }
.ud-btn-wlg { width: 70px; height: 70px; }
.ud-btn-wsm { width: 56px; height: 56px; }
.ud-btn-white svg { width: 55%; height: 55%; filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1)); }
.ud-btn-white:active { transform: scale(0.92); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
.ud-fill-nope { fill: url(#ud-grad-nope); }
.ud-fill-star { fill: url(#ud-grad-star); }
.ud-fill-like { fill: url(#ud-grad-like); }

/* Group Info Bottom Sheet */
.gi-mask { position: fixed; inset: 0; z-index: 110; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; }
.gi-sheet { background: #fff; border-radius: 16px 16px 0 0; width: 100%; max-height: 85vh; overflow-y: auto; padding: 12px 24px 32px; position: relative; }
.gi-handle { width: 36px; height: 4px; border-radius: 2px; background: #ddd; margin: 0 auto 16px; }
.gi-close { position: absolute; top: 16px; left: 16px; width: 28px; height: 28px; font-size: 16px; color: #111; background: none; border: none; }
.gi-illustration { display: flex; justify-content: center; margin-bottom: 20px; }
.gi-img { width: 200px; height: 140px; object-fit: cover; border-radius: 12px; }
.gi-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; }
.gi-features { display: flex; flex-direction: column; gap: 20px; }
.gi-feat { display: flex; gap: 14px; align-items: flex-start; }
.gi-feat-icon { font-size: 20px; margin-top: 2px; }
.gi-feat-text { flex: 1; }
.gi-feat-text strong { font-size: 15px; color: #111; display: block; margin-bottom: 4px; }
.gi-feat-text p { font-size: 13px; color: #666; margin: 0; line-height: 1.4; }
.gi-feat-badge { display: inline-block; background: #fe3c72; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-left: 6px; vertical-align: middle; }

/* Group Settings Page */
.gs-page { position: fixed; inset: 0; z-index: 110; background: #f8f8f8; display: flex; flex-direction: column; }
.gs-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: #fff; }
.gs-back { color: #111; background: none; border: none; }
.gs-title { font-size: 17px; font-weight: 700; color: #111; }
.gs-body { flex: 1; overflow-y: auto; padding: 24px 20px; }
.gs-card { background: #fff; border-radius: 12px; padding: 18px 16px; margin-bottom: 8px; }
.gs-card-row { display: flex; align-items: center; justify-content: space-between; }
.gs-card-label { font-size: 15px; color: #111; font-weight: 500; flex: 1; }
.gs-hint { font-size: 13px; color: #666; margin: 0 0 20px; padding: 0 4px; line-height: 1.5; }
.gs-toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
.gs-toggle input { opacity: 0; width: 0; height: 0; }
.gs-slider { position: absolute; inset: 0; background: #f0f0f0; border: 1.5px solid #d1d1d1; border-radius: 14px; transition: all 0.3s ease; cursor: pointer; }
.gs-slider::before { content: ''; position: absolute; width: 30px; height: 30px; border-radius: 50%; background: #b5b5b5; left: -4px; top: 50%; transform: translateY(-50%); transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
.gs-slider::after { content: ''; position: absolute; width: 10px; height: 6px; border-left: 2px solid white; border-bottom: 2px solid white; transform: rotate(-45deg) translate(1px, -1px); left: 4px; top: 7px; opacity: 0; transition: opacity 0.2s ease, left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.gs-toggle input:checked + .gs-slider { background: #fff0f3; border-color: #ff2d55; }
.gs-toggle input:checked + .gs-slider::before { left: calc(100% - 26px); background: #ff2d55; box-shadow: 0 2px 10px rgba(255,45,85,0.4); }
.gs-toggle input:checked + .gs-slider::after { opacity: 1; left: calc(100% - 16px); }
</style>
