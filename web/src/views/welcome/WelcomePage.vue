<script setup lang="ts">
import { useRouter } from 'vue-router';
import FlameLogo from '@/components/common/FlameLogo.vue';

const router = useRouter();

function goPhoneLogin() {
  router.push({ name: 'phone-login' });
}
</script>

<template>
  <div class="welcome">
    <!-- 背景渐变 -->
    <div class="bg-gradient"></div>

    <!-- 内容 -->
    <div class="content safe-top safe-bottom">
      <!-- Logo 区域 -->
      <div class="logo-area">
        <div class="logo-box">
          <FlameLogo :size="72" color="#ffffff" />
        </div>
        <div class="brand-name">tinder</div>
      </div>

      <!-- 底部按钮区域 -->
      <div class="bottom">
        <p class="terms">
          点击"登录"，表示你同意我们的
          <a href="#" class="link">条款</a>。在我们的<a href="#" class="link">隐私政策</a>中了解我们如何处理你的数据。
        </p>

        <button class="btn btn-phone press" @click="goPhoneLogin">
          <span class="icon">📱</span>
          <span>用手机号码登录</span>
        </button>

        <button class="btn btn-social press" @click="goPhoneLogin">
          <span class="icon"></span>
          <span>用 Apple 账户登录</span>
        </button>

        <button class="btn btn-social press" @click="goPhoneLogin">
          <span class="icon">f</span>
          <span>用 Facebook 登录</span>
        </button>

        <button class="btn btn-social press" @click="goPhoneLogin">
          <span class="icon">G</span>
          <span>用 Google 账户登录</span>
        </button>

        <p class="trouble">
          <a href="#" class="link">登录时遇到问题？</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #fff;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: var(--brand-gradient);
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
}

.logo-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.logo-box {
  width: 120px;
  height: 120px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
}

.brand-name {
  font-size: 48px;
  font-weight: 300;
  letter-spacing: -1px;
  font-style: italic;
}

.bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 8px;
}

.terms {
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  margin: 0 0 8px;
  opacity: 0.9;
}

.link {
  text-decoration: underline;
  font-weight: 500;
}

.btn {
  height: 48px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.3px;
}

.btn-phone {
  background: #fff;
  color: #ff4458;
}

.btn-social {
  background: transparent;
  color: #fff;
  border: 1.5px solid #fff;
}

.icon {
  font-weight: bold;
  width: 20px;
  display: inline-flex;
  justify-content: center;
}

.trouble {
  text-align: center;
  margin: 8px 0 0;
  font-size: 13px;
}
</style>
