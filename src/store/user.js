import { defineStore } from 'pinia'
import http from '@/service/http'
import { useNotificationStore } from "@/store/notification.js";

function safeParse(key) {
    const raw = localStorage.getItem(key)
    if (!raw || raw === "undefined" || raw === "null") return null
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

const useUserStore = defineStore('user', {
    state: () => ({
        user: safeParse('user'),   // 登录用户信息
    }),

    getters: {
        isLoggedIn: (state) => !!state.user
    },

    actions: {
        setUser(user) {
            if (!user || typeof user !== 'object') return
            this.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },

        async login(email, password) {
            const res = await http.post('/auth/login', { email, password })
            this.setUser(res.data)   // 保存后端返回的用户对象
            return res.data
        },

        async logout() {
            const notificationStore = useNotificationStore()
            notificationStore.stopSocket()

            // 如果后端有 logout 接口，可以调用：
            // await http.post('/auth/logout')

            this.user = null
            localStorage.removeItem('user')
        },

        async fetchUserStatistics(userId) {
            const res = await http.get(`/users/${userId}/status`)
            return res
        },

        async follow(userId) {
            await http.post(`/follow/${userId}`)
        },

        async unfollow(userId) {
            await http.delete(`/follow/${userId}`)
        },

        async isFollowing(userId) {
            if (!this.user) return false
            try {
                // 调用后端接口，获取当前用户的关注列表
                const res = await http.get(`/follow/list/${this.user.id}`)
                // 判断目标用户是否在关注列表里
                return res.some(u => u.id === userId)
            } catch (e) {
                console.error("检查关注状态失败:", e)
                return false
            }
        },

        async getFollowingUsers(userId) {
            const res = await http.get(`/follow/list/${userId}`)
            return res
        },

        async getBookmarkArticles() {
            const res = await http.get(`/users/${this.user.id}/bookmarks`)
            return res
        },

        async fetchHistoryFromServer(userId) {
            const res = await http.get(`/users/${userId}/history`)
            return res
        }
    }
})

export default useUserStore
