<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const OPTIONS = ['男性', '女性', '二元性别以外', '所有人'];

const VALUE_MAP: Record<string, string> = {
  '男性': 'male',
  '女性': 'female',
  '二元性别以外': 'all',
  '所有人': 'all',
};

const REVERSE_MAP: Record<string, string> = {
  male: '男性',
  female: '女性',
  all: '所有人',
};

const selectedLabel = ref('');

onMounted(() => {
  if (props.draft.looking_for) {
    selectedLabel.value = REVERSE_MAP[props.draft.looking_for] || '';
  }
});

watch(selectedLabel, (label) => {
  const val = VALUE_MAP[label] || 'all';
  emit('update:draft', { ...props.draft, looking_for: val as 'male' | 'female' | 'all' });
});

function select(label: string) {
  selectedLabel.value = label;
}
</script>

<template>
  <div>
    <p class="subtitle">请选择所有适用选项，收获更多想要结识的人。</p>

    <div class="options">
      <button
        v-for="opt in OPTIONS"
        :key="opt"
        class="option press"
        :class="{ active: selectedLabel === opt }"
        @click="select(opt)"
      >
        {{ opt }}
      </button>
    </div>

    <a href="#" class="info-link" @click.prevent>了解 Tinder 信息使用详情</a>
  </div>
</template>

<style scoped>
.subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0 0 20px;
  line-height: 4.0;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  height: 50px;
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
</style>
