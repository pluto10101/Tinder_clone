<script setup lang="ts">
import { computed } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const OPTIONS = [
  { value: 'straight', label: '异性恋', desc: '仅会被相反性别吸引的人士' },
  { value: 'gay_male', label: '男同性恋', desc: '这是一个统称术语，指会被同性吸引的人士' },
  {
    value: 'gay_female',
    label: '女同性恋',
    desc: '对其他女性产生爱慕感、能建立浪漫关系或认为其他女性具有性吸引力的女士',
  },
  {
    value: 'bisexual',
    label: '双性恋',
    desc: '对一种以上的性别者有可能产生爱慕感、建立浪漫关系或认为这些性别者具有性吸引力的人士',
  },
  { value: 'asexual', label: '无性恋', desc: '感受不到性吸引力的人士' },
  {
    value: 'demi',
    label: '半性恋',
    desc: '只有与他人建立深厚的情感联系才能感受到性吸引力的人士',
  },
  {
    value: 'pan',
    label: '泛性恋',
    desc: '对任意性别者均有可能产生爱慕感、建立浪漫关系或认为任意性别者均具有性吸引力的人士',
  },
  {
    value: 'queer',
    label: '酷儿',
    desc: '这是一个用于指代一系列性向和性别的统称，它往往涵盖不属于完全异性恋的性别或性向',
  },
  {
    value: 'questioning',
    label: '疑性恋',
    desc: '正在探索自身性向和/或性别的人士',
  },
  {
    value: 'unlisted',
    label: '未列出',
    desc: '请告知我们还缺什么性别。',
  },
];

const selected = computed({
  get: () => props.draft.sexual_orientation,
  set: (v: string[]) =>
    emit('update:draft', { ...props.draft, sexual_orientation: v }),
});

const showOrientation = computed({
  get: () => props.draft.show_orientation,
  set: (v: boolean) => emit('update:draft', { ...props.draft, show_orientation: v }),
});

function toggle(v: string) {
  if (selected.value.includes(v)) {
    selected.value = selected.value.filter((x) => x !== v);
  } else {
    selected.value = [...selected.value, v];
  }
}
</script>

<template>
  <div class="wrapper">
    <p class="subtitle">请选择所有适用选项，描述你的身份认同。</p>

    <div class="options">
      <button
        v-for="opt in OPTIONS"
        :key="opt.value"
        class="option press"
        :class="{ active: selected.includes(opt.value) }"
        @click="toggle(opt.value)"
      >
        <div class="opt-label">{{ opt.label }}</div>
        <div class="opt-desc">{{ opt.desc }}</div>
      </button>
    </div>

    <a href="#" class="info-link" @click.prevent>了解 Tinder 信息使用详情</a>

    <div class="bottom-check">
      <label class="check-row">
        <input v-model="showOrientation" type="checkbox" class="checkbox" />
        <span>在个人资料中显示性向</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  padding-bottom: 72px;
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
  gap: 10px;
}

.option {
  border: 1px solid #d5d5d5;
  border-radius: 10px;
  background: #fff;
  text-align: left;
  padding: 14px 16px;
  transition: all 0.2s;
  display: block;
  width: 100%;
}

.option.active {
  border-color: #111;
  border-width: 1.5px;
  padding: 13.5px 15.5px;
}

.opt-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.option.active .opt-label {
  color: #111;
}

.opt-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
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
  pointer-events: none;
}

.check-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  pointer-events: auto;
  background: var(--bg-page);
  padding: 4px 8px;
  border-radius: 6px;
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
