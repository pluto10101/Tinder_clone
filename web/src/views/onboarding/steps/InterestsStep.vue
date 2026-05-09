<script setup lang="ts">
import { computed, ref } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const MAX = 10;

const CATEGORIES = [
  {
    icon: '🌍',
    label: '价值公益',
    options: ['支持堕胎', '行动主义', '气候变化', 'LGBTQIA+ 权利', '女权主义', '社会性发展'],
    extra: ['环保主义', '动物权利', '反种族歧视', '平等权利'],
  },
  {
    icon: '🌿',
    label: '健康生活',
    options: ['自爱', '尝试新事物', '塔罗牌', '水疗', '自我照顾', '冥想', '护肤', '占星术', '桑拿'],
    extra: ['正念', '瑜伽', '素食', '排毒'],
  },
  {
    icon: '🎯',
    label: '外出游玩',
    options: ['淘二手货', '节日', '密室逃脱', '酒吧', '博物馆', '锐舞派对', '汽车影院', '展览', '巡访咖啡馆'],
    extra: ['音乐节', '夜市', '主题公园', '露营'],
  },
  {
    icon: '🏠',
    label: '家居活动',
    options: ['阅读', '家庭健身', '烹饪', '园艺', '狂刷电视剧', '在线游戏', '在线购物', '烘焙', '棋类游戏'],
    extra: ['拼图', '手工', 'DIY', '写日记'],
  },
  {
    icon: '🎬',
    label: '电影电视',
    options: ['动作片', '动漫电影', '犯罪类节目', '剧情片', '奇幻电影', '纪录片', '惊悚片', '韩剧'],
    extra: ['喜剧', '科幻', '恐怖片', '综艺'],
  },
  {
    icon: '📱',
    label: '社交生活',
    options: ['Instagram', 'X', 'SoundCloud', 'Spotify', '社交媒体活跃度', 'Pinterest', '表情包', '元宇宙'],
    extra: ['TikTok', 'YouTube', '播客', '直播'],
  },
  {
    icon: '🍽️',
    label: '美食饮品',
    options: ['美食之旅', '吃货', '早午餐', '阿萨伊', '寿司', '街边小吃', '植基饮食', '珍珠奶茶', '鸡尾酒'],
    extra: ['咖啡', '火锅', '烧烤', '甜品'],
  },
  {
    icon: '🎨',
    label: '艺术创作',
    options: ['文身', '自由职业', '摄影', '球鞋', '语言交流', '升级回收', '创业', '跳舞', '交换项目', '艺术'],
    extra: ['绘画', '书法', '陶艺', '设计'],
  },
  {
    icon: '🎵',
    label: '音乐',
    options: ['嘻哈', '摇滚', '电子', '民谣', '爵士', 'R&B', '古典', 'K-Pop'],
    extra: ['说唱', '独立', '金属', '蓝调'],
  },
  {
    icon: '⚽',
    label: '运动',
    options: ['足球', '篮球', '跑步', '游泳', '健身', '瑜伽', '登山', '骑行'],
    extra: ['滑雪', '冲浪', '网球', '拳击'],
  },
];

const interests = computed({
  get: () => props.draft.interests,
  set: (v: string[]) => emit('update:draft', { ...props.draft, interests: v }),
});

// 每个分类是否展开"显示更多"
const expanded = ref<Record<number, boolean>>({});

function toggleExpand(i: number) {
  expanded.value = { ...expanded.value, [i]: !expanded.value[i] };
}

function toggle(tag: string) {
  if (interests.value.includes(tag)) {
    interests.value = interests.value.filter((t) => t !== tag);
  } else if (interests.value.length < MAX) {
    interests.value = [...interests.value, tag];
  }
}

function remove(tag: string) {
  interests.value = interests.value.filter((t) => t !== tag);
}

const doneCount = computed(() => interests.value.length);
</script>

<template>
  <div>
    <p class="subtitle">添加至多 {{ MAX }} 项兴趣到个人资料上，助你找到同好。</p>

    <!-- 已选标签 -->
    <div v-if="interests.length" class="selected-row">
      <button
        v-for="tag in interests"
        :key="tag"
        class="selected-tag press"
        @click="remove(tag)"
      >
        {{ tag }} <span class="x">✕</span>
      </button>
    </div>

    <div class="categories">
      <div v-for="(cat, i) in CATEGORIES" :key="cat.label" class="category">
        <div class="cat-header">
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-label">{{ cat.label }}</span>
        </div>
        <div class="chip-row">
          <button
            v-for="opt in cat.options"
            :key="opt"
            class="chip press"
            :class="{
              active: interests.includes(opt),
              disabled: !interests.includes(opt) && interests.length >= MAX,
            }"
            @click="toggle(opt)"
          >
            {{ opt }}
          </button>
          <template v-if="expanded[i]">
            <button
              v-for="opt in cat.extra"
              :key="opt"
              class="chip press"
              :class="{
                active: interests.includes(opt),
                disabled: !interests.includes(opt) && interests.length >= MAX,
              }"
              @click="toggle(opt)"
            >
              {{ opt }}
            </button>
          </template>
        </div>
        <button
          v-if="cat.extra.length && !expanded[i]"
          class="show-more press"
          @click="toggleExpand(i)"
        >
          显示更多 ∨
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px;
  line-height: 1.6;
}

.selected-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 9999px;
  background: #111;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.selected-tag .x {
  font-size: 11px;
  opacity: 0.8;
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
  font-weight: 700;
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

.chip.disabled {
  opacity: 0.35;
  pointer-events: none;
}

.show-more {
  display: block;
  margin: 10px auto 0;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}
</style>
