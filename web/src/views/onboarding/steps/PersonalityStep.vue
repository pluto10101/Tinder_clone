<script setup lang="ts">
import { computed } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const CATEGORIES = [
  {
    icon: '💬',
    label: '你喜欢的沟通方式是？',
    options: ['热衷发消息', '喜欢打电话', '喜欢视频聊天', '不热衷发消息', '最好当面'],
  },
  {
    icon: '💝',
    label: '你通过什么方式来感受爱？',
    options: ['体贴的表示', '礼物', '身体碰触', '赞美', '共度时光'],
  },
  {
    icon: '🌙',
    label: '你是什么星座？',
    options: ['摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座'],
  },
];

const personality = computed({
  get: () => props.draft.personality,
  set: (v: string[]) => emit('update:draft', { ...props.draft, personality: v }),
});

function toggle(tag: string) {
  if (personality.value.includes(tag)) {
    personality.value = personality.value.filter((t) => t !== tag);
  } else {
    personality.value = [...personality.value, tag];
  }
}

const doneCount = computed(() => {
  let count = 0;
  for (const cat of CATEGORIES) {
    if (cat.options.some((opt) => personality.value.includes(opt))) count++;
  }
  return count;
});
</script>

<template>
  <div>
    <p class="subtitle">尽管说出来吧，只有真实的你才能吸引真实的 Ta 哦。</p>

    <div class="categories">
      <div v-for="cat in CATEGORIES" :key="cat.label" class="category">
        <div class="cat-header">
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-label">{{ cat.label }}</span>
        </div>
        <div class="chip-row">
          <button
            v-for="opt in cat.options"
            :key="opt"
            class="chip press"
            :class="{ active: personality.includes(opt) }"
            @click="toggle(opt)"
          >
            {{ opt }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
