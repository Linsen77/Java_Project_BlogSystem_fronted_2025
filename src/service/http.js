import axios from 'axios'

// 创建 Axios 实例
const http = axios.create({
    baseURL: 'http://localhost:8080/api', // 后端接口路径
    timeout: 5000, // 请求超时时间
    withCredentials: true
})

// 请求拦截器：添加 token（如果存在）
http.interceptors.request.use(config => {
    console.log("即将发送请求：", config.method, config.url)

    return config
})


// 响应拦截器：处理错误和返回数据
http.interceptors.response.use(
    response => response.data,  // 返回接口数据
    error => {
        console.error('API Error:', error)  // 错误处理
        return Promise.reject(error)  // 返回错误
    }
)

export default http
