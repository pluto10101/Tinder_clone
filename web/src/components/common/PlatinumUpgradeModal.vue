<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ close: [] }>();

const planSlide = ref(0);
const scrolledToBottom = ref(false);

const plans = [
  { period: '1 周', price: 'US$24.99/周', hot: true, save: '' },
  { period: '1 个月', price: 'US$12.49/周', hot: false, save: '节省 50%' },
  { period: '6 个月', price: 'US$8.33/周', hot: false, save: '节省 67%' },
];

const features = [
  { title: '无限点赞', desc: '' },
  { title: '查看给你点赞的人', desc: '' },
  { title: '置顶赞', desc: '置顶赞可以让你赞的人更快看到你。' },
  { title: '无限倒回', desc: '' },
  { title: '每月 1 个免费 Boost', desc: '购买一个月或更长时间的订阅，才可享受每月免费的 Boost。' },
  { title: '每周 3 个免费 Super Like', desc: '' },
  { title: '每周 3 次免费初印象', desc: '配对前可发送信息赢得好感。' },
  { title: '无限位置漫游模式*', desc: '你可以和世界各地的用户配对聊天。*含限制条件。了解更多' },
  { title: '最佳精选', desc: '你可以查看我们每日为你精选的个人资料。' },
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
    <div class="plat-page">
      <header class="plat-header">
        <button class="plat-close press" @click="emit('close')">✕</button>
        <div class="plat-brand">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#333"><path d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"/></svg>
          <span class="plat-brand-text">tinder</span>
          <span class="plat-badge">PLATINUM</span>
        </div>
      </header>

      <div class="plat-body" @scroll="onBodyScroll">
        <h2 class="plat-title">开通 Platinum，升级你的赞和 Super Like。</h2>
        <p class="plat-subtitle">选择一个套餐</p>

        <!-- 套餐轮播 -->
        <div class="plat-plans-carousel" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
          <div class="plat-plans-track" :style="{ transform: `translateX(-${planSlide * 70}%)` }">
            <div v-for="(plan, i) in plans" :key="i" class="plat-plan" :class="{ 'plat-plan-active': planSlide === i }" @click="planSlide = i">
              <span v-if="plan.hot" class="pp-hot">热门</span>
              <span v-if="plan.save && !plan.hot" class="pp-best">最划算</span>
              <span class="pp-period">{{ plan.period }}</span>
              <span class="pp-price">{{ plan.price }}</span>
              <span v-if="plan.save" class="pp-save">{{ plan.save }}</span>
              <span v-if="planSlide === i" class="pp-check">✓</span>
            </div>
          </div>
        </div>

        <!-- 轮播指示点 -->
        <div class="plat-dots">
          <span v-for="(_, i) in plans" :key="i" class="plat-dot" :class="{ active: planSlide === i }" @click="planSlide = i"></span>
        </div>

        <!-- 功能列表 -->
        <div class="plat-features">
          <div class="plat-features-title">Tinder Platinum 高级功能</div>
          <div v-for="feat in features" :key="feat.title" class="pf-item">
            <span class="pf-check">✓</span>
            <div class="pf-content">
              <strong>{{ feat.title }}</strong>
              <p v-if="feat.desc">{{ feat.desc }}</p>
            </div>
          </div>
        </div>

        <p class="plat-disclaimer">当您点击"继续"后，我们将向您收取费用，您的订阅会以相同的套餐期限和价格自动续订，直至您在 Play 商店设置中取消自动续订。点击即表示您同意我们的<a href="#">条款</a>。</p>
      </div>

      <footer class="plat-footer">
        <template v-if="!scrolledToBottom">
          <button class="plat-buy-full press" @click="emit('close')">以 {{ plans[planSlide].price.replace('/周', '') }} 的总价继续操作</button>
        </template>
        <template v-else>
          <div class="plat-footer-info">
            <span class="plat-footer-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#333"><path d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"/></svg>
            </span>
            <div class="plat-footer-text">
              <span class="plat-footer-period">{{ plans[planSlide].period }}</span>
              <span class="plat-footer-price">总计 {{ plans[planSlide].price.replace('/周', '') }}</span>
            </div>
          </div>
          <button class="plat-buy-btn press" @click="emit('close')">继续</button>
        </template>
      </footer>
    </div>
  </Transition>
</template>

<style scoped>
.plat-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.plat-header { display: flex; align-items: center; justify-content: center; padding: 16px 20px; position: relative; }
.plat-close { position: absolute; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; background: none; border: none; cursor: pointer; }
.plat-brand { display: flex; align-items: center; gap: 4px; }
.plat-brand-text { font-weight: 700; font-style: italic; color: #333; font-size: 16px; }
.plat-badge { background: #333; color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px; margin-left: 4px; }

.plat-body { flex: 1; overflow-y: auto; padding: 0 24px 24px; }
.plat-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.4; }
.plat-subtitle { font-size: 14px; color: #666; margin: 0 0 16px; }

.plat-plans-carousel { overflow: hidden; margin-bottom: 12px; }
.plat-plans-track { display: flex; gap: 12px; transition: transform 0.3s ease; padding: 0 4px; }
.plat-plan { min-width: 60%; padding: 18px; border-radius: 12px; border: 1.5px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; position: relative; flex-shrink: 0; cursor: pointer; }
.plat-plan-active { border-color: #333; }
.pp-hot { font-size: 11px; color: #333; font-weight: 600; }
.pp-best { font-size: 11px; color: #333; font-weight: 600; }
.pp-period { font-size: 24px; font-weight: 800; color: #111; }
.pp-price { font-size: 13px; color: #666; }
.pp-save { display: inline-block; padding: 3px 8px; border-radius: 6px; background: #f0f0f0; font-size: 11px; color: #333; font-weight: 600; margin-top: 4px; }
.pp-check { position: absolute; top: 14px; right: 14px; color: #333; font-size: 18px; }

.plat-dots { display: flex; gap: 8px; justify-content: center; margin: 12px 0 24px; }
.plat-dot { width: 8px; height: 8px; border-radius: 50%; background: #ddd; cursor: pointer; }
.plat-dot.active { background: #111; }

.plat-features { border: 1px solid #eee; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.plat-features-title { font-size: 13px; color: #666; text-align: center; margin-bottom: 16px; border: 1px solid #eee; border-radius: 8px; padding: 6px 14px; display: inline-block; }
.pf-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
.pf-check { color: #111; font-size: 16px; margin-top: 2px; font-weight: 700; }
.pf-content { flex: 1; }
.pf-content strong { font-size: 14px; color: #111; }
.pf-content p { font-size: 12px; color: #666; margin: 4px 0 0; line-height: 1.4; }
.plat-disclaimer { font-size: 11px; color: #999; line-height: 1.5; }
.plat-disclaimer a { color: #1a73e8; text-decoration: underline; }

.plat-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid #eee; background: #fff; }
.plat-footer-info { display: flex; align-items: center; gap: 8px; }
.plat-footer-icon { font-size: 20px; display: flex; align-items: center; }
.plat-footer-text { display: flex; flex-direction: column; }
.plat-footer-period { font-size: 13px; font-weight: 600; color: #111; }
.plat-footer-price { font-size: 11px; color: #666; }
.plat-buy-btn { padding: 12px 28px; border-radius: 9999px; background: #333; color: #fff; font-size: 15px; font-weight: 700; border: none; cursor: pointer; }
.plat-buy-full { width: 100%; height: 52px; border-radius: 9999px; background: #333; color: #fff; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
