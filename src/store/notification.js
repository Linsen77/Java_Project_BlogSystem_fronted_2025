import { defineStore } from 'pinia'
import { getNotifications, markAsRead } from '@/service/notification'
import { connectWebSocket, closeWebSocket } from '@/service/notificationSocket'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],
        unreadCount: 0
    }),

    actions: {
        async fetchNotifications(userId) {
            const res = await getNotifications(userId)
            //测试用
            console.log("getNotifications 返回 =", res)

            //关键修复：兜底，避免 undefined 报错
            this.notifications = Array.isArray(res) ? res.reverse() : []

            //使用 readFlag，而不是 read
            this.unreadCount = this.notifications.filter(n => !n.readFlag).length
        },

        markAsRead(id) {
            markAsRead(id)

            const n = this.notifications.find(n => n.id === id)

            //修复字段名
            if (n) n.readFlag = true

            this.unreadCount = this.notifications.filter(n => !n.readFlag).length
        },

        startSocket() {
            connectWebSocket((newNotification) => {

                //如果通知已经存在（旧通知），不要重复插入
                const exists = this.notifications.some(n => n.id === newNotification.id)
                if (exists) return

                //确保 readFlag 存在
                if (newNotification.readFlag === undefined) {
                    newNotification.readFlag = false
                }

                this.notifications.unshift(newNotification)

                //重新计算 unreadCount
                this.unreadCount = this.notifications.filter(n => !n.readFlag).length
            })
        },

        stopSocket() {
            closeWebSocket()
        }
    }
})
