import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import type { LoginRequest, RegisterRequest, User } from '@/types/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async getCaptcha() {
      try {
        const response = await authApi.getCaptcha()
        // 确保响应是 blob 类型
        if (response.data instanceof Blob) {
          return URL.createObjectURL(response.data)
        }
        throw new Error('Invalid captcha response')
      } catch (error: any) {
        this.error = '获取验证码失败'
        throw error
      }
    },

    async register(data: RegisterRequest) {
      try {
        this.loading = true
        const response = await authApi.register(data)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
      } catch (error: any) {
        this.error = error.message || '注册失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(credentials: LoginRequest) {
      try {
        this.loading = true
        const response = await authApi.login(credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
      } catch (error: any) {
        this.error = error.message || '登录失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await authApi.logout()
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
      }
    }
  }
})