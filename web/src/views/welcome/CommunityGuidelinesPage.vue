<script setup lang="ts">
import { useRouter } from 'vue-router';
import FlameLogo from '@/components/common/FlameLogo.vue';

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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
        <FlameLogo :size="44" />
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
  padding: 12px 20px 0;
}

.close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.main {
  flex: 1;
  padding: 16px 24px 24px;
  overflow-y: auto;
}

.logo {
  margin-bottom: 20px;
}

.title {
  font-size: 34px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 32px;
}

.rules {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rule-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}

.rule-desc {
  font-size: 14px;
  color: var(--text-secondary);
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
  height: 52px;
  border-radius: 9999px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
}
</style>
