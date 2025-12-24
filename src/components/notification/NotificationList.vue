<template>
  <v-list>
    <v-list-item
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        @click="notificationStore.markAsRead(notification.id)"
        :class="{ read: notification.readFlag }"
    >
      <v-list-item-content>
        <v-list-item-title>{{ notification.content }}</v-list-item-title>
        <v-list-item-subtitle>{{ notification.createtime }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="notificationStore.notifications.length === 0">
      <v-list-item-content>
        <v-list-item-title>No new notifications</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { useNotificationStore } from '@/store/notification'
const notificationStore = useNotificationStore()
</script>

<style scoped>
.v-list-item {
  padding: 10px;
}

.v-list-item:hover {
  background-color: var(--accent-color);
}

.v-list-item-title {
  font-weight: bold;
}

.v-list-item-subtitle {
  font-size: 0.9rem;
}

/* 已读通知变淡 */
.read {
  opacity: 0.5;
}
</style>
