import { defineStore } from 'pinia'
import http from '@/service/http'

export const useArticleStore = defineStore('article', {
    state: () => ({
        comments: {},   // { articleId: [commentList] }
        likes: {},       // { articleId: likeCount }
        recommended: []
    }),

    actions: {
        //获取评论
        async fetchComments(articleId) {
            const res = await http.get(`/articles/${articleId}/comments`)
            this.comments[articleId] = res.data
        },

        //发布评论
        async addComment(articleId, content) {
            const res = await http.post(`/articles/${articleId}/comments`, { content })
            this.comments[articleId].push(res.data)
        },

        // 获取用户是否点赞
        async fetchUserLikeStatus(articleId) {
            const res = await http.get(`/articles/${articleId}/isLiked`)
            return res.data.isLiked
        },

        //获取点赞数
        async fetchLikes(articleId) {
            try{
                const res = await http.get(`/articles/${articleId}/likes`)
                this.likes[articleId] = res.data.count
            }catch (e) {
                console.error("获取点赞状态失败",e);
            }

        },

        //点赞
        async like(articleId) {
            await http.post(`/articles/${articleId}/like`)
            this.likes[articleId]++
        },

        //取消点赞
        async unlike(articleId) {
            await http.delete(`/articles/${articleId}/like`)
            this.likes[articleId]--
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
            this.recommended = res.data
        }


    }
})
