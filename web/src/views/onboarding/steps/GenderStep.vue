<script setup lang="ts">
import { computed } from 'vue';
import type { OnboardingDraft } from '../types';
import type { Gender } from '@/types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: '二元性别以外' },
];

const gender = computed({
  get: () => props.draft.gender,
  set: (v: Gender | '') => emit('update:draft', { ...props.draft, gender: v }),
});

const showGender = computed({
  get: () => props.draft.show_gender,
  set: (v: boolean) => emit('update:draft', { ...props.draft, show_gender: v }),
});
</script>

<template>
  <div class="wrapper">
    <p class="subtitle">
      请选择所有适用选项，确保目标用户更容易看到你的个人资料。你当然也可以添加更多信息。
    </p>

    <div class="options">
      <button
        v-for="opt in OPTIONS"
        :key="opt.value"
        class="option press"
        :class="{ active: gender === opt.value }"
        @click="gender = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>

    <a href="#" class="info-link" @click.prevent>了解 Tinder 信息使用详情</a>

    <div class="bottom-check">
      <!-- 仅在这里添加了一行灰色横线 -->
      <div class="divider"></div>

      <label class="check-row">
        <input v-model="showGender" type="checkbox" class="checkbox" />
        <span>在个人资料中显示性别</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  min-height: 60vh;
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  height: 52px;
  border: 1px solid #d5d5d5;
  border-radius: 10px;
  font-size: 15px;
  color: var(--text-primary);
  background: #fff;
  text-align: left;
  padding: 0 16px;
  transition: all 0.2s;
}

.option.active {
  border-color: #111;
  border-width: 1.5px;
  font-weight: 600;
}

.info-link {
  display: inline-block;
  margin-top: 16px;
  color: #2b6cb0;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.bottom-check {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 92px;
  padding: 0 24px;
  text-align: center;
}

/* 新增的灰色线样式 */
.divider {
  height: 3px;
  background-color: rgba(11, 10, 10, 0.16); /* 灰色线 */
  margin-bottom: 20px;       /* 与下方文字的间距 */
  width: 100%;
}

.check-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
}

.checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 1.5px solid #888;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  background: #fff;
  flex: none;
}

.checkbox:checked {
  background: #111;
  border-color: #111;
}

.checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -52%);
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}
</style>