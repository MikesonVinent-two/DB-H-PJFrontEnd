# 数据集评测系统

这是一个用于大模型回答评测的前端系统，支持多种用户角色和工作流程。

## 系统用户角色

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

## 系统页面结构

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

## 技术栈

- 前端框架: Vue 3
- UI组件库: Element Plus
- 路由: Vue Router
- 状态管理: Pinia
- 构建工具: Vite
- 语言: TypeScript

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm run test
```

## 项目结构

```
src/
├── api/         # API接口
├── assets/      # 静态资源
├── components/  # 公共组件
├── config/      # 配置文件
├── router/      # 路由配置
├── stores/      # 状态管理
├── types/       # 类型定义
├── views/       # 页面视图
│   ├── admin/           # 管理员页面
│   ├── annotator/       # 标注员页面
│   ├── crowdsource/     # 众包用户页面
│   ├── curator/         # 策展人页面
│   ├── evaluator/       # 评测员页面
│   ├── expert/          # 专家页面
│   └── referee/         # 审核员页面
├── App.vue      # 应用入口
└── main.ts      # 主入口文件
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
