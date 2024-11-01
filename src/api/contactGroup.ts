import api from './index'
import type { ContactGroup, ApiResponse } from '../types/api'

export const contactGroupApi = {
  // 获取分组列表
  getGroups: () =>
    api.get<ApiResponse<ContactGroup[]>>('/contact-groups'),

  // 创建分组
  createGroup: (data: Partial<ContactGroup>) =>
    api.post<ApiResponse<ContactGroup>>('/contact-groups', data),

  // 更新分组
  updateGroup: (id: number, data: Partial<ContactGroup>) =>
    api.put<ApiResponse<ContactGroup>>(`/contact-groups/${id}`, data),

  // 删除分组
  deleteGroup: (id: number) =>
    api.delete<ApiResponse<void>>(`/contact-groups/${id}`),

  // 添加联系人到分组
  addContactsToGroup: (groupId: number, contactIds: number[]) =>
    api.post<ApiResponse<void>>(`/contact-groups/${groupId}/contacts`, { contactIds }),

  // 从分组移除联系人
  removeContactsFromGroup: (groupId: number, contactIds: number[]) =>
    api.delete<ApiResponse<void>>(`/contact-groups/${groupId}/contacts`, {
      data: { contactIds }
    }),

  // 获取分组内的联系人
  getGroupContacts: (groupId: number, page: number = 1) =>
    api.get<ApiResponse<{
      contacts: Array<{
        id: number;
        name: string;
        phone: string;
        email?: string;
      }>;
      total: number;
    }>>(`/contact-groups/${groupId}/contacts`, { params: { page } })
}