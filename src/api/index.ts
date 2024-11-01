import axios from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    // 如果是 blob 类型的响应,直接返回
    if (response.config.responseType === 'blob') {
      return response
    }
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || '服务器错误，请稍后重试'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default api