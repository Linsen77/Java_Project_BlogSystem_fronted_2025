import useUserStore from '@/store/user'

let socket = null

export const connectWebSocket = (onNotificationReceived) => {
    const userStore = useUserStore()

    if (!userStore.user) {
        console.error('User is not logged in!')
        return
    }

    // 创建 WebSocket 连接
    socket = new WebSocket(`ws://localhost:8080/notifications/${userStore.user.id}`)

    // 监听 WebSocket 消息
    socket.onmessage = (event) => {
        const notification = JSON.parse(event.data)

        //点赞消息
        if (notification.type === 'article_like_update') {
            onNotificationReceived(notification)
            return
        }
        //评论消息
        if (notification.type === 'article_comment_update') {
            onNotificationReceived(notification)
            return
        }
        //其他通知
        onNotificationReceived(notification)
    }

    // 监听 WebSocket 连接关闭
    socket.onclose = () => {
        console.log('WebSocket connection closed')
    }

    // 监听错误
    socket.onerror = (error) => {
        console.error('WebSocket error:', error)
    }
}

export const closeWebSocket = () => {
    if (socket) {
        socket.close()
    }
}
