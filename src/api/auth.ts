import api from './index'
import type { LoginRequest, RegisterRequest, User, ApiResponse } from '../types/api'

export const authApi = {
  login: (data: LoginRequest) => 
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data),

  getCaptcha: () =>
    api.get('/auth/captcha', {
      responseType: 'blob',
      headers: {
        'Accept': 'image/jpeg,image/png,image/gif'
      }
    }),

  getCurrentUser: () =>
    api.get<ApiResponse<User>>('/auth/user'),

  logout: () =>
    api.post<ApiResponse<void>>('/auth/logout')
}