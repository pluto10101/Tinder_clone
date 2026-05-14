<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BottomNavigation from '@/components/layout/BottomNavigation.vue';
import GoldUpgradeModal from '@/components/common/GoldUpgradeModal.vue';

const router = useRouter();
const showGoldUpgrade = ref(false);
const showSafetySheet = ref(false);
const showReportSheet = ref(false);
const showSafetySettings = ref(false);
const showSafetyCenter = ref(false);
const safetyCenterTab = ref<'guide' | 'tools' | 'resources'>('guide');
const showFriendsPage = ref(false);
const showFriendsShare = ref(false);
const showFriendsGroupInfo = ref(false);
const showFriendsGroupSettings = ref(false);
const fgSettingShowInfo = ref(true);
const fgSettingShowFriends = ref(true);
const fgSettingShowProfile = ref(true);
const goldPlanSlide = ref(0);
const goldScrolledToBottom = ref(false);
const photoVerifyEnabled = ref(false);
const searchQuery = ref('');

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
  { title: '无限位置漫游模式*', desc: '你可以和世界各地的用户配对聊天。*含限制条件。' },
  { title: '最佳精选', desc: '你可以查看我们每日为你精选的个人资料。' },
  { title: '管理你的个人资料', desc: '仅显示你想公布的信息。' },
  { title: '限制谁可以看到你', desc: '你可以管理谁可以看到你。' },
  { title: '管理你的可见用户', desc: '你可以选择你想要结识哪类用户。' },
  { title: '隐藏广告', desc: '' },
];

function openGold() { showGoldUpgrade.value = true; goldPlanSlide.value = 0; goldScrolledToBottom.value = false; }

function onGoldScroll(e: Event) {
  const el = e.target as HTMLElement;
  goldScrolledToBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
}

let goldTouchStartX = 0;
function goldTouchStart(e: TouchEvent) { goldTouchStartX = e.touches[0].clientX; }
function goldTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - goldTouchStartX;
  if (dx < -50 && goldPlanSlide.value < goldPlans.length - 1) goldPlanSlide.value++;
  else if (dx > 50 && goldPlanSlide.value > 0) goldPlanSlide.value--;
}

const newMatches = [
  { id: 'likes', name: '赞', photo: '', isLikes: true, count: '99+', online: false, verified: false },
  { id: 'm1', name: '怕有人徘徊', photo: 'https://picsum.photos/seed/cm1/200/280', online: false, verified: false },
  { id: 'm2', name: 'koi', photo: 'https://picsum.photos/seed/cm2/200/280', online: true, verified: true },
  { id: 'm3', name: 'Ferris', photo: 'https://picsum.photos/seed/cm3/200/280', online: true, verified: true },
];

const filteredMatches = computed(() => {
  if (!searchQuery.value.trim()) return newMatches;
  const q = searchQuery.value.trim().toLowerCase();
  return newMatches.filter(m => m.name.toLowerCase().includes(q));
});

const messages = [
  { id: 'msg1', name: '超人', photo: 'https://picsum.photos/seed/msg1/100/100', preview: '近期活跃，马上配对！', isBlurred: true, tag: 'LIKES YOU', verified: false, isTinder: false, badge: '' },
  { id: 'msg2', name: 'Tinder 团队', photo: '', preview: '大家都想看到你多样的一面哦，快添加更...', isBlurred: false, tag: '', verified: true, isTinder: true, badge: '' },
  { id: 'msg3', name: '麦片爱吃肉', photo: 'https://picsum.photos/seed/msg3/100/100', preview: '好可爱可以认识咩', isBlurred: false, tag: '', verified: true, isTinder: false, badge: '等你回应' },
];

function onMatchClick(match: typeof newMatches[0]) {
  if (match.isLikes) { openGold(); return; }
  router.push({ name: 'chat-conversation', params: { id: match.id } });
}

function onMessageClick(msg: typeof messages[0]) {
  if (msg.isBlurred) { openGold(); return; }
  router.push({ name: 'chat-conversation', params: { id: msg.id } });
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1 class="page-title">聊天</h1>
      <div class="header-icons">
        <button class="header-icon press" @click="showSafetySheet = true">
          <svg class="header-svg" width="26" height="26" viewBox="0 0 32 32">
            <path d="M16 4L6 8v10c0 6.5 4.5 12 10 13.5 5.5-1.5 10-7 10-13.5V8L16 4z"/>
            <path d="M22 9.5c2.5 3 3 8.5 0 12.5 1.5-3.5 1.5-9 0-12.5z" fill="white" opacity="0.9"/>
          </svg>
        </button>
        <button class="header-icon press" @click="showFriendsPage = true">
          <svg class="header-svg" width="30" height="30" viewBox="0 0 36 36">
            <circle cx="25" cy="11" r="9" opacity="0.5" />
            <circle cx="11" cy="22" r="11" />
            <path d="M6 21.5c0 0 0.5 5.5 5 5.5s5-5.5 5-5.5H6z" fill="white" />
          </svg>
        </button>
      </div>
    </header>

    <div class="search-bar">
      <svg class="search-svg" width="22" height="22" viewBox="0 0 24 24">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <input class="search-input" v-model="searchQuery" :placeholder="`搜索 ${newMatches.length} 个配对`" />
    </div>

    <!-- 新的配对（长方形卡片） -->
    <section class="matches-section">
      <h3 class="section-title">新的配对</h3>
      <div class="matches-scroll no-scrollbar">
        <div v-for="match in filteredMatches" :key="match.id" class="match-card" @click="onMatchClick(match)">
          <div class="match-card-inner" :class="{ 'match-likes-card': match.isLikes }">
            <img v-if="!match.isLikes" :src="match.photo" class="match-card-img" />
            <template v-else>
              <div class="likes-metal-card">
                <div class="likes-count-badge">{{ match.count }}</div>
              </div>
              <div class="likes-bottom-icon">
                <div class="likes-speed-lines">
                  <div class="likes-line likes-l1"></div>
                  <div class="likes-line likes-l2"></div>
                  <div class="likes-line likes-l3"></div>
                </div>
                <svg class="likes-heart-svg" viewBox="0 0 24 24">
                  <defs><linearGradient id="likesGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff2b2"/><stop offset="100%" stop-color="#fcc331"/></linearGradient></defs>
                  <path fill="url(#likesGoldGrad)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </template>
            <span v-if="match.online" class="match-online-dot"></span>
          </div>
          <span class="match-card-name">
            {{ match.name }}
            <span v-if="match.verified" class="match-card-verified">✓</span>
          </span>
        </div>
      </div>
    </section>

    <!-- 消息列表 -->
    <section class="messages-section">
      <h3 class="section-title">消息</h3>
      <div class="message-list">
        <div v-for="msg in messages" :key="msg.id" class="message-item" @click="onMessageClick(msg)">
          <div class="msg-avatar" :class="{ 'msg-blurred': msg.isBlurred }">
            <img v-if="!msg.isTinder" :src="msg.photo" class="msg-img" />
            <div v-else class="tinder-avatar">
              <svg class="tinder-flame-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path fill="#fff" fill-rule="evenodd" d="M514 924.9l-3.1-0.2c-157-0.4-284.7-128.2-284.7-285.4 0-5.4 0-10.9 0.4-16.3 4.6-159.4 84.2-202.4 93.3-206.8 10-4.9 22.1-4.8 32.3 0.6 10.2 5.4 17.1 15.3 18.8 26.6 0.1 0.6 7.8 46.6 32.2 71.4 1.3-36.1 5-79.3 15-119.1 20.1-79.2 77.4-162.1 146-211.2 10.9-7.9 25.2-8.9 37.3-2.7 12 6.2 19.4 18.4 19.4 31.8 0 61.5 31 103.3 70.3 156.1 44.9 60.5 95.8 128.9 104.3 240.1v0.1c0.2 2.2 1.6 21.5 1.6 29.4 0 156.1-126.3 283.6-282.1 285.3l-1 0.3zM330.8 459.2c-17.4 13.2-58.9 56-62.1 165.8-0.3 5.2-0.3 9.8-0.3 14.4 0 134 109.1 243.1 243.1 243.1h0.6C645.9 882 754.7 773 754.7 639.3c0-4.8-0.9-18.6-1.4-26.3-7.6-99-54.6-162.2-96-218-38.3-51.4-74.4-100-78.4-168.7-56.6 44.3-103 113.6-119.8 179.8-12.4 49.3-14.2 105.7-14.5 143.8l-0.2 26-25.4-5.4c-61.6-13.3-82.5-84.8-88.2-111.3z m258-240.4z"/>
                <path fill="#fff" fill-rule="evenodd" d="M529.2 831.6c-11 0-20.3-8.5-21.1-19.6-0.8-11.6 7.9-21.8 19.6-22.6 50.9-3.7 94.1-39.2 107.6-88.4 3.1-11.3 14.8-17.9 26-14.8 11.3 3.1 17.9 14.7 14.8 26-18.2 66.5-76.6 114.4-145.3 119.4h-1.6z"/>
              </svg>
            </div>
          </div>
          <div class="msg-content">
            <div class="msg-name-row">
              <span class="msg-name">{{ msg.name }}</span>
              <span v-if="msg.tag" class="msg-tag">{{ msg.tag }}</span>
              <span v-if="msg.verified" class="msg-verified">✓</span>
            </div>
            <p class="msg-preview">{{ msg.preview }}</p>
          </div>
          <span v-if="msg.badge" class="msg-badge">{{ msg.badge }}</span>
        </div>
      </div>
    </section>

    <!-- 安全工具包底部面板 -->
    <Transition name="sheet-fade">
      <div v-if="showSafetySheet" class="sheet-mask" @click.self="showSafetySheet = false">
        <div class="safety-sheet">
          <div class="sheet-handle"></div>
          <h2 class="safety-title">安全工具包</h2>
          <div class="safety-list">
            <div class="safety-item" @click="showSafetySheet = false; showReportSheet = true;">
              <span class="safety-icon"><svg class="safety-svg-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#E8E8E8"/><path d="M438.4 153.6l-17.6 3.2c-97.6 22.4-168-3.2-203.2-22.4V496c49.6 46.4 144 51.2 289.6 17.6 137.6-32 283.2 17.6 337.6 40h1.6V164.8c-179.2-62.4-291.2-36.8-408-11.2z" fill="#F2385A"/><path d="M865.6 139.2C672 68.8 548.8 96 430.4 123.2l-17.6 3.2c-90.208 19.552-153.568-4.704-183.44-20.976 16.768-9.856 28.144-27.872 28.144-48.72C257.504 25.392 232.112 0 200.8 0S144.096 25.392 144.096 56.704c0 25.424 16.848 46.688 39.904 53.872V1024h32V536c60.8 38.4 160 40 297.6 8 158.4-36.8 337.6 46.4 339.2 46.4l22.4 11.2V142.4l-9.6-3.2z m-19.2 414.4h-1.6c-54.4-22.4-200-72-337.6-40-145.6 33.6-240 28.8-289.6-17.6V134.4c35.2 19.2 105.6 44.8 203.2 22.4l17.6-3.2c116.8-25.6 228.8-51.2 408 11.2v388.8z" fill=""/><path d="M200.8 56.704m-23.872 0a23.872 23.872 0 1 0 47.744 0 23.872 23.872 0 1 0-47.744 0Z" fill="#F2385A"/></svg></span>
              <div class="safety-text">
                <strong>举报</strong>
                <p>举报已取消配对的对象，或举报在欧盟地区被视为违法的内容。</p>
              </div>
            </div>
            <div class="safety-item" @click="showSafetySheet = false; showSafetySettings = true;">
              <span class="safety-icon">⚙️</span>
              <div class="safety-text">
                <strong>更新安全设置</strong>
                <p>开启旨在让你在 Tinder 之旅中倍有安全感的功能吧。</p>
              </div>
            </div>
            <div class="safety-item" @click="showSafetySheet = false; showSafetyCenter = true;">
              <span class="safety-icon">🛡️</span>
              <div class="safety-text">
                <strong>访问安全中心</strong>
                <p>你的体验至关重要。请在此处查找安全资源和工具。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 举报半弹窗 -->
    <Transition name="sheet-fade">
      <div v-if="showReportSheet" class="sheet-mask" @click.self="showReportSheet = false">
        <div class="report-sheet">
          <div class="report-sheet-header">
            <button class="report-sheet-close press" @click="showReportSheet = false">✕</button>
            <h2 class="report-sheet-title">举报</h2>
          </div>
          <div class="report-sheet-body">
            <div class="report-tip-card">
              <div class="report-tip-header">
                <span class="report-tip-icon">🛡️</span>
                <span class="report-tip-title">应用内举报提示</span>
              </div>
              <p class="report-tip-text">在 Tinder 应用内，你可以在某人的个人资料中点击三点图标进行举报，或在你们的聊天信息页中点击安全盾牌图标。此外你还可以点击并长按某条信息进行举报。</p>
            </div>
            <p class="report-section-title">如要通过我们的帮助中心举报其他情况，请在下方选择举报类别：</p>
            <div class="report-options">
              <div class="report-option">
                <span class="report-option-text">已取消配对的对象对你造成了人身伤害</span>
                <span class="report-option-arrow">↗</span>
              </div>
              <div class="report-option">
                <span class="report-option-text">已取消配对的对象骚扰或伤害了你</span>
                <span class="report-option-arrow">↗</span>
              </div>
              <div class="report-option">
                <span class="report-option-text">在欧洲经济区被视为违法的内容</span>
                <span class="report-option-arrow">↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 安全设置页面 -->
    <Transition name="slide-up">
      <div v-if="showSafetySettings" class="safety-settings-page">
        <header class="safety-settings-header">
          <button class="safety-settings-back press" @click="showSafetySettings = false">←</button>
          <h2 class="safety-settings-title">安全设置</h2>
        </header>
        <div class="safety-settings-body">
          <h3 class="safety-settings-section-title">管理信息接收</h3>
          <div class="safety-settings-card">
            <div class="safety-settings-card-content">
              <strong class="safety-settings-card-title">通过照片验证才可聊天</strong>
              <p class="safety-settings-card-desc">通过照片验证的会员可以启用此功能，仅接收已验证会员发来的信息。</p>
            </div>
            <div class="safety-toggle" :class="{ 'safety-toggle-on': photoVerifyEnabled }" @click="photoVerifyEnabled = !photoVerifyEnabled">
              <div class="safety-toggle-handle">
                <span class="safety-toggle-check" v-if="photoVerifyEnabled">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 安全中心页面 -->
    <Transition name="slide-up">
      <div v-if="showSafetyCenter" class="sc-page">
        <header class="sc-header">
          <button class="sc-close press" @click="showSafetyCenter = false">✕</button>
          <h2 class="sc-title">安全中心</h2>
        </header>
        <!-- Tabs -->
        <div class="sc-tabs">
          <button class="sc-tab" :class="{ 'sc-tab-active': safetyCenterTab === 'guide' }" @click="safetyCenterTab = 'guide'">指南</button>
          <button class="sc-tab" :class="{ 'sc-tab-active': safetyCenterTab === 'tools' }" @click="safetyCenterTab = 'tools'">工具</button>
          <button class="sc-tab" :class="{ 'sc-tab-active': safetyCenterTab === 'resources' }" @click="safetyCenterTab = 'resources'">资源</button>
        </div>

        <!-- 指南 Tab -->
        <div v-if="safetyCenterTab === 'guide'" class="sc-body">
          <!-- 问候 -->
          <div class="sc-greeting">
            <div class="sc-greeting-text">
              <h2 class="sc-greeting-title">嗨 Yuny</h2>
              <p class="sc-greeting-desc">以下是你需要了解的一些安全贴士</p>
            </div>
            <img src="https://picsum.photos/seed/scavatar/60/60" class="sc-greeting-avatar" />
          </div>

          <!-- Reporting -->
          <h3 class="sc-section-title">Reporting</h3>
          <div class="sc-card sc-card-with-icon">
            <div class="sc-card-icon sc-icon-report">📋</div>
            <div class="sc-card-content">
              <strong>What to report</strong>
              <p>When you should report someone and when you shouldn't.</p>
            </div>
            <span class="sc-arrow">›</span>
          </div>
          <div class="sc-card-simple">
            <span>How to report someone</span>
            <span class="sc-arrow">›</span>
          </div>
          <div class="sc-card-simple">
            <span>What happens after I report?</span>
            <span class="sc-arrow">›</span>
          </div>

          <!-- The Trevor Project -->
          <h3 class="sc-section-title sc-section-title-lg">The Trevor Project LGBTQIA+ Guides</h3>
          <div class="sc-card sc-card-with-icon">
            <div class="sc-card-icon sc-icon-pride">🌈</div>
            <div class="sc-card-content">
              <strong>Coming Out & Other LGBTQIA+ Resources</strong>
              <p>You are never, ever alone.</p>
            </div>
            <span class="sc-arrow">›</span>
          </div>

          <!-- 健康约会101 -->
          <h3 class="sc-section-title">健康约会101</h3>
          <div class="sc-card sc-card-with-icon">
            <div class="sc-card-icon sc-icon-binoculars">🔭</div>
            <div class="sc-card-content">
              <strong>细心去感受</strong>
              <p>即使在发生性行为之前或没有发生性行为时，同意在每个阶段都非常重要。</p>
            </div>
            <span class="sc-arrow">›</span>
          </div>
          <div class="sc-card-simple">
            <span>线下见面</span>
            <span class="sc-arrow">›</span>
          </div>
          <div class="sc-card-simple">
            <span>深入了解</span>
            <span class="sc-arrow">›</span>
          </div>

          <!-- Harassment -->
          <h3 class="sc-section-title">Harassment</h3>
          <div class="sc-card sc-card-with-icon">
            <div class="sc-card-icon sc-icon-chat">💬</div>
            <div class="sc-card-content">
              <strong>How to deal</strong>
              <p>If you see something, say something.</p>
            </div>
            <span class="sc-arrow">›</span>
          </div>
          <div class="sc-card-simple">
            <span>7 times it's perfectly acceptable to ghost someone</span>
            <span class="sc-arrow">›</span>
          </div>

          <!-- Safety -->
          <h3 class="sc-section-title">Safety</h3>
          <div class="sc-card sc-card-with-icon">
            <div class="sc-card-icon sc-icon-lock">🔒</div>
            <div class="sc-card-content">
              <strong>The basics</strong>
              <p>What you need to know to be safer on Tinder and IRL — all in one place.</p>
            </div>
            <span class="sc-arrow">›</span>
          </div>
          <div class="sc-card-simple sc-card-quiz">
            <span class="sc-quiz-badge">测验</span>
            <span>Online Dating Safety Quiz</span>
            <span class="sc-arrow">›</span>
          </div>
          <div class="sc-card-simple sc-card-quiz">
            <span class="sc-quiz-badge">测验</span>
            <span>Tinder Community Guidelines Quiz</span>
            <span class="sc-arrow">›</span>
          </div>

          <!-- In real life -->
          <h3 class="sc-section-title">In real life</h3>
          <div class="sc-card sc-card-with-icon">
            <div class="sc-card-icon sc-icon-hearts">💕</div>
            <div class="sc-card-content">
              <strong>Your IRL Guide</strong>
              <p>Tips to help you be safer IRL (even though we wish you didn't have to).</p>
            </div>
            <span class="sc-arrow">›</span>
          </div>
          <div class="sc-card-simple sc-card-quiz">
            <span class="sc-quiz-badge">测验</span>
            <span>IRL Safety 101 Quiz</span>
            <span class="sc-arrow">›</span>
          </div>

          <!-- Consent -->
          <h3 class="sc-section-title">Consent</h3>
          <div class="sc-card sc-card-with-icon">
            <div class="sc-card-icon sc-icon-consent">💗</div>
            <div class="sc-card-content">
              <strong>Consent 101</strong>
              <p>It's a necessary part of any connection and we're here to give you a crash course.</p>
            </div>
            <span class="sc-arrow">›</span>
          </div>

          <!-- Travel -->
          <h3 class="sc-section-title">Travel</h3>
          <div class="sc-card sc-card-with-icon">
            <div class="sc-card-icon sc-icon-travel">✈️</div>
            <div class="sc-card-content">
              <strong>The do's and don'ts</strong>
              <p>Tips for staying safe while traveling and using Tinder abroad.</p>
            </div>
            <span class="sc-arrow">›</span>
          </div>
        </div>

        <!-- 工具 Tab -->
        <div v-if="safetyCenterTab === 'tools'" class="sc-body">
          <!-- Tinder x BrightCheck -->
          <div class="sc-tools-section">
            <div class="sc-tools-phone-mockup">
              <div class="sc-tools-phone-screen">
                <div class="sc-phone-profile">
                  <div class="sc-phone-photo"></div>
                  <div class="sc-phone-info">
                    <span class="sc-phone-name">Richard Thompson</span>
                    <span class="sc-phone-verified-badge">✓ Verified</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 class="sc-tools-title">Tinder x BrightCheck</h3>
            <p class="sc-tools-desc">Tinder is working with IBrightCheck to encourage a safer online dating experience for everyone with two free search credits.</p>
          </div>

          <!-- How to report -->
          <div class="sc-tools-section">
            <div class="sc-tools-phone-mockup sc-tools-phone-sm">
              <div class="sc-tools-phone-screen sc-phone-report">
                <span class="sc-phone-report-icon">⚠️</span>
                <span class="sc-phone-report-text">举报</span>
              </div>
            </div>
            <h3 class="sc-tools-title">How to report</h3>
            <p class="sc-tools-desc">Reporting is a safe way to let us know that someone is acting inappropriately.</p>
          </div>

          <!-- Privacy settings -->
          <div class="sc-tools-section">
            <div class="sc-tools-phone-mockup sc-tools-phone-sm">
              <div class="sc-tools-phone-screen sc-phone-privacy">
                <span class="sc-phone-tinder-logo">🔥 tinder</span>
                <span class="sc-phone-privacy-text">你的隐私设置已更新</span>
              </div>
            </div>
            <h3 class="sc-tools-title">Privacy settings</h3>
            <p class="sc-tools-desc">Customize your experience with these privacy features and settings.</p>
          </div>

          <!-- How to unmatch -->
          <div class="sc-tools-section">
            <h3 class="sc-tools-title">How to unmatch</h3>
            <p class="sc-tools-desc">Whether you realize you just aren't that interested or your match starts acting inappropriately, you can always unmatch them.</p>
          </div>

          <!-- How to get Photo Verified -->
          <div class="sc-tools-section">
            <div class="sc-tools-verified-icon">
              <span class="sc-verified-check">✓</span>
            </div>
            <h3 class="sc-tools-title">How to get Photo Verified</h3>
            <p class="sc-tools-desc">The best way to know someone isn't too good to be true.</p>
          </div>
        </div>

        <!-- 资源 Tab -->
        <div v-if="safetyCenterTab === 'resources'" class="sc-body">
          <!-- ThroughLine -->
          <div class="sc-resource-item">
            <div class="sc-resource-logo sc-resource-throughline">🌀 <strong>ThroughLine</strong></div>
            <p class="sc-resource-desc">ThroughLine 可为您提供免费、保密的心理健康热线支持，或在您遭遇创伤事件时提供支持。注意：帮助热线是独立服务，与 Tinder 无关。</p>
            <button class="sc-resource-btn">访问网站</button>
          </div>

          <!-- Black Emotional and Mental Health Collective -->
          <div class="sc-resource-item">
            <div class="sc-resource-logo sc-resource-beam">BEAM</div>
            <p class="sc-resource-name">Black Emotional and Mental Health Collective</p>
            <button class="sc-resource-btn">访问网站</button>
          </div>

          <!-- NSVRC -->
          <div class="sc-resource-item">
            <div class="sc-resource-logo sc-resource-nsvrc"><strong>NSVRC</strong></div>
            <p class="sc-resource-name">National Sexual Violence Resource Center</p>
            <p class="sc-resource-phone">📞 1-877-739-3895</p>
            <button class="sc-resource-btn">访问网站</button>
          </div>

          <!-- It's On Us -->
          <div class="sc-resource-item">
            <div class="sc-resource-logo sc-resource-itsonus"><strong>It's On Us</strong></div>
            <p class="sc-resource-name">It's On Us</p>
            <button class="sc-resource-btn">访问网站</button>
          </div>

          <!-- Building Healthy Online Communities -->
          <div class="sc-resource-item">
            <p class="sc-resource-name"><strong>Building Healthy Online Communities</strong></p>
            <button class="sc-resource-btn">访问网站</button>
          </div>

          <!-- MeToo -->
          <div class="sc-resource-item">
            <p class="sc-resource-name"><strong>MeToo</strong></p>
            <button class="sc-resource-btn">访问网站</button>
          </div>

          <!-- No More -->
          <div class="sc-resource-item">
            <p class="sc-resource-name"><strong>No More</strong></p>
            <button class="sc-resource-btn">访问网站</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 老友记页面 -->
    <Transition name="slide-up">
      <div v-if="showFriendsPage" class="friends-page">
        <header class="friends-header">
          <button class="friends-back press" @click="showFriendsPage = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span class="friends-title">《 老友记 》</span>
          <button class="friends-settings press" @click="showFriendsGroupSettings = true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
          </button>
        </header>
        <div class="friends-body">
          <div class="friends-section-header">
            <h3>抱团约会的好友栏</h3>
            <span class="friends-count">0/3</span>
          </div>
          <div class="friends-invite-card" @click="showFriendsShare = true">
            <div class="friends-user-placeholder">
              <div class="friends-avatar-dashed">
                <svg viewBox="0 0 24 24" fill="#99a2ad" width="24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <span class="friends-invite-text">邀请好友</span>
            </div>
            <span class="friends-plus">＋</span>
          </div>
          <p class="friends-desc">你可以和至多 3 位好友组团，参加抱团约会。<a href="#" class="friends-link" @click.prevent="showFriendsGroupInfo = true">了解更多</a></p>
          <span class="friends-bold-title">邀请好友一起配对</span>
          <p class="friends-sub-info">已经给 1 组抱团约会对子点了赞。现在邀请一位好友，看看能不能配对成功。</p>
          <div class="friends-match-preview">
            <div class="friends-share-tag" @click="showFriendsShare = true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
            </div>
            <div class="friends-half friends-half-left">
              <img src="https://picsum.photos/seed/sw1/400/700" class="friends-half-img" />
              <div class="friends-bottom-grad"></div>
              <span class="friends-name-label">Carey ✓</span>
            </div>
            <div class="friends-half friends-half-right">
              <img src="https://picsum.photos/seed/sw2/400/700" class="friends-half-img" />
              <div class="friends-bottom-grad"></div>
              <span class="friends-name-label">江江 ✓</span>
            </div>
          </div>
        </div>
        <footer class="friends-footer">
          <button class="friends-invite-main press" @click="showFriendsShare = true">邀 请 好 友</button>
        </footer>
      </div>
    </Transition>

    <!-- 分享面板 -->
    <Transition name="sheet-fade">
      <div v-if="showFriendsShare" class="friends-share-mask" @click.self="showFriendsShare = false">
        <div class="friends-share-sheet">
          <h3 class="friends-share-title">分享</h3>
          <div class="friends-share-grid">
            <div class="friends-share-item"><div class="friends-share-icon" style="background:#07c160;">💬</div><span>微信：发送给朋友</span></div>
            <div class="friends-share-item"><div class="friends-share-icon" style="background:linear-gradient(135deg,#ff6b6b,#feca57,#48dbfb);">📦</div><span>添加到微信收藏</span></div>
            <div class="friends-share-item"><div class="friends-share-icon" style="background:#1296db;">⭐</div><span>保存到QQ收藏</span></div>
            <div class="friends-share-item"><div class="friends-share-icon" style="background:#1296db;">🖥️</div><span>QQ：发送到我的电脑</span></div>
            <div class="friends-share-item"><div class="friends-share-icon" style="background:#fff;border:1px solid #eee;">🐧</div><span>QQ：发送给</span></div>
            <div class="friends-share-item"><div class="friends-share-icon" style="background:#ffe100;">🐟</div><span>闲鱼搜索</span></div>
            <div class="friends-share-item"><div class="friends-share-icon" style="background:linear-gradient(135deg,#a8e6cf,#88d8f7);">📍</div><span>高德地图</span></div>
            <div class="friends-share-item"><div class="friends-share-icon" style="background:#d0021b;">📖</div><span>网易有道词</span></div>
          </div>
          <button class="friends-share-cancel press" @click="showFriendsShare = false">取消</button>
        </div>
      </div>
    </Transition>

    <!-- 抱团约会了解更多底部弹窗 -->
    <Transition name="sheet-fade">
      <div v-if="showFriendsGroupInfo" class="fgi-mask" @click.self="showFriendsGroupInfo = false">
        <div class="fgi-sheet">
          <div class="fgi-handle"></div>
          <button class="fgi-close press" @click="showFriendsGroupInfo = false">✕</button>
          <div class="fgi-illustration">
            <img src="https://picsum.photos/seed/groupinfo/280/180" class="fgi-img" />
          </div>
          <h2 class="fgi-title">和好友组对，去抱团约会</h2>
          <div class="fgi-features">
            <div class="fgi-feat"><span class="fgi-feat-icon">✉️</span><div class="fgi-feat-text"><strong>邀请朋友</strong><p>和好友组对，最多三人，去抱团约会</p></div></div>
            <div class="fgi-feat"><span class="fgi-feat-icon">◎</span><div class="fgi-feat-text"><strong>添加约会活动</strong><span class="fgi-badge">更新</span><p>你想和抱团约会那一对玩什么，请选择。</p></div></div>
            <div class="fgi-feat"><span class="fgi-feat-icon">📞</span><div class="fgi-feat-text"><strong>一人滑动，两人配对</strong><p>邀请接受后，你可以独自查看抱团约会对象。</p></div></div>
            <div class="fgi-feat"><span class="fgi-feat-icon">❤️</span><div class="fgi-feat-text"><strong>配对只需一个赞</strong><p>每对中的任何人点赞都能配对成功。</p></div></div>
            <div class="fgi-feat"><span class="fgi-feat-icon">💬</span><div class="fgi-feat-text"><strong>加入群聊</strong><p>先感受下群聊的气氛，再决定要不要线下见面。</p></div></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 抱团约会设置页面 -->
    <Transition name="slide-up">
      <div v-if="showFriendsGroupSettings" class="fgs-page">
        <header class="fgs-header">
          <button class="fgs-back press" @click="showFriendsGroupSettings = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span class="fgs-title">抱团约会</span>
          <div style="width: 24px;"></div>
        </header>
        <div class="fgs-body">
          <div class="fgs-card"><div class="fgs-card-row"><span class="fgs-card-label">在好友个人资料中显示我的信息</span><label class="fgs-toggle"><input type="checkbox" v-model="fgSettingShowInfo" /><span class="fgs-slider"></span></label></div></div>
          <p class="fgs-hint">抱团约会好友的个人资料上可能会出现你的名字和照片。</p>
          <div class="fgs-card"><div class="fgs-card-row"><span class="fgs-card-label">在个人资料中显示我的好友</span><label class="fgs-toggle"><input type="checkbox" v-model="fgSettingShowFriends" /><span class="fgs-slider"></span></label></div></div>
          <p class="fgs-hint">你的个人资料上可能会出现抱团约会好友的名字和照片。</p>
          <div class="fgs-card"><div class="fgs-card-row"><span class="fgs-card-label">显示抱团约会个人资料</span><label class="fgs-toggle"><input type="checkbox" v-model="fgSettingShowProfile" /><span class="fgs-slider"></span></label></div></div>
          <p class="fgs-hint">功能关闭后，抱团约会个人资料将不会在"为你推荐"版块出现。</p>
        </div>
      </div>
    </Transition>

    <!-- Gold 升级弹窗 -->
    <GoldUpgradeModal v-if="showGoldUpgrade" @close="showGoldUpgrade = false" />

    <BottomNavigation theme="light" />
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff; padding-bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom)); }
.page-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 8px; }
.page-title { font-size: 32px; font-weight: 600; color: #1a1a1a; margin: 0; letter-spacing: 0.5px; }
.header-icons { display: flex; gap: 22px; align-items: center; }
.header-icon { display: flex; align-items: center; justify-content: center; }
.header-svg { fill: #7d818a; display: block; }

.search-bar { display: flex; align-items: center; gap: 12px; margin: 8px 20px 16px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
.search-svg { fill: #9b9ea3; flex-shrink: 0; }
.search-input { flex: 1; font-size: 17px; color: #111; font-weight: 400; border: none; outline: none; background: transparent; }
.search-input::placeholder { color: #92969c; }

/* 新的配对 - 长方形卡片 */
.matches-section { padding: 0 20px 16px; }
.section-title { font-size: 14px; font-weight: 600; color: #111; margin: 0 0 12px; }
.matches-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; }
.match-card { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 100px; cursor: pointer; }
.match-card-inner { width: 100px; height: 140px; border-radius: 10px; overflow: hidden; position: relative; background: #f5f5f5; }
.match-likes-card { padding: 4px; border: 1.5px solid #f9d466; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 14px; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: visible; }
.match-card-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.likes-metal-card { width: 100%; height: 100%; border-radius: 10px; background: linear-gradient(145deg, #7d6342 0%, #a4855d 40%, #c5a67c 60%, #8b6e4b 100%); display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 10px rgba(255,255,255,0.1); }
.likes-count-badge { width: 52px; height: 52px; background: linear-gradient(180deg, #ffdf85 0%, #fcc331 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: #3d3428; box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
.likes-bottom-icon { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); background: #fff; padding: 2px 8px; border-radius: 10px; display: flex; align-items: center; white-space: nowrap; z-index: 10; }
.likes-speed-lines { display: flex; flex-direction: column; gap: 2px; margin-right: 3px; }
.likes-line { height: 2.5px; background: #fcc331; border-radius: 2px; }
.likes-l1 { width: 10px; }
.likes-l2 { width: 6px; margin-left: 4px; }
.likes-l3 { width: 8px; margin-left: 2px; }
.likes-heart-svg { width: 20px; height: 20px; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1)); }
.match-online-dot { position: absolute; bottom: 6px; right: 6px; width: 12px; height: 12px; border-radius: 50%; background: #f2385a; border: 2px solid #fff; }
.match-card-name { font-size: 12px; color: #333; text-align: center; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.match-card-verified { width: 14px; height: 14px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 8px; display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; }

/* 消息列表 */
.messages-section { padding: 0 20px; }
.message-list { display: flex; flex-direction: column; }
.message-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; cursor: pointer; }
.msg-avatar { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
.msg-blurred { filter: blur(4px); opacity: 0.7; }
.msg-img { width: 100%; height: 100%; object-fit: cover; }
.tinder-avatar { width: 100%; height: 100%; background: linear-gradient(135deg, #FD297B, #FF655B); display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.tinder-flame-svg { width: 38px; height: 38px; }
.msg-content { flex: 1; min-width: 0; }
.msg-name-row { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
.msg-name { font-size: 15px; font-weight: 600; color: #111; }
.msg-tag { padding: 2px 6px; border-radius: 4px; background: #d4a017; color: #fff; font-size: 10px; font-weight: 700; }
.msg-verified { width: 16px; height: 16px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 9px; display: inline-flex; align-items: center; justify-content: center; }
.msg-preview { font-size: 13px; color: #888; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.msg-badge { padding: 4px 10px; border-radius: 9999px; background: #111; color: #fff; font-size: 11px; font-weight: 600; white-space: nowrap; }

/* 安全工具包 */
.sheet-mask { position: fixed; inset: 0; z-index: 90; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; align-items: flex-end; justify-content: center; }
.safety-sheet { width: 100%; max-width: 480px; background: #fff; border-radius: 24px 24px 0 0; padding: 0 24px 32px; animation: sheetUp 0.3s ease; height: 45vh; overflow-y: auto; }
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.sheet-handle { width: 36px; height: 4px; border-radius: 2px; background: #ccc; margin: 10px auto 20px; }
.safety-title { font-size: 20px; font-weight: 800; color: #111; margin: 0 0 20px; }
.safety-list { display: flex; flex-direction: column; gap: 20px; }
.safety-item { display: flex; gap: 14px; align-items: flex-start; }
.safety-icon { font-size: 24px; margin-top: 2px; display: flex; align-items: center; }
.safety-svg-icon { width: 32px; height: 32px; }
.safety-text { flex: 1; }
.safety-text strong { font-size: 17px; color: #111; display: block; margin-bottom: 4px; }
.safety-text p { font-size: 15px; color: #666; margin: 0; line-height: 1.5; }

/* 老友记页面 */
.friends-page { position: fixed; inset: 0; z-index: 100; background: #f3f4f8; display: flex; flex-direction: column; }
.friends-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f3f4f8; }
.friends-back { color: #1a1a1a; background: none; border: none; }
.friends-title { font-size: 19px; font-weight: 600; color: #1a1a1a; letter-spacing: 0.5px; }
.friends-settings { color: #4f565e; background: none; border: none; }
.friends-body { flex: 1; padding: 0 20px; overflow-y: auto; }
.friends-section-header { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 12px; }
.friends-section-header h3 { font-size: 15px; font-weight: 600; color: #444; margin: 0; }
.friends-count { color: #999; font-size: 15px; font-weight: 500; }
.friends-invite-card { background: #fff; border-radius: 20px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 18px; }
.friends-user-placeholder { display: flex; align-items: center; }
.friends-avatar-dashed { width: 48px; height: 48px; border-radius: 50%; background: #f0f2f5; border: 1.5px dashed #ccc; display: flex; align-items: center; justify-content: center; margin-right: 14px; }
.friends-avatar-dashed svg { width: 24px; height: 24px; }
.friends-invite-text { font-size: 16px; font-weight: 600; color: #1a1a1a; }
.friends-plus { font-size: 24px; color: #b0b0b0; font-weight: 300; }
.friends-desc { font-size: 14px; color: #555; line-height: 1.5; margin-bottom: 25px; }
.friends-link { color: #3261d4; font-weight: 600; text-decoration: none; border-bottom: 1px solid #3261d4; margin-left: 4px; }
.friends-bold-title { display: block; font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
.friends-sub-info { font-size: 13px; color: #777; margin-bottom: 20px; }
.friends-match-preview { width: 170px; height: 230px; background: #fff; border-radius: 16px; overflow: hidden; position: relative; display: flex; box-shadow: 0 8px 20px rgba(0,0,0,0.06); }
.friends-share-tag { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; background: rgba(0,0,0,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 5; cursor: pointer; }
.friends-half { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.friends-half-left { border-right: 1px solid rgba(255,255,255,0.2); }
.friends-half-right { }
.friends-half-img { width: 100%; height: 100%; object-fit: cover; }
.friends-bottom-grad { position: absolute; bottom: 0; width: 100%; height: 40%; background: linear-gradient(transparent, rgba(0,0,0,0.5)); }
.friends-name-label { position: absolute; bottom: 12px; left: 10px; color: #fff; font-size: 13px; font-weight: 600; z-index: 5; text-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.friends-footer { padding: 20px; background: #f3f4f8; }
.friends-invite-main { width: 100%; background: #000; color: #fff; border: none; padding: 16px; border-radius: 50px; font-size: 17px; font-weight: 600; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(0,0,0,0.15); }

/* Friends Share Sheet */
.friends-share-mask { position: fixed; inset: 0; z-index: 110; background: rgba(0,0,0,0.4); display: flex; align-items: flex-end; justify-content: center; }
.friends-share-sheet { width: 100%; max-width: 480px; background: #f5f5f5; border-radius: 16px 16px 0 0; padding: 20px 16px 32px; animation: sheetUp 0.3s ease; }
.friends-share-title { font-size: 18px; font-weight: 600; color: #111; text-align: center; margin: 0 0 20px; }
.friends-share-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 8px; margin-bottom: 20px; }
.friends-share-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.friends-share-item span { font-size: 11px; color: #666; text-align: center; line-height: 1.3; max-width: 72px; }
.friends-share-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.friends-share-cancel { width: 100%; height: 48px; border-radius: 12px; background: #fff; color: #111; font-size: 16px; font-weight: 500; border: none; }

/* Gold Overlay */
.gold-overlay { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.gold-header { display: flex; align-items: center; justify-content: center; padding: 16px 20px; position: relative; }
.gold-close { position: absolute; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; }
.gold-brand { font-size: 18px; }
.gold-brand-text { font-weight: 700; font-style: italic; color: #111; }
.gold-badge { background: linear-gradient(135deg, #d4a017, #f5c518); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; font-style: normal; margin-left: 4px; }
.gold-body { flex: 1; padding: 0 24px 24px; overflow-y: auto; }
.gold-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.4; }
.gold-subtitle { font-size: 14px; color: #666; margin: 0 0 16px; }
.gold-plans-carousel { overflow: hidden; margin-bottom: 12px; }
.gold-plans-track { display: flex; gap: 12px; transition: transform 0.3s ease; padding: 0 4px; }
.gold-plan { min-width: 60%; padding: 18px; border-radius: 12px; border: 1.5px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; position: relative; flex-shrink: 0; }
.gold-plan-active { border-color: #d4a017; }
.gp-hot { font-size: 11px; color: #d4a017; font-weight: 600; min-height: 16px; }
.gp-best { font-size: 11px; color: #d4a017; font-weight: 600; min-height: 16px; }
.gp-period { font-size: 24px; font-weight: 800; color: #111; }
.gp-price { font-size: 13px; color: #666; }
.gp-save { display: inline-block; padding: 3px 8px; border-radius: 6px; background: #f0f0f0; font-size: 11px; color: #333; font-weight: 600; margin-top: 4px; }
.gp-check { position: absolute; top: 14px; right: 14px; color: #d4a017; font-size: 18px; }
.gold-dots { display: flex; gap: 8px; justify-content: center; margin: 12px 0 24px; }
.gold-dot { width: 8px; height: 8px; border-radius: 50%; background: #ddd; cursor: pointer; }
.gold-dot.active { background: #111; }
.gold-features { border: 1px solid #eee; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.gold-features-title { font-size: 13px; color: #666; text-align: center; margin-bottom: 16px; border: 1px solid #eee; border-radius: 8px; padding: 6px 14px; display: inline-block; }
.gf-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
.gf-check { color: #111; font-size: 16px; margin-top: 2px; font-weight: 700; }
.gf-content { flex: 1; }
.gf-content strong { font-size: 14px; color: #111; display: block; margin-bottom: 2px; }
.gf-content p { font-size: 12px; color: #888; margin: 0; line-height: 1.4; }
.gold-disclaimer { font-size: 11px; color: #999; line-height: 1.5; margin: 0; }
.gold-disclaimer a { color: #42a5f5; text-decoration: underline; }
.gold-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid #eee; background: #fff; }
.gold-footer-info { display: flex; align-items: center; gap: 8px; }
.gold-footer-icon { font-size: 20px; }
.gold-footer-text { display: flex; flex-direction: column; }
.gold-footer-period { font-size: 13px; font-weight: 600; color: #111; }
.gold-footer-price { font-size: 11px; color: #666; }
.gold-buy-btn { padding: 12px 28px; border-radius: 9999px; background: linear-gradient(135deg, #d4a017, #f5c518); color: #111; font-size: 15px; font-weight: 700; }
.gold-buy-full { width: 100%; height: 52px; border-radius: 9999px; background: linear-gradient(135deg, #d4a017, #f5c518); color: #111; font-size: 16px; font-weight: 700; }
.gold-desc { font-size: 14px; color: #666; margin: 0 0 32px; }

/* Transitions */
.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.2s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }
.slide-up-enter-active { animation: slideUp 0.3s ease; }
.slide-up-leave-active { animation: slideDown 0.3s ease; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }

/* 举报半弹窗 */
.report-sheet { width: 100%; max-width: 480px; max-height: 85vh; background: #fff; border-radius: 24px 24px 0 0; display: flex; flex-direction: column; animation: sheetUp 0.3s ease; }
.report-sheet-header { display: flex; align-items: center; justify-content: center; padding: 16px 20px; position: relative; }
.report-sheet-close { position: absolute; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; display: flex; align-items: center; justify-content: center; }
.report-sheet-title { font-size: 18px; font-weight: 700; color: #111; margin: 0; }
.report-sheet-body { flex: 1; padding: 0 20px 32px; overflow-y: auto; }
.report-tip-card { background: #e8f4fd; border-radius: 12px; padding: 16px 18px; margin-bottom: 24px; }
.report-tip-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.report-tip-icon { font-size: 18px; }
.report-tip-title { font-size: 15px; font-weight: 600; color: #1a73e8; }
.report-tip-text { font-size: 14px; color: #333; line-height: 1.7; margin: 0; }
.report-section-title { font-size: 15px; font-weight: 700; color: #111; margin: 0 0 16px; line-height: 1.5; }
.report-options { display: flex; flex-direction: column; }
.report-option { display: flex; align-items: center; justify-content: space-between; padding: 18px 0; border-top: 1px solid #f0f0f0; }
.report-option-text { font-size: 15px; color: #111; flex: 1; }
.report-option-arrow { font-size: 16px; color: #999; }

/* 安全设置页面 */
.safety-settings-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.safety-settings-header { display: flex; align-items: center; padding: 16px 20px; gap: 12px; }
.safety-settings-back { font-size: 20px; color: #111; width: 32px; }
.safety-settings-title { font-size: 18px; font-weight: 700; color: #111; margin: 0; }
.safety-settings-body { flex: 1; padding: 0 20px; overflow-y: auto; }
.safety-settings-section-title { font-size: 14px; font-weight: 600; color: #111; margin: 20px 0 12px; }
.safety-settings-card { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 18px; display: flex; align-items: flex-start; gap: 14px; }
.safety-settings-card-content { flex: 1; }
.safety-settings-card-title { font-size: 15px; color: #111; display: block; margin-bottom: 6px; }
.safety-settings-card-desc { font-size: 13px; color: #666; margin: 0; line-height: 1.5; }

/* Toggle 开关 */
.safety-toggle { width: 44px; height: 24px; border-radius: 14px; background: #f0f0f0; border: 1.5px solid #d1d1d1; position: relative; cursor: pointer; flex-shrink: 0; transition: all 0.3s ease; }
.safety-toggle-on { background: #fff0f3; border-color: #ff2d55; }
.safety-toggle-handle { width: 30px; height: 30px; border-radius: 50%; background: #b5b5b5; position: absolute; left: -4px; top: 50%; transform: translateY(-50%); transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; }
.safety-toggle-on .safety-toggle-handle { left: calc(100% - 26px); background: #ff2d55; box-shadow: 0 2px 10px rgba(255, 45, 85, 0.4); }
.safety-toggle-check { color: #fff; font-size: 12px; font-weight: 700; }

/* 安全中心页面 */
.sc-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.sc-header { display: flex; align-items: center; justify-content: center; padding: 16px 20px; position: relative; }
.sc-close { position: absolute; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; display: flex; align-items: center; justify-content: center; }
.sc-title { font-size: 18px; font-weight: 700; color: #111; margin: 0; }
.sc-tabs { display: flex; border-bottom: 1px solid #eee; padding: 0 20px; }
.sc-tab { flex: 1; text-align: center; padding: 12px 0; font-size: 15px; font-weight: 500; color: #999; border-bottom: 2px solid transparent; background: none; cursor: pointer; }
.sc-tab-active { color: #111; font-weight: 700; border-bottom-color: #111; }
.sc-body { flex: 1; overflow-y: auto; padding: 0 20px 32px; }

/* 问候区域 */
.sc-greeting { display: flex; align-items: center; justify-content: space-between; padding: 24px 0 20px; }
.sc-greeting-text { flex: 1; }
.sc-greeting-title { font-size: 28px; font-weight: 800; color: #111; margin: 0 0 4px; }
.sc-greeting-desc { font-size: 14px; color: #666; margin: 0; }
.sc-greeting-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }

/* Section 标题 */
.sc-section-title { font-size: 20px; font-weight: 800; color: #111; margin: 28px 0 14px; }
.sc-section-title-lg { font-size: 18px; }

/* 带图标的卡片 */
.sc-card { display: flex; align-items: center; gap: 14px; padding: 18px; background: #fff; border: 1px solid #f0f0f0; border-radius: 12px; margin-bottom: 10px; }
.sc-card-with-icon { padding: 16px; }
.sc-card-icon { width: 64px; height: 64px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
.sc-icon-report { background: #fef3e2; }
.sc-icon-pride { background: #f0f8ff; }
.sc-icon-binoculars { background: #fce4ec; }
.sc-icon-chat { background: #e8f5e9; }
.sc-icon-lock { background: #f3e5f5; }
.sc-icon-hearts { background: #fff3e0; }
.sc-icon-consent { background: #fce4ec; }
.sc-icon-travel { background: #e3f2fd; }
.sc-card-content { flex: 1; min-width: 0; }
.sc-card-content strong { font-size: 15px; font-weight: 700; color: #111; display: block; margin-bottom: 4px; }
.sc-card-content p { font-size: 13px; color: #666; margin: 0; line-height: 1.5; }
.sc-arrow { font-size: 18px; color: #ccc; flex-shrink: 0; }

/* 简单列表卡片 */
.sc-card-simple { display: flex; align-items: center; justify-content: space-between; padding: 18px; border-bottom: 1px solid #f0f0f0; }
.sc-card-simple span:first-child { font-size: 15px; color: #111; flex: 1; }

/* 测验卡片 */
.sc-card-quiz { gap: 12px; }
.sc-quiz-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; border: 1px solid #ddd; font-size: 12px; font-weight: 600; color: #111; flex-shrink: 0; }

/* 工具 Tab */
.sc-tools-section { padding: 24px 0; border-bottom: 1px solid #f0f0f0; }
.sc-tools-section:last-child { border-bottom: none; }
.sc-tools-phone-mockup { width: 100%; max-width: 280px; margin: 0 auto 20px; background: #f8f8f8; border-radius: 20px; padding: 20px; border: 1px solid #eee; }
.sc-tools-phone-sm { max-width: 240px; padding: 16px; }
.sc-tools-phone-screen { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.sc-phone-profile { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.sc-phone-photo { width: 60px; height: 60px; border-radius: 50%; background: #e0e0e0; }
.sc-phone-info { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.sc-phone-name { font-size: 14px; font-weight: 600; color: #111; }
.sc-phone-verified-badge { font-size: 11px; color: #fff; background: #7c4dff; padding: 2px 8px; border-radius: 10px; }
.sc-phone-report { padding: 16px; }
.sc-phone-report-icon { font-size: 24px; }
.sc-phone-report-text { font-size: 13px; color: #666; }
.sc-phone-privacy { padding: 16px; }
.sc-phone-tinder-logo { font-size: 14px; font-weight: 700; color: #FD297B; }
.sc-phone-privacy-text { font-size: 12px; color: #666; text-align: center; }
.sc-tools-title { font-size: 18px; font-weight: 800; color: #111; margin: 0 0 8px; }
.sc-tools-desc { font-size: 14px; color: #666; margin: 0; line-height: 1.6; }
.sc-tools-verified-icon { width: 64px; height: 64px; border-radius: 50%; background: #e3f2fd; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.sc-verified-check { font-size: 28px; color: #42a5f5; font-weight: 700; }

/* 资源 Tab */
.sc-resource-item { padding: 24px 0; border-bottom: 1px solid #f0f0f0; }
.sc-resource-item:last-child { border-bottom: none; }
.sc-resource-logo { font-size: 18px; font-weight: 700; color: #111; margin-bottom: 12px; }
.sc-resource-throughline { color: #2e7d32; }
.sc-resource-beam { font-size: 14px; color: #111; letter-spacing: 1px; }
.sc-resource-nsvrc { font-size: 16px; color: #1a237e; }
.sc-resource-itsonus { font-size: 16px; color: #111; }
.sc-resource-name { font-size: 15px; font-weight: 600; color: #111; margin: 0 0 8px; }
.sc-resource-desc { font-size: 14px; color: #333; line-height: 1.6; margin: 0 0 12px; }
.sc-resource-phone { font-size: 14px; color: #111; margin: 0 0 12px; }
.sc-resource-btn { display: inline-block; padding: 8px 16px; border-radius: 9999px; border: 1.5px solid #ddd; font-size: 13px; font-weight: 600; color: #111; background: #fff; cursor: pointer; }

/* Group Info Bottom Sheet */
.fgi-mask { position: fixed; inset: 0; z-index: 110; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; }
.fgi-sheet { background: #fff; border-radius: 16px 16px 0 0; width: 100%; max-height: 85vh; overflow-y: auto; padding: 12px 24px 32px; position: relative; }
.fgi-handle { width: 36px; height: 4px; border-radius: 2px; background: #ddd; margin: 0 auto 16px; }
.fgi-close { position: absolute; top: 16px; left: 16px; width: 28px; height: 28px; font-size: 16px; color: #111; background: none; border: none; cursor: pointer; }
.fgi-illustration { display: flex; justify-content: center; margin-bottom: 20px; }
.fgi-img { width: 200px; height: 140px; object-fit: cover; border-radius: 12px; }
.fgi-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; }
.fgi-features { display: flex; flex-direction: column; gap: 20px; }
.fgi-feat { display: flex; gap: 14px; align-items: flex-start; }
.fgi-feat-icon { font-size: 20px; margin-top: 2px; }
.fgi-feat-text { flex: 1; }
.fgi-feat-text strong { font-size: 15px; color: #111; display: block; margin-bottom: 4px; }
.fgi-feat-text p { font-size: 13px; color: #666; margin: 0; line-height: 1.4; }
.fgi-badge { display: inline-block; background: #fe3c72; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-left: 6px; vertical-align: middle; }

/* Group Settings Page */
.fgs-page { position: fixed; inset: 0; z-index: 110; background: #f8f8f8; display: flex; flex-direction: column; }
.fgs-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: #fff; }
.fgs-back { color: #111; background: none; border: none; cursor: pointer; }
.fgs-title { font-size: 17px; font-weight: 700; color: #111; }
.fgs-body { flex: 1; overflow-y: auto; padding: 24px 20px; }
.fgs-card { background: #fff; border-radius: 12px; padding: 18px 16px; margin-bottom: 8px; }
.fgs-card-row { display: flex; align-items: center; justify-content: space-between; }
.fgs-card-label { font-size: 15px; color: #111; font-weight: 500; flex: 1; }
.fgs-hint { font-size: 13px; color: #666; margin: 0 0 20px; padding: 0 4px; line-height: 1.5; }
.fgs-toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
.fgs-toggle input { opacity: 0; width: 0; height: 0; }
.fgs-slider { position: absolute; inset: 0; background: #f0f0f0; border: 1.5px solid #d1d1d1; border-radius: 14px; transition: all 0.3s ease; cursor: pointer; }
.fgs-slider::before { content: ''; position: absolute; width: 30px; height: 30px; border-radius: 50%; background: #b5b5b5; left: -4px; top: 50%; transform: translateY(-50%); transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
.fgs-slider::after { content: ''; position: absolute; width: 10px; height: 6px; border-left: 2px solid white; border-bottom: 2px solid white; transform: rotate(-45deg) translate(1px, -1px); left: 4px; top: 7px; opacity: 0; transition: opacity 0.2s ease, left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.fgs-toggle input:checked + .fgs-slider { background: #fff0f3; border-color: #ff2d55; }
.fgs-toggle input:checked + .fgs-slider::before { left: calc(100% - 26px); background: #ff2d55; box-shadow: 0 2px 10px rgba(255,45,85,0.4); }
.fgs-toggle input:checked + .fgs-slider::after { opacity: 1; left: calc(100% - 16px); }
</style>
