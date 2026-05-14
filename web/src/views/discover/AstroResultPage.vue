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
        <div class="astro-badge sunburst-container">
          <div class="sunburst-outer-glow"></div>
          <div class="sunburst-core-highlight"></div>
          <svg class="sunburst-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="tinderGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#ffffff; stop-opacity:1" />
                <stop offset="25%" style="stop-color:#ffccd5; stop-opacity:1" />
                <stop offset="60%" style="stop-color:#ff3d72; stop-opacity:1" />
                <stop offset="100%" style="stop-color:#bd1e4a; stop-opacity:1" />
              </radialGradient>
            </defs>
            <path d="M50 0 L55 38 L68 12 L65 40 L85 25 L75 45 L98 42 L80 53 L98 68 L76 65 L88 88 L67 74 L68 98 L56 78 L50 100 L44 78 L32 98 L33 74 L12 88 L24 65 L2 68 L20 53 L2 42 L25 45 L15 25 L35 40 L32 12 L45 38 Z"
              fill="url(#tinderGrad)"
              stroke="#fe3c72"
              stroke-width="1.5"
              stroke-linejoin="round" />
          </svg>
        </div>
        <div class="astro-content">
          <div class="astro-label" style="color: #e8a838;">太阳水瓶座 ♒</div>
          <div class="astro-title">核心个性</div>
          <p class="astro-desc">你才思敏捷，外带几分古灵精怪。你遵循自己心中的节拍。</p>
        </div>
      </div>

      <!-- 月亮星座（锁定） -->
      <div class="astro-item astro-locked">
        <div class="astro-badge"><svg class="lock-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/></svg></div>
        <div class="astro-content">
          <div class="astro-label">月亮星座</div>
          <div class="astro-title">情感内心</div>
          <p class="astro-desc">添加出生地点，解锁月亮星座。</p>
        </div>
      </div>

      <!-- 上升星座（锁定） -->
      <div class="astro-item astro-locked">
        <div class="astro-badge"><svg class="lock-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/></svg></div>
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
.sunburst-container {
  position: relative; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
}
.sunburst-outer-glow {
  position: absolute; width: 28px; height: 28px;
  background: #fe3c72; border-radius: 50%;
  filter: blur(10px); opacity: 0.6;
}
.sunburst-core-highlight {
  position: absolute; width: 10px; height: 10px;
  background: radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0) 70%);
  filter: blur(3px); z-index: 3; pointer-events: none;
}
.sunburst-icon {
  width: 32px; height: 32px; z-index: 2;
  filter: blur(0.5px) drop-shadow(0 0 6px #fe3c72) drop-shadow(0 0 2px #ff8ba7);
  animation: sunpulse 2s infinite ease-in-out;
}
@keyframes sunpulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
}
.lock-icon { width: 32px; height: 32px; fill: #b39ddb; transform: rotate(15deg); }
.astro-content { flex: 1; }
.astro-label { font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 2px; }
.astro-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.astro-desc { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5; margin: 0; }
.astro-locked .astro-title { color: rgba(255,255,255,0.6); }

.footer { position: relative; z-index: 5; padding: 16px 24px 20px; text-align: center; }
.enter-btn {
  width: 100%; height: 52px; border-radius: 9999px;
  background: #fff; color: #111; font-size: 16px; font-weight: 600; margin-bottom: 22px;
}
.add-btn { font-size: 15px; font-weight: 600; color: #fff; padding: 8px; }
</style>
