import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_CODE, API_MESSAGE, ApiError } from './api'
import router from '../router'
import { useAuthStore } from '../store/modules/auth'

// 请求拦截器
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// 请求错误拦截器
export const requestErrorInterceptor = (error: AxiosError) => {
  return Promise.reject(new ApiError(
    API_MESSAGE.NETWORK_ERROR,
    API_CODE.SERVER_ERROR
  ))
}

// 响应拦截器
export const responseInterceptor = (response: any) => {
  const { code, message, data } = response.data

  if (code === API_CODE.SUCCESS) {
    return data
  }

  throw new ApiError(message || API_MESSAGE.SERVER_ERROR, code)
}

// 响应错误拦截器
export const responseErrorInterceptor = (error: AxiosError) => {
  const authStore = useAuthStore()

  if (error.response) {
    const { status, data } = error.response
    const message = (data as any)?.message

    switch (status) {
      case API_CODE.UNAUTHORIZED:
        authStore.logout()
        router.push('/login')
        return Promise.reject(new ApiError(
          message || API_MESSAGE.UNAUTHORIZED,
          API_CODE.UNAUTHORIZED
        ))

      case API_CODE.FORBIDDEN:
        return Promise.reject(new ApiError(
          message || API_MESSAGE.FORBIDDEN,
          API_CODE.FORBIDDEN
        ))

      case API_CODE.NOT_FOUND:
        return Promise.reject(new ApiError(
          message || API_MESSAGE.NOT_FOUND,
          API_CODE.NOT_FOUND
        ))

      default:
        return Promise.reject(new ApiError(
          message || API_MESSAGE.SERVER_ERROR,
          status
        ))
    }
  }

  return Promise.reject(new ApiError(
    API_MESSAGE.NETWORK_ERROR,
    API_CODE.SERVER_ERROR
  ))
}