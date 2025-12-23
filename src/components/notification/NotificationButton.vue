<template>
  <v-btn text @click="goToNotifications">
    <v-icon>mdi-bell</v-icon>
    <v-badge
        v-if="notificationStore.unreadCount > 0"
        color="red"
        dot
        overlap
    />
  </v-btn>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/store/notification'

const router = useRouter()
const notificationStore = useNotificationStore()

const goToNotifications = () => {
  router.push({ name: 'notifications' })
}
</script>

<style scoped>
.v-row {
  margin-bottom: 20px; /* 设置行之间的间距 */
}

.v-btn {
  background-color: var(--primary-color); /* 使用莫兰迪风格的按钮颜色 */
  color: white;
}

.v-btn:hover {
  background-color: var(--button-hover); /* 悬浮时按钮颜色变化 */
}

.v-alert {
  margin-top: 20px; /* 提示信息上边距 */
  font-size: 1.2rem; /* 提示字体大小 */
}
</style>
