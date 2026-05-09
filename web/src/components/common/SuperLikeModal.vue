<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ close: []; openGold: [] }>();

const slPlanSlide = ref(0);

const superLikePlans = [
  { count: 3, price: 'US$4.33/个', hot: false, save: '' },
  { count: 15, price: 'US$2.59/个', hot: true, save: '节省 40%' },
  { count: 30, price: 'US$1.99/个', hot: false, save: '节省 54%' },
];

let slTouchStartX = 0;
function slTouchStart(e: TouchEvent) { slTouchStartX = e.touches[0].clientX; }
function slTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - slTouchStartX;
  if (dx < -50 && slPlanSlide.value < superLikePlans.length - 1) slPlanSlide.value++;
  else if (dx > 50 && slPlanSlide.value > 0) slPlanSlide.value--;
}
</script>

<template>
  <Transition name="slide-up">
    <div class="sl-page">
      <header class="sl-header">
        <button class="sl-close press" @click="emit('close')">✕</button>
        <span class="sl-header-title">获取 Super Like</span>
        <div></div>
      </header>
      <div class="sl-body">
        <h2 class="sl-title">使用 Super Like 吸引 Ta 的目光吧，让你的配对成功几率提高 3 倍！</h2>
        <p class="sl-subtitle">选择一个套餐</p>

        <!-- 套餐轮播 -->
        <div class="sl-plans-carousel" @touchstart.passive="slTouchStart" @touchend.passive="slTouchEnd">
          <div class="sl-plans-track" :style="{ transform: `translateX(-${slPlanSlide * 80}%)` }">
            <div v-for="(plan, i) in superLikePlans" :key="i" class="sl-plan" :class="{ 'sl-plan-active': slPlanSlide === i }" @click="slPlanSlide = i">
              <span v-if="plan.hot" class="sl-hot">热门</span>
              <span v-else-if="plan.save" class="sl-best">最划算</span>
              <span v-else class="sl-hot">&nbsp;</span>
              <span class="sl-count">{{ plan.count }} Super Like</span>
              <div class="sl-price-row">
                <span class="sl-price">{{ plan.price }}</span>
                <span v-if="plan.save" class="sl-save">{{ plan.save }}</span>
              </div>
              <button class="sl-select-btn press">选择</button>
            </div>
          </div>
        </div>

        <!-- 指示点 -->
        <div class="sl-dots">
          <span v-for="(_, i) in superLikePlans" :key="i" class="sl-dot" :class="{ active: slPlanSlide === i }" @click="slPlanSlide = i"></span>
        </div>

        <!-- 或 -->
        <div class="sl-divider"><span>或</span></div>

        <!-- 底部 Gold 引导 -->
        <div class="sl-gold-hint">
          <p class="sl-gold-text">包括 2 次免费 Super Like 每 1 周</p>
          <div class="sl-gold-row">
            <span class="sl-gold-label">开通 Tinder Gold™</span>
            <button class="sl-gold-btn press" @click="emit('openGold')">选择</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sl-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.sl-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
.sl-close { width: 32px; height: 32px; font-size: 18px; color: #111; background: none; border: none; cursor: pointer; }
.sl-header-title { font-size: 15px; font-weight: 600; color: #42a5f5; }
.sl-body { flex: 1; overflow-y: auto; padding: 0 24px 32px; }
.sl-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.4; }
.sl-subtitle { font-size: 14px; color: #666; margin: 0 0 16px; }

.sl-plans-carousel { overflow: hidden; margin-bottom: 12px; }
.sl-plans-track { display: flex; gap: 12px; transition: transform 0.3s ease; }
.sl-plan { min-width: 75%; padding: 20px; border-radius: 12px; border: 1.5px solid #e8e8e8; display: flex; flex-direction: column; gap: 8px; position: relative; flex-shrink: 0; cursor: pointer; }
.sl-plan-active { border-color: #42a5f5; }
.sl-hot { font-size: 11px; color: #42a5f5; font-weight: 600; min-height: 16px; }
.sl-best { font-size: 11px; color: #42a5f5; font-weight: 600; min-height: 16px; }
.sl-count { font-size: 22px; font-weight: 800; color: #111; }
.sl-price-row { display: flex; align-items: center; gap: 8px; }
.sl-price { font-size: 14px; color: #666; }
.sl-save { padding: 3px 8px; border-radius: 6px; background: #f0f0f0; font-size: 11px; color: #333; font-weight: 600; }
.sl-select-btn { width: 100%; height: 44px; border-radius: 9999px; background: #42a5f5; color: #fff; font-size: 15px; font-weight: 600; margin-top: 8px; border: none; cursor: pointer; }

.sl-dots { display: flex; gap: 8px; justify-content: center; margin: 12px 0 24px; }
.sl-dot { width: 8px; height: 8px; border-radius: 50%; background: #ddd; cursor: pointer; }
.sl-dot.active { background: #111; }

.sl-divider { text-align: center; margin: 16px 0; position: relative; }
.sl-divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee; }
.sl-divider span { position: relative; background: #fff; padding: 0 12px; font-size: 13px; color: #999; }

.sl-gold-hint { border: 1px solid #eee; border-radius: 12px; padding: 16px; }
.sl-gold-text { font-size: 13px; color: #666; text-align: center; margin: 0 0 12px; }
.sl-gold-row { display: flex; align-items: center; justify-content: space-between; }
.sl-gold-label { font-size: 14px; font-weight: 600; color: #111; }
.sl-gold-btn { padding: 8px 16px; border-radius: 9999px; border: 1.5px solid #111; font-size: 13px; font-weight: 600; color: #111; background: #fff; cursor: pointer; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
