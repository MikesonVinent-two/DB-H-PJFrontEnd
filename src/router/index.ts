import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

// 路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true,
      title: '首页',
      roles: ['user', 'admin', 'expert']
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/ChatView.vue'),
    meta: {
      requiresAuth: true,
      title: 'AI对话',
      roles: ['user', 'admin', 'expert']
    }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/HistoryView.vue'),
    meta: {
      requiresAuth: true,
      title: '历史记录',
      roles: ['user', 'admin', 'expert']
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: '个人信息',
      roles: ['user', 'admin', 'expert']
    }
  },
  {
    path: '/user/:id',
    name: 'user-profile',
    component: () => import('../views/UserProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: '用户详情',
      roles: ['user', 'admin', 'expert']
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      title: '设置',
      roles: ['user', 'admin', 'expert']
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      requiresAuth: true,
      title: '关于',
      roles: ['user', 'admin', 'expert']
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      requiresAuth: false,
      title: '登录',
      roles: []
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: {
      requiresAuth: false,
      title: '注册',
      roles: []
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      requiresAuth: false,
      title: '404',
      roles: []
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 调试工具：记录路由变化
const logRouteChange = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const timestamp = new Date().toLocaleTimeString()

  console.group(`🚀 路由变化 - ${timestamp}`)
  console.log('从:', {
    name: from.name,
    path: from.path,
    params: from.params,
    query: from.query,
    meta: from.meta
  })
  console.log('到:', {
    name: to.name,
    path: to.path,
    params: to.params,
    query: to.query,
    meta: to.meta
  })
  console.groupEnd()
}

// 调试工具：记录认证状态
const logAuthStatus = (isAuthenticated: boolean, requiresAuth: boolean, path: string) => {
  console.group('🔐 认证状态检查')
  console.log({
    路径: path,
    是否已登录: isAuthenticated,
    需要认证: requiresAuth,
    用户数据存在: !!localStorage.getItem('user')
  })
  console.groupEnd()
}

// 调试工具：记录页面性能
const logPagePerformance = (to: RouteLocationNormalized) => {
  const timing = window.performance.timing
  const pageLoadTime = timing.loadEventEnd - timing.navigationStart
  const dnsTime = timing.domainLookupEnd - timing.domainLookupStart
  const tcpTime = timing.connectEnd - timing.connectStart
  const renderTime = timing.domComplete - timing.domLoading

  console.group('📊 页面性能指标')
  console.log({
    页面: to.name,
    总加载时间: `${pageLoadTime}ms`,
    DNS解析: `${dnsTime}ms`,
    TCP连接: `${tcpTime}ms`,
    页面渲染: `${renderTime}ms`
  })
  console.groupEnd()
}

// 全局前置守卫
router.beforeEach(async (to, from, next: NavigationGuardNext) => {
  console.group(`🎯 路由导航开始 - ${new Date().toLocaleTimeString()}`)

  // 记录路由变化
  logRouteChange(to, from)

  // 获取认证状态
  const user = localStorage.getItem('user')
  const isAuthenticated = !!user
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // 记录认证状态
  logAuthStatus(isAuthenticated, requiresAuth, to.path)

  // 设置页面标题
  const title = to.meta.title ? `${to.meta.title} - AI问答系统` : 'AI问答系统'
  document.title = title
  console.log('📑 页面标题已更新:', title)

  // 路由守卫逻辑
  if (requiresAuth && !isAuthenticated) {
    console.warn('⚠️ 需要登录，重定向到登录页面')
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (!requiresAuth && isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    console.warn('⚠️ 已登录，重定向到首页')
    next('/')
  } else {
    console.log('✅ 验证通过，允许导航')
    next()
  }

  console.groupEnd()
})

// 全局后置钩子
router.afterEach((to, from) => {
  const navigationTime = window.performance.now()
  console.group(`🏁 路由导航完成 - ${new Date().toLocaleTimeString()}`)
  console.log(`从 ${from.path} 到 ${to.path}`)
  console.log(`导航耗时: ${navigationTime.toFixed(2)}ms`)

  // 记录页面性能指标
  logPagePerformance(to)

  console.groupEnd()
})

// 路由错误处理
router.onError((error) => {
  console.group('❌ 路由错误')
  console.error('错误详情:', error)
  console.trace('错误堆栈')
  console.groupEnd()
})

export default router
