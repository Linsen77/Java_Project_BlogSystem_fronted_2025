import http from './http'

// 获取用户的所有通知
export const getNotifications = (userId) => {
    return http.get(`/notifications/${userId}`)
}

// 标记通知为已读
export const markAsRead = (notificationId) => {
    return http.put(`/notifications/${notificationId}/read`)
}
