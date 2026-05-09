# Tinder Clone

1:1 视觉与交互复刻 Tinder 的社交连接应用。**前端为核心**（Vue 3 + TypeScript + Vite），后端为极简 Mock 服务（Node.js + Express + 本地 JSON）。

## 当前进度：M1 — 骨架 + 登录 + 注册引导

- ✅ 项目初始化（前后端 + Tailwind + 设计 Token）
- ✅ 路由、Pinia stores、API 请求层
- ✅ 欢迎页、手机号登录、验证码验证
- ✅ 13 步注册引导流程
- ✅ 照片上传
- ✅ 资料页基础展示 + 退出登录
- ✅ 一键启动脚本

M2-M6 将陆续实现：卡片滑动、匹配、聊天、资料编辑、订阅、探索页等。

## 目录结构

```
.
├── web/                # 前端 Vue 3 项目
├── mock-server/        # 后端 Mock 服务
├── start.bat           # Windows 一键启动
├── start.sh            # macOS/Linux 一键启动
└── README.md
```

## 运行方式

### 前置要求

- [Node.js 18+](https://nodejs.org)（含 npm，装完即可）
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

**终端 1 - 启动后端：**
```bash
cd mock-server
npm install
npm run seed     # 首次运行生成 60 个 mock 用户
npm start        # 监听 http://localhost:3001
```

**终端 2 - 启动前端：**
```bash
cd web
npm install
npm run dev      # 监听 http://localhost:5173
```

然后浏览器打开 `http://localhost:5173`。

## 登录测试

- 手机号：**任意** 6-15 位数字（比如 `13800138000`）
- 验证码：**任意** 4-6 位数字（比如 `123456`）

## 开发者命令

后端 `mock-server/`：
- `npm start` — 启动服务
- `npm run dev` — 开发模式（nodemon 自动重启）
- `npm run seed` — 重新生成 mock 数据（会清空已有数据）

前端 `web/`：
- `npm run dev` — 开发服务器
- `npm run build` — 生产构建
- `npm run preview` — 预览构建产物

## 技术栈

| 层级 | 选型 |
|---|---|
| 前端框架 | Vue 3 + Composition API + TypeScript |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| 构建 | Vite 5 |
| 样式 | TailwindCSS 3 + CSS 变量 |
| HTTP | axios |
| 后端 | Node.js 18+ / Express 4 |
| 存储 | 本地 `db.json` 文件 |
| 文件上传 | multer |

## 浏览器推荐

建议使用 Chrome DevTools 切到手机模式（iPhone 14 Pro / Pixel 7）查看，因为应用是移动端优先设计。

快捷键：F12 → 点击左上角"Toggle Device Toolbar"（Ctrl+Shift+M）。

## 常见问题

**Q: 端口被占用？**  
A: 修改 `mock-server/server.js` 中的 `PORT` 和 `web/vite.config.ts` 的 `server.port`，同时更新 `web/src/api/http.ts` 的 `BASE_URL`。

**Q: 想清空数据重新开始？**  
A: `cd mock-server && npm run seed`

**Q: 照片上传到哪里？**  
A: `mock-server/uploads/` 目录，可通过 `http://localhost:3001/uploads/xxx.jpg` 访问。

**Q: 登录信息存在哪？**  
A: 浏览器 LocalStorage。打开 DevTools → Application → Local Storage 可以查看和手动清理。

## 说明

- 所有登录/支付都是 Mock，不会真实发送短信或扣款
- 数据持久化在 `mock-server/db.json`，删掉就重置
- 前端存了 token 和 onboarding 状态在 LocalStorage
