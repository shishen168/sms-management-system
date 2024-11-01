import { read, utils } from 'xlsx'
import { contactImportSchema } from './validation'
import type { Contact } from '../types/api'

export class ImportParser {
  static async parseFile(file: File): Promise<{
    valid: Partial<Contact>[]
    invalid: Array<{ row: number; errors: string[] }>
  }> {
    const buffer = await file.arrayBuffer()
    const workbook = read(buffer)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = utils.sheet_to_json(worksheet)

    const valid: Partial<Contact>[] = []
    const invalid: Array<{ row: number; errors: string[] }> = []

    rows.forEach((row: any, index: number) => {
      try {
        const contact = contactImportSchema.parse({
          name: row['姓名'] || row['name'],
          phone: row['电话'] || row['phone'],
          email: row['邮箱'] || row['email'],
          note: row['备注'] || row['note']
        })
        valid.push(contact)
      } catch (error: any) {
        invalid.push({
          row: index + 2, // 加2是因为Excel从1开始计数，还要算上表头行
          errors: error.errors.map((e: any) => e.message)
        })
      }
    })

    return { valid, invalid }
  }

  static validatePhones(phones: string[]): Promise<{
    valid: string[]
    invalid: string[]
  }> {
    const valid: string[] = []
    const invalid: string[] = []

    phones.forEach(phone => {
      if (/^1[3-9]\d{9}$/.test(phone)) {
        valid.push(phone)
      } else {
        invalid.push(phone)
      }
    })

    return Promise.resolve({ valid, invalid })
  }
}