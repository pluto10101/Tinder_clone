<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() { router.back(); }
function viewDetails() { router.push({ name: 'astro-setup' }); }
</script>

<template>
  <div class="page">
    <!-- 顶部紫色星空区域 -->
    <div class="header-section">
      <div class="header-bg">
        <div class="stars-layer">
          <span class="st st1">✦</span>
          <span class="st st2">✦</span>
          <span class="st st3">✧</span>
          <span class="st st4">✦</span>
          <span class="st st5">✦</span>
        </div>
      </div>

      <div class="header-content">
        <div class="handle"></div>
        <div class="header-top">
          <button class="close press" @click="goBack">✕</button>
          <button class="info press">ⓘ</button>
        </div>

        <div class="brand-row">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 6 8 6 13.5C6 17.6 9 21 12 21C15 21 18 17.6 18 13.5C18 10 15.5 8 15.5 8C15.5 8 15 12 13 12C13 12 14 7 12 2Z" fill="#fff"/></svg>
          <span class="brand-name">tinder</span>
          <span class="brand-label">占星术</span>
        </div>

        <div class="title-row">
          <h2 class="compat-title">你和 Niio</h2>
          <div class="avatars-mini">
            <div class="av-mini">👤</div>
            <div class="av-mini">👤</div>
          </div>
        </div>

        <!-- 个性对比卡片 -->
        <div class="compat-card">
          <div class="cc-header">
            <span class="cc-icon">☀️</span>
            <span class="cc-label">个性对比</span>
          </div>
          <p class="cc-signs">你: 水瓶座 ♒ ，Niio: <span class="cc-highlight">天蝎座 ♏</span></p>
          <p class="cc-desc">不像其他人，你们乐于改变。你们总在进步，努力成为最好的自己。</p>
        </div>

        <!-- 轮播指示器 -->
        <div class="dots">
          <span class="dot active"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>

    <!-- 白色内容区 -->
    <main class="main">
      <!-- 你的宇宙火花 -->
      <section class="sec">
        <h3 class="sec-title">你的宇宙火花</h3>
        <div class="spark-grid">
          <div class="spark-item">
            <div class="spark-label">心电感应</div>
            <div class="spark-bar">
              <span class="bar-fill-red" style="width: 40%;"></span>
            </div>
          </div>
          <div class="spark-item">
            <div class="spark-label">传播学</div>
            <div class="spark-bar">
              <span class="bar-fill-red" style="width: 60%;"></span>
            </div>
          </div>
          <div class="spark-item">
            <div class="spark-label">情感</div>
            <div class="spark-bar spark-locked">
              <span class="bar-fill-gray"></span>
              <span class="lock-icon">🔒</span>
            </div>
          </div>
          <div class="spark-item">
            <div class="spark-label">火花指数</div>
            <div class="spark-bar spark-locked">
              <span class="bar-fill-gray"></span>
              <span class="lock-icon">🔒</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 元素组合 -->
      <section class="sec">
        <h3 class="sec-title">元素组合</h3>
        <div class="element-grid">
          <div class="element-item">
            <div class="el-icon">🔥</div>
            <div class="el-info">
              <div class="el-name">火象</div>
              <div class="el-desc">激情与行动</div>
            </div>
            <div class="el-percent" style="color: #f2385a;">0%</div>
          </div>
          <div class="element-item">
            <div class="el-icon">🌍</div>
            <div class="el-info">
              <div class="el-name">土象</div>
              <div class="el-desc">现实与实际</div>
            </div>
            <div class="el-percent" style="color: #f2385a;">0%</div>
          </div>
          <div class="element-item">
            <div class="el-icon">🌬️</div>
            <div class="el-info">
              <div class="el-name">风象</div>
              <div class="el-desc">交流与创造</div>
            </div>
            <div class="el-percent" style="color: #b74fff;">50%</div>
          </div>
          <div class="element-item">
            <div class="el-icon">💧</div>
            <div class="el-info">
              <div class="el-name">水象</div>
              <div class="el-desc">情感与本能</div>
            </div>
            <div class="el-percent" style="color: #42a5f5;">50%</div>
          </div>
        </div>
      </section>

      <!-- 星座元素解释 -->
      <section class="sec">
        <div class="explain-card">
          <div class="explain-title">星座元素解释如下</div>
          <p class="explain-desc">风趣幽默的谈吐会拉近彼此的距离。</p>
        </div>
      </section>
    </main>

    <!-- 底部按钮 -->
    <footer class="footer safe-bottom">
      <button class="detail-btn press" @click="viewDetails">查看细节</button>
    </footer>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #f8f8f8; display: flex; flex-direction: column; }

/* Header */
.header-section { position: relative; }
.header-bg {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, #2a1060 0%, #3a1a7a 60%, #5a2d9e 100%);
  border-radius: 0 0 20px 20px;
}
.stars-layer { position: absolute; inset: 0; }
.st { position: absolute; color: #fff; opacity: 0.7; }
.st1 { top: 10%; left: 15%; font-size: 14px; }
.st2 { top: 8%; right: 20%; font-size: 18px; }
.st3 { top: 25%; right: 10%; font-size: 10px; }
.st4 { top: 15%; left: 40%; font-size: 8px; }
.st5 { top: 30%; left: 10%; font-size: 12px; }

.header-content { position: relative; z-index: 5; padding: 8px 20px 20px; }
.handle { width: 36px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.4); margin: 0 auto 12px; }
.header-top { display: flex; justify-content: space-between; margin-bottom: 12px; }
.close { width: 28px; height: 28px; color: #fff; font-size: 16px; }
.info { width: 28px; height: 28px; color: #fff; font-size: 16px; border: 1px solid rgba(255,255,255,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; }

.brand-row { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
.brand-name { font-size: 12px; font-weight: 300; font-style: italic; color: #fff; }
.brand-label { font-size: 11px; color: rgba(255,255,255,0.6); margin-left: 4px; }

.title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.compat-title { font-size: 24px; font-weight: 700; color: #fff; margin: 0; }
.avatars-mini { display: flex; gap: -4px; }
.av-mini { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 16px; margin-left: -4px; border: 2px solid rgba(255,255,255,0.4); }

/* Compat Card */
.compat-card { background: rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; backdrop-filter: blur(4px); }
.cc-header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.cc-icon { font-size: 16px; }
.cc-label { font-size: 13px; font-weight: 600; color: #fff; }
.cc-signs { font-size: 12px; color: rgba(255,255,255,0.7); margin: 0 0 6px; }
.cc-highlight { color: #e8a838; font-weight: 600; }
.cc-desc { font-size: 14px; color: #fff; line-height: 1.5; margin: 0; }

.dots { display: flex; justify-content: center; gap: 6px; margin-top: 12px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.3); }
.dot.active { background: #fff; }

/* Main */
.main { flex: 1; padding: 20px 20px 0; }
.sec { margin-bottom: 24px; }
.sec-title { font-size: 18px; font-weight: 700; color: #111; margin: 0 0 14px; }

/* Spark */
.spark-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.spark-item {}
.spark-label { font-size: 13px; color: #666; margin-bottom: 6px; }
.spark-bar { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; position: relative; display: flex; align-items: center; }
.bar-fill-red { height: 100%; background: #f2385a; border-radius: 4px; display: flex; }
.bar-fill-gray { height: 100%; width: 100%; background: #e0e0e0; border-radius: 4px; }
.spark-locked { position: relative; }
.lock-icon { position: absolute; right: 4px; top: 50%; transform: translateY(-50%); font-size: 10px; }

/* Elements */
.element-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.element-item { display: flex; align-items: center; gap: 10px; }
.el-icon { font-size: 32px; }
.el-info { flex: 1; }
.el-name { font-size: 14px; font-weight: 600; color: #111; }
.el-desc { font-size: 11px; color: #888; }
.el-percent { font-size: 13px; font-weight: 700; }

/* Explain */
.explain-card { background: #fff; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #eee; }
.explain-title { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 4px; }
.explain-desc { font-size: 13px; color: #666; margin: 0; line-height: 1.5; }

/* Footer */
.footer { padding: 16px 24px; background: #f8f8f8; }
.detail-btn { width: 100%; height: 52px; border-radius: 9999px; background: #fff; border: 1.5px solid #111; font-size: 16px; font-weight: 600; color: #111; }
</style>
