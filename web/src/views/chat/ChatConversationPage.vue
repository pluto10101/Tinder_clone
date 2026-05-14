<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const matchId = route.params.id as string;
const messageInput = ref('');

// 模拟不同聊天数据
const chatData: Record<string, { name: string; photo: string; verified: boolean; isTinder?: boolean; messages: Array<{ from: 'them' | 'system'; text: string; time: string; date?: string }> }> = {
  'm1': {
    name: '怕有人徘徊', photo: 'https://picsum.photos/seed/cm1/100/100', verified: false,
    messages: [
      { from: 'system', text: '您已与 怕有人徘徊 配对', time: '2 小时前' },
    ],
  },
  'm2': {
    name: 'koi', photo: 'https://picsum.photos/seed/cm2/100/100', verified: true,
    messages: [
      { from: 'system', text: '您已与 koi 配对', time: '1 天前' },
    ],
  },
  'm3': {
    name: 'Ferris', photo: 'https://picsum.photos/seed/cm3/100/100', verified: true,
    messages: [
      { from: 'system', text: '您已与 Ferris 配对', time: '3 天前' },
    ],
  },
  'msg2': {
    name: 'Tinder 团队', photo: '', verified: true, isTinder: true,
    messages: [
      { from: 'them', text: '欢迎使用 Tinder！你可以返回到这里获取使用建议，确保自己能够感受成功的交友体验。不确定应该跳过还是点赞？那就直接点赞吧。', time: '下午5:52', date: '星期三' },
      { from: 'them', text: '大家都想看到你多样的一面哦，快添加更多照片提升你的配对几率吧。', time: '下午4:52', date: '星期四' },
    ],
  },
  'msg3': {
    name: '麦片爱吃肉', photo: 'https://picsum.photos/seed/msg3/100/100', verified: true,
    messages: [
      { from: 'system', text: '你已于 2026/5/7 与麦片爱吃肉配对', time: '' },
      { from: 'them', text: '好可爱可以认识咩', time: '下午2:47', date: '星期四' },
    ],
  },
};

const currentChat = computed(() => chatData[matchId] || { name: '用户', photo: 'https://picsum.photos/seed/default/100/100', verified: false, messages: [] });
const isTinder = computed(() => currentChat.value.isTinder);
const showSafetySheet = ref(false);
const showCompatSheet = ref(false);

function goBack() { router.back(); }
</script>

<template>
  <div class="page">
    <!-- 顶部导航 -->
    <header class="chat-header">
      <button class="back-btn press" @click="goBack">←</button>
      <div class="chat-user">
        <div class="chat-user-avatar-wrap">
          <img v-if="!isTinder" :src="currentChat.photo" class="chat-user-avatar" />
          <div v-else class="tinder-avatar-sm">
            <svg class="tinder-flame-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" fill-rule="evenodd" d="M514 924.9l-3.1-0.2c-157-0.4-284.7-128.2-284.7-285.4 0-5.4 0-10.9 0.4-16.3 4.6-159.4 84.2-202.4 93.3-206.8 10-4.9 22.1-4.8 32.3 0.6 10.2 5.4 17.1 15.3 18.8 26.6 0.1 0.6 7.8 46.6 32.2 71.4 1.3-36.1 5-79.3 15-119.1 20.1-79.2 77.4-162.1 146-211.2 10.9-7.9 25.2-8.9 37.3-2.7 12 6.2 19.4 18.4 19.4 31.8 0 61.5 31 103.3 70.3 156.1 44.9 60.5 95.8 128.9 104.3 240.1v0.1c0.2 2.2 1.6 21.5 1.6 29.4 0 156.1-126.3 283.6-282.1 285.3l-1 0.3zM330.8 459.2c-17.4 13.2-58.9 56-62.1 165.8-0.3 5.2-0.3 9.8-0.3 14.4 0 134 109.1 243.1 243.1 243.1h0.6C645.9 882 754.7 773 754.7 639.3c0-4.8-0.9-18.6-1.4-26.3-7.6-99-54.6-162.2-96-218-38.3-51.4-74.4-100-78.4-168.7-56.6 44.3-103 113.6-119.8 179.8-12.4 49.3-14.2 105.7-14.5 143.8l-0.2 26-25.4-5.4c-61.6-13.3-82.5-84.8-88.2-111.3z m258-240.4z"/>
              <path fill="#fff" fill-rule="evenodd" d="M529.2 831.6c-11 0-20.3-8.5-21.1-19.6-0.8-11.6 7.9-21.8 19.6-22.6 50.9-3.7 94.1-39.2 107.6-88.4 3.1-11.3 14.8-17.9 26-14.8 11.3 3.1 17.9 14.7 14.8 26-18.2 66.5-76.6 114.4-145.3 119.4h-1.6z"/>
            </svg>
          </div>
        </div>
        <span class="chat-user-name">{{ currentChat.name }}</span>
        <span v-if="currentChat.verified && !isTinder" class="chat-verified">✓</span>
        <span v-if="isTinder" class="tinder-verified">💗</span>
      </div>
      <button class="more-btn press" @click="showSafetySheet = true">
        <svg class="more-btn-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M128 512a64 64 0 1 0 128 0 64 64 0 0 0-128 0zM448 512a64 64 0 1 0 128 0 64 64 0 0 0-128 0zM768 512a64 64 0 1 0 128 0 64 64 0 0 0-128 0z" fill="#000000" opacity=".65"/>
        </svg>
      </button>
    </header>

    <!-- 聊天内容区 -->
    <div class="chat-body">
      <div class="chat-messages">
        <template v-for="(msg, i) in currentChat.messages" :key="i">
          <!-- 日期分隔 -->
          <div v-if="msg.date" class="date-divider">{{ msg.date }} {{ msg.time }}</div>

          <!-- 系统消息 -->
          <div v-if="msg.from === 'system'" class="system-msg">
            <p class="system-text">{{ msg.text }}</p>
            <!-- 配对头像（非 Tinder 团队） -->
            <div v-if="!isTinder" class="system-avatar">
              <img :src="currentChat.photo" />
            </div>
          </div>

          <!-- 对方消息 -->
          <div v-if="msg.from === 'them'" class="them-msg">
            <div v-if="isTinder" class="them-avatar-wrap"><div class="tinder-avatar-msg">🔥</div></div>
            <div v-else class="them-avatar-wrap"><img :src="currentChat.photo" class="them-avatar" /></div>
            <div class="them-bubble">{{ msg.text }}</div>
            <button v-if="!isTinder" class="msg-heart press">♡</button>
          </div>
        </template>
      </div>
    </div>

    <!-- 星座适配性提示（非 Tinder 团队且非新配对） -->
    <div v-if="!isTinder && currentChat.messages.length <= 1" class="astro-hint-bar">
      <span class="astro-hint-tag">☀️ 双子座 Ⅱ</span>
      <span class="astro-hint-dots">● ● ● ●</span>
      <p class="astro-hint-text">水瓶座和<strong>双子座</strong> · 你们的星座元素相同，所以你们大概率不需要做什么，就能了解彼此。<a href="#" class="astro-hint-link" @click.prevent="showCompatSheet = true">查看 适配性 ›</a></p>
    </div>

    <!-- 底部输入栏 -->
    <div class="chat-input-bar" v-if="!isTinder">
      <button class="gif-btn press">GIF</button>
      <input v-model="messageInput" class="chat-input" placeholder="输入消息...." />
      <button class="send-btn press" :disabled="!messageInput.trim()">发送</button>
    </div>

    <!-- 安全工具包底部弹窗 -->
    <Transition name="sheet-fade">
      <div v-if="showSafetySheet" class="safety-mask" @click.self="showSafetySheet = false">
        <div class="safety-sheet">
          <div class="safety-handle"></div>
          <h3 class="safety-title">安全工具包</h3>
          <div class="safety-items">
            <div class="safety-item" @click="showSafetySheet = false">
              <span class="safety-icon safety-icon-unmatch">✕</span>
              <div class="safety-item-text">
                <strong>与 {{ currentChat.name }} 取消配对</strong>
                <p>已经不感兴趣？你可以与对方取消配对。</p>
              </div>
            </div>
            <div class="safety-item" @click="showSafetySheet = false">
              <span class="safety-icon safety-icon-report"><svg class="safety-svg-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#E8E8E8"/><path d="M876.8 603.2z" fill=""/><path d="M438.4 153.6l-17.6 3.2c-97.6 22.4-168-3.2-203.2-22.4V496c49.6 46.4 144 51.2 289.6 17.6 137.6-32 283.2 17.6 337.6 40h1.6V164.8c-179.2-62.4-291.2-36.8-408-11.2z" fill="#F2385A"/><path d="M865.6 139.2C672 68.8 548.8 96 430.4 123.2l-17.6 3.2c-90.208 19.552-153.568-4.704-183.44-20.976 16.768-9.856 28.144-27.872 28.144-48.72C257.504 25.392 232.112 0 200.8 0S144.096 25.392 144.096 56.704c0 25.424 16.848 46.688 39.904 53.872V1024h32V536c60.8 38.4 160 40 297.6 8 158.4-36.8 337.6 46.4 339.2 46.4l22.4 11.2V142.4l-9.6-3.2z m-19.2 414.4h-1.6c-54.4-22.4-200-72-337.6-40-145.6 33.6-240 28.8-289.6-17.6V134.4c35.2 19.2 105.6 44.8 203.2 22.4l17.6-3.2c116.8-25.6 228.8-51.2 408 11.2v388.8z" fill=""/><path d="M200.8 56.704m-23.872 0a23.872 23.872 0 1 0 47.744 0 23.872 23.872 0 1 0-47.744 0Z" fill="#F2385A"/></svg></span>
              <div class="safety-item-text">
                <strong>举报 {{ currentChat.name }}</strong>
                <p>别担心——我们不会告知对方。</p>
              </div>
            </div>
            <div class="safety-item" @click="showSafetySheet = false">
              <span class="safety-icon safety-icon-block">🚫</span>
              <div class="safety-item-text">
                <strong>屏蔽 {{ currentChat.name }}</strong>
                <p>你和对方将互不可见。</p>
              </div>
            </div>
            <div class="safety-item" @click="showSafetySheet = false">
              <span class="safety-icon safety-icon-center">🛡️</span>
              <div class="safety-item-text">
                <strong>访问安全中心</strong>
                <p>你的体验至关重要。请在此处查找安全资源和工具。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 星座适配性底部面板 -->
    <Transition name="sheet-fade">
      <div v-if="showCompatSheet" class="compat-mask" @click.self="showCompatSheet = false">
        <div class="compat-sheet">
          <div class="compat-header">
            <div class="compat-header-bg">
              <span class="cst cst1">✦</span>
              <span class="cst cst2">✦</span>
              <span class="cst cst3">✧</span>
            </div>
            <div class="compat-header-content">
              <div class="compat-handle"></div>
              <div class="compat-top-row">
                <button class="compat-close press" @click="showCompatSheet = false">✕</button>
                <button class="compat-info-btn press">ⓘ</button>
              </div>
              <div class="compat-brand">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 6 8 6 13.5C6 17.6 9 21 12 21C15 21 18 17.6 18 13.5C18 10 15.5 8 15.5 8C15.5 8 15 12 13 12C13 12 14 7 12 2Z" fill="#fff"/></svg>
                <span class="compat-brand-text">tinder</span>
                <span class="compat-brand-sub">占星术</span>
              </div>
              <h3 class="compat-title">你和 {{ currentChat.name }}</h3>
              <div class="compat-compare-card">
                <div class="compat-compare-top"><span>☀️</span><strong>个性对比</strong></div>
                <p class="compat-compare-signs">你: 水瓶座 ♒ ，{{ currentChat.name }}: <span class="compat-sign-highlight">双子座 ♊</span></p>
                <p class="compat-compare-desc">你们的星座元素相同，所以你们大概率不需要做什么，就能了解彼此。</p>
              </div>
              <div class="compat-dots"><span class="compat-dot active"></span><span class="compat-dot"></span><span class="compat-dot"></span></div>
            </div>
          </div>
          <div class="compat-body">
            <h4 class="cb-title">你的宇宙火花</h4>
            <div class="spark-grid">
              <div class="spark-col"><div class="spark-name">心电感应</div><div class="spark-bar"><span class="sb-fill" style="width: 40%;"></span></div></div>
              <div class="spark-col"><div class="spark-name">传播学</div><div class="spark-bar"><span class="sb-fill" style="width: 60%;"></span></div></div>
              <div class="spark-col"><div class="spark-name">情感</div><div class="spark-bar spark-bar-locked"><span class="sb-gray"></span>🔒</div></div>
              <div class="spark-col"><div class="spark-name">火花指数</div><div class="spark-bar spark-bar-locked"><span class="sb-gray"></span>🔒</div></div>
            </div>
            <h4 class="cb-title">元素组合</h4>
            <div class="elem-grid">
              <div class="elem-item"><span class="elem-icon">🔥</span><div><div class="elem-name">火象</div><div class="elem-desc">激情与行动</div></div><span class="elem-pct" style="color: #f2385a;">0%</span></div>
              <div class="elem-item"><span class="elem-icon">🌍</span><div><div class="elem-name">土象</div><div class="elem-desc">现实与实际</div></div><span class="elem-pct" style="color: #f2385a;">0%</span></div>
              <div class="elem-item"><span class="elem-icon">🌬️</span><div><div class="elem-name">风象</div><div class="elem-desc">交流与创造</div></div><span class="elem-pct" style="color: #b74fff;">100%</span></div>
              <div class="elem-item"><span class="elem-icon">💧</span><div><div class="elem-name">水象</div><div class="elem-desc">情感与本能</div></div><span class="elem-pct" style="color: #42a5f5;">0%</span></div>
            </div>
            <div class="explain-box">
              <strong>星座元素解释如下</strong>
              <p>风趣幽默的谈吐会拉近彼此的距离。</p>
            </div>
            <button class="compat-detail-btn press" @click="showCompatSheet = false">查看细节</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff; display: flex; flex-direction: column; }

.chat-header { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f0f0f0; gap: 12px; }
.back-btn { font-size: 20px; color: #111; width: 32px; }
.chat-user { display: flex; align-items: center; gap: 10px; flex: 1; }
.chat-user-avatar-wrap { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; }
.chat-user-avatar { width: 100%; height: 100%; object-fit: cover; }
.tinder-avatar-sm { width: 100%; height: 100%; background: linear-gradient(135deg, #FD297B, #FF655B); display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.tinder-flame-svg { width: 32px; height: 32px; }
.chat-user-name { font-size: 16px; font-weight: 600; color: #111; }
.chat-verified { width: 18px; height: 18px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; }
.tinder-verified { font-size: 14px; }
.more-btn { display: flex; align-items: center; justify-content: center; }
.more-btn-icon { width: 22px; height: 22px; }

.chat-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; justify-content: flex-end; position: relative; }
.chat-messages { padding: 16px 16px 8px; display: flex; flex-direction: column; gap: 12px; flex: 1; position: relative; }

.date-divider { text-align: center; font-size: 12px; color: #bbb; padding: 8px 0; }

.system-msg { text-align: center; padding: 8px 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; }
.system-text { font-size: 13px; color: #999; margin: 0 0 12px; }
.system-avatar { width: 200px; height: 200px; border-radius: 80%; overflow: hidden; margin: 0 auto; border: 3px solid #f0f0f0; }
.system-avatar img { width: 100%; height: 100%; object-fit: cover; }

.them-msg { display: flex; align-items: flex-end; gap: 8px; }
.them-avatar-wrap { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
.them-avatar { width: 100%; height: 100%; object-fit: cover; }
.tinder-avatar-msg { width: 100%; height: 100%; background: linear-gradient(135deg, #FD297B, #FF655B); display: flex; align-items: center; justify-content: center; font-size: 14px; border-radius: 50%; }
.them-bubble { max-width: 70%; padding: 10px 14px; background: #f2f2f2; border-radius: 18px 18px 18px 4px; font-size: 14px; color: #111; line-height: 1.5; }
.msg-heart { font-size: 18px; color: #ccc; margin-left: 4px; }

.astro-hint-bar { padding: 12px 16px; background: #fafafa; border-top: 1px solid #f0f0f0; }
.astro-hint-tag { display: inline-block; padding: 4px 10px; border-radius: 8px; background: rgba(232, 168, 56, 0.15); color: #b8860b; font-size: 12px; font-weight: 600; margin-bottom: 4px; }
.astro-hint-dots { display: inline-block; margin-left: 8px; font-size: 8px; color: #ccc; letter-spacing: 3px; }
.astro-hint-text { font-size: 13px; color: #555; line-height: 1.5; margin: 6px 0 0; }
.astro-hint-text strong { color: #b8860b; }
.astro-hint-link { color: #b8860b; font-weight: 600; text-decoration: underline; }

.chat-input-bar { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-top: 1px solid #f0f0f0; background: #fff; }
.gif-btn { width: 36px; height: 36px; border-radius: 50%; background: #0a68b4ff; color: #fff; font-size: 11px; font-weight: 700; border: none; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.chat-input { flex: 1; border: 0; padding: 10px 14px; font-size: 14px; color: #111; background: #f5f5f5; border-radius: 9999px; outline: none; }
.chat-input::placeholder { color: #bbb; }
.send-btn { font-size: 14px; font-weight: 600; color: #42a5f5; padding: 8px; }
.send-btn:disabled { color: #ccc; }

/* Safety Sheet */
.safety-mask { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; }
.safety-sheet { background: #fff; border-radius: 16px 16px 0 0; width: 100%; padding: 12px 24px 32px; height: 33vh; overflow-y: auto; }
.safety-handle { width: 36px; height: 4px; border-radius: 2px; background: #ddd; margin: 0 auto 20px; }
.safety-title { font-size: 30px; font-weight: 300; color: #111; margin: 0 0 20px; }
.safety-items { display: flex; flex-direction: column; gap: 20px; }
.safety-item { display: flex; align-items: flex-start; gap: 14px; cursor: pointer; }
.safety-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; margin-top: 2px; }
.safety-icon-unmatch { background: #ffeaa7; color: #d63031; font-weight: 700; font-size: 16px; }
.safety-icon-report { background: #ffe0e0; }
.safety-svg-icon { width: 24px; height: 24px; }
.safety-icon-block { background: #f0f0f0; }
.safety-icon-center { background: #e3f2fd; }
.safety-item-text { flex: 1; }
.safety-item-text strong { font-size: 15px; color: #111; display: block; margin-bottom: 4px; }
.safety-item-text p { font-size: 13px; color: #666; margin: 0; line-height: 1.4; }

.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.2s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }

/* Compat Sheet */
.compat-mask { position: fixed; inset: 0; z-index: 110; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; }
.compat-sheet { width: 100%; max-height: 90vh; background: #f8f8f8; border-radius: 24px 24px 0 0; overflow: hidden; display: flex; flex-direction: column; }
.compat-header { position: relative; overflow: hidden; }
.compat-header-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1a237e, #4a148c, #880e4f); }
.cst { position: absolute; color: rgba(255,255,255,0.3); font-size: 14px; }
.cst1 { top: 20%; left: 15%; }
.cst2 { top: 30%; right: 20%; }
.cst3 { bottom: 20%; left: 40%; }
.compat-header-content { position: relative; padding: 12px 20px 20px; }
.compat-handle { width: 36px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.4); margin: 0 auto 12px; }
.compat-top-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
.compat-close { width: 28px; height: 28px; color: #fff; font-size: 16px; background: none; border: none; cursor: pointer; }
.compat-info-btn { width: 28px; height: 28px; color: #fff; font-size: 14px; border: 1px solid rgba(255,255,255,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; background: none; cursor: pointer; }
.compat-brand { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
.compat-brand-text { font-size: 12px; font-style: italic; color: #fff; }
.compat-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); margin-left: 4px; }
.compat-title { font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 14px; }
.compat-compare-card { background: rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; backdrop-filter: blur(4px); }
.compat-compare-top { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.compat-compare-top strong { color: #fff; font-size: 13px; }
.compat-compare-signs { font-size: 12px; color: rgba(31, 29, 29, 0.7); margin: 0 0 6px; }
.compat-sign-highlight { color: #e8a838; }
.compat-compare-desc { font-size: 14px; color: #fff; line-height: 1.5; margin: 0; }
.compat-dots { display: flex; gap: 6px; justify-content: center; margin-top: 10px; }
.compat-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.3); }
.compat-dot.active { background: #fff; }

.compat-body { flex: 1; overflow-y: auto; padding: 20px; background: #fff; }
.cb-title { font-size: 16px; font-weight: 700; color: #111; margin: 0 0 12px; }
.spark-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
.spark-col { display: flex; flex-direction: column; gap: 6px; }
.spark-name { font-size: 13px; color: #333; font-weight: 500; }
.spark-bar { height: 6px; border-radius: 3px; background: #eee; position: relative; overflow: hidden; }
.sb-fill { position: absolute; inset: 0; background: linear-gradient(90deg, #b74fff, #42a5f5); border-radius: 3px; }
.spark-bar-locked { display: flex; align-items: center; gap: 4px; background: #f5f5f5; height: auto; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
.sb-gray { flex: 1; height: 4px; background: #ddd; border-radius: 2px; }

.elem-grid { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.elem-item { display: flex; align-items: center; gap: 12px; }
.elem-icon { font-size: 20px; }
.elem-name { font-size: 14px; font-weight: 600; color: #111; }
.elem-desc { font-size: 12px; color: #666; }
.elem-pct { margin-left: auto; font-size: 16px; font-weight: 700; }

.explain-box { background: #f8f8f8; border-radius: 12px; padding: 14px; margin-bottom: 20px; }
.explain-box strong { font-size: 14px; color: #111; display: block; margin-bottom: 4px; }
.explain-box p { font-size: 13px; color: #666; margin: 0; line-height: 1.4; }

.compat-detail-btn { width: 100%; height: 48px; border-radius: 9999px; background: #111; color: #fff; font-size: 15px; font-weight: 600; border: none; cursor: pointer; }
</style>
