<script setup lang="ts">
import { computed } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const CATEGORIES = [
  {
    key: 'drinking',
    icon: '🍷',
    label: '你多久喝一次酒？',
    options: ['不感兴趣', '已戒酒', '少喝或不喝', '遇到特殊场合才喝', '在周末社交时才喝', '大多数晚上都喝'],
  },
  {
    key: 'smoking',
    icon: '🚬',
    label: '你多久抽一次烟？',
    options: ['在社交时吸烟', '在饮酒时吸烟', '不吸烟', '吸烟', '正在戒'],
  },
  {
    key: 'exercise',
    icon: '💪',
    label: '你锻炼吗？',
    options: ['每天', '时常', '偶尔', '从不'],
  },
  {
    key: 'pets',
    icon: '🐾',
    label: '你有宠物吗？',
    options: ['狗狗', '猫猫', '爬行动物', '两栖动物', '鸟', '鱼类', '没养但喜欢动物', '其他', '乌龟', '仓鼠', '兔子', '宠物勿扰', '所有宠物', '想养宠物'],
  },
];

const lifestyles = computed({
  get: () => props.draft.lifestyles,
  set: (v: Record<string, string>) =>
    emit('update:draft', { ...props.draft, lifestyles: v }),
});

function pick(cat: string, val: string) {
  const next = { ...lifestyles.value };
  if (next[cat] === val) {
    delete next[cat];
  } else {
    next[cat] = val;
  }
  lifestyles.value = next;
}

// 计算当前完成了几个分类
const doneCount = computed(() => {
  return CATEGORIES.filter((c) => lifestyles.value[c.key]).length;
});

// 用户名
const userName = computed(() => props.draft.name || '');
</script>

<template>
  <div>
    <!-- 自定义标题（因为 types.ts 里 title 为空） -->
    <h1 class="custom-title">让我们来聊聊生活习惯吧，{{ userName }}</h1>
    <p class="subtitle">对方会跟你有一样的习惯吗？你先回答吧。</p>

    <div class="categories">
      <div v-for="cat in CATEGORIES" :key="cat.key" class="category">
        <div class="cat-header">
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-label">{{ cat.label }}</span>
        </div>
        <div class="chip-row">
          <button
            v-for="opt in cat.options"
            :key="opt"
            class="chip press"
            :class="{ active: lifestyles[cat.key] === opt }"
            @click="pick(cat.key, opt)"
          >
            {{ opt }}
          </button>
        </div>
      </div>
    </div>

    <!-- 底部按钮文案覆盖 -->
    <div class="step-counter">第 {{ doneCount }}/{{ CATEGORIES.length }} 步</div>
  </div>
</template>

<style scoped>
.custom-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
  line-height: 1.3;
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px;
  line-height: 1.6;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.category {
  padding: 16px 0;
  border-top: 1px solid #e8e8e8;
}

.cat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.cat-icon {
  font-size: 18px;
}

.cat-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 8px 14px;
  border: 1px solid #d5d5d5;
  border-radius: 9999px;
  font-size: 13px;
  color: var(--text-primary);
  background: #fff;
  transition: all 0.2s;
  white-space: nowrap;
}

.chip.active {
  border-color: #111;
  border-width: 1.5px;
  font-weight: 600;
}

.step-counter {
  display: none;
}
</style>
