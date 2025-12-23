<template>
  <VContainer class="py-8">
    <!-- 顶部标题区 -->
    <VCard class="mb-8 pa-6" elevation="0" color="primary" variant="tonal">
      <VRow align="center">
        <VCol cols="12" md="8">
          <h1 class="text-h4 font-weight-medium mb-2">通知详情</h1>
          <p class="text-body-1 text-secondary">
            查看通知的完整内容。
          </p>
        </VCol>
        <VCol cols="12" md="4" class="d-flex justify-end">
          <!-- 返回按钮 -->
          <VBtn color="secondary" variant="tonal" @click="goBack">
            <v-icon left>mdi-arrow-left</v-icon>
            返回通知列表
          </VBtn>
        </VCol>
      </VRow>
    </VCard>

    <!-- 通知详情内容 -->
    <VCard class="pa-6" elevation="1">
      <h2 class="text-h6 mb-4">{{ notification?.title }}</h2>
      <p class="text-body-2 mb-4">{{ notification?.message }}</p>
      <p class="text-caption text-secondary">时间：{{ notification?.timestamp }}</p>
    </VCard>
  </VContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotificationStore } from '@/store/notification'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()
const notification = ref(null)

onMounted(async () => {
  const id = route.params.id
  // 从 store 中查找对应通知
  notification.value = notificationStore.notifications.find(n => n.id == id)

  // 如果没有找到，可以考虑调用接口单独获取
  if (!notification.value) {
    console.warn('未找到通知，可能需要调用后端接口获取单条通知')
  } else {
    // 自动标记为已读
    await notificationStore.markAsRead(id)
  }
})

// 返回通知列表
const goBack = () => {
  router.push({ name: 'notifications' })
}
</script>

<style scoped>
.v-card {
  background-color: var(--card-background);
}
</style>
