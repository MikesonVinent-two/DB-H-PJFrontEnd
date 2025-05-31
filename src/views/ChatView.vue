<template>
  <div class="chat-view">
    <div class="chat-container">
      <chat-interface />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatInterface from '@/components/ChatInterface.vue'
</script>

<style scoped>
.chat-view {
  padding: 20px;
  background-color: var(--background-color);
  height: 100%;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.chat-container {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .chat-container {
    margin-left: 0;
  }
}
</style>
