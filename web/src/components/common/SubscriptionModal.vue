<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ close: [] }>();

const planSlide = ref(0); // 0=Plus, 1=Gold, 2=Platinum

const plans = [
  {
    name: 'Plus', brand: 'tinder', badge: '+', badgeStyle: 'plus',
    color: '#fe3c72', price: 'US$12.99',
    btnGradient: 'linear-gradient(135deg, #fd267a, #ff6036)',
    likes: [
      { title: '无限点赞', included: true },
      { title: '查看给你点赞的人', included: false, desc: '' },
      { title: '置顶赞', included: false, desc: '置顶赞可以让你赞的人更快看到你。' },
    ],
    experience: [
      { title: '无限倒回', included: true },
      { title: '每月 1 个免费 Boost', included: false, desc: '' },
      { title: '每周免费 2 个 Super Like', included: false, desc: '' },
      { title: '每周 3 次免费初印象', included: false, desc: '配对前可发送信息赢得好感。' },
    ],
    explore: [
      { title: '无限位置漫游模式*', included: true, desc: '你可以和世界各地的用户配对聊天。*含限制条件。了解更多' },
      { title: '最佳精选', included: false, desc: '你可以查看我们每日为你精选的个人资料。' },
    ],
  },
  {
    name: 'Gold', brand: 'tinder', badge: 'GOLD', badgeStyle: 'gold',
    color: '#d4a017', price: 'US$18.99',
    btnGradient: 'linear-gradient(135deg, #d4a017, #f5c518)',
    likes: [
      { title: '无限点赞', included: true },
      { title: '查看给你点赞的人', included: true, desc: '' },
      { title: '置顶赞', included: false, desc: '置顶赞可以让你赞的人更快看到你。' },
    ],
    experience: [
      { title: '无限倒回', included: true },
      { title: '每月 1 个免费 Boost', included: true, desc: '购买一个月或更长时间的订阅，才可享受每月免费的 Boost。' },
      { title: '每周免费 2 个 Super Like', included: true, desc: '' },
      { title: '每周 3 次免费初印象', included: false, desc: '配对前可发送信息赢得好感。' },
    ],
    explore: [
      { title: '无限位置漫游模式*', included: true, desc: '你可以和世界各地的用户配对聊天。*含限制条件。了解更多' },
      { title: '最佳精选', included: true, desc: '' },
    ],
  },
  {
    name: 'Platinum', brand: 'tinder', badge: 'PLATINUM', badgeStyle: 'platinum',
    color: '#333', price: 'US$24.99',
    btnGradient: 'linear-gradient(135deg, #333, #555)',
    likes: [
      { title: '无限点赞', included: true },
      { title: '查看给你点赞的人', included: true, desc: '' },
      { title: '置顶赞', included: true, desc: '置顶赞可以让你赞的人更快看到你。' },
    ],
    experience: [
      { title: '无限倒回', included: true },
      { title: '每月 1 个免费 Boost', included: true, desc: '购买一个月或更长时间的订阅，才可享受每月免费的 Boost。' },
      { title: '每周免费 3 个 Super Like', included: true, desc: '' },
      { title: '每周 3 次免费初印象', included: true, desc: '配对前可发送信息赢得好感。' },
    ],
    explore: [
      { title: '无限位置漫游模式*', included: true, desc: '你可以和世界各地的用户配对聊天。*含限制条件。了解更多' },
      { title: '最佳精选', included: true, desc: '' },
    ],
  },
];

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
    <div class="sub-page">
      <header class="sub-header">
        <button class="sub-close press" @click="emit('close')">✕</button>
        <span class="sub-title">我的订阅</span>
        <div style="width: 32px;"></div>
      </header>

      <div class="sub-body">
        <!-- 轮播品牌卡片 -->
        <div class="sub-carousel" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
          <div class="sub-carousel-track" :style="{ transform: `translateX(-${planSlide * 85}%)` }">
            <div v-for="(plan, i) in plans" :key="i" class="sub-brand-card" :class="{ active: planSlide === i }" @click="planSlide = i">
              <svg width="30" height="30" viewBox="0 0 24 24" :fill="plan.color"><path d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"/></svg>
              <span class="sub-brand-name" :style="{ color: plan.color }">tinder</span>
              <span class="sub-brand-badge" :class="plan.badgeStyle">{{ plan.badge }}</span>
            </div>
          </div>
        </div>

        <!-- 指示点 -->
        <div class="sub-dots">
          <span v-for="(_, i) in plans" :key="i" class="sub-dot" :class="{ active: planSlide === i }" @click="planSlide = i"></span>
        </div>

        <!-- 功能列表 -->
        <div class="sub-features">
          <!-- 升级你的赞 -->
          <div class="sub-section">
            <div class="sub-section-badge">升级你的赞</div>
            <div class="sub-section-card">
              <div v-for="feat in plans[planSlide].likes" :key="feat.title" class="sub-feat-item">
                <span class="sub-feat-icon" :class="feat.included ? 'included' : 'locked'">
                  <template v-if="feat.included">✓</template>
                  <template v-else><svg class="lock-svg-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M385.150849 385.662338l-128.895105 0 0-150.377622q0-49.102897 19.436563-91.556444t53.706294-74.677323 80.815185-50.637363 101.786214-18.413586q49.102897 0 94.625375 18.413586t80.815185 50.637363 56.263736 74.677323 20.971029 91.556444l0 150.377622-123.78022 0 0-121.734266q0-64.447552-35.804196-99.74026t-97.182817-35.292707q-55.240759 0-88.999001 35.292707t-33.758242 99.74026l0 121.734266zM826.053946 447.040959q27.62038 0 47.568432 19.948052t19.948052 47.568432l0 317.122877q0 27.62038-9.718282 51.66034t-26.597403 41.942058-39.896104 28.131868-50.637363 10.22977l-516.603397 0q-27.62038 0-50.125874-10.22977t-38.361638-27.108891-24.551449-39.384615-8.695305-48.07992l0-324.283716q0-27.62038 19.436563-47.568432t47.056943-19.948052l61.378621 0 128.895105 0 255.744256 0 123.78022 0 61.378621 0z"/></svg></template>
                </span>
                <div class="sub-feat-text">
                  <strong>{{ feat.title }}</strong>
                  <p v-if="feat.desc">{{ feat.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 升级你的体验 -->
          <div class="sub-section">
            <div class="sub-section-badge">升级你的体验</div>
            <div class="sub-section-card">
              <div v-for="feat in plans[planSlide].experience" :key="feat.title" class="sub-feat-item">
                <span class="sub-feat-icon" :class="feat.included ? 'included' : 'locked'">
                  <template v-if="feat.included">✓</template>
                  <template v-else><svg class="lock-svg-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M385.150849 385.662338l-128.895105 0 0-150.377622q0-49.102897 19.436563-91.556444t53.706294-74.677323 80.815185-50.637363 101.786214-18.413586q49.102897 0 94.625375 18.413586t80.815185 50.637363 56.263736 74.677323 20.971029 91.556444l0 150.377622-123.78022 0 0-121.734266q0-64.447552-35.804196-99.74026t-97.182817-35.292707q-55.240759 0-88.999001 35.292707t-33.758242 99.74026l0 121.734266zM826.053946 447.040959q27.62038 0 47.568432 19.948052t19.948052 47.568432l0 317.122877q0 27.62038-9.718282 51.66034t-26.597403 41.942058-39.896104 28.131868-50.637363 10.22977l-516.603397 0q-27.62038 0-50.125874-10.22977t-38.361638-27.108891-24.551449-39.384615-8.695305-48.07992l0-324.283716q0-27.62038 19.436563-47.568432t47.056943-19.948052l61.378621 0 128.895105 0 255.744256 0 123.78022 0 61.378621 0z"/></svg></template>
                </span>
                <div class="sub-feat-text">
                  <strong>{{ feat.title }}</strong>
                  <p v-if="feat.desc">{{ feat.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 高级探索 -->
          <div class="sub-section">
            <div class="sub-section-badge">高级探索</div>
            <div class="sub-section-card">
              <div v-for="feat in plans[planSlide].explore" :key="feat.title" class="sub-feat-item">
                <span class="sub-feat-icon" :class="feat.included ? 'included' : 'locked'">
                  <template v-if="feat.included">✓</template>
                  <template v-else><svg class="lock-svg-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M385.150849 385.662338l-128.895105 0 0-150.377622q0-49.102897 19.436563-91.556444t53.706294-74.677323 80.815185-50.637363 101.786214-18.413586q49.102897 0 94.625375 18.413586t80.815185 50.637363 56.263736 74.677323 20.971029 91.556444l0 150.377622-123.78022 0 0-121.734266q0-64.447552-35.804196-99.74026t-97.182817-35.292707q-55.240759 0-88.999001 35.292707t-33.758242 99.74026l0 121.734266zM826.053946 447.040959q27.62038 0 47.568432 19.948052t19.948052 47.568432l0 317.122877q0 27.62038-9.718282 51.66034t-26.597403 41.942058-39.896104 28.131868-50.637363 10.22977l-516.603397 0q-27.62038 0-50.125874-10.22977t-38.361638-27.108891-24.551449-39.384615-8.695305-48.07992l0-324.283716q0-27.62038 19.436563-47.568432t47.056943-19.948052l61.378621 0 128.895105 0 255.744256 0 123.78022 0 61.378621 0z"/></svg></template>
                </span>
                <div class="sub-feat-text">
                  <strong>{{ feat.title }}</strong>
                  <p v-if="feat.desc">{{ feat.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="sub-footer">
        <button class="sub-buy press" :style="{ background: plans[planSlide].btnGradient }">价格为 {{ plans[planSlide].price }} 起</button>
      </footer>
    </div>
  </Transition>
</template>

<style scoped>
.sub-page { position: fixed; inset: 0; z-index: 100; background: #f8f8f8; display: flex; flex-direction: column; overflow: hidden; }
.sub-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: #fff; }
.sub-close { width: 32px; height: 32px; font-size: 18px; color: #111; background: none; border: none; cursor: pointer; }
.sub-title { font-size: 17px; font-weight: 700; color: #111; }

.sub-body { flex: 1; overflow-y: auto; padding: 20px 20px 24px; }

/* Carousel */
.sub-carousel { overflow: hidden; margin-bottom: 15px; }
.sub-carousel-track { display: flex; gap: 12px; transition: transform 0.3s ease; padding: 0 10%; }
.sub-brand-card { min-width: 90%; padding: 28px 24px; border-radius: 14px; border: 2px solid #e8e8e8; display: flex; align-items: center; justify-content: center; gap: -1px; flex-shrink: 0; cursor: pointer; background: #fff; transition: border-color 0.2s; }
.sub-brand-card.active { border-color: #fe3c72; }
.sub-brand-name { font-size: 28px; font-weight: 800; font-style: normal; color: #111 !important; }
.sub-brand-badge { font-size: 12px; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-left: 2px; }
.sub-brand-badge.plus { color: #fe3c72; font-size: 25px; font-weight: 600; background: none; }
.sub-brand-badge.gold { background: linear-gradient(135deg, #d4a017, #f5c518); color: #fff; font-size: 9px; }
.sub-brand-badge.platinum { background: #333; color: #fff; font-size: 9px; }

.sub-dots { display: flex; gap: 8px; justify-content: center; margin: 0 0 24px; }
.sub-dot { width: 8px; height: 8px; border-radius: 50%; background: #ddd; cursor: pointer; }
.sub-dot.active { background: #111; }

/* Features */
.sub-features { display: flex; flex-direction: column; gap: 20px; }
.sub-section { display: flex; flex-direction: column; align-items: center; position: relative; padding-top: 16px; }
.sub-section-badge { font-size: 12px; color: #666; border: 1px solid #ddd; border-radius: 12px; padding: 4px 14px; background: #fff; position: absolute; top: 0; left: 50%; transform: translateX(-50%); white-space: nowrap; z-index: 2; }
.sub-section-card { width: 100%; border: 1px solid #eee; border-radius: 14px; padding: 24px 16px 16px; background: #fff; }
.sub-feat-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
.sub-feat-item:last-child { margin-bottom: 0; }
.sub-feat-icon { font-size: 16px; margin-top: 2px; width: 24px; text-align: center; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.sub-feat-icon.included { color: #fe3c72; font-weight: 700; }
.sub-feat-icon.locked { font-size: 14px; }
.lock-svg-icon { width: 16px; height: 16px; fill: #999; }
.sub-feat-text { flex: 1; }
.sub-feat-text strong { font-size: 14px; color: #111; display: block; }
.sub-feat-text p { font-size: 12px; color: #666; margin: 4px 0 0; line-height: 1.4; }

/* Footer */
.sub-footer { padding: 12px 20px 32px; background: #f8f8f8; }
.sub-buy { width: 100%; height: 52px; border-radius: 9999px; color: #fff; font-size: 16px; font-weight: 700; border: none; cursor: pointer; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
