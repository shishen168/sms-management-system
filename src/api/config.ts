// API 配置
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
export const API_TIMEOUT = 15000

// API 响应码
export const API_CODE = {
  SUCCESS: 0,
  ERROR: 1,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404
}

// API 错误消息
export const API_MESSAGE = {
  NETWORK_ERROR: '网络错误，请检查网络连接',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在'
}