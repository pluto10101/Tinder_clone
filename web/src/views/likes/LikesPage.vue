<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BottomNavigation from '@/components/layout/BottomNavigation.vue';
import GoldUpgradeModal from '@/components/common/GoldUpgradeModal.vue';
import SuperLikeModal from '@/components/common/SuperLikeModal.vue';

const router = useRouter();
const route = useRoute();

const activeTab = ref<'likes' | 'picks'>('likes');
const showGoldUpgrade = ref(false);
const goldPlanSlide = ref(0);
const showFilterSheet = ref(false);
const filterDistance = ref(161);
const filterAgeMin = ref(18);
const filterAgeMax = ref(100);
const filterMinPhotos = ref(1);
const filterInterests = ref<string[]>(['旅行', '电影', '音乐']);
const filterVerified = ref(false);
const filterHasProfile = ref(false);

const likers = [
  { id: 1, age: 30, verified: true, purpose: '长期交往，但不拒绝短...' },
  { id: 2, age: 21, verified: false, purpose: '最近活跃' },
  { id: 3, age: 28, verified: true, purpose: '长期交往，但不拒绝短...' },
  { id: 4, age: 29, verified: true, purpose: '距离 2 公里' },
  { id: 5, age: 24, verified: true, purpose: '寻找长期的伴侣' },
  { id: 6, age: 22, verified: false, purpose: '最近活跃' },
  { id: 7, age: 26, verified: true, purpose: '距离 5 公里' },
  { id: 8, age: 23, verified: true, purpose: '结交新朋友' },
  { id: 9, age: 27, verified: false, purpose: '今晚有空' },
  { id: 10, age: 25, verified: true, purpose: '长期交往，但不拒绝短...' },
  { id: 11, age: 20, verified: true, purpose: '距离 3 公里' },
  { id: 12, age: 31, verified: false, purpose: '最近活跃' },
];

const picks = [
  { id: 1, name: '中午吃啥', age: 26, photo: 'https://picsum.photos/seed/pk1/300/400', remaining: '9 小时', purpose: '长期交往，但不拒绝短期交往', bio: 'coffee tea or wine\n开朗乐观\n不一定要谈恋爱\n但一定不YP\nISTP', school: '重庆师范大学', distance: 1, interests: ['音乐', '世界和平', '酒吧', '交换项目', '环保主义'], photos: ['https://picsum.photos/seed/pk1/400/600', 'https://picsum.photos/seed/pk1b/400/600', 'https://picsum.photos/seed/pk1c/400/600', 'https://picsum.photos/seed/pk1d/400/600'] },
  { id: 2, name: '旅行者', age: 24, photo: 'https://picsum.photos/seed/pk2/300/400', isCategory: true, purpose: '结交新朋友', bio: '热爱旅行和摄影', school: '', distance: 5, interests: ['旅行', '摄影'], photos: ['https://picsum.photos/seed/pk2/400/600', 'https://picsum.photos/seed/pk2b/400/600'] },
  { id: 3, name: '今晚可以吗', age: 21, photo: 'https://picsum.photos/seed/pk3/300/400', remaining: '剩余', purpose: '今晚有空', bio: '随缘', school: '', distance: 3, interests: ['夜生活', '酒吧'], photos: ['https://picsum.photos/seed/pk3/400/600'] },
  { id: 4, name: 'Eleven', age: 24, photo: 'https://picsum.photos/seed/pk4/300/400', purpose: '长期交往', bio: '健身爱好者', school: '北京大学', distance: 2, interests: ['健身', '音乐'], photos: ['https://picsum.photos/seed/pk4/400/600', 'https://picsum.photos/seed/pk4b/400/600'] },
  { id: 5, name: 'Mia', age: 22, photo: 'https://picsum.photos/seed/pk5/300/400', purpose: '结交新朋友', bio: '喜欢猫咪', school: '', distance: 4, interests: ['猫咪', '阅读'], photos: ['https://picsum.photos/seed/pk5/400/600'] },
  { id: 6, name: '小鱼', age: 25, photo: 'https://picsum.photos/seed/pk6/300/400', purpose: '长期交往', bio: '程序员一枚', school: '清华大学', distance: 6, interests: ['编程', '游戏'], photos: ['https://picsum.photos/seed/pk6/400/600'] },
  { id: 7, name: 'Alex', age: 23, photo: 'https://picsum.photos/seed/pk7/300/400', purpose: '短期交往', bio: '音乐制作人', school: '', distance: 8, interests: ['音乐', '创作'], photos: ['https://picsum.photos/seed/pk7/400/600'] },
  { id: 8, name: '阳光', age: 27, photo: 'https://picsum.photos/seed/pk8/300/400', purpose: '长期交往', bio: '热爱生活', school: '复旦大学', distance: 3, interests: ['美食', '旅行'], photos: ['https://picsum.photos/seed/pk8/400/600'] },
  { id: 9, name: 'Coco', age: 20, photo: 'https://picsum.photos/seed/pk9/300/400', purpose: '结交新朋友', bio: '大学生', school: '浙江大学', distance: 2, interests: ['电影', '咖啡'], photos: ['https://picsum.photos/seed/pk9/400/600'] },
  { id: 10, name: '星辰', age: 26, photo: 'https://picsum.photos/seed/pk10/300/400', purpose: '长期交往', bio: '设计师', school: '', distance: 7, interests: ['设计', '摄影'], photos: ['https://picsum.photos/seed/pk10/400/600'] },
  { id: 11, name: '锁定1', age: 28, photo: 'https://picsum.photos/seed/pk11/300/400', purpose: '', bio: '', school: '', distance: 0, interests: [], photos: ['https://picsum.photos/seed/pk11/400/600'] },
  { id: 12, name: '锁定2', age: 22, photo: 'https://picsum.photos/seed/pk12/300/400', purpose: '', bio: '', school: '', distance: 0, interests: [], photos: ['https://picsum.photos/seed/pk12/400/600'] },
];

const filters = ['附近', '有个人资料', '照片已验证', '旅行', '音乐'];

const goldPlans = [
  { period: '1 周', price: 'US$18.99/周', hot: true, save: '' },
  { period: '1 个月', price: 'US$9.99/周', hot: false, save: '节省 47%' },
  { period: '6 个月', price: 'US$5.83/周', hot: false, save: '节省 69%' },
];

const goldFeatures = [
  { title: '无限点赞', desc: '' },
  { title: '查看给你点赞的人', desc: '' },
  { title: '无限倒回', desc: '' },
  { title: '每月 1 个免费 Boost', desc: '购买一个月或更长时间的订阅，才可享受每月免费的 Boost。' },
  { title: '每周免费 2 个 Super Like', desc: '' },
  { title: '无限位置漫游模式*', desc: '你可以和世界各地的用户配对聊天。*含限制条件。了解更多' },
  { title: '最佳精选', desc: '你可以查看我们每日为你精选的个人资料。' },
  { title: '管理你的个人资料', desc: '仅显示你想公布的信息。' },
  { title: '限制谁可以看到你', desc: '你可以管理谁可以看到你。' },
  { title: '管理你的可见用户', desc: '你可以选择你想要结识哪类用户。' },
  { title: '隐藏广告', desc: '' },
];

function openGold() { showGoldUpgrade.value = true; goldPlanSlide.value = 0; goldScrolledToBottom.value = false; }
function closeGold() {
  showGoldUpgrade.value = false;
  // 返回用户进入前的页面
  if (route.query.openGold === '1') {
    router.back();
  }
}

// 从聊天页跳转过来时自动打开 Gold 付费框
onMounted(() => {
  if (route.query.openGold === '1') {
    openGold();
  }
});

const goldScrolledToBottom = ref(false);
function onGoldScroll(e: Event) {
  const el = e.target as HTMLElement;
  goldScrolledToBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
}

// 滚动检测：滑动满10个卡片后自动弹出付费框
const likesScrollRef = ref<HTMLElement | null>(null);
const hasTriggeredScroll = ref(false);

function onLikesScroll(e: Event) {
  if (hasTriggeredScroll.value || showGoldUpgrade.value) return;
  const el = e.target as HTMLElement;
  if (el.scrollTop > 900) {
    hasTriggeredScroll.value = true;
    openGold();
  }
}

const hasTriggeredPicksScroll = ref(false);
function onPicksScroll(e: Event) {
  if (hasTriggeredPicksScroll.value || showGoldUpgrade.value) return;
  const el = e.target as HTMLElement;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
    hasTriggeredPicksScroll.value = true;
    openGold();
  }
}

// Gold plans touch swipe
let goldTouchStartX = 0;
function goldTouchStart(e: TouchEvent) { goldTouchStartX = e.touches[0].clientX; }
function goldTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - goldTouchStartX;
  if (dx < -50 && goldPlanSlide.value < goldPlans.length - 1) goldPlanSlide.value++;
  else if (dx > 50 && goldPlanSlide.value > 0) goldPlanSlide.value--;
}

// Pick detail view
const showPickDetail = ref(false);
const selectedPick = ref<typeof picks[0] | null>(null);
const pickPhotoIndex = ref(0);

function onPickClick(pick: typeof picks[0], index: number) {
  if (index >= 10) {
    openGold();
    return;
  }
  selectedPick.value = pick;
  pickPhotoIndex.value = 0;
  showPickDetail.value = true;
}
function closePickDetail() { showPickDetail.value = false; selectedPick.value = null; }
function pickPrevPhoto() { if (pickPhotoIndex.value > 0) pickPhotoIndex.value--; }
function pickNextPhoto() { if (selectedPick.value && pickPhotoIndex.value < selectedPick.value.photos.length - 1) pickPhotoIndex.value++; }

const showPickActions = ref(false);

// Super Like 购买页
const showSuperLikePurchase = ref(false);
const slPlanSlide = ref(0);
const superLikePlans = [
  { count: 3, price: 'US$4.33/个', hot: false, save: '' },
  { count: 15, price: 'US$2.59/个', hot: true, save: '节省 40%' },
  { count: 30, price: 'US$1.99/个', hot: false, save: '节省 54%' },
];
function openSuperLike() { showSuperLikePurchase.value = true; slPlanSlide.value = 0; }
function closeSuperLike() { showSuperLikePurchase.value = false; }
let slTouchStartX = 0;
function slTouchStart(e: TouchEvent) { slTouchStartX = e.touches[0].clientX; }
function slTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - slTouchStartX;
  if (dx < -50 && slPlanSlide.value < superLikePlans.length - 1) slPlanSlide.value++;
  else if (dx > 50 && slPlanSlide.value > 0) slPlanSlide.value--;
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1 class="page-title">赞</h1>
    </header>

    <!-- 标签切换 -->
    <div class="tabs">
      <button class="tab" :class="{ active: activeTab === 'likes' }" @click="activeTab = 'likes'">99+ 次赞</button>
      <button class="tab" :class="{ active: activeTab === 'picks' }" @click="activeTab = 'picks'">最佳精选</button>
    </div>

    <!-- 99+ 次赞 -->
    <main v-if="activeTab === 'likes'" class="main likes-main" @scroll="onLikesScroll">
      <!-- 筛选标签 -->
      <div class="filter-row">
        <button class="filter-icon press" @click="showFilterSheet = true">
          <svg class="filter-icon-svg" viewBox="0 0 24 24">
            <circle cx="7" cy="8" r="2.5" />
            <line x1="11" y1="8" x2="19" y2="8" />
            <line x1="5" y1="16" x2="13" y2="16" />
            <circle cx="17" cy="16" r="2.5" />
          </svg>
        </button>
        <div class="filter-tags no-scrollbar">
          <span v-for="f in filters" :key="f" class="filter-tag" @click="openGold">{{ f }}</span>
        </div>
      </div>
      <p class="upgrade-hint">升级至 Gold 来查看给你点赞的人。</p>
      <h3 class="section-label">全部获赞</h3>

      <!-- 模糊卡片网格 -->
      <div class="likes-grid">
        <div v-for="liker in likers" :key="liker.id" class="like-card" @click="openGold">
          <div class="like-blur-area"></div>
          <div class="like-card-info">
            <span class="like-name-blur"></span>
            <span class="like-age">{{ liker.age }}</span>
            <span v-if="liker.verified" class="like-verified">✓</span>
          </div>
          <div class="like-purpose">{{ liker.purpose.startsWith('Q') || liker.purpose.startsWith('长') ? 'Q ' : '● ' }}{{ liker.purpose }}</div>
        </div>
      </div>

      <!-- 底部悬浮黄色按钮 -->
      <div class="gold-cta-float">
        <button class="gold-cta press" @click="openGold">查看给你点赞的人</button>
      </div>
    </main>

    <!-- 最佳精选 -->
    <main v-if="activeTab === 'picks'" class="main picks-main" @scroll="onPicksScroll">
      <p class="picks-hint">升级至 Tinder Gold™ 以获得更多最佳精选！</p>
      <div class="picks-grid">
        <div v-for="(pick, idx) in picks" :key="pick.id" class="pick-card" :class="{ 'pick-locked': idx >= 10 }" @click="onPickClick(pick, idx)">
          <img :src="pick.photo" class="pick-photo" />
          <div v-if="idx >= 10" class="pick-lock-overlay"></div>
          <div class="pick-info">
            <span class="pick-name">{{ pick.name }}</span>
            <span v-if="pick.age" class="pick-age">，{{ pick.age }}</span>
          </div>
          <span v-if="pick.remaining" class="pick-remaining">剩余 {{ pick.remaining }}</span>
          <button class="pick-star press" @click.stop="openSuperLike">★</button>
        </div>
      </div>
      <div class="gold-cta-float">
        <button class="gold-cta press" @click="openGold">解锁所有最佳精选</button>
      </div>
    </main>

    <!-- 精选用户详情页 -->
    <Transition name="slide-up">
      <div v-if="showPickDetail && selectedPick" class="pick-detail-page">
        <header class="pd-header">
          <div class="pd-name-row">
            <span class="pd-name">{{ selectedPick.name }}，{{ selectedPick.age }}</span>
            <span class="pd-gold-badge">💛</span>
          </div>
          <button class="pd-down press" @click="closePickDetail">⬇</button>
        </header>

        <div class="pd-body">
          <!-- 照片区域 -->
          <div class="pd-photo-area">
            <img :src="selectedPick.photos[pickPhotoIndex]" class="pd-photo" />
            <div v-if="selectedPick.photos.length > 1" class="pd-indicators">
              <div v-for="(_, i) in selectedPick.photos" :key="i" class="pd-ind" :class="{ active: i === pickPhotoIndex }"></div>
            </div>
            <div class="pd-tap-left" @click="pickPrevPhoto"></div>
            <div class="pd-tap-right" @click="pickNextPhoto"></div>
          </div>

          <!-- 我想要 -->
          <div v-if="selectedPick.purpose" class="pd-section">
            <div class="pd-section-header"><span>🔍</span> 我想要</div>
            <div class="pd-purpose">😍 {{ selectedPick.purpose }}</div>
          </div>

          <!-- 关于我 -->
          <div v-if="selectedPick.bio" class="pd-section">
            <div class="pd-section-header"><span>❝</span> 关于我 <button class="pd-more press" @click="showPickActions = true">•••</button></div>
            <p class="pd-bio">{{ selectedPick.bio }}</p>
          </div>

          <!-- 关键信息 -->
          <div class="pd-section" v-if="selectedPick.distance || selectedPick.school">
            <div class="pd-section-header"><span>📋</span> 关键信息 <button class="pd-more press" @click="showPickActions = true">•••</button></div>
            <div v-if="selectedPick.distance" class="pd-info-item">📍 {{ selectedPick.distance }}公里以内</div>
            <div v-if="selectedPick.school" class="pd-info-item">🎓 {{ selectedPick.school }}</div>
          </div>

          <!-- 兴趣 -->
          <div v-if="selectedPick.interests.length" class="pd-section">
            <div class="pd-section-header"><span>🎯</span> 兴趣</div>
            <div class="pd-tags">
              <span v-for="tag in selectedPick.interests" :key="tag" class="pd-tag">{{ tag }}</span>
            </div>
          </div>

          <!-- 屏蔽 -->
          <div class="pd-block">屏蔽 {{ selectedPick.name }}</div>
          <div class="pd-report-row">举报 {{ selectedPick.name }}</div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="pd-actions">
          <button class="pd-btn pd-btn-nope press"><span>✕</span></button>
          <button class="pd-btn pd-btn-super press"><span>★</span></button>
          <button class="pd-btn pd-btn-like press"><span>♥</span></button>
        </div>

        <!-- 操作菜单弹窗 -->
        <Transition name="sheet-fade">
          <div v-if="showPickActions" class="pa-mask" @click.self="showPickActions = false">
            <div class="pa-sheet">
              <button class="pa-item press" @click="showPickActions = false">分享</button>
              <button class="pa-item press" @click="showPickActions = false">屏蔽</button>
              <button class="pa-item pa-item-danger press" @click="showPickActions = false">举报 {{ selectedPick?.name }}</button>
              <button class="pa-item pa-cancel press" @click="showPickActions = false">取消</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- 点赞分组筛选面板 -->
    <Transition name="sheet-fade">
      <div v-if="showFilterSheet" class="filter-mask" @click.self="showFilterSheet = false">
        <div class="filter-sheet">
          <div class="filter-sheet-header">
            <button class="filter-sheet-close press" @click="showFilterSheet = false">✕</button>
            <span class="filter-sheet-title">点赞分组</span>
            <div></div>
          </div>
          <div class="filter-sheet-body">
            <!-- 最大距离 -->
            <div class="fs-section">
              <div class="fs-row"><span class="fs-label">最大距离</span><span class="fs-value">{{ filterDistance }}+ 公里</span></div>
              <input type="range" class="fs-slider" v-model.number="filterDistance" min="1" max="161" :style="{ '--pct': ((filterDistance - 1) / 160 * 100) + '%' }" />
            </div>
            <!-- 年龄范围 -->
            <div class="fs-section">
              <div class="fs-row"><span class="fs-label">年龄范围</span><span class="fs-value">{{ filterAgeMin }}-{{ filterAgeMax }}+ 岁</span></div>
              <input type="range" class="fs-slider" v-model.number="filterAgeMax" min="18" max="100" :style="{ '--pct': ((filterAgeMax - 18) / 82 * 100) + '%' }" />
            </div>
            <!-- 最少照片数 -->
            <div class="fs-section">
              <div class="fs-row"><span class="fs-label">最少照片数</span></div>
              <div class="fs-photo-grid">
                <button v-for="n in 9" :key="n" class="fs-photo-btn" :class="{ active: filterMinPhotos === n }" @click="filterMinPhotos = n">{{ n }}</button>
              </div>
            </div>
            <!-- 兴趣 -->
            <div class="fs-section">
              <div class="fs-row"><span class="fs-label">兴趣</span></div>
              <div class="fs-interest-tags">
                <span v-for="tag in filterInterests" :key="tag" class="fs-interest-tag">{{ tag }}</span>
              </div>
              <a href="#" class="fs-link" @click.prevent>查看所有兴趣</a>
            </div>
            <!-- 照片已验证 -->
            <div class="fs-section fs-check-row">
              <span class="fs-label">照片已验证</span>
              <input type="checkbox" class="fs-checkbox" v-model="filterVerified" />
            </div>
            <!-- 有个人资料 -->
            <div class="fs-section fs-check-row">
              <span class="fs-label">有个人资料</span>
              <input type="checkbox" class="fs-checkbox" v-model="filterHasProfile" />
            </div>
          </div>
          <div class="filter-sheet-footer">
            <button class="fs-clear press" @click="filterDistance = 161; filterAgeMin = 18; filterAgeMax = 100; filterMinPhotos = 1; filterVerified = false; filterHasProfile = false">清空</button>
            <button class="fs-apply press" @click="showFilterSheet = false; openGold()">应用</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Tinder Gold 升级页面 -->
    <GoldUpgradeModal v-if="showGoldUpgrade" @close="closeGold" />

    <!-- Super Like 购买页 -->
    <SuperLikeModal v-if="showSuperLikePurchase" @close="closeSuperLike" @open-gold="closeSuperLike(); openGold()" />

    <BottomNavigation theme="light" />
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff; padding-bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom)); }
.page-header { padding: 16px 20px 0; }
.page-title { font-size: 28px; font-weight: 800; color: #111; margin: 0; font-style: italic; }

/* Tabs */
.tabs { display: flex; border-bottom: 1px solid #eee; padding: 0 20px; }
.tab { flex: 1; padding: 14px 0; font-size: 14px; font-weight: 600; color: #999; text-align: center; border-bottom: 2px solid transparent; }
.tab.active { color: #111; border-bottom-color: #111; }

.main { padding: 16px 16px 24px; }

/* Likes main scrollable */
.likes-main { overflow-y: auto; max-height: calc(100vh - 160px); padding-bottom: 80px !important; position: relative; }
.picks-main { overflow-y: auto; max-height: calc(100vh - 160px); padding-bottom: 80px; }

/* Filters */
.filter-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.filter-icon { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; }
.filter-icon-svg { width: 18px; height: 18px; stroke: #666; stroke-width: 2.8; stroke-linecap: round; fill: none; }
.filter-tags { display: flex; gap: 8px; overflow-x: auto; flex: 1; }
.filter-tag { padding: 6px 14px; border-radius: 9999px; border: 1px solid #ddd; font-size: 13px; color: #333; white-space: nowrap; cursor: pointer; }
.upgrade-hint { font-size: 14px; color: #2c2b2bff; margin: 0 0 16px; text-align: center; }
.section-label { font-size: 16px; font-weight: 700; color: #111; margin: 0 0 12px; }

/* Likes Grid */
.likes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.like-card { border-radius: 12px; overflow: hidden; background: #f5f5f5; cursor: pointer; }
.like-blur-area { width: 100%; aspect-ratio: 3/4; background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%); filter: blur(0px); }
.like-card-info { display: flex; align-items: center; gap: 4px; padding: 8px 12px 2px; }
.like-name-blur { width: 40px; height: 12px; border-radius: 4px; background: #ddd; }
.like-age { font-size: 16px; font-weight: 700; color: #111; }
.like-verified { width: 16px; height: 16px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 9px; display: inline-flex; align-items: center; justify-content: center; }
.like-purpose { padding: 2px 12px 10px; font-size: 11px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Gold CTA */
.gold-cta-float { position: sticky; bottom: 0; left: 0; right: 0; padding: -1px 0; z-index: 10; }
.gold-cta { width: 80%; height: 48px; border-radius: 9999px; background: linear-gradient(135deg, #d4a017, #f5c518); color: #111; font-size: 15px; font-weight: 600; display: block; margin: 0 auto; }

/* Picks */
.picks-hint { font-size: 14px; color: #666; text-align: center; margin: 0 0 16px; line-height: 1.5; }
.picks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.pick-card { position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 3/4; }
.pick-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.pick-info { position: absolute; bottom: 8px; left: 10px; display: flex; align-items: baseline; }
.pick-name { font-size: 14px; font-weight: 700; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
.pick-age { font-size: 14px; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
.pick-remaining { position: absolute; bottom: 28px; left: 10px; font-size: 11px; color: #f5c518; font-weight: 600; }
.pick-star { position: absolute; bottom: 8px; right: 9px; width: 32px; height: 32px; border-radius: 70%; background: #fff; color: #42a5f5; font-size: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
.pick-locked { opacity: 0.5; }
.pick-lock-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.4); z-index: 1; }

/* Pick Detail Page */
.pick-detail-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.pd-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
.pd-name-row { display: flex; align-items: center; gap: 8px; }
.pd-name { font-size: 22px; font-weight: 800; color: #111; }
.pd-gold-badge { font-size: 18px; }
.pd-down { width: 36px; height: 36px; border-radius: 50%; background: #111; color: #fff; font-size: 14px; display: flex; align-items: center; justify-content: center; }

.pd-body { flex: 1; overflow-y: auto; }
.pd-photo-area { position: relative; width: 100%; aspect-ratio: 3/4; }
.pd-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.pd-indicators { position: absolute; top: 8px; left: 12px; right: 12px; display: flex; gap: 3px; z-index: 5; }
.pd-ind { flex: 1; height: 3px; border-radius: 2px; background: rgba(0,0,0,0.2); }
.pd-ind.active { background: #111; }
.pd-tap-left { position: absolute; top: 0; left: 0; width: 35%; height: 100%; z-index: 4; }
.pd-tap-right { position: absolute; top: 0; right: 0; width: 65%; height: 100%; z-index: 4; }

.pd-section { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.pd-section-header { font-size: 13px; color: #888; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.pd-more { margin-left: auto; font-size: 14px; color: #999; }
.pd-purpose { font-size: 15px; color: #111; padding: 10px 14px; background: #f8f8f8; border-radius: 10px; }
.pd-bio { font-size: 14px; color: #333; line-height: 1.6; margin: 0; white-space: pre-line; }
.pd-info-item { font-size: 14px; color: #333; margin-bottom: 6px; }
.pd-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.pd-tag { padding: 6px 14px; border-radius: 9999px; border: 1px solid #ddd; font-size: 13px; color: #333; }
.pd-block { text-align: center; padding: 16px 20px; font-size: 15px; font-weight: 600; color: #111; }
.pd-report-row { text-align: center; padding: 0 20px 20px; font-size: 15px; font-weight: 600; color: #f2385a; }

.pd-actions { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 14px 0; border-top: 1px solid #f0f0f0; background: #fff; }
.pd-btn { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid; font-size: 24px; }
.pd-btn-nope { border-color: #f2385a; color: #f2385a; }
.pd-btn-super { border-color: #42a5f5; color: #42a5f5; }
.pd-btn-like { border-color: #4cdc8f; color: #4cdc8f; }

/* Pick Actions Sheet */
.pa-mask { position: fixed; inset: 0; z-index: 110; background: rgba(0,0,0,0.4); display: flex; align-items: flex-end; justify-content: center; }
.pa-sheet { width: calc(100% - 16px); max-width: 460px; margin-bottom: 8px; display: flex; flex-direction: column; gap: 1px; }
.pa-item { width: 100%; padding: 16px; font-size: 16px; font-weight: 500; color: #111; text-align: center; background: #fff; border-bottom: 1px solid #f0f0f0; }
.pa-item:first-child { border-radius: 14px 14px 0 0; }
.pa-item:nth-child(3) { border-radius: 0 0 14px 14px; border-bottom: none; }
.pa-item-danger { color: #f2385a; }
.pa-cancel { margin-top: 8px; border-radius: 14px; font-weight: 600; border-bottom: none; }

/* Gold Upgrade Page */
.gold-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.gold-header { display: flex; align-items: center; justify-content: center; padding: 16px 20px; position: relative; }
.gold-close { position: absolute; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; }
.gold-brand { font-size: 18px; }
.gold-brand-text { font-weight: 700; font-style: italic; color: #111; }
.gold-badge { background: linear-gradient(135deg, #d4a017, #f5c518); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; font-style: normal; margin-left: 4px; }

.gold-body { flex: 1; overflow-y: auto; padding: 0 24px 24px; }
.gold-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.4; }
.gold-subtitle { font-size: 14px; color: #666; margin: 0 0 16px; }

/* Plans Carousel */
.gold-plans-carousel { overflow: hidden; margin-bottom: 12px; }
.gold-plans-track { display: flex; gap: 12px; transition: transform 0.3s ease; padding: 0 4px; }
.gold-plan { min-width: 60%; padding: 18px; border-radius: 12px; border: 1.5px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; position: relative; flex-shrink: 0; }
.gold-plan-active { border-color: #d4a017; }
.gp-hot { font-size: 11px; color: #d4a017; font-weight: 600; }
.gp-best { font-size: 11px; color: #d4a017; font-weight: 600; }
.gp-period { font-size: 24px; font-weight: 800; color: #111; }
.gp-price { font-size: 13px; color: #666; }
.gp-save { display: inline-block; padding: 3px 8px; border-radius: 6px; background: #f0f0f0; font-size: 11px; color: #333; font-weight: 600; margin-top: 4px; }
.gp-check { position: absolute; top: 14px; right: 14px; color: #d4a017; font-size: 18px; }

.gold-dots { display: flex; gap: 8px; justify-content: center; margin: 12px 0 24px; }
.gold-dot { width: 8px; height: 8px; border-radius: 50%; background: #ddd; cursor: pointer; }
.gold-dot.active { background: #111; }

/* Features */
.gold-features { border: 1px solid #eee; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.gold-features-title { font-size: 13px; color: #666; text-align: center; margin-bottom: 16px; border: 1px solid #eee; border-radius: 8px; padding: 6px 14px; display: inline-block; }
.gf-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
.gf-check { color: #111; font-size: 16px; margin-top: 2px; font-weight: 700; }
.gf-content { flex: 1; }
.gf-content strong { font-size: 14px; color: #111; display: block; margin-bottom: 2px; }
.gf-content p { font-size: 12px; color: #888; margin: 0; line-height: 1.4; }

.gold-disclaimer { font-size: 11px; color: #999; line-height: 1.5; margin: 0; }
.gold-disclaimer a { color: #42a5f5; text-decoration: underline; }

/* Footer */
.gold-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid #eee; background: #fff; }
.gold-footer-info { display: flex; align-items: center; gap: 8px; }
.gold-footer-icon { font-size: 20px; }
.gold-footer-text { display: flex; flex-direction: column; }
.gold-footer-period { font-size: 13px; font-weight: 600; color: #111; }
.gold-footer-price { font-size: 11px; color: #666; }
.gold-buy-btn { padding: 12px 28px; border-radius: 9999px; background: linear-gradient(135deg, #d4a017, #f5c518); color: #111; font-size: 15px; font-weight: 700; }
.gold-buy-full { width: 100%; height: 52px; border-radius: 9999px; background: linear-gradient(135deg, #d4a017, #f5c518); color: #111; font-size: 16px; font-weight: 700; }

/* Transitions */
.slide-up-enter-active { animation: slideUp 0.3s ease; }
.slide-up-leave-active { animation: slideDown 0.3s ease; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }

/* Filter Sheet */
.filter-mask { position: fixed; inset: 0; z-index: 90; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; }
.filter-sheet { width: 100%; max-width: 480px; max-height: 90vh; background: #fff; border-radius: 24px 24px 0 0; display: flex; flex-direction: column; overflow: hidden; animation: sheetUp 0.3s ease; }
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.filter-sheet-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.filter-sheet-close { width: 28px; height: 28px; font-size: 16px; color: #111; }
.filter-sheet-title { font-size: 15px; font-weight: 600; color: #111; }
.filter-sheet-body { flex: 1; overflow-y: auto; padding: 20px; }

.fs-section { padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; }
.fs-section:last-child { border-bottom: none; margin-bottom: 0; }
.fs-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.fs-label { font-size: 15px; font-weight: 600; color: #111; }
.fs-value { font-size: 14px; color: #111; font-weight: 500; }
.fs-slider { width: 100%; height: 22px; appearance: none; background: transparent; outline: none; }
.fs-slider::-webkit-slider-runnable-track { height: 4px; background: linear-gradient(90deg, #FD297B 0%, #FD297B var(--pct, 50%), #eee var(--pct, 50%), #eee 100%); border-radius: 2px; }
.fs-slider::-webkit-slider-thumb { appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #FD297B; cursor: pointer; margin-top: -9px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }

.fs-photo-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.fs-photo-btn { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid #ddd; font-size: 14px; font-weight: 600; color: #333; display: flex; align-items: center; justify-content: center; background: #fff; }
.fs-photo-btn.active { border-color: #FD297B; color: #FD297B; background: rgba(253,41,123,0.05); }

.fs-interest-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.fs-interest-tag { padding: 6px 14px; border-radius: 9999px; border: 1px solid #ddd; font-size: 13px; color: #333; }
.fs-link { font-size: 13px; color: #FD297B; font-weight: 600; text-decoration: none; }

.fs-check-row { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; }
.fs-checkbox { width: 20px; height: 20px; accent-color: #FD297B; }

.filter-sheet-footer { display: flex; border-top: 1px solid #f0f0f0; }
.fs-clear { flex: 1; padding: 18px; font-size: 15px; font-weight: 600; color: #111; text-align: center; }
.fs-apply { flex: 1; padding: 18px; font-size: 15px; font-weight: 600; color: #FD297B; text-align: center; }

.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.2s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }

/* Super Like Purchase Page */
.sl-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.sl-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
.sl-close { width: 32px; height: 32px; font-size: 18px; color: #111; }
.sl-header-title { font-size: 15px; font-weight: 600; color: #42a5f5; }
.sl-body { flex: 1; overflow-y: auto; padding: 0 24px 32px; }
.sl-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.4; }
.sl-subtitle { font-size: 14px; color: #666; margin: 0 0 16px; }

.sl-plans-carousel { overflow: hidden; margin-bottom: 12px; }
.sl-plans-track { display: flex; gap: 12px; transition: transform 0.3s ease; }
.sl-plan { min-width: 75%; padding: 20px; border-radius: 12px; border: 1.5px solid #e8e8e8; display: flex; flex-direction: column; gap: 8px; position: relative; flex-shrink: 0; }
.sl-plan:last-child { margin-right: 0; }
.sl-plan-active { border-color: #42a5f5; }
.sl-hot { font-size: 11px; color: #42a5f5; font-weight: 600; min-height: 16px; }
.sl-best { font-size: 11px; color: #42a5f5; font-weight: 600; min-height: 16px; }
.sl-count { font-size: 22px; font-weight: 800; color: #111; }
.sl-price-row { display: flex; align-items: center; gap: 8px; }
.sl-price { font-size: 14px; color: #666; }
.sl-save { padding: 3px 8px; border-radius: 6px; background: #f0f0f0; font-size: 11px; color: #333; font-weight: 600; }
.sl-select-btn { width: 100%; height: 44px; border-radius: 9999px; background: #42a5f5; color: #fff; font-size: 15px; font-weight: 600; margin-top: 8px; }

.sl-dots { display: flex; gap: 8px; justify-content: center; margin: 12px 0 24px; }
.sl-dot { width: 8px; height: 8px; border-radius: 50%; background: #ddd; cursor: pointer; }
.sl-dot.active { background: #111; }

.sl-divider { text-align: center; margin: 16px 0; position: relative; }
.sl-divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee; }
.sl-divider span { position: relative; background: #fff; padding: 0 12px; font-size: 13px; color: #999; }

.sl-gold-hint { border: 1px solid #eee; border-radius: 12px; padding: 16px; }
.sl-gold-text { font-size: 13px; color: #666; text-align: center; margin: 0 0 12px; }
.sl-gold-row { display: flex; align-items: center; justify-content: space-between; }
.sl-gold-label { font-size: 14px; font-weight: 600; color: #111; }
.sl-gold-btn { padding: 8px 16px; border-radius: 9999px; border: 1.5px solid #111; font-size: 13px; font-weight: 600; color: #111; }
</style>
