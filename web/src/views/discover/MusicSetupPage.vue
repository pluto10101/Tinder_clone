<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const hotSongs = [
  { id: 1, name: 'drop dead', artist: 'Olivia Rodrigo', cover: 'https://picsum.photos/seed/song1/100/100' },
  { id: 2, name: "Choosin' Texas", artist: 'Ella Langley', cover: 'https://picsum.photos/seed/song2/100/100' },
  { id: 3, name: 'Earrings', artist: 'Malcolm Todd', cover: 'https://picsum.photos/seed/song3/100/100' },
  { id: 4, name: 'Babydoll', artist: 'Dominic Fike', cover: 'https://picsum.photos/seed/song4/100/100' },
  { id: 5, name: 'Billie Jean', artist: 'Michael Jackson', cover: 'https://picsum.photos/seed/song5/100/100' },
  { id: 6, name: 'Be Her', artist: 'Ella Langley', cover: 'https://picsum.photos/seed/song6/100/100' },
  { id: 7, name: 'Doors', artist: 'Noah Kahan', cover: 'https://picsum.photos/seed/song7/100/100' },
  { id: 8, name: 'Beauty And A Beat', artist: 'Justin Bieber, Nicki Minaj', cover: 'https://picsum.photos/seed/song8/100/100' },
  { id: 9, name: 'Man I Need', artist: 'Olivia Dean', cover: 'https://picsum.photos/seed/song9/100/100' },
  { id: 10, name: 'Stateside', artist: 'PinkPantheress, Zara Larsson', cover: 'https://picsum.photos/seed/song10/100/100' },
];

const SLOT_COUNT = 4;
const slots = ref<Array<{ id: number; name: string; artist: string; cover: string } | null>>([null, null, null, null]);

const showSearchSheet = ref(false);
const searchQuery = ref('');
const currentSlotIndex = ref(0);

const hasAnySong = computed(() => slots.value.some(s => s !== null));

function goBack() { router.back(); }

function openSearch(index: number) {
  currentSlotIndex.value = index;
  showSearchSheet.value = true;
  searchQuery.value = '';
}

function closeSearch() { showSearchSheet.value = false; }

function selectSong(song: typeof hotSongs[0]) {
  slots.value[currentSlotIndex.value] = song;
  showSearchSheet.value = false;
}

function removeSong(index: number) { slots.value[index] = null; }

function onSave() {
  const selected = slots.value.filter(s => s !== null);
  localStorage.setItem('tinder_music_songs', JSON.stringify(selected));
  localStorage.setItem('tinder_music_enabled', 'true');
  router.replace({ name: 'discover', query: { tab: 'music' } });
}
</script>

<template>
  <div class="page">
    <!-- 背景装饰音符 -->
    <div class="bg-notes">
      <span class="bn bn1">♫</span>
      <span class="bn bn2">♬</span>
    </div>

    <!-- 顶部关闭 -->
    <header class="top-bar">
      <button class="close-btn press" @click="goBack">✕</button>
    </header>

    <!-- 标题区域 -->
    <div class="header-content">
      <h1 class="title">我的音乐</h1>
      <p class="subtitle">添加你的最爱歌曲，秀出品味，以音会友。</p>
    </div>

    <!-- 白色歌曲列表卡片 -->
    <div class="music-list-card">
      <div v-for="(slot, index) in slots" :key="index" class="music-row" @click="!slot ? openSearch(index) : undefined">
        <!-- 已选歌曲 -->
        <template v-if="slot">
          <div class="cover-wrap cover-filled">
            <img :src="slot.cover" class="cover-img" />
          </div>
          <div class="song-info">
            <div class="song-name">{{ slot.name }}</div>
            <div class="song-artist">
              <svg class="spotify-logo" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.353-.675.465-1.028.249-2.82-1.722-6.368-2.112-10.55-1.157-.404.093-.81-.162-.903-.566s.162-.81.566-.903c4.588-1.047 8.513-.598 11.666 1.326.353.216.465.675.249 1.028zm1.467-3.259c-.27.439-.848.58-1.287.311-3.226-1.983-8.145-2.556-11.96-1.398-.496.15-1.02-.13-1.17-.626s.13-1.02.626-1.17c4.354-1.32 9.776-.667 13.487 1.61.439.27.58.848.311 1.287zm.134-3.375C15.023 8.356 8.307 8.132 4.417 9.313c-.64.194-1.32-.172-1.514-.812s.172-1.32.812-1.514c4.46-1.353 11.89-1.096 16.55 1.67.577.342.766 1.085.424 1.661s-1.085.766-1.661.424z"/></svg>
              {{ slot.artist }}
            </div>
          </div>
          <div class="row-action" @click.stop="openSearch(index)">
            编辑
            <svg class="chevron" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
          </div>
        </template>
        <!-- 空槽位 -->
        <template v-else>
          <div class="cover-wrap cover-empty">♫</div>
          <div class="song-info">
            <div class="song-name">歌曲 {{ index + 1 }}</div>
          </div>
          <div class="row-action">
            添加
            <svg class="chevron" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
          </div>
        </template>
      </div>
    </div>

    <!-- 底部保存按钮 -->
    <button class="btn-save press" @click="onSave">保存</button>

    <!-- 搜索面板 -->
    <Transition name="sheet-fade">
      <div v-if="showSearchSheet" class="search-mask" @click.self="closeSearch">
        <div class="search-sheet">
          <div class="search-handle"></div>
          <div class="search-header">
            <button class="search-close press" @click="closeSearch">✕</button>
            <h3 class="search-title">添加音乐</h3>
            <div style="width:28px;"></div>
          </div>
          <div class="search-input-wrap">
            <svg class="search-icon-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M446.112323 177.545051c137.567677 0.219798 252.612525 104.59798 266.162424 241.493333 13.562828 136.895354-78.778182 261.818182-213.617777 289.008485-134.852525 27.203232-268.386263-52.156768-308.945455-183.608889s25.018182-272.252121 151.738182-325.779394A267.235556 267.235556 0 0 1 446.112323 177.545051m0-62.060607c-182.794343 0-330.989899 148.195556-330.989899 330.989899s148.195556 330.989899 330.989899 330.989899 330.989899-148.195556 330.989899-330.989899-148.195556-330.989899-330.989899-330.989899z m431.321212 793.341415a30.849293 30.849293 0 0 1-21.94101-9.102223l-157.220202-157.220202c-11.752727-12.179394-11.584646-31.534545 0.37495-43.50707 11.972525-11.972525 31.327677-12.140606 43.494141-0.37495l157.220202 157.220202a31.036768 31.036768 0 0 1 6.723232 33.810101 31.004444 31.004444 0 0 1-28.651313 19.174142z m0 0"/></svg>
            <input v-model="searchQuery" class="search-input" placeholder="在 Spotify 上搜索歌曲" />
          </div>
          <div class="search-section-title">热门</div>
          <div class="search-list">
            <div v-for="song in hotSongs" :key="song.id" class="search-item" @click="selectSong(song)">
              <img :src="song.cover" class="search-item-cover" />
              <div class="search-item-info">
                <div class="search-item-name">{{ song.name }}</div>
                <div class="search-item-artist">
                  <span class="spotify-badge">●</span> {{ song.artist }}
                </div>
              </div>
              <button class="search-item-add press">＋</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f76b91 0%, #a2bdfc 45%, #dae6ff 100%);
  display: flex; flex-direction: column; align-items: center;
  position: relative; overflow: hidden;
}

/* 背景音符装饰 */
.bg-notes { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.bn { position: absolute; color: rgba(255,255,255,0.4); }
.bn1 { top: 40px; right: 80px; font-size: 50px; filter: blur(2px); transform: rotate(15deg); }
.bn2 { top: 15px; right: 25px; font-size: 28px; color: rgba(255,255,255,0.3); filter: blur(3px); }

/* 顶部 */
.top-bar { width: 100%; padding: 55px 25px 0; z-index: 10; }
.close-btn { font-size: 28px; color: #fff; font-weight: 200; background: none; border: none; cursor: pointer; }

/* 标题 */
.header-content { width: 88%; margin-top: 40px; margin-bottom: 35px; z-index: 5; }
.title { font-size: 36px; color: #1a1a1a; font-weight: 600; margin: 0 0 10px; }
.subtitle { font-size: 15.5px; color: #5e5e5e; letter-spacing: 0.5px; margin: 0; }

/* 白色列表卡片 */
.music-list-card {
  width: 90%; background: #fff; border-radius: 32px; padding: 10px 0;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04); z-index: 5;
}

.music-row {
  display: flex; align-items: center; padding: 18px 22px; position: relative; cursor: pointer;
}
.music-row:not(:last-child)::after {
  content: ''; position: absolute; bottom: 0; left: 95px; right: 22px; height: 1px; background: #f2f2f2;
}

/* 封面 */
.cover-wrap { width: 60px; height: 60px; border-radius: 12px; margin-right: 15px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.cover-filled { background: #eee; }
.cover-img { width: 100%; height: 100%; object-fit: cover; }
.cover-empty { background: #f5f6f8; border: 1px dashed #ccc; color: #8e8e93; font-size: 22px; }

/* 歌曲信息 */
.song-info { flex: 1; }
.song-name { font-size: 17.5px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px; }
.song-artist { font-size: 14.5px; color: #5e5e5e; display: flex; align-items: center; gap: 4px; }
.spotify-logo { width: 15px; height: 15px; fill: #1DB954; flex-shrink: 0; }

/* 右侧操作 */
.row-action { display: flex; align-items: center; color: #333; font-size: 15.5px; font-weight: 500; }
.chevron { width: 16px; height: 16px; fill: #c7c7cc; margin-left: 2px; }

/* 保存按钮 */
.btn-save {
  position: fixed; bottom: 45px; width: 90%; max-width: 400px; height: 56px;
  background: rgba(240, 240, 240, 0.8); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
  border-radius: 28px; color: #5e5e5e; font-size: 18px; font-weight: 500;
  border: none; cursor: pointer; z-index: 10;
}

/* 搜索面板 */
.search-mask { position: fixed; inset: 0; z-index: 90; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; }
.search-sheet { width: 100%; max-width: 480px; max-height: 90vh; background: #fff; border-radius: 24px 24px 0 0; display: flex; flex-direction: column; overflow: hidden; animation: sheetUp 0.3s ease; }
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.search-handle { width: 36px; height: 4px; border-radius: 2px; background: #ccc; margin: 10px auto 0; }
.search-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 8px; }
.search-close { width: 28px; height: 28px; font-size: 16px; color: #111; background: none; border: none; }
.search-title { font-size: 17px; font-weight: 700; color: #111; }
.search-input-wrap { display: flex; align-items: center; gap: 8px; margin: 8px 20px 16px; padding: 12px 14px; background: #f2f2f2; border-radius: 10px; }
.search-icon-svg { width: 16px; height: 16px; fill: #999; flex-shrink: 0; }
.search-input { flex: 1; border: 0; background: transparent; font-size: 14px; color: #111; outline: none; }
.search-input::placeholder { color: #999; }
.search-section-title { padding: 0 20px 8px; font-size: 15px; font-weight: 600; color: #111; }
.search-list { flex: 1; overflow-y: auto; padding: 0 20px 24px; }
.search-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; cursor: pointer; }
.search-item:last-child { border-bottom: none; }
.search-item-cover { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; }
.search-item-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.search-item-name { font-size: 14px; font-weight: 600; color: #111; }
.search-item-artist { font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px; }
.spotify-badge { color: #1DB954; font-size: 8px; }
.search-item-add { width: 32px; height: 32px; font-size: 18px; color: #111; display: flex; align-items: center; justify-content: center; background: none; border: none; }

.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.2s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }
</style>
