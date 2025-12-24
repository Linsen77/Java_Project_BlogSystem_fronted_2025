import { defineStore } from 'pinia'
import http from '@/service/http'

export const useArticleStore = defineStore('article', {
    state: () => ({
        comments: {},   // { articleId: [commentList] }
        likes: {},       // { articleId: likeCount }
        userLikeStatus: {},
        recommended: [],
        bookmarks: {}   // { articleId: true/false }
    }),

    actions: {

        //通过articleId获取文章
        async getArticleById(articleId) {
            try {
                const res = await http.get(`/articles/${articleId}`)
                return res
            } catch (e) {
                console.error("获取文章详情失败", e)
                return null
            }
        },

        //获取评论
        async fetchComments(articleId) {
            const res = await http.get(`/articles/${articleId}/comments`)
            this.comments[articleId] = res
        },

        //发布评论
        async addComment(articleId, content) {
            const res = await http.post(`/articles/${articleId}/comments`, { content })
            if (!this.comments[articleId]) {
                this.comments[articleId] = []
            }
            this.comments[articleId].push(res)

        },

        // 获取用户是否点赞
        async fetchUserLikeStatus(articleId, userId) {
            const res = await http.get(`/articles/${articleId}/likes`, { params: { userId } })
            this.userLikeStatus[articleId] = res === true
        },

        //获取点赞数
        async fetchLikes(articleId, userId) {
            if(!userId) return
            try{
                const res = await http.get(`/articles/${articleId}/likes/count`, { params: { userId } })
                this.likes[articleId] = res
            }catch (e) {
                console.error("获取点赞数失败",e);
            }

        },

        //点赞
        async like(articleId) {
            await http.post(`/articles/${articleId}/like`)
            this.likes[articleId]++
            this.userLikeStatus[articleId] = true
        },

        //取消点赞
        async unlike(articleId) {
            await http.delete(`/articles/${articleId}/like`)
            this.likes[articleId]--
            this.userLikeStatus[articleId] = false
        },

        //Websocket点赞更新
        applyLikeUpdate(articleId, newCount) {
            this.likes[articleId] = newCount
        },

        //Websocket评论更新
        applyCommentUpdate(articleId, comment) {
            if (!this.comments[articleId]) {
                this.comments[articleId] = []
            }
            this.comments[articleId].push(comment)
        },

        // 删除文章
        async deleteArticle(articleId) {
            // 调用后端接口删除文章
            await http.delete(`/articles/${articleId}`)

            // 删除本地缓存的评论和点赞（避免页面不刷新）
            delete this.comments[articleId]
            delete this.likes[articleId]
        },

        // 删除评论
        async deleteComment(articleId, commentId) {
            await http.delete(`/articles/${articleId}/comments/${commentId}`)

            // 从本地移除
            this.comments[articleId] = this.comments[articleId].filter(
                c => c.id !== commentId
            )
        },

        //获取推荐文章
        async fetchRecommended(userId) {
            const res = await http.get(`/articles/recommend/${userId}`)
            this.recommended = res
        },

        async fetchBookmarkStatus(articleId, userId) {
            const res = await http.get(`/articles/${articleId}/bookmark/status`, { params: { userId } })
            this.bookmarks[articleId] = res === true
        },

        async addBookmark(articleId) {
            await http.post(`/articles/${articleId}/bookmark`)
            this.bookmarks[articleId] = true
        },

        async removeBookmark(articleId) {
            await http.delete(`/articles/${articleId}/bookmark`)
            this.bookmarks[articleId] = false
        }


    }
})
