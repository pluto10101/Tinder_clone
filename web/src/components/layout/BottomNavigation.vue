<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = withDefaults(defineProps<{ theme?: 'dark' | 'light' }>(), { theme: 'dark' });

const route = useRoute();
const router = useRouter();

interface Tab {
  id: string;
  label: string;
  route: string;
  badge?: number;
  dot?: boolean;
}

const tabs: Tab[] = [
  { id: 'discover', label: '滑动', route: '/discover' },
  { id: 'explore', label: '探索', route: '/explore' },
  { id: 'likes', label: '赞', route: '/likes', badge: 38 },
  { id: 'chat', label: '聊天', route: '/chat', dot: true },
  { id: 'profile', label: '个人资料', route: '/profile' },
];

const activeTab = computed(() => {
  const path = route.path;
  const found = tabs.find((t) => path.startsWith(t.route));
  return found?.id || 'discover';
});

function go(tab: Tab) {
  router.push(tab.route);
}

// 颜色计算
function getActiveColor() {
  return props.theme === 'light' ? '#111111' : '#ffffff';
}
function getInactiveColor() {
  return props.theme === 'light' ? '#818385' : '#818385';
}
</script>

<template>
  <nav class="bottom-nav safe-bottom" :class="{ 'nav-light': props.theme === 'light' }">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="nav-item"
      :class="{ active: activeTab === tab.id }"
      @click="go(tab)"
    >
      <div class="icon-box">
        <!-- 滑动 (火苗) -->
        <svg v-if="tab.id === 'discover'" viewBox="0 0 24 24">
          <path
            d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"
            :fill="activeTab === tab.id ? getActiveColor() : 'none'"
            :stroke="activeTab === tab.id ? getActiveColor() : getInactiveColor()"
            stroke-width="0"
            :stroke-width="activeTab === tab.id ? '0' : '0'"
          />
          <path
            v-if="activeTab !== tab.id"
            d="M16.48 10.97c-.36-.45-.75-.87-1.16-1.28-1.51-1.49-2.07-3.12-1.74-5.06.07-.38-.28-.7-.6-.5-.59.36-1.12.82-1.57 1.37-2.31 2.82-2.18 6.46-.22 9.4 0 .01 0 .02.01.03a4.01 4.01 0 0 1-2.31-3.64c-.02-.85.18-1.67.55-2.39.2-.38-.15-.79-.53-.66-.82.26-1.54.76-2.08 1.45-1.53 1.95-1.8 4.67-.7 6.78 1.35 2.6 4.3 4.14 7.21 3.86 3.4-.33 5.92-3.4 5.4-6.8-.18-1.14-.65-2.18-1.26-3.06z"
            fill="none"
            :stroke="getInactiveColor()"
            stroke-width="1.2"
          />
        </svg>

        <!-- 探索 (指南针) -->
        <svg v-else-if="tab.id === 'explore'" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9"
            :fill="activeTab === tab.id ? getActiveColor() : 'none'"
            :stroke="activeTab === tab.id ? getActiveColor() : getInactiveColor()"
            :stroke-width="activeTab === tab.id ? '0' : '2.3'"
          />
          <path d="M14.5 9.5L13 13l-3.5 1.5L11 11l3.5-1.5z"
            :fill="activeTab === tab.id ? (props.theme === 'light' ? '#fff' : '#000') : 'none'"
            :stroke="activeTab === tab.id ? 'none' : getInactiveColor()"
            :stroke-width="activeTab === tab.id ? '0' : '1.8'"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- 赞 (心形) -->
        <svg v-else-if="tab.id === 'likes'" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            :fill="activeTab === tab.id ? getActiveColor() : 'none'"
            :stroke="activeTab === tab.id ? getActiveColor() : getInactiveColor()"
            :stroke-width="activeTab === tab.id ? '0' : '2.3'"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- 聊天 (圆润气泡) -->
        <svg v-else-if="tab.id === 'chat'" viewBox="0 0 24 24">
          <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.2 0-2.3-.25-3.3-.7L4 21l1.7-5.2a8.5 8.5 0 1 1 15.3-4.3z"
            :fill="activeTab === tab.id ? getActiveColor() : 'none'"
            :stroke="activeTab === tab.id ? getActiveColor() : getInactiveColor()"
            :stroke-width="activeTab === tab.id ? '0' : '2.3'"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- 个人资料 (人形) -->
        <svg v-else-if="tab.id === 'profile'" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            :fill="activeTab === tab.id ? getActiveColor() : 'none'"
            :stroke="activeTab === tab.id ? getActiveColor() : getInactiveColor()"
            :stroke-width="activeTab === tab.id ? '0' : '2.3'"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="12" cy="7" r="4"
            :fill="activeTab === tab.id ? getActiveColor() : 'none'"
            :stroke="activeTab === tab.id ? getActiveColor() : getInactiveColor()"
            :stroke-width="activeTab === tab.id ? '0' : '2.3'"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- 角标 -->
        <span v-if="tab.badge" class="badge-number">{{ tab.badge }}</span>
        <span v-if="tab.dot" class="badge-dot"></span>
      </div>
      <span class="nav-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background-color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  z-index: 50;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  outline: none;
}

.icon-box {
  position: relative;
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box svg {
  width: 26px;
  height: 26px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-label {
  font-size: 11px;
  color: #818385;
  font-weight: 500;
}

.nav-item.active .nav-label {
  color: #ffffff;
}

/* 黄色数字角标 */
.badge-number {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: #fbc62a;
  color: #000;
  font-size: 10px;
  font-weight: 900;
  min-width: 17px;
  height: 17px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2px;
  box-shadow: 0 0 0 2.5px #000000;
  z-index: 2;
}

/* 红色圆点提示 */
.badge-dot {
  position: absolute;
  top: 1px;
  right: -1px;
  width: 9px;
  height: 9px;
  background-color: #ff4358;
  border-radius: 50%;
  box-shadow: 0 0 0 2.5px #000000;
  z-index: 2;
}

/* Light theme */
.nav-light {
  background-color: #ffffff;
  border-top: 1px solid #eee;
}
.nav-light .nav-label {
  color: #818385;
}
.nav-light .nav-item.active .nav-label {
  color: #111111;
}
.nav-light .badge-number {
  box-shadow: 0 0 0 2.5px #ffffff;
}
.nav-light .badge-dot {
  box-shadow: 0 0 0 2.5px #ffffff;
}
</style>
