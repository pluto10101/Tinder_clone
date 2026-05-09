<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import BottomNavigation from '@/components/layout/BottomNavigation.vue';

const router = useRouter();
const userStore = useUserStore();

interface ExploreCard {
  id: number;
  name: string;
  cover: string;
  color: string;
  users?: string;
  featured?: boolean;
  cta?: string;
  description?: string;
  requirements?: { label: string; check: () => boolean }[];
  swipeable?: boolean;
  category?: 'purpose' | 'lifestyle' | 'interest';
  interestTags?: string[];
}

interface ExploreSection {
  title: string;
  subtitle: string;
  cards: ExploreCard[];
}

function hasLongTermPurpose() {
  const purposes = userStore.profile?.dating_purpose || [];
  return purposes.includes('long_term');
}
function hasMinPhotos(n: number) {
  return (userStore.profile?.photos?.length || 0) >= n;
}
function hasBio() {
  return !!(userStore.profile?.bio && userStore.profile.bio.trim().length > 0);
}

const sections: ExploreSection[] = [
  {
    title: '目标明确的约会',
    subtitle: '寻找相似的交往目标',
    cards: [
      {
        id: 1, name: '严肃谈恋爱', cover: 'https://picsum.photos/seed/ex1/600/400', color: '#6b3a3a', users: '2K', featured: true,
        description: '交往对象真心想发展长期稳定关系。',
        requirements: [
          { label: '有建立长期关系的意愿', check: hasLongTermPurpose },
          { label: '有至少 4 张照片', check: () => hasMinPhotos(4) },
          { label: '有个人介绍', check: hasBio },
        ],
      },
      { id: 2, name: '寻找长期的伴侣', cover: 'https://picsum.photos/seed/ex2/400/500', color: '#8b3a3a', users: '3K', swipeable: true, category: 'purpose' },
      { id: 3, name: '今晚有空', cover: 'https://picsum.photos/seed/ex3/400/500', color: '#5a2d9e', users: '5K', swipeable: true, category: 'purpose' },
      { id: 4, name: '享受短期交往的乐趣', cover: 'https://picsum.photos/seed/ex4/400/500', color: '#8b3a3a', users: '2K', swipeable: true, category: 'purpose' },
      { id: 5, name: '结交新朋友', cover: 'https://picsum.photos/seed/ex5/400/500', color: '#b8860b', users: '1K', swipeable: true, category: 'purpose' },
      { id: 6, name: '照片已验证', cover: 'https://picsum.photos/seed/ex6/600/400', color: '#2e7d6e', users: '4K', featured: true, cta: '立即体验', swipeable: true, category: 'lifestyle' },
    ],
  },
  {
    title: '志同道合',
    subtitle: '寻找生活愿景相似的人',
    cards: [
      { id: 7, name: '不是丁克', cover: 'https://picsum.photos/seed/ex7/600/400', color: '#3a6b3a', users: '294', featured: true, cta: '立即体验', swipeable: true, category: 'lifestyle' },
    ],
  },
  {
    title: '共同兴趣或爱好',
    subtitle: '寻找兴趣相投的人',
    cards: [
      { id: 8, name: '旅行', cover: 'https://picsum.photos/seed/ex8/400/500', color: '#2e5e4e', users: '1K', swipeable: true, category: 'interest', interestTags: ['动漫', '拳击', '体育馆', '旅行', '自然', '夜生活', '酒吧', '酒吧串游', '吃货'] },
      { id: 9, name: '刷剧狂人', cover: 'https://picsum.photos/seed/ex9/400/500', color: '#5a4a2a', users: '1K', swipeable: true, category: 'interest', interestTags: ['电影', '追剧', '动漫', '纪录片', '综艺'] },
      { id: 10, name: '体育运动', cover: 'https://picsum.photos/seed/ex10/400/500', color: '#3a5a6a', swipeable: true, category: 'interest', interestTags: ['健身', '跑步', '篮球', '足球', '游泳', '瑜伽'] },
      { id: 11, name: '咖啡之约', cover: 'https://picsum.photos/seed/ex11/400/500', color: '#6a5a3a', swipeable: true, category: 'interest', interestTags: ['咖啡', '下午茶', '烘焙', '甜品'] },
      { id: 12, name: '夜晚约会', cover: 'https://picsum.photos/seed/ex12/400/500', color: '#5a2d6e', users: '995', swipeable: true, category: 'interest', interestTags: ['酒吧', '夜店', '音乐节', '派对'] },
      { id: 13, name: '刺激探险家', cover: 'https://picsum.photos/seed/ex13/400/500', color: '#8b7a00', users: '1K', swipeable: true, category: 'interest', interestTags: ['攀岩', '跳伞', '潜水', '冲浪', '滑雪'] },
      { id: 14, name: '创意', cover: 'https://picsum.photos/seed/ex14/400/500', color: '#2e6e6e', swipeable: true, category: 'interest', interestTags: ['摄影', '绘画', '设计', '写作', '手工'] },
      { id: 15, name: '美食吃货', cover: 'https://picsum.photos/seed/ex15/400/500', color: '#6e4e2e', swipeable: true, category: 'interest', interestTags: ['火锅', '烧烤', '日料', '甜品', '烹饪'] },
      { id: 16, name: '自然爱好者', cover: 'https://picsum.photos/seed/ex16/400/500', color: '#2e5e3e', users: '1K', swipeable: true, category: 'interest', interestTags: ['徒步', '露营', '钓鱼', '园艺', '观鸟'] },
      { id: 17, name: '音乐发烧友', cover: 'https://picsum.photos/seed/ex17/400/500', color: '#5a2d9e', users: '1K', swipeable: true, category: 'interest', interestTags: ['吉他', '钢琴', '说唱', '摇滚', '电子'] },
      { id: 18, name: '自我关怀', cover: 'https://picsum.photos/seed/ex18/400/500', color: '#3a5a3a', users: '2K', swipeable: true, category: 'interest', interestTags: ['冥想', '瑜伽', '阅读', '护肤', '心理学'] },
      { id: 19, name: '游戏玩家', cover: 'https://picsum.photos/seed/ex19/400/500', color: '#5a6a3a', users: '766', swipeable: true, category: 'interest', interestTags: ['王者荣耀', '原神', 'Steam', '主机', '桌游'] },
      { id: 20, name: '梦宠结缘', cover: 'https://picsum.photos/seed/ex20/600/400', color: '#8b3a3a', users: '191', featured: true, cta: '立即体验', swipeable: true, category: 'interest', interestTags: ['猫咪', '狗狗', '宠物', '动物'] },
    ],
  },
];

// 详情底部面板
const showDetailSheet = ref(false);
const selectedCard = ref<ExploreCard | null>(null);
const showFailDialog = ref(false);

// 编辑目的页面
const showPurposeEdit = ref(false);
const selectedPurpose = ref('');

const purposeOptions = [
  { id: 'long_term', label: '寻找长期的伴侣', emoji: '💕' },
  { id: 'long_but_short_ok', label: '长期交往，但不拒绝短期交往', emoji: '😍' },
  { id: 'short_but_long_ok', label: '短期交往，但不拒绝长期交往', emoji: '🥂' },
  { id: 'short_term', label: '享受短期交往的乐趣', emoji: '🎉' },
  { id: 'friends', label: '结交新朋友', emoji: '👋' },
  { id: 'thinking', label: '我还在思考', emoji: '🤔' },
];

// 滑动浏览
const showSwipeView = ref(false);
const swipeViewCard = ref<ExploreCard | null>(null);
const swipeViewIndex = ref(0);
const svPhotoIndex = ref(0);
const showSvRewind = ref(false);
const showSvSend = ref(false);
const showSvDetail = ref(false);
const showSvSettings = ref(false);
const svDistance = ref(80);
const showSvBoostPage = ref(false);
const svBoostTab = ref<'boost' | 'prime' | 'super'>('boost');
const svBoostPlanIndex = ref(1);
const showLeaveConfirm = ref(false);
const showRejoinSheet = ref(false);
const rejoinCardRef = ref<ExploreCard | null>(null);
const leftSpaces = ref<Set<number>>(new Set());

// 滑动手势
const svOffsetX = ref(0);
const svOffsetY = ref(0);
const svIsDragging = ref(false);
const svStartX = ref(0);
const svStartY = ref(0);
const svCardTransition = ref('');
const svAnimating = ref(false);

const SV_THRESHOLD_X = 0.4;
const SV_THRESHOLD_Y = 0.3;
const SV_MAX_ROTATION = 15;
const svRotation = computed(() => Math.max(-SV_MAX_ROTATION, Math.min(SV_MAX_ROTATION, svOffsetX.value * 0.1)));
const svStampType = computed<'nope'|'like'|'super'|''>(() => {
  const w = window.innerWidth; const h = window.innerHeight;
  if (svOffsetY.value < -(h * SV_THRESHOLD_Y) && Math.abs(svOffsetY.value) > Math.abs(svOffsetX.value)) return 'super';
  if (svOffsetX.value > w * SV_THRESHOLD_X * 0.5) return 'like';
  if (svOffsetX.value < -(w * SV_THRESHOLD_X * 0.5)) return 'nope';
  return '';
});
const svStampOpacity = computed(() => Math.min(Math.abs(svOffsetX.value) / (window.innerWidth * SV_THRESHOLD_X), 0.8));

// 拖动时按钮高亮
const svActiveBtn = computed<'rewind'|'nope'|'super'|'like'|'send'|''>(() => {
  if (!svIsDragging.value) return '';
  const w = window.innerWidth; const h = window.innerHeight;
  if (svOffsetY.value < -(h * 0.15) && Math.abs(svOffsetY.value) > Math.abs(svOffsetX.value)) return 'super';
  if (svOffsetX.value > w * SV_THRESHOLD_X * 0.3) return 'like';
  if (svOffsetX.value < -(w * SV_THRESHOLD_X * 0.3)) return 'nope';
  return '';
});
function svBtnScale(btn: string): number {
  if (svActiveBtn.value !== btn) return 1;
  const w = window.innerWidth; const h = window.innerHeight;
  let progress = 0;
  if (btn === 'super') progress = Math.min(Math.abs(svOffsetY.value) / (h * SV_THRESHOLD_Y), 1);
  else progress = Math.min(Math.abs(svOffsetX.value) / (w * SV_THRESHOLD_X), 1);
  return 1 + progress * 0.3;
}

function svPointerDown(e: PointerEvent) {
  if (svAnimating.value) return;
  svIsDragging.value = true; svStartX.value = e.clientX; svStartY.value = e.clientY;
  svOffsetX.value = 0; svOffsetY.value = 0; svCardTransition.value = '';
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
}
function svPointerMove(e: PointerEvent) {
  if (!svIsDragging.value) return;
  svOffsetX.value = e.clientX - svStartX.value;
  svOffsetY.value = e.clientY - svStartY.value;
}
function svPointerUp() {
  if (!svIsDragging.value) return;
  svIsDragging.value = false;
  const w = window.innerWidth; const h = window.innerHeight;
  if (svOffsetX.value > w * SV_THRESHOLD_X) svFlyOut('like');
  else if (svOffsetX.value < -(w * SV_THRESHOLD_X)) svFlyOut('nope');
  else if (svOffsetY.value < -(h * SV_THRESHOLD_Y) && Math.abs(svOffsetY.value) > Math.abs(svOffsetX.value)) svFlyOut('super');
  else svSpringBack();
}
function svSpringBack() {
  svCardTransition.value = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  svOffsetX.value = 0; svOffsetY.value = 0;
  setTimeout(() => { svCardTransition.value = ''; }, 500);
}
async function svFlyOut(action: string) {
  svAnimating.value = true;
  const dir = action === 'nope' ? -1 : action === 'like' ? 1 : 0;
  svCardTransition.value = 'transform 0.3s cubic-bezier(0.4, 0, 1, 1)';
  svOffsetX.value = dir * window.innerWidth * 1.5;
  svOffsetY.value = action === 'super' ? -window.innerHeight * 1.5 : svOffsetY.value;
  await new Promise(r => setTimeout(r, 300));
  svCardTransition.value = ''; svOffsetX.value = 0; svOffsetY.value = 0;
  svPhotoIndex.value = 0;
  if (swipeViewIndex.value < swipeViewUsers.value.length - 1) swipeViewIndex.value++;
  else closeSwipeView();
  svAnimating.value = false;
}
function svDoSwipe(action: string) { if (!svAnimating.value) svFlyOut(action); }

const swipeViewUsers = computed(() => [
  { name: 'Sam', age: 22, distance: 1, photos: ['https://picsum.photos/seed/sw1/400/700', 'https://picsum.photos/seed/sw1b/400/700', 'https://picsum.photos/seed/sw1c/400/700'], verified: true, interests: ['动漫', '拳击', '体育馆', '旅行', '自然', '夜生活', '酒吧', '酒吧串游', '吃货'] },
  { name: '鲨鱼辣椒', age: 25, distance: 1, photos: ['https://picsum.photos/seed/sw2/400/700', 'https://picsum.photos/seed/sw2b/400/700'], verified: true, interests: ['旅行', '摄影', '美食'] },
  { name: 'ciwownd', age: 21, distance: 3, photos: ['https://picsum.photos/seed/sw3/400/700', 'https://picsum.photos/seed/sw3b/400/700'], verified: true, interests: ['健身', '音乐', '游戏'] },
  { name: 'Luna', age: 23, distance: 5, photos: ['https://picsum.photos/seed/sw4/400/700'], verified: false, interests: ['阅读', '咖啡', '电影'] },
]);

const currentSwipeUser = computed(() => swipeViewUsers.value[swipeViewIndex.value] || null);
const isInterestCategory = computed(() => swipeViewCard.value?.category === 'interest');

function onCardClick(card: ExploreCard) {
  if (card.swipeable) {
    // 如果已离开该空间，弹出重新加入提示
    if (leftSpaces.value.has(card.id)) {
      rejoinCardRef.value = card;
      showRejoinSheet.value = true;
      return;
    }
    swipeViewCard.value = card;
    swipeViewIndex.value = 0;
    svPhotoIndex.value = 0;
    showSwipeView.value = true;
    return;
  }
  if (card.requirements) {
    selectedCard.value = card;
    showDetailSheet.value = true;
  }
}

function onLeaveSpace() {
  showLeaveConfirm.value = false;
  showSvSettings.value = false;
  if (swipeViewCard.value) {
    leftSpaces.value.add(swipeViewCard.value.id);
  }
  closeSwipeView();
}

function onRejoin() {
  if (rejoinCardRef.value) {
    leftSpaces.value.delete(rejoinCardRef.value.id);
    swipeViewCard.value = rejoinCardRef.value;
    swipeViewIndex.value = 0;
    svPhotoIndex.value = 0;
    showSwipeView.value = true;
  }
  showRejoinSheet.value = false;
  rejoinCardRef.value = null;
}

function closeSwipeView() { showSwipeView.value = false; swipeViewCard.value = null; svAnimating.value = false; }
function svPrevPhoto() { if (svPhotoIndex.value > 0) svPhotoIndex.value--; }
function svNextPhoto() {
  const photos = currentSwipeUser.value?.photos || [];
  if (svPhotoIndex.value < photos.length - 1) svPhotoIndex.value++;
}

function closeDetail() { showDetailSheet.value = false; selectedCard.value = null; }
function onEditProfile() { showDetailSheet.value = false; showPurposeEdit.value = true; const p = userStore.profile?.dating_purpose || []; selectedPurpose.value = p.includes('long_term') ? 'long_term' : ''; }
function selectPurpose(id: string) { selectedPurpose.value = id; }
function cancelPurposeEdit() { showPurposeEdit.value = false; if (selectedCard.value?.requirements) { if (!selectedCard.value.requirements.every(r => r.check())) showFailDialog.value = true; } }
function savePurpose() {
  if (userStore.profile) {
    const m: Record<string, string> = { long_term: 'long_term', long_but_short_ok: 'long_term', short_but_long_ok: 'short_term', short_term: 'short_term', friends: 'friends', thinking: 'not_sure' };
    const mapped = m[selectedPurpose.value] || selectedPurpose.value;
    if (!userStore.profile.dating_purpose) userStore.profile.dating_purpose = [];
    if (!userStore.profile.dating_purpose.includes(mapped)) userStore.profile.dating_purpose.push(mapped);
  }
  showPurposeEdit.value = false;
  if (selectedCard.value?.requirements && !selectedCard.value.requirements.every(r => r.check())) showFailDialog.value = true;
}
function closeFailDialog() { showFailDialog.value = false; selectedCard.value = null; }
</script>

<template>
  <div class="page">
    <header class="page-header"><h1 class="page-title">探索</h1></header>
    <main class="main">
      <div v-for="(section, si) in sections" :key="si" class="section">
        <div class="section-header">
          <h2 class="section-title">{{ section.title }}</h2>
          <p class="section-subtitle">{{ section.subtitle }}</p>
        </div>
        <div class="card-grid">
          <div v-for="card in section.cards" :key="card.id" class="explore-card" :class="{ 'card-featured': card.featured }" :style="{ '--card-color': card.color }" @click="onCardClick(card)">
            <img :src="card.cover" class="card-cover" />
            <div class="card-overlay"></div>
            <span v-if="card.users" class="card-badge"><span class="badge-icon">👤</span> {{ card.users }}</span>
            <div class="card-bottom">
              <span class="card-name">{{ card.name }}</span>
              <button v-if="card.cta" class="card-cta">{{ card.cta }}</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 详情底部面板 -->
    <Transition name="sheet-fade">
      <div v-if="showDetailSheet && selectedCard" class="sheet-mask" @click.self="closeDetail">
        <div class="detail-sheet">
          <div class="detail-header"><button class="detail-close press" @click="closeDetail">✕</button><span class="detail-header-title">{{ selectedCard.name }}</span><div></div></div>
          <div class="detail-cover-wrap"><img :src="selectedCard.cover" class="detail-cover" /></div>
          <div class="detail-body">
            <h2 class="detail-title">{{ selectedCard.name }}</h2>
            <p class="detail-desc">{{ selectedCard.description }}</p>
            <p class="detail-join">想加入？你需要：</p>
            <div class="detail-reqs"><div v-for="(req, i) in selectedCard.requirements" :key="i" class="req-item"><span class="req-icon">{{ req.check() ? '✅' : '❌' }}</span><span class="req-label">{{ req.label }}</span></div></div>
            <button class="detail-edit-btn press" @click="onEditProfile">编辑个人资料</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 编辑交友目的 -->
    <Transition name="slide-up">
      <div v-if="showPurposeEdit" class="purpose-page">
        <header class="purpose-header"><button class="purpose-back press" @click="cancelPurposeEdit">‹</button><span class="purpose-header-title">严肃谈恋爱</span><button class="purpose-cancel press" @click="cancelPurposeEdit">取消</button></header>
        <div class="purpose-progress"><div class="progress-fill"></div></div>
        <main class="purpose-body">
          <h2 class="purpose-title">你想要查找什么？</h2>
          <p class="purpose-subtitle">你可以随时更改交往意向哦。每个人都可以在这里找到自己想要的人际交往。</p>
          <div class="purpose-grid"><div v-for="opt in purposeOptions" :key="opt.id" class="purpose-option" :class="{ selected: selectedPurpose === opt.id }" @click="selectPurpose(opt.id)"><span class="purpose-emoji">{{ opt.emoji }}</span><span class="purpose-opt-label">{{ opt.label }}</span></div></div>
        </main>
        <footer class="purpose-footer"><button class="purpose-save-btn press" @click="savePurpose">添加到个人资料</button></footer>
      </div>
    </Transition>

    <!-- 不满足要求弹窗 -->
    <Transition name="sheet-fade">
      <div v-if="showFailDialog" class="sheet-mask" @click.self="closeFailDialog">
        <div class="fail-dialog">
          <h3 class="fail-title">不满足要求</h3>
          <div class="fail-avatar"><img :src="userStore.profile?.photos?.[0]?.url || 'https://picsum.photos/seed/me/100/100'" class="fail-avatar-img" /></div>
          <p class="fail-desc">此空间面向倾向寻找长期关系的用户。前往"探索"界面，看看是否对其他空间感兴趣。</p>
          <button class="fail-btn press" @click="closeFailDialog">返回探索页面</button>
        </div>
      </div>
    </Transition>

    <!-- 滑动浏览页面 -->
    <Transition name="slide-up">
      <div v-if="showSwipeView && swipeViewCard && currentSwipeUser" class="swipe-view">
        <header class="sv-header">
          <button class="sv-close press" @click="closeSwipeView">✕</button>
          <div class="sv-title-wrap">
            <span v-if="swipeViewCard.name === '照片已验证'" class="sv-verified-icon">✓</span>
            <span class="sv-title">{{ swipeViewCard.name }}</span>
          </div>
          <div class="sv-header-right"><button class="sv-boost press" @click="showSvBoostPage = true"><svg width="18" height="18" viewBox="0 0 24 24" fill="#a644ff"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg></button><button class="sv-more press" @click="showSvSettings = true">•••</button></div>
        </header>

        <div class="sv-card-area">
          <div
            class="sv-card"
            :style="{ transform: `translateX(${svOffsetX}px) translateY(${svOffsetY}px) rotate(${svRotation}deg)`, transition: svCardTransition }"
            @pointerdown="svPointerDown"
            @pointermove="svPointerMove"
            @pointerup="svPointerUp"
            @pointercancel="svPointerUp"
          >
            <img :src="currentSwipeUser.photos[svPhotoIndex] || currentSwipeUser.photos[0]" class="sv-photo" draggable="false" />
            <div v-if="currentSwipeUser.photos.length > 1" class="sv-indicators">
              <div v-for="(_, i) in currentSwipeUser.photos" :key="i" class="sv-ind" :class="{ active: i === svPhotoIndex }"></div>
            </div>
            <div class="sv-tap-left" @click.stop="svPrevPhoto"></div>
            <div class="sv-tap-right" @click.stop="svNextPhoto"></div>
            <!-- 滑动印章 -->
            <div v-if="svStampType === 'nope'" class="sv-stamp sv-stamp-nope" :style="{ opacity: svStampOpacity }">NOPE</div>
            <div v-if="svStampType === 'like'" class="sv-stamp sv-stamp-like" :style="{ opacity: svStampOpacity }">LIKE</div>
            <div v-if="svStampType === 'super'" class="sv-stamp sv-stamp-super" :style="{ opacity: svStampOpacity }">SUPER</div>
            <div class="sv-card-info">
              <div class="sv-active-tag">活跃</div>
              <div class="sv-name-row">
                <span class="sv-name">{{ currentSwipeUser.name }}</span>
                <span class="sv-age">{{ currentSwipeUser.age }}</span>
                <span v-if="currentSwipeUser.verified" class="sv-check">✓</span>
              </div>
              <div class="sv-distance">📍 距离 {{ currentSwipeUser.distance }} 公里</div>
              <div v-if="isInterestCategory" class="sv-interests">
                <div class="sv-interests-label">🎯 兴趣</div>
                <div class="sv-tags">
                  <span v-for="tag in currentSwipeUser.interests" :key="tag" class="sv-tag">{{ tag }}</span>
                </div>
              </div>
            </div>
            <button class="sv-up-btn" @click.stop="showSvDetail = true">
              <svg class="sv-arrow-svg" viewBox="0 0 24 24"><path d="M12 4L4 12h4.5v8h7v-8H20L12 4z" /></svg>
            </button>
          </div>
        </div>

        <div class="sv-actions">
          <button class="sv-icon-btn sv-btn-sm press" :style="{ transform: `scale(${svBtnScale('rewind')})` }" @click="showSvRewind = true">
            <svg viewBox="0 0 24 24"><path class="sv-fill-undo" d="M12.5 3.5c-4.14 0-7.5 3.36-7.5 7.5H2l3.84 4.1a.5.5 0 0 0 .73 0L10.5 11H7.5c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5c-1.38 0-2.63-.56-3.53-1.47l-1.41 1.41c1.27 1.27 3.01 2.06 4.94 2.06 3.87 0 7-3.13 7-7s-3.13-7-7-7z"/></svg>
          </button>
          <button class="sv-icon-btn sv-btn-lg press" :class="{ 'sv-glow-nope': svActiveBtn === 'nope' }" :style="{ transform: `scale(${svBtnScale('nope')})` }" @click="svDoSwipe('nope')">
            <svg viewBox="0 0 24 24"><path class="sv-fill-nope" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
          <button class="sv-icon-btn sv-btn-sm press" :class="{ 'sv-glow-star': svActiveBtn === 'super' }" :style="{ transform: `scale(${svBtnScale('super')})` }" @click="svDoSwipe('super')">
            <svg viewBox="0 0 24 24"><path class="sv-fill-star" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </button>
          <button class="sv-icon-btn sv-btn-lg press" :class="{ 'sv-glow-like': svActiveBtn === 'like' }" :style="{ transform: `scale(${svBtnScale('like')})` }" @click="svDoSwipe('like')">
            <svg viewBox="0 0 24 24"><path class="sv-fill-like" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <button class="sv-icon-btn sv-btn-sm press" :style="{ transform: `scale(${svBtnScale('send')})` }" @click="showSvSend = true">
            <svg viewBox="0 0 24 24"><path class="sv-fill-boost" d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></svg>
          </button>
          <svg width="0" height="0" style="position:absolute;">
            <defs>
              <linearGradient id="sv-grad-nope" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff5d73"/><stop offset="100%" stop-color="#ee0b66"/></linearGradient>
              <linearGradient id="sv-grad-like" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d3f96e"/><stop offset="100%" stop-color="#17e297"/></linearGradient>
              <linearGradient id="sv-grad-star" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#51ccff"/><stop offset="100%" stop-color="#1786ff"/></linearGradient>
              <linearGradient id="sv-grad-boost" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3d8bff"/><stop offset="100%" stop-color="#1a5fff"/></linearGradient>
            </defs>
          </svg>
        </div>

        <!-- 回退升级弹窗 -->
        <Transition name="sheet-fade">
          <div v-if="showSvRewind" class="sv-rewind-overlay">
            <button class="sv-rw-close press" @click="showSvRewind = false">✕</button>
            <div class="sv-rw-brand">🔥 <span class="sv-rw-brand-t">tinder<span style="color:#FD297B;">+</span></span></div>
            <h2 class="sv-rw-title">无限倒回。你可以撤回操作，再给自己一次机会！</h2>
            <p class="sv-rw-sub">选择一个套餐</p>
            <div class="sv-rw-plans">
              <div class="sv-rw-plan sv-rw-plan-active"><span class="sv-rw-hot">热门</span><span class="sv-rw-period">1 周</span><span class="sv-rw-price">US$12.99/周</span><span class="sv-rw-chk">✓</span></div>
              <div class="sv-rw-plan"><span class="sv-rw-period">1 个月</span><span class="sv-rw-price">US$6.24/周</span></div>
            </div>
            <div class="sv-rw-features">
              <div class="sv-rw-feat">✓ 无限点赞</div>
              <div class="sv-rw-feat">✓ 无限倒回</div>
              <div class="sv-rw-feat">✓ 无限位置漫游模式</div>
              <div class="sv-rw-feat">✓ 管理你的个人资料</div>
              <div class="sv-rw-feat">✓ 限制谁可以看到你</div>
            </div>
            <button class="sv-rw-buy press" @click="showSvRewind = false">以 US$12.99 的总价继续操作</button>
          </div>
        </Transition>

        <!-- 发送消息弹窗 -->
        <Transition name="sheet-fade">
          <div v-if="showSvSend" class="sv-send-overlay">
            <div class="sv-send-header">
              <button class="sv-send-close press" @click="showSvSend = false">✕</button>
              <div class="sv-send-count">0</div>
            </div>
            <div class="sv-send-body">
              <div class="sv-send-tip"><span class="sv-send-icon">➤</span> 配对成功率提高最多五倍</div>
              <p class="sv-send-desc">发送初印象，率先赢得好感。发送信息。看看是否能配对成功。</p>
              <div class="sv-send-preview">
                <img :src="currentSwipeUser.photos[0]" class="sv-send-img" />
                <span class="sv-send-pcount">1/{{ currentSwipeUser.photos.length }}</span>
              </div>
            </div>
            <div class="sv-send-input-row">
              <input class="sv-send-input" placeholder="填写信息" />
              <button class="sv-send-submit press">发送</button>
            </div>
          </div>
        </Transition>

        <!-- 用户详情页 -->
        <Transition name="slide-up">
          <div v-if="showSvDetail" class="sv-detail-page">
            <header class="svd-header">
              <div class="svd-name-row">
                <span class="svd-name">{{ currentSwipeUser.name }}，{{ currentSwipeUser.age }}</span>
                <span v-if="currentSwipeUser.verified" class="svd-verified">✓</span>
              </div>
              <button class="svd-down press" @click="showSvDetail = false">⬇</button>
            </header>
            <div class="svd-body">
              <div class="svd-photo-area">
                <img :src="currentSwipeUser.photos[svPhotoIndex] || currentSwipeUser.photos[0]" class="svd-photo" />
                <div v-if="currentSwipeUser.photos.length > 1" class="svd-indicators">
                  <div v-for="(_, i) in currentSwipeUser.photos" :key="i" class="svd-ind" :class="{ active: i === svPhotoIndex }"></div>
                </div>
                <div class="svd-tap-left" @click="svPrevPhoto"></div>
                <div class="svd-tap-right" @click="svNextPhoto"></div>
              </div>
              <div class="svd-info">
                <div class="svd-info-row">
                  <span class="svd-info-name">{{ currentSwipeUser.name }}</span>
                  <span class="svd-info-age">{{ currentSwipeUser.age }}</span>
                  <span v-if="currentSwipeUser.verified" class="svd-info-check">✓</span>
                </div>
                <div class="svd-meta">📍 距离 {{ currentSwipeUser.distance }} 公里</div>
                <div v-if="currentSwipeUser.interests?.length" class="svd-interests">
                  <h4 class="svd-section-title">兴趣</h4>
                  <div class="svd-tags">
                    <span v-for="tag in currentSwipeUser.interests" :key="tag" class="svd-tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="svd-actions">
              <button class="sv-icon-btn sv-btn-lg press" @click="showSvDetail = false; svDoSwipe('nope')">
                <svg viewBox="0 0 24 24"><path class="sv-fill-nope" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
              <button class="sv-icon-btn sv-btn-sm press" @click="showSvDetail = false; svDoSwipe('super')">
                <svg viewBox="0 0 24 24"><path class="sv-fill-star" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </button>
              <button class="sv-icon-btn sv-btn-lg press" @click="showSvDetail = false; svDoSwipe('like')">
                <svg viewBox="0 0 24 24"><path class="sv-fill-like" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>
            </div>
          </div>
        </Transition>

        <!-- 模块设置底部面板 -->
        <Transition name="sheet-fade">
          <div v-if="showSvSettings" class="sv-settings-mask" @click.self="showSvSettings = false">
            <div class="sv-settings-sheet">
              <div class="sv-settings-header">
                <button class="sv-settings-close press" @click="showSvSettings = false">✕</button>
                <span class="sv-settings-title">{{ swipeViewCard?.name }}设置</span>
                <div></div>
              </div>
              <div class="sv-settings-body">
                <div class="sv-settings-row">
                  <span class="sv-settings-label">发现距离</span>
                  <span class="sv-settings-value">{{ svDistance }} 公里</span>
                </div>
                <input type="range" class="sv-settings-slider" v-model.number="svDistance" min="1" max="160" :style="{ '--slider-pct': ((svDistance - 1) / 159 * 100) + '%' }" />
                <p class="sv-settings-hint">此类设置仅适用于{{ swipeViewCard?.name }}功能</p>
              </div>
              <div class="sv-settings-footer">
                <button class="sv-settings-update press" @click="showSvSettings = false">更新设置</button>
                <button v-if="swipeViewCard?.name === '今晚有空'" class="sv-settings-leave press" @click="showLeaveConfirm = true">离开空间</button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 离开空间确认面板 -->
        <Transition name="sheet-fade">
          <div v-if="showLeaveConfirm" class="sv-settings-mask" @click.self="showLeaveConfirm = false">
            <div class="sv-settings-sheet">
              <div class="sv-settings-header">
                <button class="sv-settings-close press" @click="showLeaveConfirm = false">✕</button>
                <span class="sv-settings-title">{{ swipeViewCard?.name }}设置</span>
                <div></div>
              </div>
              <div class="sv-leave-body">
                <h3 class="sv-leave-title">想离开{{ swipeViewCard?.name }}了吗？</h3>
                <p class="sv-leave-desc">一旦离开，你将在此空间消失，需要重新加入。</p>
              </div>
              <div class="sv-settings-footer">
                <button class="sv-settings-update press" @click="onLeaveSpace">离开空间</button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- 重新加入空间底部面板 -->
    <Transition name="sheet-fade">
      <div v-if="showRejoinSheet && rejoinCardRef" class="sheet-mask" @click.self="showRejoinSheet = false">
        <div class="rejoin-sheet">
          <div class="rejoin-header">
            <button class="rejoin-close press" @click="showRejoinSheet = false">✕</button>
            <span class="rejoin-header-title">{{ rejoinCardRef.name }}</span>
            <div></div>
          </div>
          <div class="rejoin-cover-wrap">
            <img :src="rejoinCardRef.cover" class="rejoin-cover" />
          </div>
          <div class="rejoin-body">
            <h2 class="rejoin-title">加入{{ rejoinCardRef.name }}</h2>
            <p class="rejoin-desc">寻找随性直率的新伙伴，和你一起探险。</p>
          </div>
          <div class="rejoin-footer">
            <button class="rejoin-btn press" @click="onRejoin">马上加入</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Boost 购买页面 -->
    <Transition name="slide-up">
      <div v-if="showSvBoostPage" class="svbp-page" :class="{ 'svbp-super': svBoostTab === 'super' }">
        <header class="svbp-header">
          <button class="svbp-close press" @click="showSvBoostPage = false">✕</button>
        </header>
        <div class="svbp-body">
          <h1 class="svbp-title">选择 Boost</h1>
          <div class="svbp-tabs">
            <button class="svbp-tab" :class="{ 'svbp-tab-active': svBoostTab === 'boost' }" @click="svBoostTab = 'boost'; svBoostPlanIndex = 1">Boost</button>
            <button class="svbp-tab" :class="{ 'svbp-tab-active': svBoostTab === 'prime' }" @click="svBoostTab = 'prime'; svBoostPlanIndex = 1">优时 Boost</button>
            <button class="svbp-tab" :class="{ 'svbp-tab-active': svBoostTab === 'super' }" @click="svBoostTab = 'super'; svBoostPlanIndex = 1">Super Boost</button>
          </div>
          <template v-if="svBoostTab === 'boost'">
            <div class="svbp-desc"><strong>⚡ Boost</strong><p>成为当地的最佳个人资料，30 分钟内帮你收获更多点赞。</p></div>
            <div class="svbp-plans">
              <div class="svbp-plan" :class="{ 'svbp-plan-active': svBoostPlanIndex === 0 }" @click="svBoostPlanIndex = 0"><div class="svbp-plan-top"><span class="svbp-best">最划算</span><span class="svbp-save">节省 40%</span></div><div class="svbp-plan-row"><span class="svbp-count">20 Boost</span><span class="svbp-price">US$1.99/个</span></div></div>
              <div class="svbp-plan" :class="{ 'svbp-plan-active': svBoostPlanIndex === 1 }" @click="svBoostPlanIndex = 1"><div class="svbp-plan-row"><span class="svbp-count">10 Boost</span><span class="svbp-price">US$5.99/个</span></div></div>
              <div class="svbp-plan" :class="{ 'svbp-plan-active': svBoostPlanIndex === 2 }" @click="svBoostPlanIndex = 2"><div class="svbp-plan-row"><span class="svbp-count">3 Boost</span><span class="svbp-price">US$3.33/个</span></div></div>
            </div>
            <div class="svbp-or"><span>或</span></div>
            <div class="svbp-gold"><p>每月免费赠送 1 个 Boost</p><div class="svbp-gold-row"><span>🔥 开通 Tinder Gold®</span><button class="svbp-gold-btn press" @click="showSvBoostPage = false">选择</button></div></div>
          </template>
          <template v-if="svBoostTab === 'prime'">
            <div class="svbp-desc"><strong>🕐 优时 Boost</strong><p>我们会在用户最活跃的时段一键 Boost，让更多的潜在配对对象看到你。</p></div>
            <div class="svbp-plans">
              <div class="svbp-plan" :class="{ 'svbp-plan-active': svBoostPlanIndex === 0 }" @click="svBoostPlanIndex = 0"><div class="svbp-plan-top"><span class="svbp-save">节省 25%</span></div><div class="svbp-plan-row"><span class="svbp-count">5 优时 Boost</span><span class="svbp-price">US$11.99/个</span></div></div>
              <div class="svbp-plan" :class="{ 'svbp-plan-active': svBoostPlanIndex === 1 }" @click="svBoostPlanIndex = 1"><div class="svbp-plan-top"><span class="svbp-save">节省 12%</span></div><div class="svbp-plan-row"><span class="svbp-count">3 优时 Boost</span><span class="svbp-price">US$13.99/个</span></div></div>
              <div class="svbp-plan" :class="{ 'svbp-plan-active': svBoostPlanIndex === 2 }" @click="svBoostPlanIndex = 2"><div class="svbp-plan-row"><span class="svbp-count">1 优时 Boost</span><span class="svbp-price">US$15.99</span></div></div>
            </div>
            <div class="svbp-or"><span>或</span></div>
            <div class="svbp-gold"><p>每月免费赠送 1 个 Boost</p><div class="svbp-gold-row"><span>🔥 开通 Tinder Gold®</span><button class="svbp-gold-btn press" @click="showSvBoostPage = false">选择</button></div></div>
          </template>
          <template v-if="svBoostTab === 'super'">
            <div class="svbp-desc svbp-desc-super"><strong>⚡ Super Boost</strong><p>Super Boost 助你冲到前排，让更多人有机会认识你。</p></div>
            <div class="svbp-plans">
              <div class="svbp-plan" :class="{ 'svbp-plan-active': svBoostPlanIndex === 0 }" @click="svBoostPlanIndex = 0"><div class="svbp-plan-top"><span class="svbp-best">最划算</span><span class="svbp-save">节省 35%</span></div><div class="svbp-plan-row"><span class="svbp-count svbp-purple">12 小时</span><span class="svbp-price">US$129.99</span></div></div>
              <div class="svbp-plan" :class="{ 'svbp-plan-active': svBoostPlanIndex === 1 }" @click="svBoostPlanIndex = 1"><div class="svbp-plan-top"><span class="svbp-best">热门</span><span class="svbp-save">节省 30%</span></div><div class="svbp-plan-row"><span class="svbp-count svbp-purple">6 小时</span><span class="svbp-price">US$69.99</span></div></div>
              <div class="svbp-plan" :class="{ 'svbp-plan-active': svBoostPlanIndex === 2 }" @click="svBoostPlanIndex = 2"><div class="svbp-plan-row"><span class="svbp-count svbp-purple">3 小时</span><span class="svbp-price">US$49.99</span></div></div>
            </div>
          </template>
        </div>
        <footer class="svbp-footer">
          <template v-if="svBoostTab === 'super'"><p class="svbp-footer-sub">订阅用户专享。</p><button class="svbp-buy svbp-buy-dark press" @click="showSvBoostPage = false">解锁 Super Boost</button></template>
          <template v-else><button class="svbp-buy svbp-buy-purple press" @click="showSvBoostPage = false">以 US${{ svBoostTab === 'boost' ? '59.99' : '41.99' }} 的总价继续操作</button></template>
        </footer>
      </div>
    </Transition>

    <BottomNavigation theme="light" />
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff; padding-bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom)); }
.page-header { padding: 16px 20px 8px; }
.page-title { font-size: 28px; font-weight: 800; color: #111; margin: 0; }
.main { padding: 0 16px 24px; }
.section { margin-bottom: 28px; }
.section-header { margin-bottom: 12px; }
.section-title { font-size: 16px; font-weight: 700; color: #111; margin: 0 0 2px; }
.section-subtitle { font-size: 13px; color: #888; margin: 0; }
.card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.explore-card { position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 3 / 4; cursor: pointer; }
.explore-card.card-featured { grid-column: 1 / -1; aspect-ratio: 16 / 9; }
.card-cover { width: 100%; height: 100%; object-fit: cover; display: block; }
.card-overlay { position: absolute; inset: 0; background: var(--card-color, #333); opacity: 0.55; mix-blend-mode: multiply; }
.card-badge { position: absolute; top: 10px; right: 10px; display: flex; align-items: center; gap: 3px; padding: 4px 8px; border-radius: 6px; background: rgba(0,0,0,0.5); color: #fff; font-size: 11px; font-weight: 600; backdrop-filter: blur(4px); }
.badge-icon { font-size: 10px; }
.card-bottom { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px; display: flex; align-items: flex-end; justify-content: space-between; }
.card-name { font-size: 18px; font-weight: 700; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.4); line-height: 1.2; }
.card-cta { padding: 8px 14px; border-radius: 9999px; background: #fff; color: #111; font-size: 12px; font-weight: 600; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }

/* Detail Sheet */
.sheet-mask { position: fixed; inset: 0; z-index: 90; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; }
.detail-sheet { width: 100%; max-width: 480px; max-height: 85vh; background: #fff; border-radius: 24px 24px 0 0; display: flex; flex-direction: column; overflow: hidden; animation: sheetUp 0.3s ease; }
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.detail-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.detail-close { width: 28px; height: 28px; font-size: 16px; color: #111; }
.detail-header-title { font-size: 15px; font-weight: 600; color: #111; }
.detail-cover-wrap { width: 100%; aspect-ratio: 16/9; overflow: hidden; }
.detail-cover { width: 100%; height: 100%; object-fit: cover; }
.detail-body { padding: 20px 24px 32px; overflow-y: auto; }
.detail-title { font-size: 24px; font-weight: 800; color: #111; margin: 0 0 8px; }
.detail-desc { font-size: 14px; color: #555; line-height: 1.5; margin: 0 0 20px; }
.detail-join { font-size: 14px; color: #111; font-weight: 500; margin: 0 0 12px; }
.detail-reqs { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.req-item { display: flex; align-items: center; gap: 10px; }
.req-icon { font-size: 18px; }
.req-label { font-size: 14px; color: #333; }
.detail-edit-btn { width: 100%; height: 52px; border-radius: 9999px; background: #111; color: #fff; font-size: 16px; font-weight: 600; }

/* Purpose Edit */
.purpose-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.purpose-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; height: 56px; }
.purpose-back { font-size: 24px; color: #111; width: 32px; }
.purpose-header-title { font-size: 15px; font-weight: 600; color: #111; }
.purpose-cancel { font-size: 14px; color: #666; }
.purpose-progress { height: 4px; background: #eee; margin: 0 20px; border-radius: 2px; }
.progress-fill { height: 100%; width: 60%; background: linear-gradient(90deg, #FD297B, #FF655B); border-radius: 2px; }
.purpose-body { flex: 1; padding: 24px 20px; overflow-y: auto; }
.purpose-title { font-size: 24px; font-weight: 800; color: #111; margin: 0 0 8px; }
.purpose-subtitle { font-size: 13px; color: #888; line-height: 1.5; margin: 0 0 24px; }
.purpose-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.purpose-option { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; border-radius: 12px; border: 1.5px solid #e8e8e8; background: #fafafa; cursor: pointer; text-align: center; transition: all 0.2s; }
.purpose-option.selected { border-color: #FD297B; background: rgba(253, 41, 123, 0.04); }
.purpose-emoji { font-size: 32px; }
.purpose-opt-label { font-size: 12px; font-weight: 500; color: #333; line-height: 1.3; }
.purpose-footer { padding: 16px 24px; }
.purpose-save-btn { width: 100%; height: 52px; border-radius: 9999px; background: #111; color: #fff; font-size: 16px; font-weight: 600; }

/* Fail Dialog */
.fail-dialog { width: calc(100% - 32px); max-width: 360px; background: #111; border-radius: 20px; padding: 28px 24px; text-align: center; margin: auto; animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.fail-title { font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 16px; }
.fail-avatar { margin-bottom: 16px; }
.fail-avatar-img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 3px solid #333; }
.fail-desc { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 24px; }
.fail-btn { width: 100%; height: 48px; border-radius: 9999px; background: #fff; color: #111; font-size: 15px; font-weight: 600; }

/* Transitions */
.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.2s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }
.slide-up-enter-active { animation: slideUp 0.3s ease; }
.slide-up-leave-active { animation: slideDown 0.3s ease; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }

/* Swipe View */
.swipe-view { position: fixed; inset: 0; z-index: 100; background: #111; display: flex; flex-direction: column; }
.sv-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: #111; }
.sv-close { width: 32px; height: 32px; font-size: 18px; color: #fff; }
.sv-title-wrap { display: flex; align-items: center; gap: 6px; }
.sv-verified-icon { width: 20px; height: 20px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 11px; display: flex; align-items: center; justify-content: center; }
.sv-title { font-size: 15px; font-weight: 600; color: #fff; }
.sv-header-right { display: flex; align-items: center; gap: 12px; }
.sv-boost { display: flex; align-items: center; justify-content: center; }
.sv-more { font-size: 16px; color: #fff; letter-spacing: 2px; }

.sv-card-area { flex: 1; position: relative; margin: 0 8px; border-radius: 12px; overflow: hidden; }
.sv-card { position: absolute; inset: 0; border-radius: 12px; overflow: hidden; }
.sv-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.sv-indicators { position: absolute; top: 8px; left: 12px; right: 12px; display: flex; gap: 3px; z-index: 5; }
.sv-ind { flex: 1; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.4); }
.sv-ind.active { background: #fff; }
.sv-tap-left { position: absolute; top: 0; left: 0; width: 35%; height: 70%; z-index: 4; }
.sv-tap-right { position: absolute; top: 0; right: 0; width: 65%; height: 70%; z-index: 4; }

.sv-card-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); z-index: 3; }
.sv-active-tag { display: inline-flex; align-items: center; justify-content: center; padding: 4px 14px; border-radius: 100px; background-color: #f1fcf6; color: #1a5d4e; font-size: 13px; font-weight: 700; margin-bottom: 6px; white-space: nowrap; }
.sv-name-row { display: flex; align-items: baseline; gap: 6px; }
.sv-name { font-size: 26px; font-weight: 700; color: #fff; }
.sv-age { font-size: 22px; font-weight: 400; color: #fff; }
.sv-check { width: 18px; height: 18px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; }
.sv-distance { font-size: 12px; color: rgba(255,255,255,0.75); margin-top: 4px; }
.sv-up-btn { position: absolute; bottom: 16px; right: 16px; width: 38px; height: 38px; border-radius: 50%; background: rgba(10, 10, 10, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #fff; display: flex; align-items: center; justify-content: center; z-index: 5; border: none; cursor: pointer; box-shadow: inset 0 0 0 0.5px rgba(255,255,255,0.15), 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.15s; }
.sv-up-btn:active { transform: scale(0.9); }
.sv-arrow-svg { width: 22px; height: 22px; fill: #ffffff; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); }

/* Interest tags */
.sv-interests { margin-top: 8px; }
.sv-interests-label { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 6px; display: flex; align-items: center; gap: 4px; }
.sv-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.sv-tag { padding: 4px 10px; border-radius: 9999px; background: rgba(255,255,255,0.15); color: #fff; font-size: 12px; font-weight: 500; backdrop-filter: blur(4px); }

.sv-actions { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 14px 0; background: #fff; }
.sv-icon-btn { border: none; outline: none; cursor: pointer; border-radius: 50%; display: flex; justify-content: center; align-items: center; position: relative; background: rgba(0, 0, 0, 0.04); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(0, 0, 0, 0.06); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06); transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.sv-btn-sm { width: 54px; height: 54px; }
.sv-btn-lg { width: 78px; height: 78px; }
.sv-icon-btn svg { width: 58%; height: 58%; filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1)); }
.sv-icon-btn:active { transform: scale(0.9); }
.sv-fill-nope { fill: url(#sv-grad-nope); }
.sv-fill-like { fill: url(#sv-grad-like); }
.sv-fill-star { fill: url(#sv-grad-star); }
.sv-fill-boost { fill: url(#sv-grad-boost); }
.sv-fill-undo { fill: #8a8e97; }
.sv-glow-nope { box-shadow: 0 0 16px rgba(238, 11, 102, 0.3), 0 4px 15px rgba(0, 0, 0, 0.06); background: rgba(238, 11, 102, 0.08); }
.sv-glow-like { box-shadow: 0 0 16px rgba(23, 226, 151, 0.3), 0 4px 15px rgba(0, 0, 0, 0.06); background: rgba(23, 226, 151, 0.08); }
.sv-glow-star { box-shadow: 0 0 16px rgba(23, 134, 255, 0.3), 0 4px 15px rgba(0, 0, 0, 0.06); background: rgba(23, 134, 255, 0.08); }

/* Swipe card drag */
.sv-card { will-change: transform; cursor: grab; touch-action: none; }
.sv-card:active { cursor: grabbing; }

/* Stamps */
.sv-stamp { position: absolute; top: 20%; left: 50%; transform: translateX(-50%) rotate(-20deg); font-size: 42px; font-weight: 900; z-index: 6; pointer-events: none; padding: 8px 16px; border: 4px solid; border-radius: 8px; letter-spacing: 4px; }
.sv-stamp-nope { color: #f2385a; border-color: #f2385a; transform: translateX(-50%) rotate(20deg); }
.sv-stamp-like { color: #4cdc8f; border-color: #4cdc8f; transform: translateX(-50%) rotate(-20deg); }
.sv-stamp-super { color: #42a5f5; border-color: #42a5f5; transform: translateX(-50%) rotate(0deg); }

/* Rewind Upgrade Overlay */
.sv-rewind-overlay { position: fixed; inset: 0; z-index: 110; background: #fff; display: flex; flex-direction: column; padding: 20px 24px; overflow-y: auto; }
.sv-rw-close { position: absolute; top: 20px; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; }
.sv-rw-brand { text-align: center; margin: 16px 0 20px; font-size: 18px; }
.sv-rw-brand-t { font-weight: 700; font-style: italic; color: #111; }
.sv-rw-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.3; }
.sv-rw-sub { font-size: 14px; color: #666; margin: 0 0 16px; }
.sv-rw-plans { display: flex; gap: 12px; margin-bottom: 20px; }
.sv-rw-plan { flex: 1; padding: 16px; border-radius: 12px; border: 1.5px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; position: relative; }
.sv-rw-plan-active { border-color: #FD297B; }
.sv-rw-hot { font-size: 11px; color: #FD297B; font-weight: 600; }
.sv-rw-period { font-size: 22px; font-weight: 800; color: #111; }
.sv-rw-price { font-size: 13px; color: #666; }
.sv-rw-chk { position: absolute; top: 12px; right: 12px; color: #FD297B; font-size: 16px; }
.sv-rw-features { border: 1px solid #eee; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
.sv-rw-feat { font-size: 14px; color: #111; margin-bottom: 8px; font-weight: 500; }
.sv-rw-buy { width: 100%; height: 52px; border-radius: 9999px; background: linear-gradient(135deg, #FD297B, #FF655B); color: #fff; font-size: 15px; font-weight: 600; }

/* Send Message Overlay */
.sv-send-overlay { position: fixed; inset: 0; z-index: 110; background: #111; display: flex; flex-direction: column; }
.sv-send-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
.sv-send-close { width: 32px; height: 32px; font-size: 18px; color: #fff; }
.sv-send-count { width: 32px; height: 32px; border-radius: 50%; background: #333; color: #fff; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; }
.sv-send-body { flex: 1; padding: 0 20px; overflow-y: auto; }
.sv-send-tip { color: #42a5f5; font-size: 14px; font-weight: 600; margin-bottom: 12px; }
.sv-send-icon { margin-right: 6px; }
.sv-send-desc { font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0 0 20px; }
.sv-send-preview { position: relative; width: 260px; border-radius: 12px; overflow: hidden; border: 3px solid #42a5f5; }
.sv-send-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
.sv-send-pcount { position: absolute; top: 10px; right: 10px; padding: 3px 8px; border-radius: 6px; background: rgba(0,0,0,0.5); color: #fff; font-size: 11px; font-weight: 600; }
.sv-send-input-row { display: flex; align-items: center; margin: 16px 20px; background: #fff; border-radius: 9999px; overflow: hidden; }
.sv-send-input { flex: 1; border: 0; padding: 14px 18px; font-size: 14px; color: #111; background: transparent; outline: none; }
.sv-send-input::placeholder { color: #999; }
.sv-send-submit { padding: 14px 18px; font-size: 14px; font-weight: 600; color: #42a5f5; background: transparent; }

/* Settings Sheet */
.sv-settings-mask { position: fixed; inset: 0; z-index: 110; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; }
.sv-settings-sheet { width: 100%; max-width: 480px; background: #fff; border-radius: 24px 24px 0 0; animation: sheetUp 0.3s ease; }
.sv-settings-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.sv-settings-close { width: 28px; height: 28px; font-size: 16px; color: #111; }
.sv-settings-title { font-size: 15px; font-weight: 600; color: #111; }
.sv-settings-body { padding: 24px 20px; }
.sv-settings-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.sv-settings-label { font-size: 14px; color: #111; font-weight: 500; }
.sv-settings-value { font-size: 14px; color: #111; font-weight: 600; }
.sv-settings-slider { width: 100%; height: 22px; appearance: none; background: transparent; outline: none; margin-bottom: 16px; position: relative; }
.sv-settings-slider::-webkit-slider-runnable-track { height: 4px; background: linear-gradient(90deg, #FD297B 0%, #FD297B var(--slider-pct, 50%), #eee var(--slider-pct, 50%), #eee 100%); border-radius: 2px; }
.sv-settings-slider::-webkit-slider-thumb { appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 3px solid #FD297B; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2); margin-top: -9px; }
.sv-settings-hint { font-size: 12px; color: #999; text-align: center; margin: 0; }
.sv-settings-footer { padding: 16px 20px 32px; display: flex; flex-direction: column; gap: 12px; }
.sv-settings-update { width: 100%; height: 52px; border-radius: 9999px; background: #111; color: #fff; font-size: 16px; font-weight: 600; }
.sv-settings-leave { font-size: 15px; font-weight: 600; color: #111; text-align: center; padding: 8px; }

/* Leave confirm body */
.sv-leave-body { padding: 24px 20px; }
.sv-leave-title { font-size: 20px; font-weight: 700; color: #111; margin: 0 0 8px; }
.sv-leave-desc { font-size: 14px; color: #666; line-height: 1.5; margin: 0; }

/* Rejoin Sheet */
.rejoin-sheet { width: 100%; max-width: 480px; background: #fff; border-radius: 24px 24px 0 0; animation: sheetUp 0.3s ease; overflow: hidden; }
.rejoin-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.rejoin-close { width: 28px; height: 28px; font-size: 16px; color: #111; }
.rejoin-header-title { font-size: 15px; font-weight: 600; color: #111; }
.rejoin-cover-wrap { width: 100%; aspect-ratio: 16/9; overflow: hidden; }
.rejoin-cover { width: 100%; height: 100%; object-fit: cover; }
.rejoin-body { padding: 20px 24px 8px; }
.rejoin-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 8px; }
.rejoin-desc { font-size: 14px; color: #666; line-height: 1.5; margin: 0; }
.rejoin-footer { padding: 16px 24px 32px; }
.rejoin-btn { width: 100%; height: 52px; border-radius: 9999px; background: #111; color: #fff; font-size: 16px; font-weight: 600; }

/* Boost Page in Explore */
.svbp-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.svbp-super { background: linear-gradient(180deg, #7b2ff7 0%, #9b4dff 40%, #b366ff 70%, #d4a0ff 100%); }
.svbp-header { padding: 16px 20px; }
.svbp-close { width: 32px; height: 32px; font-size: 20px; color: #111; background: none; border: none; }
.svbp-super .svbp-close { color: #fff; }
.svbp-body { flex: 1; overflow-y: auto; padding: 0 20px 24px; }
.svbp-title { font-size: 28px; font-weight: 300; color: #111; margin: 0 0 16px; }
.svbp-super .svbp-title { color: #fff; }
.svbp-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
.svbp-tab { padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 600; color: #666; background: none; border: 1.5px solid #ddd; cursor: pointer; }
.svbp-tab-active { background: #111; color: #fff; border-color: #111; }
.svbp-super .svbp-tab { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.7); }
.svbp-super .svbp-tab-active { background: #fff; color: #111; border-color: #fff; }
.svbp-desc { margin-bottom: 24px; }
.svbp-desc strong { font-size: 16px; color: #111; display: block; margin-bottom: 6px; }
.svbp-desc p { font-size: 14px; color: #666; line-height: 1.5; margin: 0; }
.svbp-desc-super strong { color: #fff; }
.svbp-desc-super p { color: rgba(255,255,255,0.8); }
.svbp-super .svbp-desc strong { color: #fff; }
.svbp-super .svbp-desc p { color: rgba(255,255,255,0.8); }
.svbp-plans { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.svbp-plan { border: 1.5px solid #e8e8e8; border-radius: 12px; padding: 16px 18px; cursor: pointer; }
.svbp-plan-active { border-color: #7b2ff7; border-width: 2px; }
.svbp-plan-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.svbp-best { font-size: 12px; font-weight: 600; color: #7b2ff7; }
.svbp-save { font-size: 12px; font-weight: 600; color: #666; padding: 2px 8px; border-radius: 6px; background: #f5f5f5; }
.svbp-plan-row { display: flex; align-items: baseline; justify-content: space-between; }
.svbp-count { font-size: 20px; font-weight: 700; color: #111; }
.svbp-purple { color: #7b2ff7; }
.svbp-price { font-size: 15px; font-weight: 600; color: #111; }
.svbp-or { text-align: center; padding: 16px 0; position: relative; }
.svbp-or::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee; }
.svbp-or span { position: relative; background: #fff; padding: 0 12px; font-size: 14px; color: #999; }
.svbp-gold { border: 1px solid #eee; border-radius: 12px; padding: 16px; }
.svbp-gold p { font-size: 13px; font-weight: 600; color: #111; text-align: center; margin: 0 0 12px; }
.svbp-gold-row { display: flex; align-items: center; justify-content: space-between; }
.svbp-gold-row span { font-size: 15px; font-weight: 500; color: #111; }
.svbp-gold-btn { padding: 8px 16px; border-radius: 9999px; border: 1.5px solid #ddd; font-size: 13px; font-weight: 600; color: #111; background: #fff; }
.svbp-footer { padding: 16px 20px 32px; }
.svbp-footer-sub { text-align: center; font-size: 14px; color: #666; margin: 0 0 12px; }
.svbp-super .svbp-footer-sub { color: rgba(255,255,255,0.7); }
.svbp-buy { width: 100%; height: 52px; border-radius: 9999px; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }
.svbp-buy-purple { background: linear-gradient(135deg, #7b2ff7, #b366ff); color: #fff; }
.svbp-buy-dark { background: #111; color: #fff; }
.svbp-super .svbp-plan { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); }
.svbp-super .svbp-plan-active { border-color: #fff; background: rgba(255,255,255,0.15); }
.svbp-super .svbp-count { color: #fff; }
.svbp-super .svbp-price { color: rgba(255,255,255,0.9); }
.svbp-super .svbp-best { color: #fff; }
.svbp-super .svbp-save { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); }

.slide-up-enter-active { animation: slideUpAnim 0.3s ease; }
.slide-up-leave-active { animation: slideDownAnim 0.3s ease; }
@keyframes slideUpAnim { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideDownAnim { from { transform: translateY(0); } to { transform: translateY(100%); } }

/* User Detail Page */
.sv-detail-page { position: fixed; inset: 0; z-index: 120; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.svd-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
.svd-name-row { display: flex; align-items: center; gap: 6px; }
.svd-name { font-size: 22px; font-weight: 700; color: #111; }
.svd-verified { width: 20px; height: 20px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }
.svd-down { width: 36px; height: 36px; border-radius: 50%; background: #f0f0f0; font-size: 16px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
.svd-body { flex: 1; overflow-y: auto; }
.svd-photo-area { position: relative; width: 100%; aspect-ratio: 3/4; }
.svd-photo { width: 100%; height: 100%; object-fit: cover; }
.svd-indicators { position: absolute; top: 8px; left: 8px; right: 8px; display: flex; gap: 4px; }
.svd-ind { flex: 1; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.4); }
.svd-ind.active { background: #fff; }
.svd-tap-left { position: absolute; top: 0; left: 0; width: 40%; height: 100%; }
.svd-tap-right { position: absolute; top: 0; right: 0; width: 60%; height: 100%; }
.svd-info { padding: 20px; }
.svd-info-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.svd-info-name { font-size: 26px; font-weight: 700; color: #111; }
.svd-info-age { font-size: 22px; color: #111; }
.svd-info-check { width: 20px; height: 20px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }
.svd-meta { font-size: 14px; color: #666; margin-bottom: 16px; }
.svd-interests { margin-top: 12px; }
.svd-section-title { font-size: 15px; font-weight: 700; color: #111; margin: 0 0 10px; }
.svd-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.svd-tag { padding: 6px 14px; border-radius: 20px; background: #f0f0f0; font-size: 13px; color: #333; }
.svd-actions { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 16px 20px 32px; border-top: 1px solid #f0f0f0; }
</style>
