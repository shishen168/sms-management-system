import api from './index'
import type { Contact, ContactImportResult, ApiResponse } from '../types/api'

export const contactApi = {
  // 获取联系人列表
  getContacts: (params: {
    page: number
    pageSize: number
    search?: string
    groupId?: number
    tags?: string[]
    isStarred?: boolean
  }) =>
    api.get<ApiResponse<{
      contacts: Contact[]
      total: number
    }>>('/contacts', { params }),

  // 创建联系人
  create: (data: Partial<Contact>) =>
    api.post<ApiResponse<Contact>>('/contacts', data),

  // 更新联系人
  update: (id: number, data: Partial<Contact>) =>
    api.put<ApiResponse<Contact>>(`/contacts/${id}`, data),

  // 删除联系人
  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/contacts/${id}`),

  // 批量删除联系人
  batchDelete: (ids: number[]) =>
    api.post<ApiResponse<void>>('/contacts/batch-delete', { ids }),

  // 标星/取消标星
  toggleStar: (id: number) =>
    api.patch<ApiResponse<Contact>>(`/contacts/${id}/star`),

  // 导入联系人
  import: (file: File, options: { groupId?: number; tags?: string[] }) => {
    const formData = new FormData()
    formData.append('file', file)
    if (options.groupId) {
      formData.append('groupId', options.groupId.toString())
    }
    if (options.tags) {
      formData.append('tags', JSON.stringify(options.tags))
    }
    return api.post<ApiResponse<ContactImportResult>>('/contacts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 导出联系人
  export: (params: {
    groupId?: number
    tags?: string[]
    isStarred?: boolean
  }) =>
    api.get('/contacts/export', {
      params,
      responseType: 'blob'
    }),

  // 验证联系人
  validate: (phones: string[]) =>
    api.post<ApiResponse<{
      valid: string[]
      invalid: string[]
    }>>('/contacts/validate', { phones })
}