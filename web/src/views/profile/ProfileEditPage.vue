<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { profileApi } from '@/api/profile';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(true);
const saving = ref(false);
const activeTab = ref<'edit' | 'preview'>('edit');

// 编辑字段
const photos = ref<{ id: number; url: string; sort_order: number }[]>([]);
const smartPhotos = ref(true);
const bio = ref('');
const aboutMe = ref('');
const interests = ref<string[]>([]);
const datingPurpose = ref<string[]>([]);
const heightCm = ref<number | null>(null);
const jobTitle = ref('');
const company = ref('');
const school = ref('');
const city = ref('');
const gender = ref('');
const showGender = ref(true);
const orientation = ref('');
const showOrientation = ref(false);
const showAge = ref(true);
const showDistance = ref(true);
const lifestyles = ref<Record<string, string>>({});

const PHOTO_SLOTS = 9;

onMounted(async () => {
  try {
    if (!userStore.profile) await userStore.fetchProfile();
    const p = userStore.profile!;
    photos.value = [...(p.photos || [])];
    bio.value = p.bio || '';
    jobTitle.value = p.job_title || '';
    company.value = p.company || '';
    school.value = p.school || '';
    city.value = p.city || '';
    gender.value = p.gender || '';
    heightCm.value = p.height_cm;
    interests.value = [...(p.interests || [])];
    datingPurpose.value = [...(p.dating_purpose || [])];
    lifestyles.value = { ...(p.lifestyles || {}) };
    orientation.value = Array.isArray(p.sexual_orientation)
      ? p.sexual_orientation.join(', ')
      : (p.sexual_orientation || '');
    showGender.value = p.settings?.show_gender ?? true;
    showOrientation.value = p.settings?.show_orientation ?? false;
    showAge.value = p.settings?.show_age ?? true;
    showDistance.value = p.settings?.show_distance ?? true;
  } catch {}
  loading.value = false;
});

// 照片
const fileInputs = ref<HTMLInputElement[]>([]);
const uploading = ref<Record<number, boolean>>({});

function triggerUpload(i: number) {
  fileInputs.value[i]?.click();
}

async function onFileChange(i: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  uploading.value = { ...uploading.value, [i]: true };
  try {
    const photo = await profileApi.uploadPhoto(file);
    photos.value = [...photos.value, photo];
  } catch {}
  uploading.value = { ...uploading.value, [i]: false };
}

async function removePhoto(id: number) {
  try { await profileApi.deletePhoto(id); } catch {}
  photos.value = photos.value.filter((p) => p.id !== id);
}

async function save() {
  if (saving.value) return;
  saving.value = true;
  try {
    await userStore.updateProfile({
      bio: bio.value,
      job_title: jobTitle.value,
      company: company.value,
      school: school.value,
      city: city.value,
      height_cm: heightCm.value,
      interests: interests.value,
      dating_purpose: datingPurpose.value,
      lifestyles: lifestyles.value,
      settings: {
        ...(userStore.profile?.settings || {} as any),
        show_gender: showGender.value,
        show_orientation: showOrientation.value,
        show_age: showAge.value,
        show_distance: showDistance.value,
      },
    });
    router.back();
  } catch {}
  saving.value = false;
}

function goBack() { router.back(); }

// 半弹窗（复用设置页面模式）
const showHalfSheet = ref(false);
const halfSheetTitle = ref('');
const halfSheetOptions = ref<string[]>([]);
const halfSheetSelected = ref<string[]>([]);
const halfSheetFull = ref(false);

const optionsMap: Record<string, string[]> = {
  '兴趣': ['旅行', '音乐', '电影', '美食', '健身', '阅读', '摄影', '游戏', '动漫', '咖啡', '宠物', '户外', '艺术', '舞蹈', '烹饪', '瑜伽', '跑步', '篮球', '足球', '游泳'],
  '我想要': ['寻找长期的伴侣', '长期交往，但不拒绝短期交往', '短期交往，但不拒绝长期交往', '享受短期交往的乐趣', '结交新朋友', '我还在思考'],
  '身高': ['150 cm', '155 cm', '160 cm', '165 cm', '170 cm', '175 cm', '180 cm', '185 cm', '190 cm', '195 cm', '200 cm'],
  '添加语言': ['中文', '英语', '日语', '韩语', '法语', '德语', '西班牙语', '葡萄牙语', '俄语', '阿拉伯语'],
  '星座': ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
  '教育情况': ['高中', '大专', '本科在读', '本科', '硕士在读', '硕士', '博士在读', '博士'],
  '家庭计划': ['想要孩子', '不想要孩子', '有孩子，还想要更多', '有孩子，不想再要了', '不确定'],
  '沟通风格': ['大声说出来', '文字优先', '视频通话', '面对面', '随缘'],
  '爱的方式': ['肯定的言辞', '精心的时刻', '赠送礼物', '服务的行动', '身体接触'],
  '宠物喜好': ['狗', '猫', '仓鼠', '兔子', '鱼', '鸟', '爬行动物', '两栖动物', '其他', '没有宠物', '所有宠物都喜欢', '过敏'],
  '饮酒': ['不喝酒', '偶尔小酌', '社交场合喝', '经常喝', '正在戒酒'],
  '你多久抽一次烟？': ['不抽烟', '社交场合抽', '经常抽', '正在戒烟'],
  '健身情况': ['每天', '经常', '有时', '从不'],
  '社交媒体活跃度': ['几乎不用', '偶尔刷刷', '经常使用', '重度用户'],
  '外出': ['酒吧', '夜店', '餐厅', '咖啡馆', '公园', '电影院', '博物馆', '音乐节'],
  '我的周末': ['宅家', '户外运动', '朋友聚会', '旅行', '加班', '学习', '逛街', '睡觉'],
  '我和我的手机': ['形影不离', '偶尔看看', '尽量少用', '只用来打电话', '社交媒体达人'],
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
</script>

<template>
  <div class="page">
    <!-- 顶部 -->
    <header class="top-bar safe-top">
      <button class="back press" @click="goBack">←</button>
      <span class="top-title">编辑个人资料</span>
      <div style="width: 32px;"></div>
    </header>

    <!-- 编辑/预览 Tab -->
    <div class="tab-bar">
      <button class="tab" :class="{ active: activeTab === 'edit' }" @click="activeTab = 'edit'">编辑</button>
      <button class="tab" :class="{ active: activeTab === 'preview' }" @click="activeTab = 'preview'">预览</button>
    </div>

    <main v-if="!loading && activeTab === 'edit'" class="main">

      <!-- 媒体 -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">媒体</span>
            <span class="sec-badge-red">立即添加</span>
          </div>
          <span class="sec-percent">+28%</span>
        </div>
        <p class="sec-desc">最多上传九张照片。添加照片配文，彰显你的个性。</p>
        <a href="#" class="sec-link" @click.prevent>查看如何选择照片，助你脱颖而出</a>

        <div class="photo-grid">
          <template v-for="i in PHOTO_SLOTS" :key="i">
            <div class="photo-slot" :class="{ filled: photos[i - 1] }">
              <template v-if="photos[i - 1]">
                <img :src="photos[i - 1]!.url" class="photo-img" />
                <button class="photo-edit press">✎</button>
              </template>
              <template v-else>
                <button v-if="!uploading[i-1]" class="photo-add press" @click="triggerUpload(i-1)">+</button>
                <div v-else class="photo-loading">...</div>
                <input :ref="(el) => el && (fileInputs[i-1] = el as HTMLInputElement)" type="file" accept="image/*" class="hidden" @change="onFileChange(i-1, $event)" />
              </template>
            </div>
          </template>
        </div>
      </section>

      <!-- 照片选项 -->
      <section class="sec">
        <div class="sec-title-plain">照片选项</div>
        <div class="option-row">
          <span>智能照片</span>
          <label class="toggle">
            <input v-model="smartPhotos" type="checkbox" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <p class="sec-desc">智能照片会一直测试你的所有个人资料照片，以找到最棒的一张。</p>
      </section>

      <!-- 关于我 (bio) -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">关于我</span>
            <span class="sec-badge-red">重要</span>
          </div>
          <span class="sec-percent">+20%</span>
        </div>
        <div class="input-card">
          <textarea v-model="bio" class="textarea" rows="2" placeholder="关于我" maxlength="500" />
          <span class="char-count">{{ 500 - bio.length }}</span>
        </div>
        <a href="#" class="sec-link" @click.prevent>"关于我"的快速提示</a>
      </section>

      <!-- 关于我 (提示) -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">关于我</span>
          </div>
          <span class="sec-percent">+10%</span>
        </div>
        <div class="input-card prompt-card">
          <button class="prompt-add press">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#fe3c72"/><path d="M12 7v10M7 12h10" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <div class="prompt-header">
            <strong>选择一条提示</strong>
          </div>
          <p class="prompt-sub">回答提示</p>
        </div>
      </section>

      <!-- 兴趣 -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">兴趣</span>
          </div>
          <span class="sec-percent">+5%</span>
        </div>
        <div class="input-card" @click="openHalfSheet('兴趣')">
          <span class="placeholder-text">添加兴趣</span>
          <span class="arrow">›</span>
        </div>
      </section>

      <!-- 交往目标 -->
      <section class="sec">
        <div class="sec-title-plain">交往目标</div>
        <div class="input-card row-card" @click="openHalfSheet('我想要')">
          <span class="row-icon"><svg class="edit-field-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M515.2 224c-307.2 0-492.8 313.6-492.8 313.6s214.4 304 492.8 304 492.8-304 492.8-304S822.4 224 515.2 224zM832 652.8c-102.4 86.4-211.2 140.8-320 140.8s-217.6-51.2-320-140.8c-35.2-32-70.4-64-99.2-99.2-6.4-6.4-9.6-12.8-16-19.2 3.2-6.4 9.6-12.8 12.8-19.2 25.6-35.2 57.6-70.4 92.8-102.4 99.2-89.6 208-144 329.6-144s230.4 54.4 329.6 144c35.2 32 64 67.2 92.8 102.4 3.2 6.4 9.6 12.8 12.8 19.2-3.2 6.4-9.6 12.8-16 19.2C902.4 585.6 870.4 620.8 832 652.8z"/><path d="M512 345.6c-96 0-169.6 76.8-169.6 169.6 0 96 76.8 169.6 169.6 169.6 96 0 169.6-76.8 169.6-169.6C681.6 422.4 604.8 345.6 512 345.6zM512 640c-67.2 0-121.6-54.4-121.6-121.6 0-67.2 54.4-121.6 121.6-121.6 67.2 0 121.6 54.4 121.6 121.6C633.6 582.4 579.2 640 512 640z"/></svg></span>
          <span>我想要</span>
          <span class="row-right">🤔 {{ datingPurpose[0] || '我还在思考' }}</span>
          <span class="arrow">›</span>
        </div>
      </section>

      <!-- 身高 -->
      <section class="sec">
        <div class="sec-title-plain">身高</div>
        <div class="input-card row-card" @click="openHalfSheet('身高')">
          <svg class="edit-field-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M580.266667 226.133333l-55.466667 55.466667 98.133333 98.133333-29.866666 29.866667-98.133334-98.133333-55.466666 55.466666 98.133333 98.133334-29.866667 29.866666-98.133333-98.133333-55.466667 55.466667 98.133334 98.133333-29.866667 29.866667-98.133333-98.133334-55.466667 55.466667 98.133333 98.133333-29.866666 29.866667-98.133334-98.133333-93.866666 93.866666 179.2 179.2 512-512-179.2-179.2-51.2 51.2L704 298.666667l-29.866667 29.866666-93.866666-102.4zM657.066667 85.333333l243.2 243.2L328.533333 900.266667 85.333333 657.066667 657.066667 85.333333z" fill="#444444"/></svg>
          <span class="placeholder-text">{{ heightCm ? heightCm + ' cm' : '添加身高' }}</span>
          <span class="arrow">›</span>
        </div>
      </section>

      <!-- 我会的语言 -->
      <section class="sec">
        <div class="sec-title-plain">我会的语言</div>
        <div class="input-card" @click="openHalfSheet('添加语言')"><span class="placeholder-text">添加语言</span><span class="arrow">›</span></div>
      </section>

      <!-- 我的更多信息 -->
      <section class="sec">
        <div class="sec-title-plain">我的更多信息</div>
        <div class="info-row" @click="openHalfSheet('星座')"><span class="info-icon">🌙</span><span>星座</span><span class="info-right">选择 ›</span></div>
        <div class="info-row" @click="openHalfSheet('教育情况')"><span class="info-icon">🎓</span><span>教育情况</span><span class="info-right">选择 ›</span></div>
        <div class="info-row" @click="openHalfSheet('家庭计划')"><span class="info-icon">👶</span><span>家庭计划</span><span class="info-right">选择 ›</span></div>
        <div class="info-row" @click="openHalfSheet('沟通风格')"><span class="info-icon">💬</span><span>沟通风格</span><span class="info-right">选择 ›</span></div>
        <div class="info-row" @click="openHalfSheet('爱的方式')"><span class="info-icon">💝</span><span>爱的方式</span><span class="info-right">选择 ›</span></div>
      </section>

      <!-- 生活方式 -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">生活方式</span>
          </div>
          <span class="sec-percent">+5%</span>
        </div>
        <div class="info-row" @click="openHalfSheet('宠物喜好')"><span class="info-icon">🐾</span><span>宠物喜好</span><span class="info-right">选择 ›</span></div>
        <div class="info-row" @click="openHalfSheet('饮酒')"><span class="info-icon">🍷</span><span>饮酒</span><span class="info-right">选择 ›</span></div>
        <div class="info-row" @click="openHalfSheet('你多久抽一次烟？')"><span class="info-icon">🚬</span><span>你多久抽一次烟？</span><span class="info-right">选择 ›</span></div>
        <div class="info-row" @click="openHalfSheet('健身情况')"><span class="info-icon">💪</span><span>健身情况</span><span class="info-right">选择 ›</span></div>
        <div class="info-row" @click="openHalfSheet('社交媒体活跃度')"><span class="info-icon">@</span><span>社交媒体活跃度</span><span class="info-right">选择 ›</span></div>
      </section>

      <!-- 欢迎跟我聊 -->
      <section class="sec">
        <div class="sec-title-plain">欢迎跟我聊</div>
        <div class="input-card" @click="openHalfSheet('外出')"><span>外出</span><span class="row-right-gray">添加问答 ›</span></div>
        <div class="input-card" @click="openHalfSheet('我的周末')"><span>我的周末</span><span class="row-right-gray">添加问答 ›</span></div>
        <div class="input-card" @click="openHalfSheet('我和我的手机')"><span>我和我的手机</span><span class="row-right-gray">添加问答 ›</span></div>
      </section>

      <!-- 职位 -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">职位</span>
            <span class="sec-badge-red">重要</span>
          </div>
          <span class="sec-percent">+4%</span>
        </div>
        <div class="input-card">
          <input v-model="jobTitle" class="field-input" placeholder="添加职位" />
        </div>
      </section>

      <!-- 公司 -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">公司</span>
          </div>
          <span class="sec-percent">+2%</span>
        </div>
        <div class="input-card">
          <input v-model="company" class="field-input" placeholder="添加公司" />
        </div>
      </section>

      <!-- 学校 -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">学校</span>
          </div>
          <span class="sec-percent">+4%</span>
        </div>
        <div class="input-card">
          <input v-model="school" class="field-input" placeholder="添加学校" />
        </div>
      </section>

      <!-- 居住地 -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">居住地</span>
          </div>
        </div>
        <div class="input-card">
          <input v-model="city" class="field-input" placeholder="添加城市" />
        </div>
      </section>

      <!-- 我的最爱歌曲 -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">我的最爱歌曲</span>
          </div>
        </div>
        <div class="input-card"><span class="placeholder-text">选择最爱歌曲</span></div>
      </section>

      <!-- 我最喜欢的 Spotify 艺术家 -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">我最喜欢的 Spotify 艺术家</span>
          </div>
        </div>
        <div class="input-card">
          <span class="link-text">将 Spotify 添加进你的个人资料</span>
        </div>
      </section>

      <!-- 性别 -->
      <section class="sec">
        <div class="sec-title-plain">性别</div>
        <div class="input-card row-between">
          <span>{{ gender === 'male' ? '男性' : gender === 'female' ? '女性' : '其他' }}</span>
          <span class="row-right-gray">{{ showGender ? '显示' : '隐藏' }} ›</span>
        </div>
      </section>

      <!-- 性取向 -->
      <section class="sec">
        <div class="sec-header">
          <div class="sec-title-row">
            <span class="sec-dot"></span>
            <span class="sec-title">性取向</span>
          </div>
        </div>
        <div class="input-card row-between">
          <span class="placeholder-text">添加性取向</span>
          <span class="row-right-gray">{{ showOrientation ? '显示' : '隐藏' }} ›</span>
        </div>
      </section>

      <!-- 管理您的个人资料 -->
      <section class="sec">
        <div class="sec-title-row" style="margin-bottom: 12px;">
          <span class="sec-title-plain" style="margin: 0;">管理您的个人资料</span>
          <span class="tinder-plus-badge">Tinder Plus®</span>
        </div>
        <div class="option-row">
          <span>不要显示我的年龄</span>
          <label class="toggle">
            <input v-model="showAge" type="checkbox" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="option-row">
          <span>不显示我的距离</span>
          <label class="toggle">
            <input v-model="showDistance" type="checkbox" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </section>

      <div style="height: 60px;"></div>
    </main>

    <!-- 预览 Tab -->
    <main v-if="!loading && activeTab === 'preview'" class="main preview-main">
      <div class="preview-card">
        <img
          v-if="photos.length"
          :src="photos[0].url"
          class="preview-photo"
        />
        <div v-else class="preview-empty">暂无照片</div>
        <div class="preview-overlay">
          <div class="preview-info">
            <span class="preview-name">{{ userStore.profile?.name || '' }}</span>
            <span class="preview-age" v-if="userStore.profile?.birthday">
              {{ Math.floor((Date.now() - new Date(userStore.profile.birthday).getTime()) / (365.25 * 24 * 3600 * 1000)) }}
            </span>
            <span v-if="userStore.profile?.is_verified" class="preview-verified">✓</span>
          </div>
          <button class="preview-up-btn">↑</button>
        </div>
      </div>
    </main>

    <div v-if="loading" class="loading">加载中...</div>

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
.page { min-height: 100vh; background: #fff; }

.top-bar {
  position: sticky; top: 0; z-index: 10;
  height: 52px; background: #fff; border-bottom: 1px solid #eee;
  display: flex; align-items: center; justify-content: space-between; padding: 0 16px;
}
.back { width: 32px; height: 32px; font-size: 22px; color: #fe3c72; }
.top-title { font-size: 16px; font-weight: 600; color: #111; margin-right: 200px; }

.tab-bar {
  position: sticky; top: 52px; z-index: 10; background: #fff;
  display: flex; border-bottom: 1px solid #eee;
}
.tab {
  flex: 1; height: 44px; font-size: 14px; font-weight: 600; color: #999;
  display: flex; align-items: center; justify-content: center;
  border-bottom: 2px solid transparent; transition: all 0.2s;
}
.tab.active { color: #111; border-bottom-color: #111; }

.main { padding: 0 16px 24px; }
.loading { display: flex; align-items: center; justify-content: center; min-height: 50vh; color: #999; }

/* Section */
.sec { padding: 16px 0; border-bottom: 1px solid #f0f0f0; }
.sec-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.sec-title-row { display: flex; align-items: center; gap: 6px; }
.sec-dot { width: 6px; height: 6px; border-radius: 50%; background: #f2385a; }
.sec-title { font-size: 15px; font-weight: 700; color: #111; }
.sec-title-plain { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 10px; }
.sec-badge-red { font-size: 10px; font-weight: 700; color: #fff; background: #f2385a; padding: 2px 8px; border-radius: 4px; }
.sec-percent { font-size: 13px; font-weight: 700; color: #f2385a; }
.sec-desc { font-size: 12px; color: #888; line-height: 1.5; margin: 4px 0; }
.sec-link { font-size: 13px; color: #f2385a; font-weight: 600; text-decoration: underline; display: inline-block; margin-top: 4px; }

/* Photo Grid */
.photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 10px; }
.photo-slot {
  aspect-ratio: 3/4; background: #f8f8f8; border: 1.5px dashed #d5d5d5;
  border-radius: 10px; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.photo-slot.filled { border: 0; }
.photo-img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
.photo-edit {
  position: absolute; bottom: 6px; right: 6px; width: 24px; height: 24px;
  border-radius: 50%; background: rgba(0,0,0,0.5); color: #fff; font-size: 12px;
  display: flex; align-items: center; justify-content: center;
}
.photo-add { font-size: 28px; color: #999; font-weight: 300; }
.photo-loading { font-size: 12px; color: #999; }
.hidden { display: none; }

/* Input Card */
.input-card {
  background: #f8f8f8; border-radius: 10px; padding: 14px 16px;
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 8px; min-height: 48px;
}
.textarea { width: 100%; border: 0; background: transparent; font-size: 14px; color: #111; resize: none; line-height: 1.5; }
.textarea::placeholder { color: #bbb; }
.char-count { font-size: 12px; color: #bbb; flex: none; margin-left: 8px; }
.field-input { flex: 1; border: 0; background: transparent; font-size: 14px; color: #111; }
.field-input::placeholder { color: #bbb; }
.placeholder-text { color: #bbb; font-size: 14px; flex: 1; }
.arrow { color: #ccc; font-size: 18px; font-weight: 300; }
.link-text { color: #f2385a; font-size: 14px; font-weight: 500; }
.row-right { margin-left: auto; font-size: 13px; color: #666; }
.row-right-gray { margin-left: auto; font-size: 13px; color: #bbb; }
.row-between { justify-content: space-between; }
.row-card { gap: 8px; }
.row-icon { font-size: 18px; display: flex; align-items: center; }
.edit-field-icon { width: 18px; height: 18px; fill: #444; flex-shrink: 0; }

/* Prompt Card */
.prompt-card { flex-direction: column; align-items: stretch; position: relative; }
.prompt-header { display: flex; align-items: center; }
.prompt-header strong { font-size: 14px; color: #111; }
.prompt-add { width: 28px; height: 28px; position: absolute; top: -12px; right: -12px; }
.prompt-sub { font-size: 12px; color: #999; margin: 4px 0 0; }

/* Info Rows */
.info-row {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 0; border-bottom: 1px solid #f5f5f5;
  font-size: 14px; color: #111;
}
.info-row:last-child { border-bottom: 0; }
.info-icon { font-size: 18px; width: 24px; text-align: center; flex: none; }
.info-right { margin-left: auto; font-size: 13px; color: #bbb; }

/* Option Row */
.option-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 0; border-bottom: 1px solid #f5f5f5;
  font-size: 14px; color: #111;
}

/* Toggle */
.toggle { position: relative; width: 44px; height: 24px; display: inline-block; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute; inset: 0; background: #f0f0f0; border: 1.5px solid #d1d1d1; border-radius: 14px;
  transition: all 0.3s ease; cursor: pointer;
}
.toggle-slider::before {
  content: ''; position: absolute; width: 30px; height: 30px; border-radius: 50%; background: #b5b5b5;
  left: -4px; top: 50%; transform: translateY(-50%);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.toggle-slider::after {
  content: ''; position: absolute; width: 10px; height: 6px;
  border-left: 2px solid white; border-bottom: 2px solid white;
  transform: rotate(-45deg) translate(1px, -1px); left: 4px; top: 7px;
  opacity: 0; transition: opacity 0.2s ease, left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.toggle input:checked + .toggle-slider { background: #fff0f3; border-color: #ff2d55; }
.toggle input:checked + .toggle-slider::before { left: calc(100% - 26px); background: #ff2d55; box-shadow: 0 2px 10px rgba(255, 45, 85, 0.4); }
.toggle input:checked + .toggle-slider::after { opacity: 1; left: calc(100% - 16px); }
.toggle-slider:active::before { transform: translateY(-50%) scale(0.9); }

/* Tinder Plus Badge */
.tinder-plus-badge {
  font-size: 10px; font-weight: 700; color: #fff;
  background: linear-gradient(90deg, #fd297b, #ff655b);
  padding: 3px 8px; border-radius: 4px; margin-left: 8px;
}

/* Preview */
.preview-main {
  padding: 8px 16px;
}

.preview-card {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4.5;
  border-radius: 12px;
  overflow: hidden;
  background: #111;
}

.preview-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 16px;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.preview-info {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.preview-name {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.preview-age {
  font-size: 24px;
  font-weight: 400;
  color: #fff;
}

.preview-verified {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #42a5f5;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
}

.preview-up-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.3);
}

/* Half Sheet */
.hs-mask { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; }
.hs-sheet { width: 100%; max-height: 50vh; background: #fff; border-radius: 20px 20px 0 0; padding: 12px 20px 32px; display: flex; flex-direction: column; transition: max-height 0.3s ease; overflow: hidden; }
.hs-sheet.hs-full { max-height: 85vh; }
.hs-handle { width: 36px; height: 4px; border-radius: 2px; background: #ddd; margin: 0 auto 12px; }
.hs-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.hs-title { font-size: 18px; font-weight: 700; color: #111; margin: 0; }
.hs-done-btn { font-size: 14px; font-weight: 600; color: #fe3c72; background: none; border: none; cursor: pointer; }
.hs-body { flex: 1; overflow-y: auto; }
.hs-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.hs-tag { padding: 10px 18px; border-radius: 9999px; border: 1.5px solid #e0e0e0; font-size: 14px; color: #333; background: #fff; cursor: pointer; transition: all 0.2s; }
.hs-tag-selected { border-color: #fe3c72; background: #fff0f3; color: #fe3c72; font-weight: 600; }

.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.2s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }
</style>
