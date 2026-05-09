<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ close: []; openGold: [] }>();

const boostTab = ref<'boost' | 'prime' | 'super'>('boost');
const boostPlanIndex = ref(1);
</script>

<template>
  <Transition name="slide-up">
    <div class="boost-page" :class="{ 'boost-page-super': boostTab === 'super' }">
      <header class="bp-header">
        <button class="bp-close press" @click="emit('close')">✕</button>
      </header>
      <div class="bp-body">
        <h1 class="bp-title">选择 Boost</h1>
        <div class="bp-tabs">
          <button class="bp-tab" :class="{ 'bp-tab-active': boostTab === 'boost' }" @click="boostTab = 'boost'; boostPlanIndex = 1">Boost</button>
          <button class="bp-tab" :class="{ 'bp-tab-active': boostTab === 'prime' }" @click="boostTab = 'prime'; boostPlanIndex = 1">优时 Boost</button>
          <button class="bp-tab" :class="{ 'bp-tab-active': boostTab === 'super' }" @click="boostTab = 'super'; boostPlanIndex = 1">Super Boost</button>
        </div>
        <template v-if="boostTab === 'boost'">
          <div class="bp-desc-card">
            <div class="bp-desc-left"><div class="bp-desc-icon">⚡</div><strong>Boost</strong><p>成为当地的最佳个人资料，30 分钟内帮你收获更多点赞。</p></div>
            <img src="https://picsum.photos/seed/boostav/60/60" class="bp-desc-avatar" />
          </div>
          <div class="bp-plans">
            <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 0 }" @click="boostPlanIndex = 0"><div class="bp-plan-top"><span class="bp-plan-best">最划算</span><span class="bp-plan-save">节省 40%</span></div><div class="bp-plan-row"><span class="bp-plan-count">20 Boost</span><span class="bp-plan-price">US$1.99/个</span></div></div>
            <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 1 }" @click="boostPlanIndex = 1"><div class="bp-plan-row"><span class="bp-plan-count">10 Boost</span><span class="bp-plan-price">US$5.99/个</span></div></div>
            <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 2 }" @click="boostPlanIndex = 2"><div class="bp-plan-row"><span class="bp-plan-count">3 Boost</span><span class="bp-plan-price">US$3.33/个</span></div></div>
          </div>
          <div class="bp-or"><span>或</span></div>
          <div class="bp-gold-hint"><p class="bp-gold-hint-title">每月免费赠送 1 个 Boost</p><div class="bp-gold-row"><span>🔥 开通 Tinder Gold®</span><button class="bp-gold-btn press" @click="emit('openGold')">选择</button></div></div>
        </template>
        <template v-if="boostTab === 'prime'">
          <div class="bp-desc-card">
            <div class="bp-desc-left"><div class="bp-desc-icon bp-icon-prime">🕐</div><strong>优时 Boost</strong><p>我们会在用户最活跃的时段一键 Boost，让更多的潜在配对对象看到你。</p></div>
            <img src="https://picsum.photos/seed/boostav2/60/60" class="bp-desc-avatar" />
          </div>
          <div class="bp-plans">
            <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 0 }" @click="boostPlanIndex = 0"><div class="bp-plan-top"><span class="bp-plan-save">节省 25%</span></div><div class="bp-plan-row"><span class="bp-plan-count">5 优时 Boost</span><span class="bp-plan-price">US$11.99/个</span></div></div>
            <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 1 }" @click="boostPlanIndex = 1"><div class="bp-plan-top"><span class="bp-plan-save">节省 12%</span></div><div class="bp-plan-row"><span class="bp-plan-count">3 优时 Boost</span><span class="bp-plan-price">US$13.99/个</span></div></div>
            <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 2 }" @click="boostPlanIndex = 2"><div class="bp-plan-row"><span class="bp-plan-count">1 优时 Boost</span><span class="bp-plan-price">US$15.99</span></div></div>
          </div>
          <div class="bp-or"><span>或</span></div>
          <div class="bp-gold-hint"><p class="bp-gold-hint-title">每月免费赠送 1 个 Boost</p><div class="bp-gold-row"><span>🔥 开通 Tinder Gold®</span><button class="bp-gold-btn press" @click="emit('openGold')">选择</button></div></div>
        </template>
        <template v-if="boostTab === 'super'">
          <div class="bp-desc-card bp-desc-super">
            <div class="bp-desc-left"><div class="bp-desc-icon bp-icon-super">⚡</div><strong>Super Boost</strong><p>Super Boost 助你冲到前排，让更多人有机会认识你。</p></div>
            <div class="bp-super-icon">⚡</div>
          </div>
          <div class="bp-plans">
            <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 0 }" @click="boostPlanIndex = 0"><div class="bp-plan-top"><span class="bp-plan-best">最划算</span><span class="bp-plan-save">节省 35%</span></div><div class="bp-plan-row"><span class="bp-plan-count bp-count-purple">12 小时</span><span class="bp-plan-price">US$129.99</span></div></div>
            <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 1 }" @click="boostPlanIndex = 1"><div class="bp-plan-top"><span class="bp-plan-hot">热门</span><span class="bp-plan-save">节省 30%</span></div><div class="bp-plan-row"><span class="bp-plan-count bp-count-purple">6 小时</span><span class="bp-plan-price">US$69.99</span></div></div>
            <div class="bp-plan" :class="{ 'bp-plan-active': boostPlanIndex === 2 }" @click="boostPlanIndex = 2"><div class="bp-plan-row"><span class="bp-plan-count bp-count-purple">3 小时</span><span class="bp-plan-price">US$49.99</span></div></div>
          </div>
        </template>
      </div>
      <footer class="bp-footer">
        <template v-if="boostTab === 'super'"><p class="bp-footer-sub">订阅用户专享。</p><button class="bp-buy-btn bp-buy-super press" @click="emit('close')">解锁 Super Boost</button></template>
        <template v-else><button class="bp-buy-btn bp-buy-purple press" @click="emit('close')">以 US${{ boostTab === 'boost' ? '59.99' : '41.99' }} 的总价继续操作</button></template>
      </footer>
    </div>
  </Transition>
</template>

<style scoped>
.boost-page { position: fixed; inset: 0; z-index: 100; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
.boost-page-super { background: linear-gradient(180deg, #1a0033 0%, #2d004d 100%); }
.boost-page-super .bp-title, .boost-page-super .bp-tab { color: #fff; }
.boost-page-super .bp-close { color: #fff; }
.bp-header { display: flex; align-items: center; padding: 16px 20px; }
.bp-close { width: 32px; height: 32px; font-size: 18px; color: #111; background: none; border: none; cursor: pointer; }
.bp-body { flex: 1; overflow-y: auto; padding: 0 20px 24px; }
.bp-title { font-size: 26px; font-weight: 800; color: #111; margin: 0 0 20px; }
.bp-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
.bp-tab { padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; color: #666; background: #f5f5f5; border: none; cursor: pointer; }
.bp-tab-active { background: #a644ff; color: #fff; }
.boost-page-super .bp-tab { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }
.boost-page-super .bp-tab-active { background: #a644ff; color: #fff; }

.bp-desc-card { display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px solid #eee; border-radius: 12px; margin-bottom: 16px; }
.bp-desc-super { border-color: rgba(166,68,255,0.3); background: rgba(166,68,255,0.05); }
.boost-page-super .bp-desc-card { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
.boost-page-super .bp-desc-card strong, .boost-page-super .bp-desc-card p { color: #fff; }
.bp-desc-left { flex: 1; }
.bp-desc-left strong { font-size: 16px; color: #111; display: block; margin-bottom: 4px; }
.bp-desc-left p { font-size: 12px; color: #666; margin: 0; line-height: 1.4; }
.bp-desc-icon { font-size: 24px; margin-bottom: 6px; }
.bp-icon-prime { color: #a644ff; }
.bp-icon-super { color: #a644ff; }
.bp-desc-avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
.bp-super-icon { font-size: 40px; }

.bp-plans { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.bp-plan { padding: 14px 16px; border: 1.5px solid #e8e8e8; border-radius: 10px; cursor: pointer; }
.bp-plan-active { border-color: #a644ff; }
.boost-page-super .bp-plan { border-color: rgba(255,255,255,0.15); }
.boost-page-super .bp-plan-active { border-color: #a644ff; }
.boost-page-super .bp-plan-count, .boost-page-super .bp-plan-price { color: #fff; }
.bp-plan-top { display: flex; gap: 8px; margin-bottom: 6px; }
.bp-plan-best { font-size: 11px; color: #a644ff; font-weight: 600; }
.bp-plan-hot { font-size: 11px; color: #a644ff; font-weight: 600; }
.bp-plan-save { font-size: 11px; color: #666; font-weight: 500; }
.bp-plan-row { display: flex; justify-content: space-between; align-items: center; }
.bp-plan-count { font-size: 15px; font-weight: 700; color: #111; }
.bp-plan-price { font-size: 13px; color: #666; }
.bp-count-purple { color: #a644ff; }

.bp-or { text-align: center; margin: 16px 0; position: relative; }
.bp-or::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee; }
.bp-or span { position: relative; background: #fff; padding: 0 12px; font-size: 14px; color: #999; }
.bp-gold-hint { border: 1px solid #eee; border-radius: 12px; padding: 16px; }
.bp-gold-hint-title { font-size: 13px; font-weight: 600; color: #111; text-align: center; margin: 0 0 12px; }
.bp-gold-row { display: flex; align-items: center; justify-content: space-between; }
.bp-gold-row span { font-size: 15px; font-weight: 500; color: #111; }
.bp-gold-btn { padding: 8px 16px; border-radius: 9999px; border: 1.5px solid #ddd; font-size: 13px; font-weight: 600; color: #111; background: #fff; cursor: pointer; }

.bp-footer { padding: 16px 20px 32px; }
.bp-footer-sub { text-align: center; font-size: 14px; color: #666; margin: 0 0 12px; }
.bp-buy-btn { width: 100%; height: 52px; border-radius: 9999px; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }
.bp-buy-purple { background: #a644ff; color: #fff; }
.bp-buy-super { background: linear-gradient(135deg, #7b2ff7, #a644ff); color: #fff; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
