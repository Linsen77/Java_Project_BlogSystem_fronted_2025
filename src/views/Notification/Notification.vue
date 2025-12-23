<template>
  <VContainer class="py-8">
    <!-- 顶部标题区 -->
    <VCard class="mb-8 pa-6" elevation="0" color="primary" variant="tonal">
      <h1 class="text-h4 font-weight-medium mb-2">通知中心</h1>
      <p class="text-body-1 text-secondary">查看最新的系统通知与消息提醒。</p>
    </VCard>

    <!-- 通知列表 -->
    <NotificationList />
  </VContainer>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/store/notification'
import useUserStore from '@/store/user'
import NotificationList from '@/components/notification/NotificationList.vue'

const notificationStore = useNotificationStore()
const userStore = useUserStore()

onMounted(() => {
  notificationStore.fetchNotifications(userStore.user.id)
  notificationStore.startSocket()
})

onUnmounted(() => {
  notificationStore.stopSocket()
})
</script>

<style scoped>
.v-card {
  background-color: var(--card-background);
}

.v-list-item {
  transition: background-color 0.2s;
}

.v-list-item:hover {
  background-color: var(--button-hover);
}
</style>
