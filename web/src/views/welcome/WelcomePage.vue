<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goPhoneLogin() {
  router.push({ name: 'phone-login' });
}
</script>

<template>
  <div class="container">
    <!-- Logo 区域 -->
    <div class="logo-section">
      <svg viewBox="0 0 1024 1024">
        <path d="M514 924.9l-3.1-0.2c-157-0.4-284.7-128.2-284.7-285.4 0-5.4 0-10.9 0.4-16.3 4.6-159.4 84.2-202.4 93.3-206.8 10-4.9 22.1-4.8 32.3 0.6 10.2 5.4 17.1 15.3 18.8 26.6 0.1 0.6 7.8 46.6 32.2 71.4 1.3-36.1 5-79.3 15-119.1 20.1-79.2 77.4-162.1 146-211.2 10.9-7.9 25.2-8.9 37.3-2.7 12 6.2 19.4 18.4 19.4 31.8 0 61.5 31 103.3 70.3 156.1 44.9 60.5 95.8 128.9 104.3 240.1v0.1c0.2 2.2 1.6 21.5 1.6 29.4 0 156.1-126.3 283.6-282.1 285.3l-1 0.3z" fill="white"/>
      </svg>
      <span class="tinder-text">tinder</span>
    </div>

    <!-- 底部区域 -->
    <div class="bottom-section">
      <p class="terms-text">
        点击继续即表示你同意<span class="bold-link">条款</span>。前往<span class="bold-link">隐私政策</span>和<br>
        <span class="bold-link">Cookies 政策</span>，了解数据处理惯例。
      </p>

      <!-- Google 按钮 -->
      <div class="btn press" @click="goPhoneLogin">
        <div class="btn-icon">
          <svg viewBox="0 0 24 24" width="25" height="25">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>
        <div class="btn-text">使用 Google 账号登录</div>
      </div>

      <!-- 手机号按钮 -->
      <div class="btn press" @click="goPhoneLogin">
        <div class="btn-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#424242">
            <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.05 15.05 0 01-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
          </svg>
        </div>
        <div class="btn-text">使用手机号码登录</div>
      </div>

      <span class="footer-link">登录时遇到问题？</span>
    </div>

    <div class="home-indicator"></div>
  </div>
</template>

<style scoped>
* {
  -webkit-font-smoothing: antialiased;
}

.container {
  height: 100vh;
  width: 100%;
  background: linear-gradient(175deg, #ff6036 0%, #fd267d 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 42px;
  color: white;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.logo-section {
  margin-top: 27vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-section svg {
  width: 60px;
  height: 55px;
  margin-right: -10px;
  fill: white;
}

.tinder-text {
  font-size: 60px;
  font-weight: 500;
  letter-spacing: -3.5px;
  margin-bottom: 6px;
}

.bottom-section {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 32px;
  padding: 0 38px;
}

.terms-text {
  font-size: 13.5px;
  line-height: 1.5;
  margin-bottom: 65px;
  color: white;
  font-weight: 400;
}

.bold-link {
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.btn {
  width: 100%;
  height: 53px;
  background: white;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  cursor: pointer;
}

.btn-icon {
  position: absolute;
  left: 25px;
  display: flex;
  align-items: center;
}

.btn-text {
  color: #424242;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.footer-link {
  font-size: 17px;
  font-weight: 700;
  margin-top: 30px;
  display: block;
  opacity: 0.95;
}

.home-indicator {
  position: absolute;
  bottom: 8px;
  width: 135px;
  height: 5px;
  background-color: white;
  border-radius: 100px;
  left: 50%;
  transform: translateX(-50%);
}

.press:active {
  transform: scale(0.97);
  transition: transform 0.1s;
}
</style>
