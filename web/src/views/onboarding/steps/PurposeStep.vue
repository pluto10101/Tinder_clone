<script setup lang="ts">
import { computed } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const OPTIONS = [
  { value: '寻找长期的伴侣', emoji: '💘' },
  { value: '长期交往，但不拒绝短期交往', emoji: '😍' },
  { value: '短期交往，但不拒绝长期交往', emoji: '🥂' },
  { value: '享受短期交往的乐趣', emoji: '🎉' },
  { value: '结交新朋友', emoji: '👋' },
  { value: '我还在思考', emoji: '🤔' },
];

const purpose = computed({
  get: () => props.draft.dating_purpose,
  set: (v: string[]) =>
    emit('update:draft', { ...props.draft, dating_purpose: v }),
});

function toggle(v: string) {
  if (purpose.value.includes(v)) {
    purpose.value = purpose.value.filter((x) => x !== v);
  } else {
    purpose.value = [...purpose.value, v];
  }
}
</script>

<template>
  <div>
    <p class="subtitle">
      你可以随时更改交往意向哦。每个人都可以在这里找到自己想要的人际交往。
    </p>

    <div class="grid">
      <button
        v-for="opt in OPTIONS"
        :key="opt.value"
        class="tile press"
        :class="{ active: purpose.includes(opt.value) }"
        @click="toggle(opt.value)"
      >
        <div class="emoji">{{ opt.emoji }}</div>
        <div class="label">{{ opt.value }}</div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px;
  line-height: 1.6;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.tile {
  aspect-ratio: 1 / 1.1;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fafafa;
  transition: all 0.2s;
  padding: 12px 6px;
}

.tile.active {
  border-color: #111;
  border-width: 1.5px;
  background: #f5f5f5;
}

.emoji {
  font-size: 36px;
  line-height: 1;
}

.label {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 500;
  text-align: center;
  line-height: 1.4;
}

.tile.active .label {
  font-weight: 600;
}
</style>
