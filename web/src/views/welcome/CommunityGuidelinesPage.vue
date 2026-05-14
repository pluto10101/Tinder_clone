<script setup lang="ts">
import { useRouter } from 'vue-router';
// 删除了原来的 FlameLogo 导入

const router = useRouter();

const RULES = [
  {
    title: '做真实的自己。',
    desc: '确保你的照片、年龄和个人介绍都真实无误。',
  },
  {
    title: '安全为重。',
    desc: '不要太快就泄露个人信息。',
    link: '安全约会',
  },
  {
    title: '礼貌待人。',
    desc: '尊重他人并设身处地地对待他们。',
  },
  {
    title: '积极主动。',
    desc: '始终举报不良行为。',
  },
];

function close() {
  router.back();
}

function agree() {
  router.replace({ name: 'onboarding' });
}
</script>

<template>
  <div class="page">
    <header class="top safe-top">
      <button class="close press" @click="close">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </header>

    <main class="main">
      <div class="logo">
        <!-- 替换后的完整火花 SVG -->
        <svg viewBox="0 0 1024 1024" width="60" height="60" class="tinder-flame">
          <path
            d="M514 924.9l-3.1-0.2c-157-0.4-284.7-128.2-284.7-285.4 0-5.4 0-10.9 0.4-16.3 4.6-159.4 84.2-202.4 93.3-206.8 10-4.9 22.1-4.8 32.3 0.6 10.2 5.4 17.1 15.3 18.8 26.6 0.1 0.6 7.8 46.6 32.2 71.4 1.3-36.1 5-79.3 15-119.1 20.1-79.2 77.4-162.1 146-211.2 10.9-7.9 25.2-8.9 37.3-2.7 12 6.2 19.4 18.4 19.4 31.8 0 61.5 31 103.3 70.3 156.1 44.9 60.5 95.8 128.9 104.3 240.1v0.1c0.2 2.2 1.6 21.5 1.6 29.4 0 156.1-126.3 283.6-282.1 285.3l-1 0.3z"
            fill="#fe3c72"
          ></path>
        </svg>
      </div>

      <h1 class="title">欢迎使用 Tinder。</h1>
      <p class="subtitle">请遵守这些使用规则。</p>

      <div class="rules">
        <div v-for="(r, i) in RULES" :key="i" class="rule">
          <h3 class="rule-title">{{ r.title }}</h3>
          <p class="rule-desc">
            {{ r.desc }}
            <a v-if="r.link" href="#" class="link" @click.prevent>{{ r.link }}</a>
          </p>
        </div>
      </div>
    </main>

    <footer class="footer safe-bottom">
      <button class="btn-agree press" @click="agree">同意</button>
    </footer>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
}

.top {
  padding: 13px 20px 0;
}

.close {
  width: 40px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(132, 128, 128, 0.97);
}

.main {
  flex: 1;
  padding: 16px 24px 24px;
  overflow-y: auto;
}

.logo {
  margin-bottom: 25px;
}

/* 确保火花图标比例正确 */
.tinder-flame {
  display: block;
}

.title {
  font-size: 34px;
  font-weight: 600;
  color: #111; /* 替换 var 为具体颜色以确保显示正确 */
  margin: 0 0 6px;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 15px;
  color: #666; /* 替换 var */
  margin: 0 0 32px;
}

.rules {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rule-title {
  font-size: 18px;
  font-weight: 500;
  color: #111;
  margin: 0 0 10px;
}

.rule-desc {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.link {
  color: #2b6cb0;
  text-decoration: underline;
  font-weight: 500;
  margin-left: 2px;
}

.footer {
  padding: 12px 24px 16px;
}

.btn-agree {
  width: 100%;
  height: 58px;
  border-radius: 9999px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  border: none;
  cursor: pointer;
}

.press:active {
  opacity: 0.7;
}
</style>