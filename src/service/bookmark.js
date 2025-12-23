import http from './http'

// 获取当前用户的收藏列表
export const getBookmarkArticles = (userId) => {
    return http.get(`/bookmarks/user/${userId}`)
}

// 收藏文章
export const bookmarkArticle = (userId, articleId) => {
    return http.post(`/bookmarks/article/${articleId}/user/${userId}`)
}

// 取消收藏
export const unbookmarkArticle = (userId, articleId) => {
    return http.delete(`/bookmarks/article/${articleId}/user/${userId}`)
}
