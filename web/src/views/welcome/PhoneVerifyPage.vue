<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const phone = computed(() => String(route.query.phone || ''));
const digits = ref<string[]>(['', '', '', '', '', '']);
const inputsEl = ref<HTMLInputElement[]>([]);
const loading = ref(false);
const error = ref('');

const code = computed(() => digits.value.join(''));
const canSubmit = computed(() => code.value.length === 6);

onMounted(() => {
  nextTick(() => inputsEl.value[0]?.focus());
});

function onInput(i: number, e: Event) {
  const target = e.target as HTMLInputElement;
  const v = target.value.replace(/\D/g, '').slice(-1);
  digits.value[i] = v;
  target.value = v;
  if (v && i < 5) {
    inputsEl.value[i + 1]?.focus();
  }
  if (canSubmit.value) {
    submit();
  }
}

function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) {
    inputsEl.value[i - 1]?.focus();
  }
}

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') || '';
  const nums = text.replace(/\D/g, '').slice(0, 6).split('');
  if (nums.length === 0) return;
  e.preventDefault();
  nums.forEach((n, i) => (digits.value[i] = n));
  if (canSubmit.value) submit();
}

async function submit() {
  if (!canSubmit.value || loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    const resp = await auth.verifySms(phone.value, code.value);
    if (resp.is_new_user || !resp.onboarding_complete) {
      router.replace({ name: 'guidelines' });
    } else {
      router.replace({ name: 'discover' });
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '验证失败';
    digits.value = ['', '', '', '', '', ''];
    nextTick(() => inputsEl.value[0]?.focus());
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
      <h1 class="title">我的验证码是...</h1>
      <p class="subtitle">
        验证码已发送至 <strong>{{ phone }}</strong>
      </p>

      <div class="code-row" @paste="onPaste">
        <input
          v-for="(_, i) in digits"
          :key="i"
          :ref="(el) => el && (inputsEl[i] = el as HTMLInputElement)"
          class="digit"
          type="tel"
          inputmode="numeric"
          maxlength="1"
          :value="digits[i]"
          @input="onInput(i, $event)"
          @keydown="onKeydown(i, $event)"
        />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="hint">
        测试提示：<strong>任意 6 位数字</strong>均可验证通过（例如 123456）
      </p>

      <button class="resend" @click="auth.sendSms(phone)">重新发送验证码</button>
    </main>

    <footer class="footer safe-bottom">
      <button
        class="btn-continue press"
        :disabled="!canSubmit || loading"
        @click="submit"
      >
        {{ loading ? '验证中...' : '继续' }}
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

.code-row {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.digit {
  width: 48px;
  height: 56px;
  border: 0;
  border-bottom: 2px solid var(--border);
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  background: transparent;
  transition: border-color 0.2s;
}

.digit:focus {
  border-bottom-color: #ff4458;
}

.error {
  color: #f2385a;
  font-size: 13px;
  margin: 8px 0;
}

.hint {
  margin-top: 16px;
  font-size: 12px;
  color: var(--text-tertiary);
  background: rgba(253, 41, 123, 0.06);
  padding: 12px;
  border-radius: 8px;
  line-height: 1.6;
}

.resend {
  margin-top: 24px;
  color: #ff4458;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 0;
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
