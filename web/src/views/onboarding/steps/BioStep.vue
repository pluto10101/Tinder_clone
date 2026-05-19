<script setup lang="ts">
import { computed, ref } from 'vue';
import type { OnboardingDraft } from '../types';

const props = defineProps<{ draft: OnboardingDraft }>();
const emit = defineEmits<{ 'update:draft': [v: OnboardingDraft] }>();

const bio = computed({
  get: () => props.draft.bio,
  set: (v: string) => emit('update:draft', { ...props.draft, bio: v.slice(0, 500) }),
});

const showBioInput = ref(false);
const showCaptionInput = ref(false);
</script>

<template>
  <div>
    <p class="subtitle">
      添加个人介绍和"关于我"，装点个人资料，吸引更多话题。
    </p>

    <!-- 个人简介卡片 -->
    <div class="card" @click="showBioInput = !showBioInput">
      <div class="card-content">
        <div class="card-title">个人简介</div>
        <div class="card-desc">介绍下自己，给人留下强烈印象。</div>
      </div>
      <button class="card-add press" @click.stop="showBioInput = !showBioInput">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#111" />
          <path d="M12 7v10M7 12h10" stroke="#fff" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <!-- 个人简介输入框 -->
    <div v-if="showBioInput" class="bio-input-area">
      <textarea
        v-model="bio"
        class="textarea"
        rows="4"
        placeholder="说点什么吧..."
        autofocus
      />
      <div class="counter">{{ bio.length }} / 500</div>
    </div>

    <!-- 照片配文卡片 -->
    <div class="card" @click="showCaptionInput = !showCaptionInput">
      <div class="card-content">
        <div class="card-title">选择一项照片配文</div>
        <div class="card-desc">添加"关于我"，秀出你的个性。</div>
      </div>
      <button class="card-add press" @click.stop="showCaptionInput = !showCaptionInput">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#111" />
          <path d="M12 7v10M7 12h10" stroke="#fff" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <!-- 底部提示 -->
    <div class="tip">
      <span class="tip-icon">💡</span>
      <span class="tip-text">写个简短介绍，配对人数可能会提高<strong class="tip-highlight">25%</strong></span>
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

.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f5f5f5;
  border-radius: 14px;
  padding: 20px 16px;
  margin-bottom: 12px;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.card-add {
  flex: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
}

.tip {
  position: fixed;
  left: 24px;
  right: 24px;
  bottom: 80px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tip-icon {
  font-size: 18px;
  flex: none;
}

.tip-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.4;
}

.tip-highlight {
  color: #ff4458;
  font-weight: 700;
}

.bio-input-area {
  margin-top: 16px;
}

.textarea {
  width: 100%;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  font-size: 15px;
  color: var(--text-primary);
  background: #fff;
  resize: none;
  line-height: 1.6;
}

.textarea:focus {
  border-color: #111;
}

.counter {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-tertiary);
  text-align: right;
}
</style>
