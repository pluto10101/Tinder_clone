<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() { router.back(); }
function enterAstro() {
  // 回到发现页并激活占星术标签
  router.replace({ name: 'discover', query: { tab: 'astro' } });
}
</script>

<template>
  <div class="page">
    <!-- 紫色星空背景 -->
    <div class="bg"></div>
    <div class="stars">
      <span class="s s1">✦</span>
      <span class="s s2">✦</span>
      <span class="s s3">✦</span>
      <span class="s s4">✦</span>
    </div>

    <header class="top">
      <button class="close press" @click="goBack">✕</button>
    </header>

    <main class="main">
      <!-- 品牌 -->
      <div class="brand-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 6 8 6 13.5C6 17.6 9 21 12 21C15 21 18 17.6 18 13.5C18 10 15.5 8 15.5 8C15.5 8 15 12 13 12C13 12 14 7 12 2Z" fill="#fff"/></svg>
        <span class="brand-text">tinder</span>
        <span class="brand-label">占星术</span>
      </div>

      <h1 class="title">关于你</h1>

      <!-- 右上角星座图标 -->
      <div class="zodiac-icon">
        <div class="zodiac-circle">✦</div>
      </div>

      <!-- 太阳星座 -->
      <div class="astro-item">
        <div class="astro-badge">☀️</div>
        <div class="astro-content">
          <div class="astro-label" style="color: #e8a838;">太阳水瓶座 ♒</div>
          <div class="astro-title">核心个性</div>
          <p class="astro-desc">你才思敏捷，外带几分古灵精怪。你遵循自己心中的节拍。</p>
        </div>
      </div>

      <!-- 月亮星座（锁定） -->
      <div class="astro-item astro-locked">
        <div class="astro-badge">🔒</div>
        <div class="astro-content">
          <div class="astro-label">月亮星座</div>
          <div class="astro-title">情感内心</div>
          <p class="astro-desc">添加出生地点，解锁月亮星座。</p>
        </div>
      </div>

      <!-- 上升星座（锁定） -->
      <div class="astro-item astro-locked">
        <div class="astro-badge">🔒</div>
        <div class="astro-content">
          <div class="astro-label">上升星座</div>
          <div class="astro-title">他人眼中的你</div>
          <p class="astro-desc">添加出生时间和地点，解锁上升星座。</p>
        </div>
      </div>
    </main>

    <footer class="footer safe-bottom">
      <button class="enter-btn press" @click="enterAstro">进入星座板块</button>
      <button class="add-btn press">添加出生时间和地点</button>
    </footer>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; position: relative; overflow: hidden; display: flex; flex-direction: column; }
.bg { position: absolute; inset: 0; background: linear-gradient(180deg, #3a1a7a 0%, #2a1060 40%, #1a0840 100%); }
.stars { position: absolute; inset: 0; pointer-events: none; }
.s { position: absolute; color: #fff; opacity: 0.7; }
.s1 { top: 8%; left: 10%; font-size: 14px; }
.s2 { top: 12%; right: 20%; font-size: 18px; }
.s3 { top: 25%; left: 30%; font-size: 10px; }
.s4 { top: 5%; right: 40%; font-size: 12px; }

.top { position: relative; z-index: 10; padding: 16px 20px; }
.close { width: 32px; height: 32px; color: #fff; font-size: 18px; }

.main { flex: 1; position: relative; z-index: 5; padding: 0 24px; }

.brand-row { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
.brand-text { font-size: 14px; font-weight: 300; font-style: italic; color: #fff; }
.brand-label { font-size: 12px; color: rgba(255,255,255,0.7); margin-left: 4px; }

.title { font-size: 32px; font-weight: 700; color: #fff; margin: 0 0 24px; }

.zodiac-icon { position: absolute; top: 0; right: 24px; }
.zodiac-circle {
  width: 56px; height: 56px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: #fff;
}

.astro-item { display: flex; gap: 12px; margin-bottom: 24px; }
.astro-badge { font-size: 28px; flex: none; margin-top: 4px; }
.astro-content { flex: 1; }
.astro-label { font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 2px; }
.astro-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.astro-desc { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5; margin: 0; }
.astro-locked .astro-title { color: rgba(255,255,255,0.6); }

.footer { position: relative; z-index: 5; padding: 16px 24px 8px; text-align: center; }
.enter-btn {
  width: 100%; height: 52px; border-radius: 9999px;
  background: #fff; color: #111; font-size: 16px; font-weight: 600; margin-bottom: 12px;
}
.add-btn { font-size: 15px; font-weight: 600; color: #fff; padding: 8px; }
</style>
