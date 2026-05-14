<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import FlameLogo from '@/components/common/FlameLogo.vue';
import GoldUpgradeModal from '@/components/common/GoldUpgradeModal.vue';
import PlatinumUpgradeModal from '@/components/common/PlatinumUpgradeModal.vue';
import PlusUpgradeModal from '@/components/common/PlusUpgradeModal.vue';
import SuperLikeModal from '@/components/common/SuperLikeModal.vue';
import BoostModal from '@/components/common/BoostModal.vue';

const router = useRouter();
const auth = useAuthStore();
const userStore = useUserStore();
const showGoldUpgrade = ref(false);
const showPlatinum = ref(false);
const showPlus = ref(false);
const showSuperLike = ref(false);
const showBoost = ref(false);

// 发现设置
const distanceMax = ref(80);
const showBeyondDistance = ref(true);
const genderInterest = ref('男性');
const ageMin = ref(18);
const ageMax = ref(33);
const showBeyondAge = ref(true);
const minPhotos = ref(1);

// 开关
const enableDiscovery = ref(true);
const photoVerifyChat = ref(false);
const showProfile = ref(false);

onMounted(async () => {
  try {
    if (!userStore.profile) await userStore.fetchProfile();
    const s = userStore.profile?.settings;
    if (s) {
      distanceMax.value = s.distance_max_km || 80;
      ageMin.value = s.age_min || 18;
      ageMax.value = s.age_max || 33;
    }
  } catch {}
});

const phone = computed(() => userStore.profile?.phone || '');

async function logout() {
  await auth.logout();
  userStore.reset();
  router.replace({ name: 'welcome' });
}

// 自动保存设置到 profile（形成闭环）
watch([distanceMax, ageMin, ageMax, enableDiscovery], async () => {
  if (!userStore.profile) return;
  try {
    await userStore.updateProfile({
      settings: {
        ...userStore.profile.settings,
        distance_max_km: distanceMax.value,
        age_min: ageMin.value,
        age_max: ageMax.value,
      },
    });
  } catch {}
}, { deep: true });

// 条款/隐私/社区弹窗
const showInfoDialog = ref(false);
const infoDialogTitle = ref('');
const infoDialogContent = ref('');

const infoContents: Record<string, string> = {
  'Cookie 政策': '我们使用 Cookie 和类似技术来提供、保护和改进我们的服务。你可以在浏览器设置中管理 Cookie 偏好。',
  '隐私政策': '我们重视你的隐私。你的个人数据仅用于提供服务、改善体验和确保安全。你可以随时请求删除你的数据。',
  '隐私偏好': '你可以控制哪些数据被收集和使用。包括位置数据、使用数据和广告偏好设置。',
  '来自 Match Group': 'Tinder 是 Match Group 旗下产品。Match Group 致力于为全球用户提供安全、有意义的社交连接。',
  '许可证': '本应用使用了多个开源库，包括 Vue.js (MIT)、Vite (MIT)、Tailwind CSS (MIT) 等。',
  '服务条款': '使用 Tinder 即表示你同意我们的服务条款。你必须年满 18 岁，遵守社区准则，不得发布违规内容。',
  '社群规则': '尊重他人、保持真实、注意安全。禁止骚扰、仇恨言论、垃圾信息和欺诈行为。违规者将被封禁。',
  '安全贴士': '不要分享个人财务信息。首次见面选择公共场所。告诉朋友你的约会计划。相信你的直觉。',
  '帮助和支持': '如需帮助，请访问我们的帮助中心或通过应用内反馈联系我们。我们的团队会在 24 小时内回复。',
  '进行举报': '如果你遇到不当行为，可以在对方的个人资料或聊天界面中进行举报。我们会认真审核每一份举报。',
  '外观': '当前使用系统设置自动切换深色/浅色模式。你也可以手动选择始终使用浅色或深色主题。',
  '数据使用情况': '视频将在 Wi-Fi 环境下自动播放。你可以选择：始终自动播放、仅 Wi-Fi 下播放、从不自动播放。',
  '共同好友': '开启后，你可以在潜在配对对象的个人资料上看到你们共同认识的好友数量。此功能需要连接社交账号。',
  '管理付款帐户': '你可以在此管理绑定的支付方式，包括信用卡、借记卡和移动支付。',
  '管理 Google Play 账号': '通过 Google Play 管理你的订阅和付款方式。取消订阅需在 Google Play 商店设置中操作。',
  '恢复购买': '如果你之前购买过订阅但未显示，可以点击此处恢复。请确保使用相同的账号登录。',
  '屏蔽联系人': '你可以导入手机通讯录来屏蔽联系人。被屏蔽的联系人将不会在你的推荐中出现，你也不会出现在他们的推荐中。',
  '分享 Tinder': '邀请朋友加入 Tinder！分享你的专属链接，让更多人体验有趣的社交。',
};

function openInfoDialog(title: string) {
  infoDialogTitle.value = title;
  infoDialogContent.value = infoContents[title] || '该功能正在开发中，敬请期待。';
  showInfoDialog.value = true;
}

// 删除账户确认
const showDeleteConfirm = ref(false);

// 兴趣全屏页
const showInterestsPage = ref(false);
const selectedInterests = ref<string[]>([]);
const interestSearch = ref('');
const allInterests = [
  '社会性发展', '平等', '政治', '行动主义', '人权', '心理健康意识', '选民权', '气候变化',
  'LGBTQIA+ 权利', '女权主义', '黑人命也是命', '包容', '残障人士权利', '参加自愿活动',
  '环保主义', '世界和平', '同志骄傲', '青年赋权', '自爱', '尝试新事物', '塔罗牌', '水疗',
  '自我照顾', '冥想', '护肤', '占星术', '桑拿', '自我发展', '正念', '积极的生活方式', '瑜伽',
  '化妆品', '密室逃脱', '酒吧', '博物馆', '淘二手货', '锐舞派对', '汽车影院', '展览',
  '巡访咖啡馆', '水族馆', '音乐剧', '购物', '家庭派对', '戏剧', '逛夜店', '汽车', '水烟',
  '摩托车', '电影节', '酒吧竞猜游戏', '节日', '打保龄球', '卡拉 OK', '特惠时段', '单口相声',
  '夜生活', '艺术画廊', '音乐会', '酒吧', '滑旱冰', '现场音乐', '城镇节庆', '酒吧串游',
  '旅行', '摄影', '健身', '阅读', '烹饪', '电影', '音乐', '游戏', '编程', '设计',
];

function toggleInterest(tag: string) {
  const idx = selectedInterests.value.indexOf(tag);
  if (idx >= 0) selectedInterests.value.splice(idx, 1);
  else if (selectedInterests.value.length < 10) selectedInterests.value.push(tag);
}

// 半弹窗
const showHalfSheet = ref(false);
const halfSheetTitle = ref('');
const halfSheetOptions = ref<string[]>([]);
const halfSheetSelected = ref<string[]>([]);
const halfSheetFull = ref(false);

const optionsMap: Record<string, string[]> = {
  '我想要': ['长期交往', '短期交往', '结交新朋友', '今晚有空', '长期交往，但不拒绝短期交往', '还没想好', '随缘', '先聊聊看', '寻找灵魂伴侣', '开放式关系'],
  '添加语言': ['南非语', '阿尔巴尼亚语', '阿姆哈拉语', '阿拉伯语', '亚美尼亚语', '美国手语', '阿萨姆语', '中文', '英语', '日语', '韩语', '法语', '德语', '西班牙语', '葡萄牙语', '俄语', '意大利语', '泰语', '越南语', '印地语', '马来语', '印尼语', '土耳其语', '波兰语', '瑞典语', '挪威语', '粤语', '荷兰语', '芬兰语', '希腊语'],
  '星座': ['白羊座 ♈', '金牛座 ♉', '双子座 ♊', '巨蟹座 ♋', '狮子座 ♌', '处女座 ♍', '天秤座 ♎', '天蝎座 ♏', '射手座 ♐', '摩羯座 ♑', '水瓶座 ♒', '双鱼座 ♓'],
  '教育情况': ['高中', '职业学校', '大专', '本科在读', '本科', '硕士在读', '硕士', '博士在读', '博士', 'MBA', '其他'],
  '家庭计划': ['想要孩子', '不想要孩子', '已有孩子，还想要更多', '已有孩子，不想再要', '还没想好', '开放态度'],
  '沟通风格': ['面对面交流', '电话聊天', '视频通话', '文字消息', '语音消息', '表情包大战', '深夜长谈', '简短有力'],
  '爱的方式': ['肢体接触', '赞美之词', '精心时刻', '服务行动', '赠送礼物', '陪伴', '倾听', '一起冒险'],
  '宠物喜好': ['猫', '狗', '兔子', '仓鼠', '鱼', '鸟', '爬行动物', '都喜欢', '没有宠物', '过敏', '想养但还没养'],
  '饮酒': ['从不喝酒', '偶尔小酌', '社交场合喝', '周末喝', '经常喝', '只喝红酒', '只喝啤酒', '正在戒酒'],
  '你多久抽一次烟？': ['从不抽烟', '社交场合抽', '偶尔抽', '经常抽', '正在戒烟', '电子烟', '只抽雪茄'],
  '健身情况': ['每天健身', '经常健身', '一周3-4次', '偶尔健身', '几乎不健身', '想开始健身', '户外运动为主', '瑜伽冥想'],
  '社交媒体活跃度': ['非常活跃', '比较活跃', '偶尔发', '只看不发', '潜水党', '不用社交媒体', '只用微信', '内容创作者'],
};

function openHalfSheet(title: string) {
  halfSheetTitle.value = title;
  halfSheetOptions.value = optionsMap[title] || [];
  halfSheetSelected.value = [];
  halfSheetFull.value = false;
  showHalfSheet.value = true;
}

function toggleHalfSheetOption(opt: string) {
  const idx = halfSheetSelected.value.indexOf(opt);
  if (idx >= 0) halfSheetSelected.value.splice(idx, 1);
  else halfSheetSelected.value.push(opt);
}

function closeHalfSheet() { showHalfSheet.value = false; halfSheetFull.value = false; }

let sheetTouchStartY = 0;
function onSheetTouchStart(e: TouchEvent) { sheetTouchStartY = e.touches[0].clientY; }
function onSheetTouchEnd(e: TouchEvent) {
  const dy = e.changedTouches[0].clientY - sheetTouchStartY;
  if (dy < -60) halfSheetFull.value = true;
  else if (dy > 60 && halfSheetFull.value) halfSheetFull.value = false;
  else if (dy > 60 && !halfSheetFull.value) closeHalfSheet();
}

function goBack() {
  router.back();
}
</script>

<template>
  <div class="page">
    <header class="top-bar safe-top">
      <button class="back press" @click="goBack">←</button>
      <span class="top-title">设置</span>
      <div style="width: 32px;"></div>
    </header>

    <main class="main">

      <!-- 会员推广区 -->
      <section class="promo-section">
        <div class="promo-card promo-platinum" @click="showPlatinum = true">
          <div class="promo-brand">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 6 8 6 13.5C6 17.6 9 21 12 21C15 21 18 17.6 18 13.5C18 10 15.5 8 15.5 8C15.5 8 15 12 13 12C13 12 14 7 12 2Z" fill="#111"/></svg>
            <span class="promo-name">tinder</span>
            <span class="promo-tier promo-tier-plat">PLATINUM</span>
          </div>
          <p class="promo-desc">你可以使用置顶赞，查看谁给你点了赞，同时享受更多高级功能</p>
        </div>

        <div class="promo-card promo-gold" @click="showGoldUpgrade = true">
          <div class="promo-brand">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 6 8 6 13.5C6 17.6 9 21 12 21C15 21 18 17.6 18 13.5C18 10 15.5 8 15.5 8C15.5 8 15 12 13 12C13 12 14 7 12 2Z" fill="#c9a000"/></svg>
            <span class="promo-name">tinder</span>
            <span class="promo-tier promo-tier-gold">GOLD</span>
          </div>
          <p class="promo-desc">查看给你点赞的人及更多信息！</p>
        </div>

        <div class="promo-card promo-plus" @click="showPlus = true">
          <div class="promo-brand">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 6 8 6 13.5C6 17.6 9 21 12 21C15 21 18 17.6 18 13.5C18 10 15.5 8 15.5 8C15.5 8 15 12 13 12C13 12 14 7 12 2Z" fill="#f2385a"/></svg>
            <span class="promo-name">tinder</span>
            <span class="promo-tier promo-tier-plus">+</span>
          </div>
          <p class="promo-desc">无限点赞次数和更多！</p>
        </div>
      </section>

      <!-- 功能快捷入口 -->
      <section class="quick-grid">
        <div class="feature-card" @click="showSuperLike = true">
          <div class="fc-icon-circle">
            <svg class="fc-icon fc-icon-blue" width="22" height="22" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </div>
          <span class="fc-label fc-color-blue">获取 Super Like</span>
        </div>
        <div class="feature-card" @click="showBoost = true">
          <div class="fc-icon-circle">
            <svg class="fc-icon fc-icon-purple" width="22" height="22" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
          </div>
          <span class="fc-label fc-color-purple">获得 Boost</span>
        </div>
        <div class="feature-card">
          <div class="fc-icon-circle">
            <svg class="fc-icon fc-icon-black" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/><line x1="3" y1="3" x2="21" y2="21" stroke="#333" stroke-width="2" /></svg>
          </div>
          <span class="fc-label fc-color-black">开启隐身模式</span>
        </div>
        <div class="feature-card">
          <div class="fc-icon-circle">
            <svg class="fc-icon fc-icon-red" width="22" height="22" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
          </div>
          <span class="fc-label fc-color-red">位置漫游模式</span>
        </div>
      </section>

      <!-- 账号设置 -->
      <section class="sec">
        <div class="sec-label">账号设置</div>
        <div class="card">
          <div class="row-between">
            <span>电话号码</span>
            <span class="row-value">{{ phone }} ›</span>
          </div>
        </div>
        <p class="sec-hint">验证手机号码，以帮助保护你的账号。</p>
      </section>

      <!-- 发现设置 -->
      <section class="sec">
        <div class="sec-label">发现设置</div>

        <!-- 解锁更多偏好设置 -->
        <div class="unlock-card" style="margin-bottom: 12px;">
          <h3 class="unlock-title">解锁更多<br/>偏好设置</h3>
          <p class="unlock-desc">想要更多独特体验？设置高级偏好，查看对你口味的个人资料，但又不会错过其他的有缘人。</p>
          <div class="unlock-bottom">
            <div class="unlock-avatars">👤👤👤👤</div>
            <button class="unlock-btn press">解锁</button>
          </div>
        </div>

        <div class="card">
          <div class="row-label">位置</div>
          <div class="row-location">
            <span class="loc-pin">📍</span>
            <span>成都市, 中国</span>
          </div>
          <a href="#" class="link-red" @click.prevent>添加一个新位置</a>
        </div>
        <p class="sec-hint">更改位置，随地配对。</p>

        <div class="card">
          <div class="row-between">
            <span class="row-title">最大距离</span>
            <span class="row-value-bold">{{ distanceMax }}公里</span>
          </div>
          <input v-model.number="distanceMax" type="range" min="1" max="160" class="slider" :style="{ '--val': (distanceMax / 160 * 100) + '%' }" />
          <div class="row-between" style="margin-top: 12px;">
            <span class="row-desc">当我将可看的个人资料浏览完毕后向我显示超出距离范围的用户</span>
            <label class="toggle"><input v-model="showBeyondDistance" type="checkbox" /><span class="toggle-slider"></span></label>
          </div>
        </div>

        <div class="card">
          <div class="row-label">感兴趣</div>
          <div class="row-between">
            <span class="row-title">{{ genderInterest }}</span>
            <span class="arrow">›</span>
          </div>
        </div>

        <div class="card">
          <div class="row-between">
            <span class="row-title">年龄范围</span>
            <span class="row-value-bold">{{ ageMin }} - {{ ageMax }}</span>
          </div>
          <div class="dual-slider">
            <input v-model.number="ageMax" type="range" min="18" max="100" class="slider" :style="{ '--val': ((ageMax - 18) / 82 * 100) + '%' }" />
          </div>
          <div class="row-between" style="margin-top: 12px;">
            <span class="row-desc">当我将可看的个人资料浏览完毕后向我显示略微超出偏好范围的用户。</span>
            <label class="toggle"><input v-model="showBeyondAge" type="checkbox" /><span class="toggle-slider"></span></label>
          </div>
        </div>
      </section>

      <!-- 最少照片数 -->
      <section class="sec">
        <div class="card">
          <div class="row-between">
            <span class="row-title">最少照片数</span>
            <span class="row-value-bold">{{ minPhotos }}</span>
          </div>
          <input v-model.number="minPhotos" type="range" min="1" max="9" class="slider" :style="{ '--val': ((minPhotos - 1) / 8 * 100) + '%' }" />
        </div>
      </section>

      <!-- 有个人资料 + 兴趣等 -->
      <section class="sec">
        <div class="card">
          <div class="row-between">
            <span>有个人资料</span>
            <label class="toggle"><input v-model="showProfile" type="checkbox" /><span class="toggle-slider"></span></label>
          </div>
        </div>
        <div class="list-card">
          <div class="list-row" @click="showInterestsPage = true"><span>兴趣</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('我想要')"><span class="list-icon">🎯</span><span>我想要</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('添加语言')"><span class="list-icon">🗣</span><span>添加语言</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('星座')"><span class="list-icon">🌙</span><span>星座</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('教育情况')"><span class="list-icon">🎓</span><span>教育情况</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('家庭计划')"><span class="list-icon">👶</span><span>家庭计划</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('沟通风格')"><span class="list-icon">💬</span><span>沟通风格</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('爱的方式')"><span class="list-icon">💝</span><span>爱的方式</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('宠物喜好')"><span class="list-icon">🐾</span><span>宠物喜好</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('饮酒')"><span class="list-icon">🍷</span><span>饮酒</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('你多久抽一次烟？')"><span class="list-icon">🚬</span><span>你多久抽一次烟？</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('健身情况')"><span class="list-icon">💪</span><span>健身情况</span><span class="row-right-gray">选择 ›</span></div>
          <div class="list-row" @click="openHalfSheet('社交媒体活跃度')"><span class="list-icon">@</span><span>社交媒体活跃度</span><span class="row-right-gray">选择 ›</span></div>
        </div>
      </section>

      <!-- 管理您的访客 -->
      <section class="sec">
        <div class="sec-label-row">
          <span class="sec-label" style="margin: 0;">管理您的访客</span>
          <span class="tinder-plus-badge">Tinder Plus™</span>
        </div>
        <div class="card">
          <div class="row-check"><strong>均衡的推荐</strong><span class="check-pink">✓</span></div>
          <p class="row-sub">看看和你最相关的人（默认设置）</p>
        </div>
        <div class="card">
          <div class="row-check"><strong>最近活跃</strong></div>
          <p class="row-sub">先看看最近最活跃的人</p>
        </div>
      </section>

      <!-- 管理我的可见设置 -->
      <section class="sec">
        <div class="sec-label">管理我的可见设置</div>
        <div class="card">
          <div class="row-check"><strong>标准</strong><span class="check-pink">✓</span></div>
          <p class="row-sub">你将在卡片集中对其他会员可见</p>
        </div>
        <div class="card">
          <div class="row-check">
            <strong>隐身</strong>
            <span class="tinder-plus-badge" style="margin-left: 8px;">Tinder Plus™</span>
          </div>
          <p class="row-sub">你只对赞过的会员可见</p>
        </div>
      </section>

      <!-- 启用发现 -->
      <section class="sec">
        <div class="sec-label">启用发现</div>
        <div class="card">
          <div class="row-between">
            <span>启用发现</span>
            <label class="toggle"><input v-model="enableDiscovery" type="checkbox" /><span class="toggle-slider"></span></label>
          </div>
        </div>
        <p class="sec-hint">如关闭此功能，你的个人资料将不会显示在卡片集中，并且发现功能将被禁用。你赞过的会员也许仍然能看到你并与你达成配对。</p>
      </section>

      <!-- 管理信息接收 -->
      <section class="sec">
        <div class="sec-label">管理信息接收</div>
        <div class="card">
          <div class="row-between">
            <div>
              <div><strong>通过照片验证才可聊天</strong></div>
              <p class="row-sub" style="margin: 4px 0 0;">通过照片验证的会员可以启用此功能，仅接收已验证会员发来的信息。</p>
            </div>
            <label class="toggle"><input v-model="photoVerifyChat" type="checkbox" /><span class="toggle-slider"></span></label>
          </div>
        </div>
      </section>

      <!-- 屏蔽联系人 -->
      <section class="sec">
        <div class="card single-row" @click="openInfoDialog('屏蔽联系人')">屏蔽联系人</div>
      </section>

      <!-- 外观 -->
      <section class="sec">
        <div class="sec-label">外观</div>
        <div class="card single-row-arrow" @click="openInfoDialog('外观')">使用系统设置 <span class="arrow">›</span></div>
      </section>

      <!-- 数据使用情况 -->
      <section class="sec">
        <div class="sec-label">数据使用情况</div>
        <div class="card single-row-arrow" @click="openInfoDialog('数据使用情况')">自动播放视频 <span class="arrow">›</span></div>
      </section>

      <!-- 申请 Tinder U -->
      <section class="sec">
        <div class="card" style="text-align: center;">
          <span style="color: #f2385a; font-weight: 600; font-size: 15px;">申请 Tinder U</span>
        </div>
      </section>

      <!-- 网页版个人资料 -->
      <section class="sec">
        <div class="card">
          <strong>网页版个人资料</strong>
          <p class="row-sub" style="margin: 6px 0 10px;">创建用户名。并分享用户名。世界各地的用户将相聚在 Tinder，与你配对。</p>
          <div class="row-between">
            <span>用户名</span>
            <span class="row-right-gray">申请用户名 ›</span>
          </div>
        </div>
      </section>

      <!-- 问答活动 / 最佳精选 / 抱团约会 / 星座板块 / 音乐 / 滑动热潮 / 活跃状态 / 共同好友 -->
      <section class="sec" v-for="item in [
        { label: '问答活动', title: '管理问答活动' },
        { label: '最佳精选', title: '管理最佳精选' },
        { label: '抱团约会', title: '管理抱团约会功能' },
        { label: '星座板块', title: '管理星座板块' },
        { label: '音乐', title: '管理音乐模式' },
        { label: '滑动热潮', title: '管理滑动热潮' },
        { label: '活跃状态', title: '管理活跃状态' },
      ]" :key="item.label">
        <div class="sec-label">{{ item.label }}</div>
        <div class="card single-row-arrow">
          <div>
            <div>{{ item.title }}</div>
            <div class="row-sub">设置</div>
          </div>
          <span class="arrow">›</span>
        </div>
      </section>

      <!-- 共同好友 -->
      <section class="sec">
        <div class="sec-label">共同好友</div>
        <div class="card single-row-arrow" @click="openInfoDialog('共同好友')">共同好友 <span class="arrow">›</span></div>
        <p class="sec-hint">查看与潜在配对对象共享多少好友。</p>
      </section>

      <!-- 应用程序设置 -->
      <section class="sec">
        <div class="sec-label">应用程序设置</div>
        <div class="list-card">
          <div class="list-row"><span>通知</span></div>
          <div class="list-row"><span>电子邮件地址</span></div>
          <div class="list-row"><span>推送通知</span></div>
          <div class="list-row"><span>短信</span></div>
          <div class="list-row"><span>Tinder 团队</span></div>
        </div>
      </section>

      <!-- 显示距离范围为 -->
      <section class="sec">
        <div class="card">
          <div class="row-between">
            <span>显示距离范围为</span>
            <span class="row-value-bold">公里</span>
          </div>
          <div class="unit-toggle">
            <button class="unit-btn unit-active">公里</button>
            <button class="unit-btn">英里</button>
          </div>
        </div>
      </section>

      <!-- 付款帐户 -->
      <section class="sec">
        <div class="sec-label">付款帐户</div>
        <div class="list-card">
          <div class="list-row-arrow" @click="openInfoDialog('管理付款帐户')"><span>管理付款帐户</span><span class="arrow">›</span></div>
          <div class="list-row-arrow" @click="openInfoDialog('管理 Google Play 账号')"><span>管理 Google Play 账号</span><span class="arrow">›</span></div>
          <div class="list-row-arrow" @click="openInfoDialog('恢复购买')"><span>恢复购买</span><span class="arrow">›</span></div>
        </div>
      </section>

      <!-- 联系我们 -->
      <section class="sec">
        <div class="sec-label">联系我们</div>
        <div class="list-card">
          <div class="list-row" @click="openInfoDialog('帮助和支持')"><span>帮助和支持</span></div>
          <div class="list-row" @click="openInfoDialog('进行举报')"><span>进行举报</span></div>
        </div>
      </section>

      <!-- 社区 -->
      <section class="sec">
        <div class="sec-label">社区</div>
        <div class="list-card">
          <div class="list-row" @click="openInfoDialog('社群规则')"><span>社群规则</span></div>
          <div class="list-row" @click="openInfoDialog('安全贴士')"><span>安全贴士</span></div>
        </div>
      </section>

      <!-- 分享 Tinder -->
      <section class="sec">
        <div class="card single-row" @click="openInfoDialog('分享 Tinder')">分享 Tinder</div>
      </section>

      <!-- 隐私 -->
      <section class="sec">
        <div class="sec-label" style="margin-bottom: 0;">隐私</div>
        <div class="list-card">
          <div class="list-row" @click="openInfoDialog('Cookie 政策')"><span>Cookie 政策</span></div>
          <div class="list-row" @click="openInfoDialog('隐私政策')"><span>隐私政策</span></div>
          <div class="list-row" @click="openInfoDialog('隐私偏好')"><span>隐私偏好</span></div>
          <div class="list-row" @click="openInfoDialog('来自 Match Group')"><span>来自 Match Group</span></div>
        </div>
      </section>

      <!-- 合法 -->
      <section class="sec">
        <div class="list-card">
          <div class="list-row"><strong>合法</strong></div>
          <div class="list-row" @click="openInfoDialog('许可证')"><span>许可证</span></div>
          <div class="list-row" @click="openInfoDialog('服务条款')"><span>服务条款</span></div>
        </div>
      </section>

      <!-- 登出 -->
      <section class="sec">
        <button class="logout-btn press" @click="logout">登出</button>
      </section>

      <!-- 版本 -->
      <section class="version-sec">
        <FlameLogo :size="40" />
        <p class="version-text">版本 17.15.0(17150031)</p>
      </section>

      <!-- 删除账户 -->
      <section class="sec">
        <button class="delete-btn press" @click="showDeleteConfirm = true">删除账户</button>
      </section>

      <div style="height: 40px;"></div>
    </main>

    <!-- 兴趣全屏页 -->
    <Transition name="slide-up">
      <div v-if="showInterestsPage" class="interests-page">
        <header class="ip-header">
          <button class="ip-close press" @click="showInterestsPage = false">✕</button>
          <div class="ip-title-row">
            <h1 class="ip-title">兴趣</h1>
            <span class="ip-count">{{ selectedInterests.length }}/10</span>
          </div>
          <p class="ip-desc">兴趣功能可以让你轻而易举找到志趣相投的知己。在个人资料中添加 0-10 个兴趣，让自己找到一拍即合的伙伴。</p>
          <div class="ip-search">
            <span class="ip-search-icon">🔍</span>
            <input v-model="interestSearch" class="ip-search-input" placeholder="搜索" />
          </div>
        </header>
        <div class="ip-body">
          <div class="ip-tags">
            <button
              v-for="tag in allInterests.filter(t => !interestSearch || t.includes(interestSearch))"
              :key="tag"
              class="ip-tag"
              :class="{ 'ip-tag-selected': selectedInterests.includes(tag) }"
              @click="toggleInterest(tag)"
            >{{ tag }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 半弹窗 -->
    <Transition name="sheet-fade">
      <div v-if="showHalfSheet" class="hs-mask" @click.self="closeHalfSheet">
        <div
          class="hs-sheet"
          :class="{ 'hs-full': halfSheetFull }"
          @touchstart.passive="onSheetTouchStart"
          @touchend.passive="onSheetTouchEnd"
        >
          <div class="hs-handle"></div>
          <div class="hs-header">
            <h3 class="hs-title">{{ halfSheetTitle }}</h3>
            <button class="hs-done-btn press" @click="closeHalfSheet">完成</button>
          </div>
          <div class="hs-body">
            <div class="hs-tags">
              <button
                v-for="opt in halfSheetOptions"
                :key="opt"
                class="hs-tag"
                :class="{ 'hs-tag-selected': halfSheetSelected.includes(opt) }"
                @click="toggleHalfSheetOption(opt)"
              >{{ opt }}</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Gold 升级弹窗 -->
    <GoldUpgradeModal v-if="showGoldUpgrade" @close="showGoldUpgrade = false" />

    <!-- Platinum 升级弹窗 -->
    <PlatinumUpgradeModal v-if="showPlatinum" @close="showPlatinum = false" />

    <!-- Plus 升级弹窗 -->
    <PlusUpgradeModal v-if="showPlus" @close="showPlus = false" />

    <!-- Super Like 购买页 -->
    <SuperLikeModal v-if="showSuperLike" @close="showSuperLike = false" @open-gold="showSuperLike = false; showGoldUpgrade = true" />

    <!-- Boost 购买页 -->
    <BoostModal v-if="showBoost" @close="showBoost = false" @open-gold="showBoost = false; showGoldUpgrade = true" />

    <!-- 信息弹窗 -->
    <Transition name="sheet-fade">
      <div v-if="showInfoDialog" class="info-mask" @click.self="showInfoDialog = false">
        <div class="info-dialog">
          <div class="info-dialog-header">
            <h3 class="info-dialog-title">{{ infoDialogTitle }}</h3>
            <button class="info-dialog-close press" @click="showInfoDialog = false">✕</button>
          </div>
          <p class="info-dialog-content">{{ infoDialogContent }}</p>
          <button class="info-dialog-btn press" @click="showInfoDialog = false">我知道了</button>
        </div>
      </div>
    </Transition>

    <!-- 删除账户确认 -->
    <Transition name="sheet-fade">
      <div v-if="showDeleteConfirm" class="info-mask" @click.self="showDeleteConfirm = false">
        <div class="info-dialog">
          <div class="info-dialog-header">
            <h3 class="info-dialog-title">删除账户</h3>
            <button class="info-dialog-close press" @click="showDeleteConfirm = false">✕</button>
          </div>
          <p class="info-dialog-content">确定要删除账户吗？此操作不可撤销，你的所有数据、配对和消息都将被永久删除。</p>
          <div class="info-dialog-actions">
            <button class="info-dialog-cancel press" @click="showDeleteConfirm = false">取消</button>
            <button class="info-dialog-danger press" @click="showDeleteConfirm = false; logout()">确认删除</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; }

.top-bar {
  position: sticky; top: 0; z-index: 10;
  height: 52px; background: #fff; border-bottom: 1px solid #eee;
  display: flex; align-items: center; justify-content: space-between; padding: 0 16px;
}
.back { width: 32px; height: 32px; font-size: 22px; color: #fe3c72; }
.top-title { font-size: 16px; font-weight: 600; color: #111; margin-right: 250px; }

.main { padding: 0 16px 24px; }

/* Promo */
.promo-section { padding: 16px 0; display: flex; flex-direction: column; gap: 6px; }
.promo-card { background: #fff; border-radius: 14px; padding: 8px; text-align: center; }
.promo-platinum { background: #fff; }
.promo-gold { background: #fff; }
.promo-plus { background: #fff; }
.promo-brand { display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 8px; }
.promo-name { font-size: 30px; font-weight: 800; font-style: normal; color: #111; font-family: inherit; }
.promo-tier { font-size: 9px; font-weight: 800; padding: 2px 5px; border-radius: 3px; letter-spacing: 0.5px; }
.promo-tier-plat { color: #ffffffff; background: #141414ff; }
.promo-tier-gold { color: #b8860b; background: rgba(184,134,11,0.12); }
.promo-tier-plus { color: #f2385a; font-size: 25px; font-weight: 300; background: none; }
.promo-desc { font-size: 13px; color: #666; line-height: 1.5; margin: 0; }

/* Quick Grid */
.quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 8px 0 16px; }
.feature-card { background: #fff; border-radius: 24px; padding: 12px 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; aspect-ratio: 1.7 / 1; cursor: pointer; transition: transform 0.1s ease; }
.feature-card:active { transform: scale(0.97); }
.fc-icon-circle { width: 48px; height: 48px; border-radius: 50%; border: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.fc-label { font-size: 15px; font-weight: 600; text-align: center; letter-spacing: 0.5px; }
.fc-icon-blue { fill: #2db3ff; }
.fc-icon-purple { fill: #b649f5; }
.fc-icon-black { fill: #333; }
.fc-icon-red { fill: #ff4458; }
.fc-color-blue { color: #2db3ff; }
.fc-color-purple { color: #b649f5; }
.fc-color-black { color: #333; }
.fc-color-red { color: #ff4458; }

/* Section */
.sec { padding: 8px 0; }
.sec-label { font-size: 14px; font-weight: 700; color: #111; margin: 12px 0 8px; }
.sec-label-row { display: flex; align-items: center; margin: 12px 0 8px; }
.sec-hint { font-size: 12px; color: #999; margin: 6px 0 0; line-height: 1.5; }

/* Card */
.card { background: #fff; border-radius: 14px; padding: 16px; margin-bottom: 8px; }
.list-card { background: #fff; border-radius: 14px; overflow: hidden; margin-bottom: 8px; }

.row-between { display: flex; align-items: center; justify-content: space-between; }
.row-label { font-size: 12px; color: #999; margin-bottom: 6px; }
.row-title { font-size: 15px; font-weight: 600; color: #111; }
.row-value { font-size: 14px; color: #666; }
.row-value-bold { font-size: 15px; font-weight: 700; color: #111; }
.row-desc { font-size: 12px; color: #666; line-height: 1.5; flex: 1; margin-right: 12px; }
.row-sub { font-size: 12px; color: #999; margin: 2px 0 0; line-height: 1.4; }
.row-right-gray { margin-left: auto; font-size: 13px; color: #bbb; }
.row-check { display: flex; align-items: center; justify-content: space-between; }
.check-pink { color: #f2385a; font-size: 18px; font-weight: 700; }
.arrow { color: #ccc; font-size: 18px; }
.link-red { color: #f2385a; font-size: 13px; font-weight: 600; text-decoration: none; display: block; margin-top: 8px; }
.single-row { font-size: 14px; color: #111; }
.single-row-arrow { display: flex; align-items: center; justify-content: space-between; font-size: 14px; color: #111; }

.row-location { display: flex; align-items: center; gap: 6px; font-size: 15px; color: #111; margin: 4px 0; }
.loc-pin { font-size: 18px; }

/* List rows */
.list-row { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid #f5f5f5; font-size: 14px; color: #111; }
.list-row:last-child { border-bottom: 0; }
.list-row-arrow { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #f5f5f5; font-size: 14px; color: #111; }
.list-row-arrow:last-child { border-bottom: 0; }
.list-icon { font-size: 18px; width: 24px; text-align: center; }

/* Slider */
.slider {
  width: 100%;
  height: 3px;
  appearance: none;
  -webkit-appearance: none;
  background: #eee;
  border-radius: 2px;
  outline: none;
  margin-top: 10px;
  position: relative;
}
.slider::-webkit-slider-runnable-track {
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(to right, #f2385a 0%, #f2385a var(--val, 50%), #eee var(--val, 50%));
}
.slider::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #f2385a;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin-top: -10px;
}
.slider::-moz-range-track {
  height: 3px;
  border-radius: 2px;
  background: #eee;
}
.slider::-moz-range-progress {
  height: 3px;
  border-radius: 2px;
  background: #f2385a;
}
.slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #f2385a;
  cursor: pointer;
  border: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Toggle */
.toggle { position: relative; width: 44px; height: 24px; display: inline-block; flex: none; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; inset: 0; background: #f0f0f0; border: 1.5px solid #d1d1d1; border-radius: 14px; transition: all 0.3s ease; cursor: pointer; }
.toggle-slider::before { content: ''; position: absolute; width: 30px; height: 30px; border-radius: 50%; background: #b5b5b5; left: -4px; top: 50%; transform: translateY(-50%); transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); }
.toggle-slider::after { content: ''; position: absolute; width: 10px; height: 6px; border-left: 2px solid white; border-bottom: 2px solid white; transform: rotate(-45deg) translate(1px, -1px); left: 4px; top: 7px; opacity: 0; transition: opacity 0.2s ease, left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.toggle input:checked + .toggle-slider { background: #fff0f3; border-color: #ff2d55; }
.toggle input:checked + .toggle-slider::before { left: calc(100% - 26px); background: #ff2d55; box-shadow: 0 2px 10px rgba(255, 45, 85, 0.4); }
.toggle input:checked + .toggle-slider::after { opacity: 1; left: calc(100% - 16px); }
.toggle-slider:active::before { transform: translateY(-50%) scale(0.9); }

/* Unit Toggle */
.unit-toggle { display: flex; gap: 0; margin-top: 10px; border-radius: 9999px; overflow: hidden; border: 1px solid #eee; }
.unit-btn { flex: 1; height: 40px; font-size: 14px; font-weight: 600; color: #666; background: #fff; border: 0; }
.unit-active { background: #f2385a; color: #fff; border-radius: 9999px; }

/* Unlock */
.unlock-card { background: linear-gradient(135deg, #fffdf5, #fff8e1); border-radius: 14px; padding: 20px; position: relative; overflow: hidden; }
.unlock-card::after { content: ''; position: absolute; right: -20px; bottom: -20px; width: 120px; height: 120px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C12 2 6 8 6 13.5C6 17.6 9 21 12 21C15 21 18 17.6 18 13.5C18 10 15.5 8 15.5 8C15.5 8 15 12 13 12C13 12 14 7 12 2Z' fill='%23f5e6b8' opacity='0.4'/%3E%3C/svg%3E") no-repeat center; background-size: contain; opacity: 0.5; }
.unlock-title { font-size: 22px; font-weight: 700; color: #c9a000; margin: 0 0 8px; line-height: 1.3; font-style: italic; }
.unlock-desc { font-size: 12px; color: #666; line-height: 1.5; margin: 0 0 12px; position: relative; z-index: 1; }
.unlock-bottom { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1; }
.unlock-avatars { font-size: 24px; }
.unlock-btn { padding: 8px 20px; border-radius: 9999px; border: 1.5px solid #c9a000; font-size: 13px; font-weight: 600; color: #111; background: #fff; }

/* Tinder Plus Badge */
.tinder-plus-badge { font-size: 10px; font-weight: 700; color: #fff; background: linear-gradient(90deg, #fd297b, #ff655b); padding: 3px 8px; border-radius: 4px; }

/* Logout / Delete */
.logout-btn { width: 100%; height: 48px; border-radius: 14px; background: #fff; font-size: 15px; font-weight: 600; color: #111; }
.delete-btn { width: 100%; height: 48px; border-radius: 14px; background: #fff; font-size: 15px; font-weight: 600; color: #111; }

/* Version */
.version-sec { text-align: center; padding: 24px 0; display: flex; flex-direction: column; align-items: center; }
.version-text { font-size: 12px; color: #999; margin-top: 8px; }

/* 兴趣全屏页 */
.interests-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.ip-header { padding: 20px 20px 0; }
.ip-close { width: 32px; height: 32px; font-size: 20px; color: #111; margin-bottom: 12px; background: none; border: none; }
.ip-title-row { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
.ip-title { font-size: 28px; font-weight: 800; color: #111; margin: 0; }
.ip-count { font-size: 16px; font-weight: 600; color: #999; }
.ip-desc { font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 16px; }
.ip-search { display: flex; align-items: center; gap: 8px; padding: 12px 14px; background: #f5f5f5; border-radius: 10px; margin-bottom: 16px; }
.ip-search-icon { font-size: 14px; opacity: 0.5; }
.ip-search-input { flex: 1; border: 0; background: transparent; font-size: 14px; color: #111; outline: none; }
.ip-search-input::placeholder { color: #999; }
.ip-body { flex: 1; overflow-y: auto; padding: 0 20px 32px; }
.ip-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.ip-tag { padding: 10px 16px; border-radius: 9999px; border: 1.5px solid #ddd; font-size: 14px; color: #333; background: #fff; cursor: pointer; transition: all 0.15s; }
.ip-tag-selected { border-color: #111; background: #111; color: #fff; }

/* 半弹窗 */
.hs-mask { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.4); display: flex; align-items: flex-end; justify-content: center; }
.hs-sheet { width: 100%; max-width: 480px; max-height: 55vh; background: #fff; border-radius: 24px 24px 0 0; display: flex; flex-direction: column; transition: max-height 0.3s ease; animation: sheetUp 0.3s ease; }
.hs-full { max-height: 90vh; }
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.hs-handle { width: 36px; height: 4px; border-radius: 2px; background: #ccc; margin: 10px auto 0; }
.hs-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 12px; }
.hs-title { font-size: 20px; font-weight: 800; color: #111; margin: 0; }
.hs-done-btn { padding: 8px 16px; border-radius: 9999px; background: #111; color: #fff; font-size: 13px; font-weight: 600; border: none; }
.hs-body { flex: 1; overflow-y: auto; padding: 0 20px 24px; }
.hs-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.hs-tag { padding: 10px 16px; border-radius: 9999px; border: 1.5px solid #ddd; font-size: 14px; color: #333; background: #fff; cursor: pointer; transition: all 0.15s; }
.hs-tag-selected { border-color: #111; background: #111; color: #fff; }

/* Transitions */
.slide-up-enter-active { animation: slideUp 0.3s ease; }
.slide-up-leave-active { animation: slideDown 0.3s ease; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.2s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }

/* Info Dialog */
.info-mask { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; padding: 20px; }
.info-dialog { background: #fff; border-radius: 16px; padding: 24px; width: 100%; max-width: 340px; }
.info-dialog-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.info-dialog-title { font-size: 18px; font-weight: 700; color: #111; margin: 0; }
.info-dialog-close { font-size: 16px; color: #999; background: none; border: none; cursor: pointer; }
.info-dialog-content { font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 20px; }
.info-dialog-btn { width: 100%; height: 44px; border-radius: 9999px; background: #111; color: #fff; font-size: 15px; font-weight: 600; border: none; cursor: pointer; }
.info-dialog-actions { display: flex; gap: 12px; }
.info-dialog-cancel { flex: 1; height: 44px; border-radius: 9999px; background: #f0f0f0; color: #111; font-size: 15px; font-weight: 600; border: none; cursor: pointer; }
.info-dialog-danger { flex: 1; height: 44px; border-radius: 9999px; background: #ff3b30; color: #fff; font-size: 15px; font-weight: 600; border: none; cursor: pointer; }
</style>
