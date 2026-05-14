<script setup lang="ts">
import { computed, ref } from 'vue';
import type { OnboardingDraft } from '../types';
import { profileApi } from '@/api/profile';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const SLOTS = 6;
const MAX_SIZE = 15 * 1024 * 1024;

const photos = computed({
  get: () => props.draft.photos,
  set: (v) => emit('update:draft', { ...props.draft, photos: v }),
});

const uploading = ref<Record<number, boolean>>({});
const errorMsg = ref('');
const inputs = ref<HTMLInputElement[]>([]);

function triggerPick(i: number) {
  inputs.value[i]?.click();
}

async function onFileChange(i: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  if (file.size > MAX_SIZE) {
    errorMsg.value = '图片不能超过 15MB';
    return;
  }
  errorMsg.value = '';
  uploading.value = { ...uploading.value, [i]: true };
  try {
    const photo = await profileApi.uploadPhoto(file);
    photos.value = [...photos.value, photo];
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : '上传失败';
  } finally {
    uploading.value = { ...uploading.value, [i]: false };
  }
}

async function removePhoto(id: number) {
  try {
    await profileApi.deletePhoto(id);
  } catch {
    // ignore
  }
  photos.value = photos.value.filter((p) => p.id !== id);
}
</script>

<template>
  <div class="photo-onboarding">
    <p class="subtitle">
      上传 2 张照片，开始玩转 Tinder。添加 4 张或更多照片可以让你的个人资料脱颖而出。
    </p>

    <div class="grid">
      <template v-for="i in SLOTS" :key="i">
        <div class="slot" :class="{ filled: photos[i - 1] }">
          <!-- 已上传照片显示 -->
          <template v-if="photos[i - 1]">
            <img :src="photos[i - 1]!.url" class="photo" />
            <button class="remove-btn press" @click="removePhoto(photos[i - 1]!.id)">✕</button>
          </template>

          <!-- 上传中状态 -->
          <template v-else-if="uploading[i - 1]">
            <div class="loading">
              <div class="spinner"></div>
            </div>
          </template>

          <!-- 空槽位状态 -->
          <template v-else>
            <input
              :ref="(el) => el && (inputs[i - 1] = el as HTMLInputElement)"
              type="file"
              accept="image/*"
              class="hidden-input"
              @change="onFileChange(i - 1, $event)"
            />
            <!-- 悬浮在右下角的加号按钮 -->
            <button
              class="add-btn press"
              @click="triggerPick(i - 1)"
            >
              <svg width="60" height="60" viewBox="0 0 30 30">
                <!-- 白色外圈（让加号悬浮的感觉更强） -->
                <circle cx="15" cy="15" r="14" fill="white" />
                <!-- 内部圆圈（Tinder 品牌渐变色或纯黑） -->
                <circle cx="15" cy="15" r="11" fill="#111" />
                <!-- 白色加号 -->
                <path d="M15 10v10M10 15h10" stroke="#fff" stroke-width="1" stroke-linecap="round" />
              </svg>
            </button>
          </template>
        </div>
      </template>
    </div>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.photo-onboarding {
  padding: 0 4px;
  /* 如果有全局字体，这里会自动继承 */
}

.subtitle {
  font-size: 15px;
  color: #666;
  margin: 0 0 25px;
  line-height: 1.5;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px; /* 间距稍大，给悬浮按钮留出空间 */
}

.slot {
  aspect-ratio: 3 / 4.7;
  background: #edeff3;
  border: 2px dashed #d0d5dd;
  border-radius: 12px;
  position: relative;
  /* 【关键修改】：允许内容溢出，这样加号才能悬挂在外面 */
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot.filled {
  border: none;
  background: #f0f0f0;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 【关键修改】：因为父级不切溢出了，图片自己必须带圆角 */
  border-radius: 12px;
}

/* 右上角删除按钮（针对已上传图片） */
.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 1px solid #ddd;
  color: #666;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  z-index: 5;
}

/* 【核心修改】：悬浮右下角加号按钮 */
.add-btn {
  position: absolute;
  bottom: -10px; /* 负值让它往外飘 */
  right: -10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 2px solid #ddd;
  border-top-color: #fe3c72; /* Tinder 主题色 */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hidden-input {
  display: none;
}

.error {
  color: #ff4458;
  font-size: 13px;
  margin-top: 15px;
  text-align: center;
}

/* 统一的点击缩放反馈 */
.press:active {
  transform: scale(0.92);
  transition: transform 0.1s;
}
</style>