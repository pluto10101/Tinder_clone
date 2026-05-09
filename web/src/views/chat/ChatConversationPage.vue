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
          <div v-else class="tinder-avatar-sm">🔥</div>
        </div>
        <span class="chat-user-name">{{ currentChat.name }}</span>
        <span v-if="currentChat.verified && !isTinder" class="chat-verified">✓</span>
        <span v-if="isTinder" class="tinder-verified">💗</span>
      </div>
      <button class="more-btn press" @click="showSafetySheet = true">•••</button>
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
              <span class="safety-icon safety-icon-report">🚩</span>
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
.tinder-avatar-sm { width: 100%; height: 100%; background: linear-gradient(135deg, #FD297B, #FF655B); display: flex; align-items: center; justify-content: center; font-size: 18px; border-radius: 50%; }
.chat-user-name { font-size: 16px; font-weight: 600; color: #111; }
.chat-verified { width: 18px; height: 18px; border-radius: 50%; background: #42a5f5; color: #fff; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; }
.tinder-verified { font-size: 14px; }
.more-btn { font-size: 18px; color: #111; letter-spacing: -1px; font-weight: 700; }

.chat-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; justify-content: flex-end; }
.chat-messages { padding: 16px 16px 8px; display: flex; flex-direction: column; gap: 12px; }

.date-divider { text-align: center; font-size: 12px; color: #bbb; padding: 8px 0; }

.system-msg { text-align: center; padding: 8px 0; }
.system-text { font-size: 13px; color: #999; margin: 0 0 12px; }
.system-avatar { width: 100px; height: 100px; border-radius: 50%; overflow: hidden; margin: 0 auto; border: 3px solid #f0f0f0; }
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
.gif-btn { padding: 6px 10px; border-radius: 6px; border: 1.5px solid #4cdc8f; color: #4cdc8f; font-size: 12px; font-weight: 700; }
.chat-input { flex: 1; border: 0; padding: 10px 14px; font-size: 14px; color: #111; background: #f5f5f5; border-radius: 9999px; outline: none; }
.chat-input::placeholder { color: #bbb; }
.send-btn { font-size: 14px; font-weight: 600; color: #42a5f5; padding: 8px; }
.send-btn:disabled { color: #ccc; }

/* Safety Sheet */
.safety-mask { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; }
.safety-sheet { background: #fff; border-radius: 16px 16px 0 0; width: 100%; padding: 12px 24px 32px; }
.safety-handle { width: 36px; height: 4px; border-radius: 2px; background: #ddd; margin: 0 auto 20px; }
.safety-title { font-size: 20px; font-weight: 800; color: #111; margin: 0 0 20px; }
.safety-items { display: flex; flex-direction: column; gap: 20px; }
.safety-item { display: flex; align-items: flex-start; gap: 14px; cursor: pointer; }
.safety-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; margin-top: 2px; }
.safety-icon-unmatch { background: #ffeaa7; color: #d63031; font-weight: 700; font-size: 16px; }
.safety-icon-report { background: #ffe0e0; }
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
.compat-compare-signs { font-size: 12px; color: rgba(255,255,255,0.7); margin: 0 0 6px; }
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
