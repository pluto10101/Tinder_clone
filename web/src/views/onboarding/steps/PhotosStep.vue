<script setup lang="ts">
import { computed, ref } from 'vue';
import type { OnboardingDraft } from '../types';
import { profileApi } from '@/api/profile';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const SLOTS = 6;
const MAX_SIZE = 10 * 1024 * 1024;

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
    errorMsg.value = '图片不能超过 10MB';
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
  <div>
    <p class="subtitle">
      上传 2 张照片，开始玩转 Tinder。添加 4 张或更多照片可以让你的个人资料脱颖而出。
    </p>

    <div class="grid">
      <template v-for="i in SLOTS" :key="i">
        <div class="slot" :class="{ filled: photos[i - 1] }">
          <template v-if="photos[i - 1]">
            <img :src="photos[i - 1]!.url" class="photo" />
            <button class="remove press" @click="removePhoto(photos[i - 1]!.id)">✕</button>
          </template>
          <template v-else>
            <div v-if="uploading[i - 1]" class="loading">
              <div class="spinner"></div>
            </div>
            <input
              :ref="(el) => el && (inputs[i - 1] = el as HTMLInputElement)"
              type="file"
              accept="image/*"
              class="hidden-input"
              @change="onFileChange(i - 1, $event)"
            />
          </template>
          <!-- 右下角加号按钮（未填充时显示） -->
          <button
            v-if="!photos[i - 1] && !uploading[i - 1]"
            class="add-btn press"
            @click="triggerPick(i - 1)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#111" />
              <path d="M10 5v10M5 10h10" stroke="#fff" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </template>
    </div>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px;
  line-height: 1.6;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.slot {
  aspect-ratio: 3 / 4;
  background: #f5f5f5;
  border: 2px dashed #ccc;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot.filled {
  border-style: solid;
  border-color: transparent;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.remove {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hidden-input {
  display: none;
}

.error {
  color: #f2385a;
  font-size: 13px;
  margin-top: 12px;
  text-align: center;
}
</style>
