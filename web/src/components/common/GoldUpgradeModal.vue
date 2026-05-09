<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ close: [] }>();

const goldPlanSlide = ref(0);
const goldScrolledToBottom = ref(false);

const goldPlans = [
  { period: '1 周', price: 'US$18.99/周', hot: true, save: '' },
  { period: '1 个月', price: 'US$9.99/周', hot: false, save: '节省 47%' },
  { period: '6 个月', price: 'US$5.83/周', hot: false, save: '节省 69%' },
];

const goldFeatures = [
  { title: '无限点赞', desc: '' },
  { title: '查看给你点赞的人', desc: '' },
  { title: '无限倒回', desc: '' },
  { title: '每月 1 个免费 Boost', desc: '购买一个月或更长时间的订阅，才可享受每月免费的 Boost。' },
  { title: '每周免费 2 个 Super Like', desc: '' },
  { title: '无限位置漫游模式*', desc: '你可以和世界各地的用户配对聊天。*含限制条件。了解更多' },
  { title: '最佳精选', desc: '你可以查看我们每日为你精选的个人资料。' },
  { title: '管理你的个人资料', desc: '仅显示你想公布的信息。' },
  { title: '限制谁可以看到你', desc: '你可以管理谁可以看到你。' },
  { title: '管理你的可见用户', desc: '你可以选择你想要结识哪类用户。' },
  { title: '隐藏广告', desc: '' },
];

function onGoldScroll(e: Event) {
  const el = e.target as HTMLElement;
  goldScrolledToBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
}

let goldTouchStartX = 0;
function goldTouchStart(e: TouchEvent) { goldTouchStartX = e.touches[0].clientX; }
function goldTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - goldTouchStartX;
  if (dx < -50 && goldPlanSlide.value < goldPlans.length - 1) goldPlanSlide.value++;
  else if (dx > 50 && goldPlanSlide.value > 0) goldPlanSlide.value--;
}
</script>

<template>
  <Transition name="slide-up">
    <div class="gold-page">
      <header class="gold-header">
        <button class="gold-close press" @click="emit('close')">✕</button>
        <div class="gold-brand">🔥 <span class="gold-brand-text">tinder <span class="gold-badge">GOLD</span></span></div>
      </header>

      <div class="gold-body" @scroll="onGoldScroll">
        <h2 class="gold-title">开通 Tinder Gold™ 可以查看给你点赞的人，然后快速和对方达成配对。</h2>
        <p class="gold-subtitle">选择一个套餐</p>

        <!-- 套餐轮播 -->
        <div class="gold-plans-carousel" @touchstart.passive="goldTouchStart" @touchend.passive="goldTouchEnd">
          <div class="gold-plans-track" :style="{ transform: `translateX(-${goldPlanSlide * 70}%)` }">
            <div v-for="(plan, i) in goldPlans" :key="i" class="gold-plan" :class="{ 'gold-plan-active': goldPlanSlide === i }" @click="goldPlanSlide = i">
              <span v-if="plan.hot" class="gp-hot">热门</span>
              <span v-if="plan.save && !plan.hot" class="gp-best">最划算</span>
              <span class="gp-period">{{ plan.period }}</span>
              <span class="gp-price">{{ plan.price }}</span>
              <span v-if="plan.save" class="gp-save">{{ plan.save }}</span>
              <span v-if="goldPlanSlide === i" class="gp-check">✓</span>
            </div>
          </div>
        </div>

        <!-- 轮播指示点 -->
        <div class="gold-dots">
          <span v-for="(_, i) in goldPlans" :key="i" class="gold-dot" :class="{ active: goldPlanSlide === i }" @click="goldPlanSlide = i"></span>
        </div>

        <!-- 功能列表 -->
        <div class="gold-features">
          <div class="gold-features-title">Tinder Gold® 专属特权</div>
          <div v-for="feat in goldFeatures" :key="feat.title" class="gf-item">
            <span class="gf-check">✓</span>
            <div class="gf-content">
              <strong>{{ feat.title }}</strong>
              <p v-if="feat.desc">{{ feat.desc }}</p>
            </div>
          </div>
        </div>

        <p class="gold-disclaimer">当您点击"继续"后，我们将向您收取费用，您的订阅会以相同的套餐期限和价格自动续订，直至您在 Play 商店设置中取消自动续订。点击即表示您同意我们的<a href="#">条款</a>。</p>
      </div>

      <footer class="gold-footer">
        <template v-if="!goldScrolledToBottom">
          <button class="gold-buy-full press" @click="emit('close')">以 {{ goldPlans[goldPlanSlide].price.replace('/周', '') }} 的总价继续操作</button>
        </template>
        <template v-else>
          <div class="gold-footer-info">
            <span class="gold-footer-icon">🔥</span>
            <div class="gold-footer-text">
              <span class="gold-footer-period">{{ goldPlans[goldPlanSlide].period }}</span>
              <span class="gold-footer-price">总计 {{ goldPlans[goldPlanSlide].price.replace('/周', '') }}</span>
            </div>
          </div>
          <button class="gold-buy-btn press" @click="emit('close')">继续</button>
        </template>
      </footer>
    </div>
  </Transition>
</template>

<style scoped>
.gold-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.gold-header { display: flex; align-items: center; justify-content: center; padding: 16px 20px; position: relative; }
.gold-close { position: absolute; left: 20px; width: 32px; height: 32px; font-size: 18px; color: #111; background: none; border: none; cursor: pointer; }
.gold-brand { font-size: 18px; }
.gold-brand-text { font-weight: 700; font-style: italic; color: #111; }
.gold-badge { background: linear-gradient(135deg, #d4a017, #f5c518); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; font-style: normal; margin-left: 4px; }

.gold-body { flex: 1; overflow-y: auto; padding: 0 24px 24px; }
.gold-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 24px; line-height: 1.4; }
.gold-subtitle { font-size: 14px; color: #666; margin: 0 0 16px; }

.gold-plans-carousel { overflow: hidden; margin-bottom: 12px; }
.gold-plans-track { display: flex; gap: 12px; transition: transform 0.3s ease; padding: 0 4px; }
.gold-plan { min-width: 60%; padding: 18px; border-radius: 12px; border: 1.5px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; position: relative; flex-shrink: 0; cursor: pointer; }
.gold-plan-active { border-color: #d4a017; }
.gp-hot { font-size: 11px; color: #d4a017; font-weight: 600; }
.gp-best { font-size: 11px; color: #d4a017; font-weight: 600; }
.gp-period { font-size: 24px; font-weight: 800; color: #111; }
.gp-price { font-size: 13px; color: #666; }
.gp-save { display: inline-block; padding: 3px 8px; border-radius: 6px; background: #f0f0f0; font-size: 11px; color: #333; font-weight: 600; margin-top: 4px; }
.gp-check { position: absolute; top: 14px; right: 14px; color: #d4a017; font-size: 18px; }

.gold-dots { display: flex; gap: 8px; justify-content: center; margin: 12px 0 24px; }
.gold-dot { width: 8px; height: 8px; border-radius: 50%; background: #ddd; cursor: pointer; }
.gold-dot.active { background: #111; }

.gold-features { border: 1px solid #eee; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.gold-features-title { font-size: 13px; color: #666; text-align: center; margin-bottom: 16px; border: 1px solid #eee; border-radius: 8px; padding: 6px 14px; display: inline-block; }
.gf-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
.gf-check { color: #111; font-size: 16px; margin-top: 2px; font-weight: 700; }
.gf-content { flex: 1; }
.gf-content strong { font-size: 14px; color: #111; }
.gf-content p { font-size: 12px; color: #666; margin: 4px 0 0; line-height: 1.4; }
.gold-disclaimer { font-size: 11px; color: #999; line-height: 1.5; }
.gold-disclaimer a { color: #1a73e8; text-decoration: underline; }

.gold-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid #eee; background: #fff; }
.gold-footer-info { display: flex; align-items: center; gap: 8px; }
.gold-footer-icon { font-size: 20px; }
.gold-footer-text { display: flex; flex-direction: column; }
.gold-footer-period { font-size: 13px; font-weight: 600; color: #111; }
.gold-footer-price { font-size: 11px; color: #666; }
.gold-buy-btn { padding: 12px 28px; border-radius: 9999px; background: linear-gradient(135deg, #d4a017, #f5c518); color: #111; font-size: 15px; font-weight: 700; border: none; cursor: pointer; }
.gold-buy-full { width: 100%; height: 52px; border-radius: 9999px; background: linear-gradient(135deg, #d4a017, #f5c518); color: #111; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
