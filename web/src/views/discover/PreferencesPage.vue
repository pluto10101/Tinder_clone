<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const activeBlock = ref('recommend');
const distanceMax = ref(80);
const showBeyondDistance = ref(true);
const genderInterest = ref('男性');
const ageMin = ref(18);
const ageMax = ref(33);
const showBeyondAge = ref(true);
const minPhotos = ref(1);
const hasProfile = ref(false);

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
  '跑步', '瑜伽', '篮球', '足球', '游泳', '登山', '骑行', '滑板', '冲浪', '钓鱼',
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
const halfSheetDragging = ref(false);
const halfSheetFull = ref(false);

const optionsMap: Record<string, string[]> = {
  '我想要': ['长期交往', '短期交往', '结交新朋友', '今晚有空', '长期交往，但不拒绝短期交往', '还没想好', '随缘', '先聊聊看', '寻找灵魂伴侣', '开放式关系'],
  '添加语言': ['南非语', '阿尔巴尼亚语', '阿姆哈拉语', '阿拉伯语', '亚美尼亚语', '美国手语', '阿萨姆语', '艾马拉语', '阿塞拜疆语', '班巴拉语', '巴斯克语', '白俄罗斯语', '孟加拉人', '比哈尔语', '波斯尼亚语', '布列塔尼语', '保加利亚语', '缅甸语', '粤语', '加泰罗尼亚语', '宿雾语', '齐切瓦语', '科西嘉语', '克罗地亚语', '捷克语', '丹麦语', '迪维希语', '多格拉语', '荷兰语', '英语', '世界语', '爱沙尼亚语', '埃维语', '菲律宾语', '芬兰语', '法语', '弗里西亚语', '加利西亚语', '格鲁吉亚语', '德语', '希腊语', '瓜拉尼', '古吉拉特人', '中文', '日语', '韩语', '西班牙语', '葡萄牙语', '俄语', '意大利语', '泰语', '越南语', '印地语', '马来语', '印尼语', '土耳其语', '波兰语', '乌克兰语', '瑞典语', '挪威语'],
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

// 半弹窗拖拽
let sheetTouchStartY = 0;
function onSheetTouchStart(e: TouchEvent) { sheetTouchStartY = e.touches[0].clientY; halfSheetDragging.value = true; }
function onSheetTouchEnd(e: TouchEvent) {
  const dy = e.changedTouches[0].clientY - sheetTouchStartY;
  halfSheetDragging.value = false;
  if (dy < -60) halfSheetFull.value = true;
  else if (dy > 60 && halfSheetFull.value) halfSheetFull.value = false;
  else if (dy > 60 && !halfSheetFull.value) closeHalfSheet();
}

function goBack() { router.back(); }
</script>

<template>
  <div class="page">
    <header class="top-bar safe-top">
      <button class="back press" @click="goBack">←</button>
      <span class="top-title">偏好设置</span>
      <div style="width: 32px;"></div>
    </header>

    <main class="main">
      <!-- 版块 -->
      <section class="sec">
        <div class="card">
          <div class="sec-label-inner">版块</div>
          <div class="block-tabs">
            <button class="block-tab" :class="{ active: activeBlock === 'recommend' }" @click="activeBlock = 'recommend'">为你推荐</button>
            <button class="block-tab" :class="{ active: activeBlock === 'group' }" @click="activeBlock = 'group'">抱团约会</button>
            <button class="block-tab" :class="{ active: activeBlock === 'astro' }" @click="activeBlock = 'astro'">占星术</button>
            <button class="block-tab" :class="{ active: activeBlock === 'music' }" @click="activeBlock = 'music'">音乐</button>
          </div>
        </div>
      </section>

      <!-- 位置 -->
      <section class="sec">
        <div class="card">
          <div class="sec-label-inner">位置</div>
          <div class="loc-row">
            <span class="loc-pin">📍</span>
            <span class="loc-text">成都市, 中国</span>
          </div>
          <a href="#" class="link-red" @click.prevent>添加一个新位置</a>
        </div>
        <p class="hint">更改位置，随地配对。</p>
      </section>

      <!-- 最大距离 -->
      <section class="sec">
        <div class="card">
          <div class="row-between">
            <span class="field-title">最大距离</span>
            <span class="field-value">{{ distanceMax }}公里</span>
          </div>
          <input v-model.number="distanceMax" type="range" min="1" max="160" class="slider" :style="{ '--val': (distanceMax / 160 * 100) + '%' }" />
          <div class="row-between" style="margin-top: 14px;">
            <span class="field-desc">当我将可看的个人资料浏览完后向我显示超出距离范围的用户</span>
            <label class="toggle"><input v-model="showBeyondDistance" type="checkbox" /><span class="toggle-slider"></span></label>
          </div>
        </div>
      </section>

      <!-- 感兴趣 -->
      <section class="sec">
        <div class="card">
          <div class="sec-label-inner">感兴趣</div>
          <div class="row-between">
            <span class="field-title">{{ genderInterest }}</span>
            <span class="arrow">›</span>
          </div>
        </div>
      </section>

      <!-- 年龄范围 -->
      <section class="sec">
        <div class="card">
          <div class="row-between">
            <span class="field-title">年龄范围</span>
            <span class="field-value">{{ ageMin }} - {{ ageMax }}</span>
          </div>
          <input v-model.number="ageMax" type="range" min="18" max="100" class="slider" :style="{ '--val': ((ageMax - 18) / 82 * 100) + '%' }" />
          <div class="row-between" style="margin-top: 14px;">
            <span class="field-desc">当我将可看的个人资料浏览完毕后向我显示略微超出偏好范围的用户。</span>
            <label class="toggle"><input v-model="showBeyondAge" type="checkbox" /><span class="toggle-slider"></span></label>
          </div>
        </div>
      </section>

      <!-- 解锁更多偏好设置 -->
      <section class="sec">
        <div class="unlock-card">
          <h3 class="unlock-title">解锁更多<br/>偏好设置</h3>
          <p class="unlock-desc">想要更多独特体验？设置高级偏好，查看对你口味的个人资料，但又不会错过其他的有缘人。</p>
          <div class="unlock-bottom">
            <div class="unlock-avatars">👤👤👤👤</div>
            <button class="unlock-btn press">解锁</button>
          </div>
        </div>
      </section>

      <!-- 最少照片数 -->
      <section class="sec">
        <div class="row-between" style="padding: 0 4px;">
          <span class="field-title">最少照片数</span>
          <span class="field-value">{{ minPhotos }}</span>
        </div>
        <input v-model.number="minPhotos" type="range" min="1" max="9" class="slider" :style="{ '--val': ((minPhotos - 1) / 8 * 100) + '%' }" />
      </section>

      <!-- 有个人资料 -->
      <section class="sec">
        <div class="row-between" style="padding: 8px 0;">
          <span class="field-title">有个人资料</span>
          <label class="toggle"><input v-model="hasProfile" type="checkbox" /><span class="toggle-slider"></span></label>
        </div>
      </section>

      <!-- 筛选列表 -->
      <section class="sec filter-list">
        <div class="filter-row" @click="showInterestsPage = true"><span>兴趣</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('我想要')"><span class="filter-icon">🎯</span><span>我想要</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('添加语言')"><span class="filter-icon">🗣</span><span>添加语言</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('星座')"><span class="filter-icon">🌙</span><span>星座</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('教育情况')"><span class="filter-icon">🎓</span><span>教育情况</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('家庭计划')"><span class="filter-icon">👶</span><span>家庭计划</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('沟通风格')"><span class="filter-icon">💬</span><span>沟通风格</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('爱的方式')"><span class="filter-icon">💝</span><span>爱的方式</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('宠物喜好')"><span class="filter-icon">🐾</span><span>宠物喜好</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('饮酒')"><span class="filter-icon">🍷</span><span>饮酒</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('你多久抽一次烟？')"><span class="filter-icon">🚬</span><span>你多久抽一次烟？</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('健身情况')"><span class="filter-icon">💪</span><span>健身情况</span><span class="filter-right">选择 ›</span></div>
        <div class="filter-row" @click="openHalfSheet('社交媒体活跃度')"><span class="filter-icon">@</span><span>社交媒体活跃度</span><span class="filter-right">选择 ›</span></div>
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
            <svg class="ip-search-icon-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M446.112323 177.545051c137.567677 0.219798 252.612525 104.59798 266.162424 241.493333 13.562828 136.895354-78.778182 261.818182-213.617777 289.008485-134.852525 27.203232-268.386263-52.156768-308.945455-183.608889s25.018182-272.252121 151.738182-325.779394A267.235556 267.235556 0 0 1 446.112323 177.545051m0-62.060607c-182.794343 0-330.989899 148.195556-330.989899 330.989899s148.195556 330.989899 330.989899 330.989899 330.989899-148.195556 330.989899-330.989899-148.195556-330.989899-330.989899-330.989899z m431.321212 793.341415a30.849293 30.849293 0 0 1-21.94101-9.102223l-157.220202-157.220202c-11.752727-12.179394-11.584646-31.534545 0.37495-43.50707 11.972525-11.972525 31.327677-12.140606 43.494141-0.37495l157.220202 157.220202a31.036768 31.036768 0 0 1 6.723232 33.810101 31.004444 31.004444 0 0 1-28.651313 19.174142z m0 0"/></svg>
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
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; }

.top-bar {
  position: sticky; top: 0; z-index: 10;
  height: 52px; background: #fff; border-bottom: 1px solid #eee;
  display: flex; align-items: center; justify-content: space-between; padding: 0 16px;
}
.back { width: 32px; height: 32px; font-size: 22px; color: #111; }
.top-title { font-size: 16px; font-weight: 600; color: #111; }

.main { padding: 12px 16px 24px; }
.sec { margin-bottom: 12px; }
.card { background: #fff; border-radius: 14px; padding: 16px; }
.sec-label-inner { font-size: 30px; color: #999; margin-bottom: 25px; }

/* Block Tabs */
.block-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.block-tab { padding: 8px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; color: #111; border: 1.5px solid #ddd; background: #fff; transition: all 0.2s; }
.block-tab.active { border-color: #111; }

/* Location */
.loc-row { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
.loc-pin { font-size: 18px; }
.loc-text { font-size: 15px; font-weight: 500; color: #111; }
.link-red { color: #f2385a; font-size: 13px; font-weight: 600; text-decoration: none; display: block; margin-top: 8px; }
.hint { font-size: 12px; color: #999; margin: 6px 4px 0; }

/* Fields */
.row-between { display: flex; align-items: center; justify-content: space-between; }
.field-title { font-size: 15px; font-weight: 600; color: #111; }
.field-value { font-size: 15px; font-weight: 700; color: #111; }
.field-desc { font-size: 12px; color: #666; line-height: 1.5; flex: 1; margin-right: 12px; }
.arrow { color: #ccc; font-size: 18px; }

/* Slider */
.slider { width: 100%; height: 3px; appearance: none; -webkit-appearance: none; background: #eee; border-radius: 2px; outline: none; margin-top: 10px; }
.slider::-webkit-slider-runnable-track { height: 3px; border-radius: 2px; background: linear-gradient(to right, #f2385a 0%, #f2385a var(--val, 50%), #eee var(--val, 50%)); }
.slider::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #f2385a; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2); margin-top: -10px; }

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

/* Unlock */
.unlock-card { background: linear-gradient(135deg, #fffdf5, #fff8e1); border-radius: 14px; padding: 20px; position: relative; overflow: hidden; }
.unlock-title { font-size: 22px; font-weight: 700; color: #c9a000; margin: 0 0 8px; line-height: 1.3; font-style: italic; }
.unlock-desc { font-size: 12px; color: #666; line-height: 1.5; margin: 0 0 12px; }
.unlock-bottom { display: flex; align-items: center; justify-content: space-between; }
.unlock-avatars { font-size: 24px; }
.unlock-btn { padding: 8px 20px; border-radius: 9999px; border: 1.5px solid #c9a000; font-size: 13px; font-weight: 600; color: #111; background: #fff; }

/* Filter List */
.filter-list { background: transparent; }
.filter-row { display: flex; align-items: center; gap: 10px; padding: 14px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #111; cursor: pointer; }
.filter-row:last-child { border-bottom: 0; }
.filter-icon { font-size: 18px; width: 24px; text-align: center; flex: none; color: #666; }
.filter-right { margin-left: auto; font-size: 13px; color: #bbb; }

/* 兴趣全屏页 */
.interests-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; }
.ip-header { padding: 20px 20px 0; }
.ip-close { width: 32px; height: 32px; font-size: 20px; color: #111; margin-bottom: 12px; }
.ip-title-row { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
.ip-title { font-size: 28px; font-weight: 500; color: #111; margin: 0; }
.ip-count { font-size: 16px; font-weight: 600; color: #999; }
.ip-desc { font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 16px; }
.ip-search { display: flex; align-items: center; gap: 8px; padding: 12px 14px; background: #f5f5f5; border-radius: 10px; margin-bottom: 16px; }
.ip-search-icon { font-size: 14px; opacity: 0.5; }
.ip-search-icon-svg { width: 16px; height: 16px; fill: #999; flex-shrink: 0; }
.ip-search-input { flex: 1; border: 0; background: transparent; font-size: 14px; color: #111; outline: none; }
.ip-search-input::placeholder { color: #999; }
.ip-body { flex: 1; overflow-y: auto; padding: 0 20px 32px; }
.ip-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.ip-tag { padding: 5px 15px; border-radius: 9999px; border: 1.5px solid #ddd; font-size: 14px; color: #333; background: #fff; cursor: pointer; transition: all 0.15s; }
.ip-tag-selected { border-color: #111; background: #111; color: #fff; }

/* 半弹窗 */
.hs-mask { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.4); display: flex; align-items: flex-end; justify-content: center; }
.hs-sheet { width: 100%; max-width: 480px; max-height: 50vh; background: #fff; border-radius: 24px 24px 0 0; display: flex; flex-direction: column; transition: max-height 0.3s ease; animation: sheetUp 0.3s ease; }
.hs-full { max-height: 90vh; }
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.hs-handle { width: 36px; height: 4px; border-radius: 2px; background: #ccc; margin: 10px auto 0; }
.hs-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 12px; }
.hs-title { font-size: 20px; font-weight: 500; color: #111; margin: 0; }
.hs-done-btn { padding: 8px 16px; border-radius: 9999px; background: #f0f0f0; color: #111; font-size: 13px; font-weight: 600; }
.hs-body { flex: 1; overflow-y: auto; padding: 0 20px 24px; }
.hs-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.hs-tag { padding: 8px 12px; border-radius: 9999px; border: 1.5px solid #ddd; font-size: 14px; color: #333; background: #fff; cursor: pointer; transition: all 0.15s; }
.hs-tag-selected { border-color: #111; background: #111; color: #fff; }

/* Transitions */
.slide-up-enter-active { animation: slideUp 0.3s ease; }
.slide-up-leave-active { animation: slideDown 0.3s ease; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.2s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }
</style>
