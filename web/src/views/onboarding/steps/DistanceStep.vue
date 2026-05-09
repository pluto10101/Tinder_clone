<script setup lang="ts">
import { computed } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const distance = computed({
  get: () => props.draft.distance_max_km,
  set: (v: number) =>
    emit('update:draft', { ...props.draft, distance_max_km: Number(v) }),
});
</script>

<template>
  <div>
    <p class="desc">我们会向你展示该距离范围内的人。</p>
    <div class="value">
      <strong>{{ distance }}</strong> <span>公里</span>
    </div>
    <input
      v-model.number="distance"
      type="range"
      min="1"
      max="160"
      step="1"
      class="slider"
    />
    <div class="range-labels">
      <span>1 km</span>
      <span>160 km</span>
    </div>
  </div>
</template>

<style scoped>
.desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 32px;
  line-height: 1.5;
}
.value {
  text-align: center;
  margin-bottom: 16px;
}
.value strong {
  font-size: 48px;
  font-weight: 700;
  color: #111;
}
.value span {
  font-size: 16px;
  color: var(--text-secondary);
  margin-left: 4px;
}
.slider {
  width: 100%;
  height: 4px;
  appearance: none;
  background: linear-gradient(90deg, #111 0%, #111 var(--percent, 30%), var(--border) var(--percent, 30%));
  border-radius: 2px;
  outline: none;
}
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #111;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.slider::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #111;
  cursor: pointer;
  border: 0;
}
.range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-tertiary);
}
</style>
