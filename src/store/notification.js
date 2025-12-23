import { defineStore } from 'pinia'
import { getNotifications, markAsRead } from '@/service/notification'
import { connectWebSocket, closeWebSocket } from '@/service/notificationSocket'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],   // 正确字段
        unreadCount: 0
    }),

    actions: {
        async fetchNotifications(userId) {
            const res = await getNotifications(userId)
            this.notifications = res.data   // 修复
            this.unreadCount = this.notifications.filter(n => !n.read).length
        },

        markAsRead(id) {
            markAsRead(id)
            const n = this.notifications.find(n => n.id === id)
            if (n) n.read = true
            this.unreadCount = this.notifications.filter(n => !n.read).length
        },

        startSocket() {
            connectWebSocket((newNotification) => {
                this.notifications.unshift(newNotification)  // 修复
                this.unreadCount++
            })
        },

        stopSocket() {
            closeWebSocket()
        }
    }
})
