<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ close: [] }>();

const planSlide = ref(0);
const scrolledToBottom = ref(false);

const plans = [
  { period: '1 周', price: 'US$12.99/周', hot: true, save: '' },
  { period: '1 个月', price: 'US$6.24/周', hot: false, save: '节省 52%' },
  { period: '6 个月', price: 'US$4.16/周', hot: false, save: '节省 68%' },
];

const features = [
  { title: '无限点赞', desc: '' },
  { title: '无限倒回', desc: '' },
  { title: '无限位置漫游模式*', desc: '你可以和世界各地的用户配对聊天。*含限制条件。了解更多' },
  { title: '管理你的个人资料', desc: '仅显示你想公布的信息。' },
  { title: '限制谁可以看到你', desc: '你可以管理谁可以看到你。' },
  { title: '管理你的可见用户', desc: '你可以选择你想要结识哪类用户。' },
  { title: '隐藏广告', desc: '' },
];

function onBodyScroll(e: Event) {
  const el = e.target as HTMLElement;
  scrolledToBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
}

let touchStartX = 0;
function onTouchStart(e: TouchEvent) { touchStartX = e.touches[0].clientX; }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (dx < -50 && planSlide.value < plans.length - 1) planSlide.value++;
  else if (dx > 50 && planSlide.value > 0) planSlide.value--;
}
</script>

<template>
  <Transition name="slide-up">
    <div class="plus-page">
      <header class="plus-header">
        <button class="plus-close press" @click="emit('close')">✕</button>
        <div class="plus-brand">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fe3c72"><path d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"/></svg>
          <span class="plus-brand-text">tinder</span>
          <span class="plus-badge">+</span>
        </div>
      </header>

      <div class="plus-body" @scroll="onBodyScroll">
        <h2 class="plus-title">无限点赞。无限倒回。无限位置漫游。无广告。</h2>
        <p class="plus-subtitle">选择一个套餐</p>

        <!-- 套餐轮播 -->
        <div class="plus-plans-carousel" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
          <div class="plus-plans-track" :style="{ transform: `translateX(-${planSlide * 70}%)` }">
            <div v-for="(plan, i) in plans" :key="i" class="plus-plan" :class="{ 'plus-plan-active': planSlide === i }" @click="planSlide = i">
              <span v-if="plan.hot" class="ppl-hot">热门</span>
              <span v-if="plan.save && !plan.hot" class="ppl-best">最划算</span>
              <span class="ppl-period">{{ plan.period }}</span>
              <span class="ppl-price">{{ plan.price }}</span>
              <span v-if="plan.save" class="ppl-save">{{ plan.save }}</span>
              <span v-if="planSlide === i" class="ppl-check">✓</span>
            </div>
          </div>
        </div>

        <!-- 轮播指示点 -->
        <div class="plus-dots">
          <span v-for="(_, i) in plans" :key="i" class="plus-dot" :class="{ active: planSlide === i }" @click="planSlide = i"></span>
        </div>

        <!-- 功能列表 -->
        <div class="plus-features">
          <div class="plus-features-title">Tinder Plus™ 高级功能</div>
          <div v-for="feat in features" :key="feat.title" class="plf-item">
            <span class="plf-check">✓</span>
            <div class="plf-content">
              <strong>{{ feat.title }}</strong>
              <p v-if="feat.desc">{{ feat.desc }}</p>
            </div>
          </div>
        </div>

        <p class="plus-disclaimer">当您点击"继续"后，我们将向您收取费用，您的订阅会以相同的套餐期限和价格自动续订，直至您在 Play 商店设置中取消自动续订。点击即表示您同意我们的<a href="#">条款</a>。</p>
      </div>

      <footer class="plus-footer">
        <template v-if="!scrolledToBottom">
          <button class="plus-buy-full press" @click="emit('close')">以 {{ plans[planSlide].price.replace('/周', '') }} 的总价继续操作</button>
        </template>
        <template v-else>
          <div class="plus-footer-info">
            <span class="plus-footer-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fe3c72"><path d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"/></svg>
            </span>
            <div class="plus-footer-text">
              <span class="plus-footer-period">{{ plans[planSlide].period }}</span>
              <span class="plus-footer-price">总计 {{ plans[planSlide].price.replace('/周', '') }}</span>
            </div>
          </div>
          <button class="plus-buy-btn press" @click="emit('close')">继续</button>
        </template>
      </footer>
    </div>
  </Transition>
</template>

<style scoped>
.plus-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.plus-header { display: flex; align-items: center; justify-content: center; padding: 16px 20px; position: relative; }
.plus-close { position: absolute; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; background: none; border: none; cursor: pointer; }
.plus-brand { display: flex; align-items: center; gap: 4px; }
.plus-brand-text { font-weight: 700; font-style: italic; color: #030303ff; font-size: 16px; }
.plus-badge { color: #000000ff; font-size: 18px; font-weight: 300; margin-left: 2px; }

.plus-body { flex: 1; overflow-y: auto; padding: 0 24px 24px; }
.plus-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.4; }
.plus-subtitle { font-size: 14px; color: #666; margin: 0 0 16px; }

.plus-plans-carousel { overflow: hidden; margin-bottom: 12px; }
.plus-plans-track { display: flex; gap: 12px; transition: transform 0.3s ease; padding: 0 4px; }
.plus-plan { min-width: 60%; padding: 18px; border-radius: 12px; border: 1.5px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; position: relative; flex-shrink: 0; cursor: pointer; }
.plus-plan-active { border-color: #fe3c72; }
.ppl-hot { font-size: 11px; color: #fe3c72; font-weight: 600; }
.ppl-best { font-size: 11px; color: #fe3c72; font-weight: 600; }
.ppl-period { font-size: 24px; font-weight: 800; color: #111; }
.ppl-price { font-size: 13px; color: #666; }
.ppl-save { display: inline-block; padding: 3px 8px; border-radius: 6px; background: #f0f0f0; font-size: 11px; color: #333; font-weight: 600; margin-top: 4px; }
.ppl-check { position: absolute; top: 14px; right: 14px; color: #fe3c72; font-size: 18px; }

.plus-dots { display: flex; gap: 8px; justify-content: center; margin: 12px 0 24px; }
.plus-dot { width: 8px; height: 8px; border-radius: 50%; background: #ddd; cursor: pointer; }
.plus-dot.active { background: #111; }

.plus-features { border: 1px solid #eee; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.plus-features-title { font-size: 13px; color: #666; text-align: center; margin-bottom: 16px; border: 1px solid #eee; border-radius: 8px; padding: 6px 14px; display: inline-block; }
.plf-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
.plf-check { color: #111; font-size: 16px; margin-top: 2px; font-weight: 700; }
.plf-content { flex: 1; }
.plf-content strong { font-size: 14px; color: #111; }
.plf-content p { font-size: 12px; color: #666; margin: 4px 0 0; line-height: 1.4; }
.plus-disclaimer { font-size: 11px; color: #999; line-height: 1.5; }
.plus-disclaimer a { color: #1a73e8; text-decoration: underline; }

.plus-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid #eee; background: #fff; }
.plus-footer-info { display: flex; align-items: center; gap: 8px; }
.plus-footer-icon { font-size: 20px; display: flex; align-items: center; }
.plus-footer-text { display: flex; flex-direction: column; }
.plus-footer-period { font-size: 13px; font-weight: 600; color: #111; }
.plus-footer-price { font-size: 11px; color: #666; }
.plus-buy-btn { padding: 12px 28px; border-radius: 9999px; background: linear-gradient(135deg, #fd267a, #ff6036); color: #fff; font-size: 15px; font-weight: 700; border: none; cursor: pointer; }
.plus-buy-full { width: 100%; height: 52px; border-radius: 9999px; background: linear-gradient(135deg, #fd267a, #ff6036); color: #fff; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
