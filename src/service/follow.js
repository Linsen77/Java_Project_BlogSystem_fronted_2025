import http from './http'

// 获取当前用户的关注列表
export const getFollowingList = (userId) => {
    return http.get(`/follows/user/${userId}`)
}

// 关注用户
export const followUser = (userId, followedId) => {
    return http.post(`/follows/follow/${userId}/${followedId}`)
}

// 取消关注
export const unfollowUser = (userId, followedId) => {
    return http.delete(`/follows/unfollow/${userId}/${followedId}`)
}
