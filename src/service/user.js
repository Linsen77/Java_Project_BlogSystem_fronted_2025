import http from './http'

// 获取用户个人信息
export const getUserProfile = (userId) => {
    return http.get(`/users/${userId}/profile`)
}

// 获取用户发布的文章
export const getUserArticles = (userId) => {
    return http.get(`/articles/user/${userId}`)
}

// 获取用户关注的用户列表
export const getUserFollowing = (userId) => {
    return http.get(`/users/${userId}/following`)
}

// 获取用户收藏的文章
export const getUserBookmark = (userId) => {
    return http.get(`/users/${userId}/bookmarks`)
}
