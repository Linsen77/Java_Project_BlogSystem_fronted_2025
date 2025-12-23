import http from './http'

// 搜索文章
export const searchArticles = (query) => {
    return http.get(`/articles/search`, {
        params: { query }  // 查询参数，发送到后端
    })
}
