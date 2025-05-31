<template>
  <el-menu
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserRole } from '@/api/user'
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
  Magic,
  List,
  Management,
  StarFilled,
  Files,
  Timer,
  Check,
  ChatLineRound,
  CPU,
  UserFilled
} from '@element-plus/icons-vue'
import { WORKSPACE_TYPES, WORKSPACES_BY_TYPE, getAccessibleWorkspaces } from '@/config/workspaceRoles'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)
const activeIndex = computed(() => route.name as string)

// 获取用户角色
const userRole = computed(() => userStore.currentUser?.role || '')

// 判断用户是否为评测员
const isEvaluator = computed(() => userStore.currentUser?.isEvaluator || false)

// 获取用户可访问的工作台
const accessibleWorkspaces = computed(() => {
  return getAccessibleWorkspaces(userRole.value, isEvaluator.value)
})

// 按类型分组的可访问工作台
const accessibleWorkspacesByType = computed(() => {
  const result: Record<string, any[]> = {}

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
  [WORKSPACE_TYPES.EVALUATION]: '评测功能',
  [WORKSPACE_TYPES.GENERATION]: '生成工作台',
  [WORKSPACE_TYPES.SYSTEM]: '系统管理'
}

// 工作台类型图标映射
const workspaceTypeIcons = {
  [WORKSPACE_TYPES.DATA]: Collection,
  [WORKSPACE_TYPES.STANDARDIZATION]: EditPen,
  [WORKSPACE_TYPES.PROMPT]: Document,
  [WORKSPACE_TYPES.EVALUATION]: DataAnalysis,
  [WORKSPACE_TYPES.GENERATION]: Magic,
  [WORKSPACE_TYPES.SYSTEM]: Setting
}

// 判断是否为标注员
const isAnnotator = computed(() => userRole.value === UserRole.ANNOTATOR)

// 判断是否为众包用户
const isCrowdsourceUser = computed(() => userRole.value === UserRole.CROWDSOURCE_USER)

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
  const iconMap: Record<string, any> = {
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
    'Magic': Magic,
    'List': List,
    'Management': Management,
    'StarFilled': StarFilled,
    'Files': Files,
    'Timer': Timer,
    'Check': Check,
    'ChatLineRound': ChatLineRound,
    'CPU': CPU,
    'UserFilled': UserFilled
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
