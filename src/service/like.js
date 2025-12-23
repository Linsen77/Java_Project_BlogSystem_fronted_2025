import http from './http'

// 获取某篇文章的点赞数
export const getLikeCount = (articleId) => {
    return http.get(`/likes/article/${articleId}/count`)
}

// 点赞（给指定的文章点赞）
export const likeArticle = (articleId, userId) => {
    return http.post(`/likes/article/${articleId}/user/${userId}`)
}

// 取消点赞（给指定的文章取消点赞）
export const unlikeArticle = (articleId, userId) => {
    return http.delete(`/likes/article/${articleId}/user/${userId}`)
}
