# 物品收纳管家 (pdd-167)

全栈物品收纳管家应用，支持空间管理、物品记录、搜索、标签和家庭共享。

## 项目结构

```
pdd-167/
├── frontend/     # React 18 + TypeScript + Vite + TailwindCSS
└── backend/      # Node.js + Express + SQLite
```

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

### 后端

```bash
cd backend
npm install
npm run dev
```

后端运行在 http://localhost:3000

## 功能特性

- 用户注册/登录
- 空间管理（柜子、抽屉、箱子）
- 物品添加、编辑、删除
- 物品搜索（按名称或描述）
- 物品标签（季节性、常用、易碎等）
- 过期提醒设置
- 家庭共享（邀请家人）
