# 数据集评测系统

这是一个用于大模型回答评测的前端系统，支持多种用户角色和工作流程。系统采用现代化的Vue 3技术栈构建，提供直观的用户界面和丰富的功能模块。

## 🌟 功能特点

- 🔐 多角色权限管理系统
- 📊 实时数据监控和可视化
- 💬 集成聊天界面和WebSocket支持
- 🔧 灵活的Prompt配置和管理
- 📈 完整的评测流程管理
- 🌐 响应式设计，支持多设备访问

## 👥 系统用户角色

系统支持以下用户角色，每个角色拥有不同的权限和功能：

1. **ADMIN** (管理员) - 拥有系统的最高权限，可以进行系统管理操作：
   - 设定评测员
   - 创建数据集版本
   - 更新数据集版本
   - 创建批次运行
   - 执行批次运行
   - 执行评测
   - 执行最后的算分
   - 以及能实现其他所有成员的功能

2. **CURATOR** (策展人) - 负责内容管理和策展工作：
   - 录入原始问题
   - 录入原始回答

3. **EXPERT** (专家) - 具有专业知识的用户：
   - 查看标准问题
   - 提供专家回答

4. **ANNOTATOR** (标注员) - 负责数据标注工作：
   - 编写回答prompt和评测prompt
   - 配置组装config
   - 编写回答题型prompt与评测主观题prompt
   - 标准化问题
   - 提供标准回答

5. **REFEREE** (审核员) - 负责内容审核工作：
   - 审核众包回答
   - 给专家回答评分

6. **CROWDSOURCE_USER** (众包用户) - 普通用户：
   - 查看标准问题
   - 参与众包任务

此外，还有一个特殊身份 **评测员**，由管理员设定，可以评测批次回答得到的大模型回答。

## 📱 系统页面结构

系统的页面结构按照用户角色划分：

### 管理员页面
- 管理员控制台
- 用户管理
- 评测员管理
- 数据集管理
- 批次运行管理
- 评测管理
- 算分管理

### 策展人页面
- 策展概览
- 原始问题管理
- 原始回答管理

### 专家页面
- 专家概览
- 标准问题
- 专家回答

### 标注员页面
- 标注概览
- Prompt管理
- 配置管理
- 问题标准化
- 标准回答

### 审核员页面
- 审核概览
- 众包回答审核
- 专家回答评分

### 众包用户页面
- 众包概览
- 标准问题
- 众包任务

### 评测员页面
- 评测概览
- 批次评测

### 通用页面
- 首页
- 个人信息
- 设置
- 登录/注册
- 聊天界面

## 🛠 技术栈

- **前端框架**: Vue 3 (Composition API)
- **UI组件库**: Element Plus
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **构建工具**: Vite 6
- **开发语言**: TypeScript
- **HTTP客户端**: Axios
- **实时通信**: WebSocket, STOMP.js, Socket.IO
- **数据可视化**: ECharts
- **代码规范**: ESLint + Prettier + oxlint
- **测试框架**: Vitest (单元测试) + Playwright (E2E测试)
- **其他依赖**:
  - marked (Markdown渲染)
  - highlight.js (代码高亮)
  - dompurify (XSS防护)
  - papaparse (CSV解析)

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量示例文件：
```bash
cp src/env.example .env.development
```

2. 编辑 `.env.development` 文件，配置相应的环境变量：
```env
# 应用标题
VITE_APP_TITLE=数据集评测系统

# 应用环境
VITE_APP_ENV=development

# API配置
VITE_APP_API_BASE_URL=http://localhost:8080
VITE_APP_API_TIMEOUT=10000

# LLM配置
VITE_APP_LLM_CHAT_TIMEOUT=600000
```

### 开发环境运行

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 生产环境构建

```bash
npm run build
```

构建后的文件在 `dist` 目录下。

### 预览构建结果

```bash
npm run preview
```

## 📂 项目结构

```
src/
├── api/                    # API接口定义
│   ├── user.ts            # 用户相关接口
│   ├── dataset.ts         # 数据集接口
│   ├── evaluations.ts     # 评测接口
│   ├── llm.ts            # LLM相关接口
│   └── index.ts          # API统一导出
├── assets/                # 静态资源
├── components/            # 公共组件
│   ├── TheNavbar.vue     # 导航栏组件
│   ├── TheSidebar.vue    # 侧边栏组件
│   ├── ChatInterface.vue # 聊天界面组件
│   ├── LoginForm.vue     # 登录表单
│   └── icons/            # 图标组件
├── config/               # 配置文件
│   ├── index.ts         # 主配置文件
│   └── workspaceRoles.ts # 工作区角色配置
├── router/              # 路由配置
├── services/            # 业务服务层
├── stores/              # Pinia状态管理
├── types/               # TypeScript类型定义
├── utils/               # 工具函数
├── views/               # 页面视图
│   ├── admin/           # 管理员页面
│   ├── annotator/       # 标注员页面
│   ├── crowdsource/     # 众包用户页面
│   ├── curator/         # 策展人页面
│   ├── evaluator/       # 评测员页面
│   ├── expert/          # 专家页面
│   ├── referee/         # 审核员页面
│   ├── HomeView.vue     # 首页
│   ├── LoginView.vue    # 登录页
│   └── ChatView.vue     # 聊天页面
├── examples/            # 示例代码
├── App.vue              # 应用入口
├── main.ts              # 主入口文件
└── env.example          # 环境变量示例
```

## 🧪 测试

### 运行单元测试

```bash
npm run test:unit
```

### 运行端到端测试

```bash
# 首次运行需要安装浏览器
npx playwright install

# 运行所有E2E测试
npm run test:e2e

# 运行特定浏览器的测试
npm run test:e2e -- --project=chromium

# 运行特定测试文件
npm run test:e2e -- tests/example.spec.ts

# 调试模式运行测试
npm run test:e2e -- --debug
```

## 🔧 开发工具

### 代码规范

项目使用ESLint、Prettier和oxlint来保证代码质量：

```bash
# 运行所有代码检查
npm run lint

# 只运行ESLint
npm run lint:eslint

# 只运行oxlint
npm run lint:oxlint

# 格式化代码
npm run format
```

### 类型检查

```bash
npm run type-check
```

## 🌍 部署

### 生产环境配置

1. 创建生产环境配置文件 `.env.production`：
```env
VITE_APP_TITLE=数据集评测系统
VITE_APP_ENV=production
VITE_APP_API_BASE_URL=https://your-api-domain.com
VITE_APP_API_TIMEOUT=10000
VITE_APP_LLM_CHAT_TIMEOUT=600000
```

2. 构建生产版本：
```bash
npm run build
```

3. 部署 `dist` 目录到你的Web服务器。

### Docker部署

```dockerfile
# Dockerfile示例
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔐 环境变量说明

详细的环境变量配置说明请参考 [环境变量配置说明.md](./环境变量配置说明.md)。

主要环境变量：

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `VITE_APP_TITLE` | 应用标题 | 数据集评测系统 |
| `VITE_APP_ENV` | 应用环境 | development |
| `VITE_APP_API_BASE_URL` | API基础URL | http://localhost:8080 |
| `VITE_APP_API_TIMEOUT` | API超时时间(ms) | 10000 |
| `VITE_APP_LLM_CHAT_TIMEOUT` | LLM聊天超时时间(ms) | 600000 |

## 🐛 问题排查

### 常见问题

1. **端口占用**: 如果5173端口被占用，Vite会自动选择下一个可用端口
2. **依赖安装失败**: 尝试清除npm缓存 `npm cache clean --force`
3. **构建失败**: 检查TypeScript类型错误 `npm run type-check`
4. **API连接失败**: 确认后端服务是否正常运行，检查环境变量配置

### 开发模式调试

在浏览器开发者工具中，你可以看到：
- Vue DevTools 插件支持
- 详细的错误信息和警告
- 网络请求日志
- WebSocket连接状态

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

### 代码规范

- 遵循项目的ESLint配置
- 编写有意义的提交信息
- 为新功能添加相应的测试
- 更新相关文档

## 📄 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](LICENSE) 文件。

## 📞 联系方式

如果你有任何问题或建议，欢迎通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

## 🔗 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Vite 文档](https://vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)

---

**注意**: 这是一个积极开发中的项目，功能和API可能会发生变化。建议在生产环境使用前进行充分测试。
