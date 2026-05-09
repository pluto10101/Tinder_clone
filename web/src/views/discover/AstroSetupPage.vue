<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const birthday = computed(() => {
  const b = userStore.profile?.birthday;
  if (!b) return '';
  const d = new Date(b);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
});

function goBack() { router.back(); }
function onContinue() { router.replace({ name: 'astro-result' }); }
</script>

<template>
  <div class="page">
    <!-- 星空背景 -->
    <div class="astro-bg">
      <div class="astro-glow"></div>
      <!-- 十字星 -->
      <svg class="star-svg" style="top:25%; left:18%; width:35px;" viewBox="0 0 100 100">
        <path fill="white" d="M50 0 L53 47 L100 50 L53 53 L50 100 L47 53 L0 50 L47 47 Z" />
      </svg>
      <svg class="star-svg" style="top:5%; left:58%; width:25px; opacity:0.7;" viewBox="0 0 100 100">
        <path fill="white" d="M50 0 L53 47 L100 50 L53 53 L50 100 L47 53 L0 50 L47 47 Z" />
      </svg>
      <svg class="star-svg" style="top:40%; left:85%; width:40px;" viewBox="0 0 100 100">
        <path fill="white" d="M50 0 L53 47 L100 50 L53 53 L50 100 L47 53 L0 50 L47 47 Z" />
      </svg>
      <!-- 小圆点星 -->
      <div class="star-dot" style="top:20%; left:12%; width:4px; height:4px; opacity:0.6;"></div>
      <div class="star-dot" style="top:18%; left:15%; width:3px; height:3px; opacity:0.8;"></div>
      <div class="star-dot" style="top:23%; left:45%; width:5px; height:5px; opacity:0.4;"></div>
      <div class="star-dot" style="top:38%; left:72%; width:4px; height:4px; opacity:0.7;"></div>
      <div class="star-dot" style="top:55%; left:73%; width:6px; height:6px; opacity:0.9;"></div>
      <div class="star-dot" style="top:58%; left:46%; width:3px; height:3px; opacity:0.3;"></div>
    </div>

    <!-- 顶部按钮 -->
    <header class="top-bar">
      <button class="close-btn press" @click="goBack">✕</button>
      <button class="info-btn press">i</button>
    </header>

    <!-- 标题区域（在星空背景上） -->
    <div class="hero-content">
      <h1 class="hero-title">添加星座</h1>
      <p class="hero-subtitle">星座会透露你与配对对象的适配性，看是合拍还是不合。</p>
    </div>

    <!-- 白色内容区域 -->
    <main class="main">
      <!-- 约会 -->
      <div class="field-card">
        <div class="field-left">
          <span class="field-label">约会</span>
        </div>
        <span class="field-value">{{ birthday || '添加' }}</span>
      </div>
      <div class="field-hint-row">
        <span class="hint-icon">☀️</span>
        <span class="hint-text">解锁太阳星座。它主导你的核心个性。</span>
      </div>

      <!-- 地点 -->
      <div class="field-card field-highlight">
        <div class="field-left">
          <span class="field-label">地点</span>
        </div>
        <span class="field-action">添加 ›</span>
      </div>
      <div class="field-hint-row">
        <span class="hint-icon">🌙</span>
        <span class="hint-text">解锁月亮星座，它掌管你的情感内心。</span>
      </div>

      <!-- 时间 -->
      <div class="field-card">
        <div class="field-left">
          <span class="field-label">时间</span>
        </div>
        <span class="field-action">添加 ›</span>
      </div>
      <div class="field-hint-row">
        <span class="hint-icon">⬆️</span>
        <span class="hint-text">解锁上升星座，它揭露他人眼中的你。</span>
      </div>
    </main>

    <footer class="footer safe-bottom">
      <button class="continue-btn press" @click="onContinue">保存</button>
    </footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh; display: flex; flex-direction: column; position: relative;
  background: #ffffff;
}

/* 星空背景层 - 只覆盖顶部 */
.astro-bg {
  position: absolute; top: 0; left: 0; right: 0; height: 280px;
  background:
    linear-gradient(to bottom, transparent 60%, #ffffff 100%),
    radial-gradient(circle at 80% 0%, #1a0f30 0%, transparent 50%),
    linear-gradient(135deg, #2d1b4e 0%, #4c328c 35%, #c389f0 55%, #8e8696 100%);
  pointer-events: none; z-index: 0;
  overflow: hidden;
}
.astro-glow {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 30% 40%, rgba(195, 137, 240, 0.3) 0%, transparent 60%);
}
.star-svg {
  position: absolute;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
  opacity: 0.9;
}
.star-dot {
  position: absolute;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* 顶部 */
.top-bar {
  position: relative; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; height: 56px;
}
.close-btn { width: 32px; height: 32px; font-size: 24px; color: #fff; opacity: 0.9; background: none; border: none; }
.info-btn {
  width: 26px; height: 26px; border: 2px solid white; border-radius: 50%;
  color: white; display: flex; align-items: center; justify-content: center;
  font-family: serif; font-weight: bold; font-size: 14px; opacity: 0.9; background: none;
}

/* 标题（星空上） */
.hero-content {
  position: relative; z-index: 5;
  padding: 10px 24px 40px;
}
.hero-title {
  font-size: 32px; color: #ffffff; margin: 0 0 12px;
  font-weight: 700;
}
.hero-subtitle {
  font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.75);
  margin: 0;
}

/* 白色内容区 */
.main {
  flex: 1; padding: 0 24px 24px; position: relative; z-index: 5;
}

.field-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px; border-radius: 14px; border: 1.5px solid #e8e8e8;
  margin-bottom: 6px; background: #fff;
}
.field-highlight { border-color: #4caf9e; background: rgba(76, 175, 158, 0.04); }
.field-label { font-size: 15px; font-weight: 500; color: #111; }
.field-value { font-size: 14px; color: #555; font-weight: 500; }
.field-action { font-size: 14px; color: #555; }

.field-hint-row { display: flex; align-items: flex-start; gap: 6px; padding: 6px 4px 20px; }
.hint-icon { font-size: 14px; margin-top: 1px; }
.hint-text { font-size: 13px; color: #666; line-height: 1.4; }

.footer { padding: 16px 24px; background: #fff; }
.continue-btn {
  width: 100%; height: 52px; border-radius: 9999px;
  background: #111; color: #fff; font-size: 16px; font-weight: 600;
  border: none; cursor: pointer;
}
</style>
