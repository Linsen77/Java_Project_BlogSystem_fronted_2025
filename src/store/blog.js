import {defineStore} from "pinia";
import http from '@/service/http'

export const useBlogStore = defineStore('blog', {
    state: () => ({
        articles: [],
        categories: [],
        recommended: [],
        hotArticles: []
    }),

    actions: {
        async fetchArticles() {
            const res = await http.get('/articles')
            this.articles = res.data
        },

        async fetchArticlesByTag(tagName) {
            this.articles = await http.get('/articles/search/byTag', {
                params: {tag: tagName}
            })
        },

        async fetchHotArticles() {
            const res = await http.get('/articles/hot')
            this.hotArticles = res.data
        },

        //后端搜索接口
        async searchArticles(query) {
            const res = await http.get('/articles/search', {
                params: { q: query }
            })
            this.articles = res.data
        },

        //基于用户历史推荐文章
        async fetchRecommended(userId) {
            const res = await http.get(`/articles/recommend/${userId}`)
            this.recommended = res.data
        }
    }
})
