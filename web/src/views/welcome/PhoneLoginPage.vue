<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const countryCode = ref('+86');
const phone = ref('');
const loading = ref(false);
const error = ref('');

const canSubmit = computed(() => /^\d{6,15}$/.test(phone.value));

async function handleSubmit() {
  if (!canSubmit.value || loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    const fullPhone = `${countryCode.value}${phone.value}`;
    await auth.sendSms(fullPhone);
    router.push({
      name: 'phone-verify',
      query: { phone: fullPhone },
    });
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '发送失败';
  } finally {
    loading.value = false;
  }
}

function back() {
  router.back();
}
</script>

<template>
  <div class="page">
    <header class="header safe-top">
      <button class="back press" @click="back">←</button>
    </header>

    <main class="main">
      <h1 class="title">你的手机号码?</h1>
      <p class="subtitle">我们会发送验证码来验证你的手机号码。标准短信费用将会产生。</p>

      <div class="phone-row">
        <div class="country">
          <span>🇨🇳</span>
          <span class="code">{{ countryCode }}</span>
        </div>
        <input
          v-model="phone"
          class="phone-input"
          type="tel"
          inputmode="numeric"
          placeholder="手机号码"
          autofocus
          @keyup.enter="handleSubmit"
        />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="hint">
        测试提示：任意手机号均可登录，验证码固定为
        <strong>123456</strong>
      </p>
    </main>

    <footer class="footer safe-bottom">
      <button
        class="btn-continue press"
        :disabled="!canSubmit || loading"
        @click="handleSubmit"
      >
        {{ loading ? '发送中...' : '继续' }}
      </button>
    </footer>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-page);
}

.header {
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.back {
  width: 40px;
  height: 40px;
  font-size: 24px;
  color: var(--text-primary);
}

.main {
  flex: 1;
  padding: 16px 24px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0 12px;
  color: var(--text-primary);
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 32px;
  line-height: 1.5;
}

.phone-row {
  display: flex;
  gap: 12px;
  border-bottom: 2px solid #ff4458;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.country {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  padding-right: 8px;
  border-right: 1px solid var(--border);
}

.code {
  font-size: 16px;
}

.phone-input {
  flex: 1;
  border: 0;
  font-size: 20px;
  padding: 4px 0;
  background: transparent;
  color: var(--text-primary);
}

.error {
  color: #f2385a;
  font-size: 13px;
  margin: 8px 0;
}

.hint {
  margin-top: 24px;
  font-size: 12px;
  color: var(--text-tertiary);
  background: rgba(253, 41, 123, 0.06);
  padding: 12px;
  border-radius: 8px;
  line-height: 1.6;
}

.footer {
  padding: 16px 24px;
}

.btn-continue {
  width: 100%;
  height: 52px;
  border-radius: 9999px;
  background: var(--brand-gradient);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  transition: opacity 0.2s;
}

.btn-continue:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
