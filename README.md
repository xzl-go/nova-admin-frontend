# nova-admin 前端

本项目为 nova-admin 管理系统的前端部分，基于 React + Ant Design 开发。

## 目录结构

```
frontend/
  ├── src/
  │   ├── pages/
  │   │   ├── Login.jsx         # 登录页面
  │   │   └── InitSystem.jsx    # 系统初始化页面
  │   ├── App.jsx               # 页面切换逻辑
  │   └── index.js              # 应用入口
  ├── package.json
  └── ...
```

## 启动方法

1. 安装依赖
   ```bash
   npm install
   ```
2. 启动开发服务器
   ```bash
   npm start
   ```

## 功能说明
- 登录页面：输入用户名和密码进行登录
- 系统初始化页面：输入超级管理员和数据库信息进行系统初始化

后续可对接 Go Nova 框架后端接口。 