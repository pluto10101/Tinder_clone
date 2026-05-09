<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { STEPS, emptyDraft, type OnboardingDraft } from './types';
import { storage, StorageKeys } from '@/utils/storage';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

import NameStep from './steps/NameStep.vue';
import BirthdayStep from './steps/BirthdayStep.vue';
import GenderStep from './steps/GenderStep.vue';
import OrientationStep from './steps/OrientationStep.vue';
import PreferenceStep from './steps/PreferenceStep.vue';
import PurposeStep from './steps/PurposeStep.vue';
import EducationStep from './steps/EducationStep.vue';
import LifestyleStep from './steps/LifestyleStep.vue';
import PersonalityStep from './steps/PersonalityStep.vue';
import InterestsStep from './steps/InterestsStep.vue';
import PhotosStep from './steps/PhotosStep.vue';
import BioStep from './steps/BioStep.vue';

const router = useRouter();
const auth = useAuthStore();
const userStore = useUserStore();

const draft = ref<OnboardingDraft>(
  storage.get<OnboardingDraft>(StorageKeys.onboardingDraft, emptyDraft())
);
const stepIndex = ref(0);
const submitting = ref(false);
const error = ref('');
const showWelcomeModal = ref(false);

// 自动持久化 draft
watch(
  draft,
  (v) => storage.set(StorageKeys.onboardingDraft, v),
  { deep: true }
);

const currentStep = computed(() => STEPS[stepIndex.value]);
const canNext = computed(() => currentStep.value.isValid(draft.value));
const progress = computed(() => ((stepIndex.value + 1) / STEPS.length) * 100);

// 生活习惯、个性、兴趣页面的"第 x/y 步"按钮文案
const subStepLabel = computed(() => {
  const key = currentStep.value.key;
  if (key === 'lifestyle') {
    const LIFESTYLE_CATS = ['drinking', 'smoking', 'exercise', 'pets'];
    const done = LIFESTYLE_CATS.filter((k) => draft.value.lifestyles[k]).length;
    return `第 ${done}/${LIFESTYLE_CATS.length} 步`;
  }
  if (key === 'personality') {
    const COMM = ['热衷发消息', '喜欢打电话', '喜欢视频聊天', '不热衷发消息', '最好当面'];
    const LOVE = ['体贴的表示', '礼物', '身体碰触', '赞美', '共度时光'];
    const ZODIAC = ['摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座'];
    let done = 0;
    if (draft.value.personality.some((p) => COMM.includes(p))) done++;
    if (draft.value.personality.some((p) => LOVE.includes(p))) done++;
    if (draft.value.personality.some((p) => ZODIAC.includes(p))) done++;
    return `第 ${done}/3 步`;
  }
  if (key === 'interests') {
    return `第 ${draft.value.interests.length}/10 步`;
  }
  return '';
});

const STEP_COMPONENTS: Record<string, unknown> = {
  name: NameStep,
  birthday: BirthdayStep,
  gender: GenderStep,
  orientation: OrientationStep,
  preference: PreferenceStep,
  purpose: PurposeStep,
  education: EducationStep,
  lifestyle: LifestyleStep,
  personality: PersonalityStep,
  interests: InterestsStep,
  photos: PhotosStep,
  bio: BioStep,
};

function next() {
  if (!canNext.value) return;
  // 名字输入完后弹欢迎 modal
  if (currentStep.value.key === 'name') {
    showWelcomeModal.value = true;
    return;
  }
  advance();
}

function advance() {
  if (stepIndex.value < STEPS.length - 1) {
    stepIndex.value += 1;
    window.scrollTo({ top: 0 });
  } else {
    finish();
  }
}

function skip() {
  if (!currentStep.value.skippable) return;
  advance();
}

function back() {
  if (stepIndex.value > 0) {
    stepIndex.value -= 1;
  } else {
    router.push({ name: 'welcome' });
  }
}

function closeWelcomeModal() {
  showWelcomeModal.value = false;
  advance();
}

function dismissWelcomeModal() {
  // 关闭但不进入下一步，让用户回到当前步骤修改姓名
  showWelcomeModal.value = false;
}

async function finish() {
  if (submitting.value) return;
  submitting.value = true;
  error.value = '';
  try {
    const d = draft.value;
    await userStore.updateProfile({
      name: d.name,
      birthday: d.birthday,
      gender: d.gender || null,
      sexual_orientation: d.sexual_orientation || null,
      looking_for: d.looking_for || null,
      bio: d.bio,
      school: d.school,
      degree: d.degree,
      dating_purpose: d.dating_purpose,
      interests: d.interests,
      lifestyles: d.lifestyles,
      personality: d.personality,
      onboarding_complete: true,
      settings: {
        ...(userStore.profile?.settings || {
          distance_max_km: 50,
          age_min: 18,
          age_max: 60,
          gender_preference: 'all',
          show_age: true,
          show_distance: true,
          show_online_status: true,
        }),
        distance_max_km: d.distance_max_km,
        show_gender: d.show_gender,
        show_orientation: d.show_orientation,
      },
    });
    auth.setOnboardingComplete(true);
    storage.remove(StorageKeys.onboardingDraft);
    router.replace({ name: 'discover' });
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '提交失败';
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  // 确保 profile 已拉取，便于编辑已有字段
  try {
    if (!userStore.profile) await userStore.fetchProfile();
  } catch {
    // ignore
  }
});
</script>

<template>
  <div class="page">
    <!-- 顶部进度 -->
    <header class="header safe-top">
      <div class="progress">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
    </header>
    <div class="back-row">
      <button class="back press" @click="back">←</button>
      <button
        v-if="currentStep.skippable"
        class="top-skip press"
        @click="skip"
      >
        跳过
      </button>
    </div>

    <!-- 当前步骤内容 -->
    <main class="main">
      <h1 v-if="currentStep.title" class="step-title">{{ currentStep.title }}</h1>
      <component :is="STEP_COMPONENTS[currentStep.key]" v-model:draft="draft" />
      <p v-if="error" class="error">{{ error }}</p>
    </main>

    <!-- 底部按钮 -->
    <footer class="footer safe-bottom">
      <button
        class="btn-next press"
        :class="{ primary: canNext || subStepLabel }"
        :disabled="!canNext || submitting"
        @click="next"
      >
        {{
          submitting
            ? '提交中...'
            : subStepLabel
              ? subStepLabel
              : stepIndex === STEPS.length - 1
                ? '完成'
                : '下一步'
        }}
      </button>
    </footer>

    <!-- 欢迎 Modal -->
    <Transition name="modal">
      <div v-if="showWelcomeModal" class="modal-mask" @click.self="dismissWelcomeModal">
        <div class="modal">
          <div class="modal-emoji">👋</div>
          <h2 class="modal-title">欢迎使用 Tinder，{{ draft.name }}！</h2>
          <p class="modal-subtitle">
            Tinder 上有很多精彩等待你来发现哦。不过请先设置你的个人资料吧。
          </p>
          <button class="modal-btn-primary press" @click="closeWelcomeModal">
            开始吧
          </button>
          <button class="modal-btn-text press" @click="dismissWelcomeModal">
            编辑名称
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-page);
}

.header {
  padding: 0;
  height: auto;
}

.progress {
  width: 100%;
  height: 3px;
  background: var(--border);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff7a00 0%, #ff2d7a 60%, #b74fff 100%);
  transition: width 0.3s ease;
}

.back-row {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back {
  width: 32px;
  height: 32px;
  font-size: 24px;
  color: var(--text-primary);
}

.top-skip {
  padding: 8px 8px;
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 500;
}

.main {
  flex: 1;
  padding: 16px 24px 24px;
  overflow-y: auto;
}

.step-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px;
  line-height: 1.25;
}

.error {
  color: #f2385a;
  font-size: 13px;
  margin-top: 12px;
}

.footer {
  padding: 12px 24px 16px;
  display: flex;
  gap: 12px;
  background: var(--bg-page);
  border-top: 1px solid var(--border);
}

.btn-next {
  flex: 1;
  height: 52px;
  border-radius: 9999px;
  background: #d0d0d0;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-next.primary {
  background: #111;
}

.btn-next:disabled {
  cursor: not-allowed;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal {
  background: #fff;
  border-radius: 20px;
  padding: 32px 24px 20px;
  max-width: 340px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.modal-emoji {
  font-size: 44px;
  margin-bottom: 12px;
  line-height: 1;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--text-primary);
  line-height: 1.3;
}

.modal-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 24px;
  padding: 0 8px;
}

.modal-btn-primary {
  width: 100%;
  height: 48px;
  border-radius: 9999px;
  background: #111;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}

.modal-btn-text {
  width: 100%;
  height: 44px;
  background: transparent;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 500;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.85);
}
</style>
