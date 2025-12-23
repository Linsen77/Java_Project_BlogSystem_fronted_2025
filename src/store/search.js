import { defineStore } from 'pinia'
import { searchArticles } from '@/service/search'

export const useSearchStore = defineStore('search', {
    state: () => ({
        results: []  // 存储搜索结果
    }),
    actions: {
        // 调用 API 进行搜索并更新结果
        async search(query) {
            try {
                const response = await searchArticles(query)
                this.setResults(response)
            } catch (error) {
                console.error('Search error:', error)
            }
        },
        setResults(results) {
            this.results = results
        }
    }
})
