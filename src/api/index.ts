import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'https://m1.apifoxmock.com/m1/6367019-6063223-default', // Apifox Mock地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      // 请求已发出，服务器返回状态码不在 2xx 范围内
      console.error('请求错误:', error.response.status, error.response.data)

      // 处理401未授权错误
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        // 可以在这里添加重定向到登录页的逻辑
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，未收到响应')
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  },
)

export default api
