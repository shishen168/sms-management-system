import { defineStore } from 'pinia'
import { contactApi } from '@/api/contact'
import type { Contact } from '@/types/api'

export const useContactStore = defineStore('contact', {
  state: () => ({
    contacts: [] as Contact[],
    total: 0,
    currentPage: 1,
    pageSize: 20,
    loading: false,
    error: null as string | null,
    selectedContacts: [] as number[],
    searchQuery: '',
    selectedTags: [] as string[],
    selectedGroupId: null as number | null,
    showStarredOnly: false
  }),

  getters: {
    hasSelected: (state) => state.selectedContacts.length > 0,
    allTags: (state) => {
      const tags = new Set<string>()
      state.contacts.forEach(contact => {
        contact.tags?.forEach(tag => tags.add(tag))
      })
      return Array.from(tags)
    }
  },

  actions: {
    async fetchContacts() {
      try {
        this.loading = true
        const response = await contactApi.getContacts({
          page: this.currentPage,
          pageSize: this.pageSize,
          search: this.searchQuery,
          groupId: this.selectedGroupId || undefined,
          tags: this.selectedTags.length > 0 ? this.selectedTags : undefined,
          isStarred: this.showStarredOnly
        })
        this.contacts = response.data.contacts
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createContact(data: Partial<Contact>) {
      try {
        this.loading = true
        const response = await contactApi.create(data)
        await this.fetchContacts()
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateContact(id: number, data: Partial<Contact>) {
      try {
        this.loading = true
        const response = await contactApi.update(id, data)
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contacts[index] = response.data
        }
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteContact(id: number) {
      try {
        this.loading = true
        await contactApi.delete(id)
        this.contacts = this.contacts.filter(c => c.id !== id)
        this.selectedContacts = this.selectedContacts.filter(cid => cid !== id)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async batchDelete() {
      try {
        this.loading = true
        await contactApi.batchDelete(this.selectedContacts)
        await this.fetchContacts()
        this.selectedContacts = []
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleStar(id: number) {
      try {
        const response = await contactApi.toggleStar(id)
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contacts[index] = response.data
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async importContacts(file: File, options: { groupId?: number; tags?: string[] }) {
      try {
        this.loading = true
        const response = await contactApi.import(file, options)
        await this.fetchContacts()
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async exportContacts() {
      try {
        this.loading = true
        const response = await contactApi.export({
          groupId: this.selectedGroupId || undefined,
          tags: this.selectedTags.length > 0 ? this.selectedTags : undefined,
          isStarred: this.showStarredOnly
        })
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'contacts.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
      this.currentPage = 1
    },

    setSelectedGroupId(groupId: number | null) {
      this.selectedGroupId = groupId
      this.currentPage = 1
    },

    toggleTag(tag: string) {
      const index = this.selectedTags.indexOf(tag)
      if (index === -1) {
        this.selectedTags.push(tag)
      } else {
        this.selectedTags.splice(index, 1)
      }
      this.currentPage = 1
    },

    toggleStarredOnly() {
      this.showStarredOnly = !this.showStarredOnly
      this.currentPage = 1
    },

    selectContact(id: number) {
      const index = this.selectedContacts.indexOf(id)
      if (index === -1) {
        this.selectedContacts.push(id)
      } else {
        this.selectedContacts.splice(index, 1)
      }
    },

    selectAll() {
      if (this.selectedContacts.length === this.contacts.length) {
        this.selectedContacts = []
      } else {
        this.selectedContacts = this.contacts.map(c => c.id)
      }
    }
  }
})