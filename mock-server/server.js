/**
 * Tinder Clone Mock Server
 * 单文件 Express 服务，使用本地 db.json 存储数据
 * 启动：npm start  →  http://localhost:3001
 */
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const DB_PATH = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// 确保 uploads 目录存在
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// 确保 db.json 存在
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(
    DB_PATH,
    JSON.stringify(
      {
        users: [],
        actions: [],
        matches: [],
        messages: [],
        groups: [],
        notifications: [],
      },
      null,
      2
    )
  );
}

// ---------------- Middleware ----------------
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// multer 上传配置（保留原扩展名）
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ---------------- Helpers ----------------
function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function currentUserId(req) {
  const hdr = req.header('X-User-Id');
  return hdr ? Number(hdr) : null;
}

function ok(res, data) {
  res.json({ code: 0, message: 'ok', data });
}

function fail(res, code, message) {
  res.status(code).json({ code, message, data: null });
}

// 默认空用户模板
function makeEmptyUser(id, phone) {
  return {
    id,
    phone,
    name: null,
    birthday: null,
    gender: null,
    sexual_orientation: null,
    looking_for: null,
    bio: null,
    school: null,
    degree: null,
    job_title: null,
    company: null,
    city: null,
    height_cm: null,
    dating_purpose: [],
    interests: [],
    lifestyles: {},
    personality: [],
    photos: [],
    is_verified: false,
    membership: 'free',
    membership_expires_at: null,
    stealth_mode: false,
    super_like_count: 1,
    boost_count: 0,
    read_receipt_count: 0,
    onboarding_complete: false,
    settings: {
      distance_max_km: 50,
      age_min: 18,
      age_max: 60,
      gender_preference: 'all',
      show_gender: true,
      show_age: true,
      show_distance: true,
      show_orientation: false,
      show_online_status: true,
    },
    created_at: new Date().toISOString(),
  };
}

// ---------------- Routes ----------------

// 健康检查
app.get('/', (req, res) => {
  ok(res, { name: 'tinder-clone-mock-server', version: '0.1.0', time: new Date().toISOString() });
});

// ---- Auth ----
app.post('/auth/sms/send', (req, res) => {
  const { phone } = req.body || {};
  if (!phone) return fail(res, 400, '手机号不能为空');
  // Mock: 固定验证码
  ok(res, { code: '123456', ttl: 60 });
});

app.post('/auth/sms/verify', (req, res) => {
  const { phone, code } = req.body || {};
  if (!phone || !code) return fail(res, 400, '参数缺失');
  // Mock: 任意 6 位数字通过
  if (!/^\d{4,6}$/.test(String(code))) return fail(res, 400, '验证码格式错误');

  const db = readDb();
  let user = db.users.find((u) => u.phone === phone);
  let isNew = false;
  if (!user) {
    isNew = true;
    user = makeEmptyUser(Date.now(), phone);
    db.users.push(user);
    writeDb(db);
  }
  ok(res, {
    token: `mock_token_${user.id}`,
    user_id: user.id,
    is_new_user: isNew,
    onboarding_complete: user.onboarding_complete,
  });
});

app.post('/auth/logout', (req, res) => ok(res, {}));

// ---- Profile ----
app.get('/profile', (req, res) => {
  const uid = currentUserId(req);
  if (!uid) return fail(res, 401, '未登录');
  const db = readDb();
  const user = db.users.find((u) => u.id === uid);
  if (!user) return fail(res, 404, '用户不存在');
  ok(res, user);
});

app.put('/profile', (req, res) => {
  const uid = currentUserId(req);
  if (!uid) return fail(res, 401, '未登录');
  const db = readDb();
  const idx = db.users.findIndex((u) => u.id === uid);
  if (idx < 0) return fail(res, 404, '用户不存在');
  // 合并更新（不允许覆盖 id / phone / created_at）
  const { id, phone, created_at, ...patch } = req.body || {};
  db.users[idx] = { ...db.users[idx], ...patch };
  writeDb(db);
  ok(res, db.users[idx]);
});

app.post('/profile/photos', upload.single('photo'), (req, res) => {
  const uid = currentUserId(req);
  if (!uid) return fail(res, 401, '未登录');
  if (!req.file) return fail(res, 400, '未收到文件');
  const db = readDb();
  const user = db.users.find((u) => u.id === uid);
  if (!user) return fail(res, 404, '用户不存在');

  const photo = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
    sort_order: user.photos.length,
  };
  user.photos.push(photo);
  writeDb(db);
  ok(res, photo);
});

app.delete('/profile/photos/:id', (req, res) => {
  const uid = currentUserId(req);
  if (!uid) return fail(res, 401, '未登录');
  const pid = Number(req.params.id);
  const db = readDb();
  const user = db.users.find((u) => u.id === uid);
  if (!user) return fail(res, 404, '用户不存在');
  user.photos = user.photos.filter((p) => p.id !== pid);
  // 重排 sort_order
  user.photos.forEach((p, i) => (p.sort_order = i));
  writeDb(db);
  ok(res, {});
});

app.put('/profile/photos/reorder', (req, res) => {
  const uid = currentUserId(req);
  if (!uid) return fail(res, 401, '未登录');
  const { ids } = req.body || {};
  if (!Array.isArray(ids)) return fail(res, 400, '参数错误');
  const db = readDb();
  const user = db.users.find((u) => u.id === uid);
  if (!user) return fail(res, 404, '用户不存在');
  const map = new Map(user.photos.map((p) => [p.id, p]));
  user.photos = ids.map((id, i) => {
    const p = map.get(id);
    if (p) p.sort_order = i;
    return p;
  }).filter(Boolean);
  writeDb(db);
  ok(res, user.photos);
});

// ---- 完善度计算（服务端与前端保持一致逻辑） ----
app.get('/profile/completeness', (req, res) => {
  const uid = currentUserId(req);
  if (!uid) return fail(res, 401, '未登录');
  const db = readDb();
  const user = db.users.find((u) => u.id === uid);
  if (!user) return fail(res, 404, '用户不存在');

  // 权重表（合计 100）
  const items = [
    { key: 'photos_ge_4', weight: 28, done: user.photos.length >= 4 },
    { key: 'bio', weight: 20, done: !!(user.bio && user.bio.trim().length > 0) },
    { key: 'about_me', weight: 10, done: !!(user.job_title || user.school || user.city) },
    { key: 'interests', weight: 12, done: user.interests.length >= 3 },
    { key: 'lifestyles', weight: 10, done: Object.keys(user.lifestyles || {}).length >= 2 },
    { key: 'personality', weight: 10, done: user.personality.length >= 3 },
    { key: 'basic', weight: 10, done: !!(user.name && user.birthday && user.gender) },
  ];
  const completeness = items.reduce((sum, i) => sum + (i.done ? i.weight : 0), 0);

  ok(res, {
    completeness,
    items,
  });
});

// ---- Discover ----
app.get('/discover/cards', (req, res) => {
  const db = readDb();
  const uid = currentUserId(req);
  const swipedIds = (db.actions || []).filter((a) => a.user_id === uid).map((a) => a.target_user_id);
  const candidates = db.users.filter(
    (u) => u.id !== uid && !swipedIds.includes(u.id) && !u.stealth_mode && u.onboarding_complete
  );
  // 随机打乱 + 截取 20 个
  const shuffled = candidates.sort(() => Math.random() - 0.5).slice(0, 20);
  // 附加随机距离
  const cards = shuffled.map((u) => ({ ...u, distance: Math.floor(Math.random() * 50) + 1 }));
  ok(res, cards);
});

app.post('/discover/swipe', (req, res) => {
  const { target_user_id, action } = req.body || {};
  if (!target_user_id || !action) return fail(res, 400, '参数缺失');
  const db = readDb();
  const uid = currentUserId(req);
  if (!db.actions) db.actions = [];
  db.actions.push({
    id: Date.now(),
    user_id: uid,
    target_user_id,
    action_type: action,
    created_at: new Date().toISOString(),
  });

  let matched = false;
  let match = null;
  if (action === 'like' || action === 'super_like') {
    // 30% 概率模拟匹配
    if (Math.random() < 0.3) {
      match = {
        id: Date.now() + 1,
        user_a_id: uid,
        user_b_id: target_user_id,
        match_type: action === 'super_like' ? 'super_like' : 'normal',
        matched_at: new Date().toISOString(),
      };
      if (!db.matches) db.matches = [];
      db.matches.push(match);
      matched = true;

      // 自动生成通知
      if (!db.notifications) db.notifications = [];
      const otherUser = db.users.find((u) => u.id === target_user_id);
      db.notifications.push({
        id: Date.now() + 2,
        user_id: uid,
        type: 'match',
        title: '新匹配',
        body: `你和 ${otherUser?.name || '对方'} 互相喜欢！`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }
  }
  writeDb(db);
  ok(res, { matched, match });
});

app.post('/discover/rewind', (req, res) => {
  const db = readDb();
  const uid = currentUserId(req);
  const userActions = (db.actions || []).filter((a) => a.user_id === uid);
  if (userActions.length === 0) return fail(res, 404, '没有可撤销的操作');
  const last = userActions[userActions.length - 1];
  db.actions = db.actions.filter((a) => a.id !== last.id);
  writeDb(db);
  ok(res, { target_user_id: last.target_user_id });
});

app.get('/discover/filters', (req, res) => {
  const uid = currentUserId(req);
  const db = readDb();
  const user = db.users.find((u) => u.id === uid);
  ok(res, user?.settings || { distance_max_km: 50, age_min: 18, age_max: 60, gender_preference: 'all' });
});

app.put('/discover/filters', (req, res) => {
  const uid = currentUserId(req);
  const db = readDb();
  const user = db.users.find((u) => u.id === uid);
  if (user) {
    user.settings = { ...user.settings, ...req.body };
    writeDb(db);
  }
  ok(res, user?.settings || {});
});

// ---- Matches ----
app.get('/matches', (req, res) => {
  const db = readDb();
  const uid = currentUserId(req);
  const myMatches = (db.matches || []).filter((m) => m.user_a_id === uid || m.user_b_id === uid);
  const result = myMatches.map((m) => {
    const otherId = m.user_a_id === uid ? m.user_b_id : m.user_a_id;
    const other = db.users.find((u) => u.id === otherId);
    const msgs = (db.messages || []).filter((msg) => msg.match_id === m.id);
    return {
      ...m,
      other_user: other || null,
      last_message: msgs[msgs.length - 1] || null,
      unread_count: msgs.filter((msg) => msg.sender_id !== uid && !msg.is_read).length,
    };
  });
  ok(res, result);
});

app.delete('/matches/:id', (req, res) => {
  const mid = Number(req.params.id);
  const db = readDb();
  db.matches = (db.matches || []).filter((m) => m.id !== mid);
  db.messages = (db.messages || []).filter((msg) => msg.match_id !== mid);
  writeDb(db);
  ok(res, {});
});

app.get('/matches/likes', (req, res) => {
  const db = readDb();
  const uid = currentUserId(req);
  const likers = db.users.filter((u) => u.id !== uid && u.onboarding_complete).sort(() => Math.random() - 0.5).slice(0, 15);
  ok(res, likers);
});

// ---- Explore ----
app.get('/explore/groups', (req, res) => {
  const db = readDb();
  ok(res, db.groups || []);
});

app.get('/explore/groups/:id/users', (req, res) => {
  const gid = Number(req.params.id);
  const db = readDb();
  const group = (db.groups || []).find((g) => g.id === gid);
  if (!group) return fail(res, 404, '分组不存在');
  const users = db.users.filter((u) => group.user_ids.includes(u.id));
  ok(res, users);
});

// ---- Notifications ----
app.get('/notifications', (req, res) => {
  const db = readDb();
  const uid = currentUserId(req);
  const list = (db.notifications || []).filter((n) => n.user_id === uid).sort((a, b) => b.created_at.localeCompare(a.created_at));
  ok(res, list);
});

app.put('/notifications/read-all', (req, res) => {
  const db = readDb();
  const uid = currentUserId(req);
  (db.notifications || []).forEach((n) => { if (n.user_id === uid) n.is_read = true; });
  writeDb(db);
  ok(res, {});
});

// ---------------- 404 & Error ----------------
app.use((req, res) => fail(res, 404, `Not Found: ${req.method} ${req.path}`));

app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  fail(res, 500, err.message || '服务器错误');
});

// ---------------- Start ----------------
app.listen(PORT, () => {
  console.log(`\n🔥 Tinder Clone Mock Server running:`);
  console.log(`   → http://localhost:${PORT}`);
  console.log(`   → Uploads served at: http://localhost:${PORT}/uploads/`);
  console.log(`   → DB file: ${DB_PATH}\n`);
});
