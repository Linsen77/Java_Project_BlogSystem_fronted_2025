import http from './http'

// 获取某篇文章的评论
export const getCommentsByArticle = (articleId) => {
    return http.get(`/comments/article/${articleId}`)
}

// 添加评论
export const addComment = (articleId, userId, content) => {
    return http.post(`/comments/article/${articleId}/user/${userId}`, content)
}
