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

    <el-menu-item index="home">
      <el-icon><HomeFilled /></el-icon>
      <template #title>首页</template>
    </el-menu-item>

    <el-menu-item index="chat">
      <el-icon><ChatDotRound /></el-icon>
      <template #title>AI对话</template>
    </el-menu-item>

    <el-menu-item index="history">
      <el-icon><List /></el-icon>
      <template #title>历史记录</template>
    </el-menu-item>

    <el-sub-menu index="user">
      <template #title>
        <el-icon><User /></el-icon>
        <span>用户中心</span>
      </template>
      <el-menu-item index="profile">个人信息</el-menu-item>
      <el-menu-item index="settings">设置</el-menu-item>
    </el-sub-menu>

    <el-menu-item index="about">
      <el-icon><InfoFilled /></el-icon>
      <template #title>关于</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeFilled,
  ChatDotRound,
  List,
  User,
  InfoFilled,
  Fold,
  Expand
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)
const activeIndex = computed(() => route.name as string)

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

const handleSelect = (key: string) => {
  router.push({ name: key })
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
