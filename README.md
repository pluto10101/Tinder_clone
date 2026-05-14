# Tinder Clone

1:1 视觉与交互复刻 Tinder 的社交连接应用。**前端为核心**（Vue 3 + TypeScript + Vite），后端为极简 Mock 服务（Node.js + Express + 本地 JSON）。

---

## 功能进度

### ✅ 已完成

**认证 & 引导**
- 欢迎页、社区准则页
- 手机号登录 + 验证码验证（Mock，任意数字通过）
- 13 步注册引导流程（姓名、生日、性别、性取向、目的、兴趣、生活方式、个性、教育、距离、照片等）
- 照片上传（本地 multipart 上传，存 `mock-server/uploads/`）
- 引导完成后自动跳转，路由守卫保护未登录/未引导用户

**主功能页**
- 发现页（卡片滑动，左滑/右滑/超级喜欢，30% 概率模拟匹配）
- 探索页（兴趣分组浏览）
- 喜欢页（查看喜欢过你的人，会员模糊遮罩）
- 聊天列表页 + 聊天对话页
- 个人资料页（完善度展示、退出登录）
- 个人资料编辑页（照片管理、bio、兴趣、生活方式、职业等全字段）
- 设置页

**发现扩展**
- 筛选偏好页（距离、年龄、性别偏好）
- 星座配对（设置、结果、兼容度）
- 音乐品味设置页

**订阅弹窗**
- Plus / Gold / Platinum 升级弹窗
- Boost 弹窗、超级喜欢弹窗

### 🔜 待实现（M2+）

- 卡片滑动动画（interact.js / GSAP 已引入，待接入）
- 实时聊天（WebSocket 或轮询）
- 匹配动画
- 推送通知
- 支付流程（Mock）
- 隐身模式、已读回执

---

## 目录结构

```
.
├── web/                        # 前端 Vue 3 项目
│   ├── src/
│   │   ├── api/                # axios 请求层（auth / profile / discover）
│   │   ├── components/         # 公共组件（弹窗、Logo 等）
│   │   ├── router/             # Vue Router 路由配置 + 守卫
│   │   ├── stores/             # Pinia 状态（auth / user / discovery）
│   │   ├── styles/             # 全局样式 + CSS 设计 Token
│   │   ├── types/              # TypeScript 类型定义
│   │   ├── utils/              # LocalStorage 工具
│   │   └── views/              # 页面组件（按功能模块分目录）
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.js
├── mock-server/                # 后端 Mock 服务
│   ├── server.js               # Express 主入口，所有路由
│   ├── seed.js                 # 生成 Mock 用户数据
│   ├── db.json                 # 数据存储文件（自动生成）
│   └── uploads/                # 用户上传的照片（自动生成）
├── start.bat                   # Windows 一键启动
├── start.sh                    # macOS/Linux 一键启动
└── README.md
```

---

## 运行方式

### 前置要求

- [Node.js 18+](https://nodejs.org)（含 npm）
- 浏览器（Chrome / Edge / Firefox / Safari）

### 一键启动（推荐）

**Windows:**
```
双击 start.bat
```

**macOS / Linux:**
```bash
chmod +x start.sh
./start.sh
```

脚本会自动安装依赖、生成 mock 数据、启动前后端，并打开浏览器访问 `http://localhost:5173`。

### 手动启动

打开两个终端窗口。

**终端 1 — 启动后端：**
```bash
cd mock-server
npm install
npm run seed     # 首次运行，生成 20 个 mock 用户
npm start        # 监听 http://localhost:3001
```

**终端 2 — 启动前端：**
```bash
cd web
npm install
npm run dev      # 监听 http://localhost:5173
```

然后浏览器打开 `http://localhost:5173`。

---

## 登录测试

| 字段 | 规则 |
|---|---|
| 手机号 | 任意 6–15 位数字，如 `13800138000` |
| 验证码 | 任意 4–6 位数字，如 `123456` |

> 首次登录会自动创建新用户并进入注册引导流程。

---

## API 接口一览

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/` | 健康检查 |
| POST | `/auth/sms/send` | 发送验证码（返回固定 `123456`） |
| POST | `/auth/sms/verify` | 验证码登录 / 注册 |
| POST | `/auth/logout` | 登出 |
| GET | `/profile` | 获取当前用户资料 |
| PUT | `/profile` | 更新资料 |
| POST | `/profile/photos` | 上传照片（`multipart/form-data`，字段名 `photo`） |
| DELETE | `/profile/photos/:id` | 删除照片 |
| PUT | `/profile/photos/reorder` | 重排照片顺序 |
| GET | `/profile/completeness` | 资料完善度（0–100） |
| GET | `/discover/cards` | 获取推荐卡片列表 |
| POST | `/discover/swipe` | 滑动操作（like / pass / super_like） |
| POST | `/discover/rewind` | 撤销上一次滑动 |
| GET | `/discover/filters` | 获取筛选偏好 |
| PUT | `/discover/filters` | 更新筛选偏好 |
| GET | `/matches` | 获取匹配列表（含最后一条消息） |
| DELETE | `/matches/:id` | 删除匹配 |
| GET | `/matches/likes` | 喜欢过你的用户列表 |
| GET | `/explore/groups` | 探索分组列表 |
| GET | `/explore/groups/:id/users` | 分组内用户列表 |
| GET | `/notifications` | 通知列表 |
| PUT | `/notifications/read-all` | 全部标为已读 |

所有需要身份的接口通过 `X-User-Id` header 识别当前用户（`Authorization` header 不校验）。

---

## 开发者命令

**后端 `mock-server/`：**
```bash
npm start          # 启动服务
npm run dev        # 开发模式（nodemon 自动重启）
npm run seed       # 重新生成 mock 数据（会清空已有数据）
```

**前端 `web/`：**
```bash
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

---

## 技术栈

| 层级 | 选型 |
|---|---|
| 前端框架 | Vue 3 + Composition API + TypeScript |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| 构建 | Vite 5 |
| 样式 | TailwindCSS 3 + CSS 变量 |
| 动画 | GSAP 3 + interact.js |
| HTTP | axios |
| 后端 | Node.js 18+ / Express 4 |
| 存储 | 本地 `db.json` 文件 |
| 文件上传 | multer |

---

## 浏览器调试建议

应用为移动端优先设计，建议用 Chrome DevTools 模拟手机视口：

`F12` → 点击左上角 **Toggle Device Toolbar**（或 `Ctrl+Shift+M`）→ 选择 iPhone 14 Pro / Pixel 7。

---

## 常见问题

**Q: 端口被占用？**  
修改 `mock-server/server.js` 中的 `PORT`（默认 3001）和 `web/vite.config.ts` 的 `server.port`（默认 5173），同时更新 `web/.env.development` 的 `VITE_API_URL`。

**Q: 想清空数据重新开始？**  
```bash
cd mock-server && npm run seed
```

**Q: 照片上传到哪里？**  
`mock-server/uploads/` 目录，通过 `http://localhost:3001/uploads/文件名` 访问。

**Q: 上传照片报 404？**  
LocalStorage 里的 `tinder_user_id` 与数据库不同步（常见于重新 seed 后）。打开浏览器 DevTools → Console，执行 `localStorage.clear()`，刷新后重新登录即可。

**Q: 登录信息存在哪？**  
浏览器 LocalStorage，key 前缀为 `tinder_`。DevTools → Application → Local Storage 可查看和手动清理。

---

## 说明

- 所有登录、短信、支付均为 Mock，不会产生真实请求或费用
- 数据持久化在 `mock-server/db.json`，删除文件即重置
- 前端在 LocalStorage 中存储 token、userId 和 onboarding 状态
