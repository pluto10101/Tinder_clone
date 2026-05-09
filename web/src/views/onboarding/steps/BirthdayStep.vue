<script setup lang="ts">
import { computed, ref } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const birthday = computed({
  get: () => props.draft.birthday,
  set: (v: string) => emit('update:draft', { ...props.draft, birthday: v }),
});

const nativeInput = ref<HTMLInputElement | null>(null);

const displayParts = computed(() => {
  if (!birthday.value) return null;
  const [y, m, d] = birthday.value.split('-');
  if (!y || !m || !d) return null;
  return { y, m, d };
});

const age = computed(() => {
  if (!birthday.value) return null;
  const b = new Date(birthday.value);
  if (Number.isNaN(b.getTime())) return null;
  return Math.floor((Date.now() - b.getTime()) / (365.25 * 24 * 3600 * 1000));
});

const warning = computed(() => {
  if (age.value === null) return '';
  if (age.value < 18) return '抱歉，需年满 18 周岁才可注册';
  if (age.value > 100) return '请输入合理的出生日期';
  return '';
});

function openPicker() {
  nativeInput.value?.showPicker?.();
  nativeInput.value?.focus();
}
</script>

<template>
  <div>
    <!-- 隐藏的原生日期选择器 -->
    <input
      ref="nativeInput"
      v-model="birthday"
      type="date"
      class="hidden-picker"
    />

    <!-- 大字日期显示（点击触发选择器） -->
    <button class="date-display press" @click="openPicker">
      <template v-if="displayParts">
        <span class="digits">{{ displayParts.y }}</span>
        <span class="sep">/</span>
        <span class="digits">{{ displayParts.m }}</span>
        <span class="sep">/</span>
        <span class="digits">{{ displayParts.d }}</span>
      </template>
      <span v-else class="placeholder">YYYY&nbsp;/&nbsp;MM&nbsp;/&nbsp;DD</span>
    </button>
    <div class="underline"></div>

    <p class="desc">你的个人资料会显示你的年龄，但不会显示你的出生日期。</p>
    <p v-if="warning" class="warn">{{ warning }}</p>
  </div>
</template>

<style scoped>
.hidden-picker {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.date-display {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 6px;
  background: transparent;
}

.digits {
  font-variant-numeric: tabular-nums;
}

.sep {
  margin: 0 4px;
  color: var(--text-primary);
}

.placeholder {
  color: #cfcfcf;
  letter-spacing: 4px;
  font-weight: 500;
}

.underline {
  height: 1.5px;
  background: #d5d5d5;
  margin-bottom: 12px;
}

.desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 12px 0 0;
  line-height: 1.6;
}

.warn {
  margin-top: 10px;
  color: #f2385a;
  font-size: 13px;
}
</style>
