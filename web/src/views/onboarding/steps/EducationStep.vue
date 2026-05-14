<script setup lang="ts">
import { computed } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const OPTIONS = ['学士', '上大学中', '高中', '博士', '读研/读博中', '硕士', '职业学校', '不便透露'];

const degree = computed({
  get: () => props.draft.degree,
  set: (v: string) => emit('update:draft', { ...props.draft, degree: v }),
});

function select(v: string) {
  degree.value = v;
}
</script>

<template>
  <div>
    <p class="subtitle">帮助你提升 Tinder 的用户体验。</p>

    <div class="divider"></div>

    <div class="tags">
      <button
        v-for="opt in OPTIONS"
        :key="opt"
        class="tag press"
        :class="{ active: degree === opt }"
        @click="select(opt)"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 16px;
  line-height: 1.6;
}

.divider {
  height: 3px;
  background: #e8e8e8;
  margin-bottom: 16px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 8px 13px;
  border: 1px solid #d5d5d5;
  border-radius: 9999px;
  font-size: 14px;
  color: var(--text-primary);
  background: #fff;
  transition: all 0.2s;
  white-space: nowrap;
}

.tag.active {
  border-color: #111;
  border-width: 1.5px;
  font-weight: 600;
}
</style>
