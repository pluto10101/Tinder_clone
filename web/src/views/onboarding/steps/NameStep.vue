<script setup lang="ts">
import { computed } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const name = computed({
  get: () => props.draft.name,
  set: (v) => emit('update:draft', { ...props.draft, name: v.slice(0, 20) }),
});
</script>

<template>
  <div>
    <input
      v-model="name"
      class="input"
      type="text"
      placeholder=""
      autofocus
    />
    <p class="desc">
      它会这样显示在你的个人资料中。<br />
      过后你将无法更改。
    </p>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  height: 44px;
  font-size: 20px;
  font-weight: 600;
  border: 0;
  border-bottom: 1.5px solid #d5d5d5;
  padding: 4px 0;
  background: transparent;
  color: var(--text-primary);
}
.input:focus {
  border-bottom-color: #111;
}
.desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 16px 0 0;
  line-height: 1.6;
}
</style>
