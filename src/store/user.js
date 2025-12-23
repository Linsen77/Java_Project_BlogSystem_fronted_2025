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

function safeParseArray(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || []
    } catch {
        return []
    }
}

const useUserStore = defineStore('user', {
    state: () => ({
        user: safeParse('user'),
        token: localStorage.getItem('token') || null,
        isLoggedIn: !!localStorage.getItem('token'),

        following: (() => {
            try {
                return JSON.parse(localStorage.getItem('following')) || []
            } catch {
                return []
            }
        })(),
        bookmarks: (() => {
            try {
                return JSON.parse(localStorage.getItem('bookmarks')) || []
            } catch {
                return []
            }
        })(),

        history: (() => {
            try {
                return JSON.parse(localStorage.getItem('history')) || []
            } catch {
                return []
            }
        })(),

        likedArticles: (() => {
            try {
                return JSON.parse(localStorage.getItem('likedArticles')) || []
            } catch {
                return []
            }
        })(),

    }),

    actions: {
        setUser(user) {
            if (!user || typeof user !== 'object') return
            this.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },

        setToken(token) {
            this.token = token
            this.isLoggedIn = true
            localStorage.setItem('token', token)
        },

        logout() {
            const notificationStore = useNotificationStore()
            notificationStore.stopSocket()

            this.user = null
            this.token = null
            this.isLoggedIn = false
            this.following = []
            this.bookmarks = []
            this.history = []
            this.likedArticles = []

            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('following')
            localStorage.removeItem('bookmarks')
            localStorage.removeItem('history')
            localStorage.removeItem('likedArticles')
        },

        async fetchUserStatistics(userId) {
            if (!userId) {
                console.warn("No userId, skip statistics request")
                return
            }
            const res = await http.get(`/users/${userId}/status`)
            return res.data
        },

        async follow(userId) {
            if (!this.following.includes(userId)) {
                this.following.push(userId)
                localStorage.setItem('following', JSON.stringify(this.following))
                await http.post(`/users/${userId}/follow`)
            }
        },

        async unfollow(userId) {
            this.following = this.following.filter(id => id !== userId)
            localStorage.setItem('following', JSON.stringify(this.following))
            await http.delete(`/users/${userId}/unfollow`)
        },

        isFollowing(userId) {
            return Array.isArray(this.following) && this.following.includes(userId)
        },

        async getFollowingUsers() {
            const res = await http.get(`/users/${this.user.id}/following`)
            return res.data
        },

        async addBookmark(articleId) {
            if (!this.bookmarks.includes(articleId)) {
                this.bookmarks.push(articleId)
                localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks))
                await http.post(`/articles/${articleId}/bookmark`)
            }
        },

        async removeBookmark(articleId) {
            this.bookmarks = this.bookmarks.filter(id => id !== articleId)
            localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks))
            await http.delete(`/articles/${articleId}/bookmark`)
        },

        isBookmarked(articleId) {
            return this.bookmarks.includes(articleId)
        },

        async getBookmarkArticles() {
            const res = await http.get(`/users/${this.user.id}/bookmarks`)
            return res.data
        },

        addHistory(id) {
            if (!this.history.includes(id)) {
                this.history.push(id)
                localStorage.setItem('history', JSON.stringify(this.history))
            }
        },

        getHistoryArticles() {
            return this.history
        },

        async fetchHistoryFromServer(userId) {
            const res = await http.get(`/users/${userId}/history`)
            this.history = res.data
            localStorage.setItem('history', JSON.stringify(this.history))
        },

        isLiked(articleId) {
            return this.likedArticles.includes(articleId)
        },

        addLike(articleId) {
            if (!this.likedArticles.includes(articleId)) {
                this.likedArticles.push(articleId)
                localStorage.setItem('likedArticles', JSON.stringify(this.likedArticles))
            }
        },

        removeLike(articleId) {
            this.likedArticles = this.likedArticles.filter(id => id !== articleId)
            localStorage.setItem('likedArticles', JSON.stringify(this.likedArticles))
        }
    }
})

export default useUserStore
