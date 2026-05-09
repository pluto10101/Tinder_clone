# Tinder Clone Mock Server

极简 Node.js + Express mock 后端，使用本地 `db.json` 存储数据。

## 运行

```bash
npm install
npm run seed    # 生成 60 个 Mock 用户数据（可选）
npm start       # 默认监听 http://localhost:3001
```

开发模式（代码改动自动重启）：

```bash
npm run dev
```

## 目录

```
mock-server/
├── server.js       # Express 主入口，所有路由
├── seed.js         # 生成 Mock 数据
├── db.json         # 数据存储文件（自动生成）
├── uploads/        # 用户上传的照片（自动生成）
└── package.json
```

## 接口

M1 阶段包含：

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/` | 健康检查 |
| POST | `/auth/sms/send` | 返回固定验证码 `123456` |
| POST | `/auth/sms/verify` | 任意 4-6 位数字验证码均通过 |
| POST | `/auth/logout` | 登出 |
| GET | `/profile` | 获取当前用户资料（需 `X-User-Id` header） |
| PUT | `/profile` | 更新资料 |
| POST | `/profile/photos` | 上传照片（multipart/form-data，字段名 `photo`） |
| DELETE | `/profile/photos/:id` | 删除照片 |
| PUT | `/profile/photos/reorder` | 重排照片 |
| GET | `/profile/completeness` | 返回资料完善度百分比 |

## 注意

- 所有写操作都通过 `fs.writeFileSync` 直写 `db.json`，无数据库
- 认证是 Mock 实现，`Authorization` header 不校验，仅通过 `X-User-Id` 识别当前用户
- 上传的图片保存到本地 `uploads/`，通过 `http://localhost:3001/uploads/xxx.jpg` 访问
