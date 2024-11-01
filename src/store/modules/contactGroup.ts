import { defineStore } from 'pinia'
import { contactGroupApi } from '@/api/contactGroup'
import type { ContactGroup } from '@/types/api'

export const useContactGroupStore = defineStore('contactGroup', {
  state: () => ({
    groups: [] as ContactGroup[],
    currentGroup: null as ContactGroup | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    groupOptions: (state) => 
      state.groups.map(group => ({
        label: `${group.name} (${group.contactCount})`,
        value: group.id
      }))
  },

  actions: {
    async fetchGroups() {
      try {
        this.loading = true
        const response = await contactGroupApi.getGroups()
        this.groups = response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createGroup(data: Partial<ContactGroup>) {
      try {
        this.loading = true
        const response = await contactGroupApi.createGroup(data)
        this.groups.push(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateGroup(id: number, data: Partial<ContactGroup>) {
      try {
        this.loading = true
        const response = await contactGroupApi.updateGroup(id, data)
        const index = this.groups.findIndex(g => g.id === id)
        if (index !== -1) {
          this.groups[index] = response.data
        }
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteGroup(id: number) {
      try {
        this.loading = true
        await contactGroupApi.deleteGroup(id)
        this.groups = this.groups.filter(g => g.id !== id)
        if (this.currentGroup?.id === id) {
          this.currentGroup = null
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addContactsToGroup(groupId: number, contactIds: number[]) {
      try {
        this.loading = true
        await contactGroupApi.addContactsToGroup(groupId, contactIds)
        // 更新分组的联系人数量
        const group = this.groups.find(g => g.id === groupId)
        if (group) {
          group.contactCount += contactIds.length
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeContactsFromGroup(groupId: number, contactIds: number[]) {
      try {
        this.loading = true
        await contactGroupApi.removeContactsFromGroup(groupId, contactIds)
        // 更新分组的联系人数量
        const group = this.groups.find(g => g.id === groupId)
        if (group) {
          group.contactCount -= contactIds.length
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentGroup(group: ContactGroup | null) {
      this.currentGroup = group
    }
  }
})