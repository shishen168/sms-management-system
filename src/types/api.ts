// API Response interface
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// User interfaces
export interface User {
  id: number
  username: string
  email: string
  phone: string
  balance: number
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  phone: string
  captcha: string
}

// SMS interfaces
export interface SmsRequest {
  phone: string
  countryCode: string
  content: string
  type: 'single' | 'batch'
}

export interface SmsBatchRequest {
  phones: string[]
  content: string
}

export interface SmsRecord {
  id: number
  phone: string
  content: string
  status: 'pending' | 'sent' | 'failed'
  error?: string
  messageId?: string
  createdAt: string
}

export interface SmsTemplate {
  id: number
  name: string
  content: string
  type: 'verification' | 'notification' | 'marketing'
  variables?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: number
}

// Contact interfaces
export interface Contact {
  id: number
  name: string
  phone: string
  email?: string
  note?: string
  isStarred: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ContactGroup {
  id: number
  name: string
  description?: string
  contactCount: number
  createdAt: string
  updatedAt: string
}

export interface ContactImportResult {
  imported: number
  failed: number
  errors?: string[]
}

// Country interface
export interface Country {
  code: string
  name: string
  dialCode: string
}