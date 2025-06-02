<template>
  <el-menu
    v-if="sidebarVisible"
    :default-active="activeIndex"
    class="sidebar"
    :collapse="isCollapse"
    :collapse-transition="false"
    @select="handleSelect"
  >
    <div class="sidebar-header">
      <el-tooltip
        v-if="isCollapse"
        effect="dark"
        content="展开菜单"
        placement="right"
      >
        <el-button
          class="toggle-button"
          :icon="Expand"
          circle
          @click="toggleCollapse"
        />
      </el-tooltip>
      <el-button
        v-else
        class="toggle-button"
        :icon="Fold"
        circle
        @click="toggleCollapse"
      />
    </div>

    <!-- 基础功能菜单 -->
    <el-menu-item index="home">
      <el-icon><HomeFilled /></el-icon>
      <template #title>首页</template>
    </el-menu-item>

    <el-menu-item index="chat">
      <el-icon><ChatDotRound /></el-icon>
      <template #title>AI对话</template>
    </el-menu-item>

    <!-- 动态生成工作台菜单 -->
    <template v-for="(workspaces, type) in accessibleWorkspacesByType" :key="type">
      <el-sub-menu :index="type">
        <template #title>
          <el-icon>
            <component :is="workspaceTypeIcons[type]" />
          </el-icon>
          <span>{{ workspaceTypeNames[type] }}</span>
        </template>

        <el-menu-item
          v-for="workspace in workspaces"
          :key="workspace.id"
          :index="workspace.id"
        >
          <el-icon>
            <component :is="getIconComponent(workspace.icon)" />
          </el-icon>
          <template #title>{{ workspace.name }}</template>
        </el-menu-item>
      </el-sub-menu>
    </template>

    <!-- 用户中心 -->
    <el-sub-menu index="user">
      <template #title>
        <el-icon><User /></el-icon>
        <span>用户中心</span>
      </template>
      <el-menu-item index="profile">个人信息</el-menu-item>
      <el-menu-item index="settings">设置</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  HomeFilled,
  User,
  Fold,
  Expand,
  Setting,
  Collection,
  EditPen,
  Connection,
  DataAnalysis,
  ChatDotRound,
  Document,
  PriceTag,
  MagicStick,
  List,
  Management,
  StarFilled,
  Files,
  Timer,
  Check,
  ChatLineRound,
  Cpu,
  UserFilled,
  Briefcase,
  PieChart,
  QuestionFilled,
  Monitor
} from '@element-plus/icons-vue'
import { WORKSPACE_TYPES, getAccessibleWorkspaces } from '@/config/workspaceRoles'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 添加一个直接的侧边栏可见性控制
const sidebarVisible = ref(false)

// 添加刷新触发器，用于强制重新计算计算属性
const refreshTrigger = ref(0)

const isCollapse = ref(false)
const activeIndex = computed(() => route.name as string)

// 获取用户角色
const userRole = computed(() => {
  // 利用刷新触发器强制重新计算
  // eslint-disable-next-line no-unused-vars
  const _ = refreshTrigger.value
  return userStore.currentUser?.role || ''
})

// 判断用户是否为评测员
const isEvaluator = computed(() => {
  // 利用刷新触发器强制重新计算
  // eslint-disable-next-line no-unused-vars
  const _ = refreshTrigger.value
  return userStore.currentUser?.isEvaluator || false
})

// 获取用户可访问的工作台
const accessibleWorkspaces = computed(() => {
  // 利用刷新触发器强制重新计算
  // eslint-disable-next-line no-unused-vars
  const _ = refreshTrigger.value
  return getAccessibleWorkspaces(userRole.value, isEvaluator.value)
})

// 按类型分组的可访问工作台
const accessibleWorkspacesByType = computed(() => {
  const result: Record<string, Array<{
    id: string;
    name: string;
    type: string;
    path: string;
    roles: string[];
    description: string;
    icon: string;
  }>> = {}

  accessibleWorkspaces.value.forEach(workspace => {
    if (!result[workspace.type]) {
      result[workspace.type] = []
    }
    result[workspace.type].push(workspace)
  })

  return result
})

// 工作台类型名称映射
const workspaceTypeNames = {
  [WORKSPACE_TYPES.DATA]: '数据管理',
  [WORKSPACE_TYPES.STANDARDIZATION]: '标准化工作台',
  [WORKSPACE_TYPES.PROMPT]: 'Prompt工作台',
  [WORKSPACE_TYPES.EVALUATION]: '评审工作台',
  [WORKSPACE_TYPES.GENERATION]: '生成工作台',
  [WORKSPACE_TYPES.SYSTEM]: '系统管理',
  [WORKSPACE_TYPES.CROWDSOURCE]: '众包工作台',
  [WORKSPACE_TYPES.EXPERT]: '专家工作台',
  [WORKSPACE_TYPES.DATASET]: '数据集工作台',
  [WORKSPACE_TYPES.RUNTIME]: '运行工作台'
}

// 工作台类型图标映射
const workspaceTypeIcons = {
  [WORKSPACE_TYPES.DATA]: Collection,
  [WORKSPACE_TYPES.STANDARDIZATION]: EditPen,
  [WORKSPACE_TYPES.PROMPT]: Document,
  [WORKSPACE_TYPES.EVALUATION]: DataAnalysis,
  [WORKSPACE_TYPES.GENERATION]: MagicStick,
  [WORKSPACE_TYPES.SYSTEM]: Setting,
  [WORKSPACE_TYPES.CROWDSOURCE]: Briefcase,
  [WORKSPACE_TYPES.EXPERT]: UserFilled,
  [WORKSPACE_TYPES.DATASET]: Files,
  [WORKSPACE_TYPES.RUNTIME]: Connection
}

// 定义事件
const emit = defineEmits(['collapse-change'])

// 切换折叠状态并发射事件
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
  emit('collapse-change', isCollapse.value)
}

// 监听折叠状态变化
watch(isCollapse, (newValue) => {
  emit('collapse-change', newValue)
})

// 获取图标组件
const getIconComponent = (iconName: string) => {
  type IconComponent = typeof HomeFilled;

  const iconMap: Record<string, IconComponent> = {
    'HomeFilled': HomeFilled,
    'User': User,
    'Setting': Setting,
    'Collection': Collection,
    'EditPen': EditPen,
    'Connection': Connection,
    'DataAnalysis': DataAnalysis,
    'ChatDotRound': ChatDotRound,
    'Document': Document,
    'PriceTag': PriceTag,
    'MagicStick': MagicStick,
    'List': List,
    'Management': Management,
    'StarFilled': StarFilled,
    'Files': Files,
    'Timer': Timer,
    'Check': Check,
    'ChatLineRound': ChatLineRound,
    'Cpu': Cpu,
    'UserFilled': UserFilled,
    'Briefcase': Briefcase,
    'PieChart': PieChart,
    'QuestionFilled': QuestionFilled,
    'Monitor': Monitor
  }

  return iconMap[iconName] || Document
}

const handleSelect = (key: string) => {
  // 如果是工作台ID，则需要获取对应的路由路径
  const workspace = accessibleWorkspaces.value.find(w => w.id === key)
  if (workspace) {
    router.push(workspace.path)
  } else {
    // 基础页面直接按名称路由
    router.push({ name: key })
  }
}

// 处理用户登录事件
const handleUserLogin = () => {
  console.log('侧边栏组件: 检测到用户登录事件，刷新侧边栏数据')
  // 立即更新侧边栏可见性
  checkAndUpdateVisibility()
  // 强制刷新计算属性
  refreshTrigger.value++
}

// 检查并更新侧边栏可见性
const checkAndUpdateVisibility = () => {
  // 直接检查localStorage中的用户信息
  const storedUser = localStorage.getItem('user')
  const hasValidUser = !!(storedUser && storedUser !== '{}')

  // 直接设置侧边栏可见性
  sidebarVisible.value = hasValidUser
  console.log('侧边栏组件: 更新可见性状态为', sidebarVisible.value)
}

// 处理身份验证状态变化事件
const handleAuthStateChange = () => {
  console.log('侧边栏组件: 检测到身份验证状态变化')
  checkAndUpdateVisibility()
  // 强制刷新计算属性
  refreshTrigger.value++
}

// 处理存储变化事件
const handleStorageChange = (event: StorageEvent) => {
  if (event.key === 'user' || event.key === 'userInfo') {
    console.log('侧边栏组件: 检测到存储事件变化，key =', event.key)
    checkAndUpdateVisibility()
    // 强制刷新计算属性
    refreshTrigger.value++
  }
}

// 组件生命周期
onMounted(() => {
  // 初始化检查侧边栏可见性
  checkAndUpdateVisibility()

  // 添加登录事件监听
  window.addEventListener('user-login', handleUserLogin as EventListener)

  // 添加存储事件监听，当localStorage变化时更新状态
  window.addEventListener('storage', handleStorageChange)

  // 添加身份验证状态变化事件监听
  window.addEventListener('auth-state-change', handleAuthStateChange as EventListener)

  // 立即检查一次状态
  setTimeout(() => {
    checkAndUpdateVisibility()
  }, 100)
})

onUnmounted(() => {
  // 移除登录事件监听
  window.removeEventListener('user-login', handleUserLogin as EventListener)

  // 移除身份验证状态变化事件监听
  window.removeEventListener('auth-state-change', handleAuthStateChange as EventListener)

  // 移除存储事件监听
  window.removeEventListener('storage', handleStorageChange)
})

// 监听userStore中currentUser的变化
watch(
  () => userStore.currentUser,
  (newValue) => {
    console.log('侧边栏组件: 检测到userStore.currentUser变化', newValue?.username)
    checkAndUpdateVisibility()
    refreshTrigger.value++
  },
  { deep: true }
)
</script>

<style scoped>
.sidebar {
  height: calc(100vh - var(--navbar-height));
  position: fixed;
  left: 0;
  top: var(--navbar-height);
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s;
  background-color: #fff;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.sidebar:not(.el-menu--collapse) {
  width: var(--sidebar-width);
}

.sidebar.el-menu--collapse {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.toggle-button {
  margin: 0 auto;
}
</style>
