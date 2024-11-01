import axios from 'axios'
import { AppDataSource } from '../config/database'
import { SmsRecord } from '../entities/SmsRecord'
import { User } from '../entities/User'

const SMS_API_URL = 'https://api.textinghouse.com/param'
const SMS_API_KEY = process.env.SMS_API_KEY

interface SendSmsResponse {
  code: number;
  message: string;
  messageId?: string;
}

export class SmsService {
  static async sendSingle(userId: number, phone: string, content: string): Promise<string> {
    try {
      // 调用短信API
      const response = await axios.post<SendSmsResponse>(SMS_API_URL, {
        apiKey: SMS_API_KEY,
        phone,
        content
      })

      if (response.data.code !== 0) {
        throw new Error(response.data.message)
      }

      // 记录发送记录
      const smsRepository = AppDataSource.getRepository(SmsRecord)
      const userRepository = AppDataSource.getRepository(User)
      
      const user = await userRepository.findOneBy({ id: userId })
      if (!user) {
        throw new Error('用户不存在')
      }

      const record = smsRepository.create({
        user,
        phone,
        content,
        messageId: response.data.messageId,
        status: 'success'
      })

      await smsRepository.save(record)
      return response.data.messageId!
    } catch (error: any) {
      // 记录失败记录
      const smsRepository = AppDataSource.getRepository(SmsRecord)
      const userRepository = AppDataSource.getRepository(User)
      
      const user = await userRepository.findOneBy({ id: userId })
      if (user) {
        const record = smsRepository.create({
          user,
          phone,
          content,
          status: 'failed',
          error: error.message
        })
        await smsRepository.save(record)
      }

      throw error
    }
  }

  static async sendBatch(userId: number, phones: string[], content: string): Promise<string[]> {
    if (phones.length > 100) {
      throw new Error('单次最多发送100条短信')
    }

    const messageIds: string[] = []
    const failedPhones: string[] = []

    // 并发发送，但限制并发数
    const chunks = this.chunkArray(phones, 10)
    for (const chunk of chunks) {
      const promises = chunk.map(phone => 
        this.sendSingle(userId, phone, content)
          .then(messageId => messageIds.push(messageId))
          .catch(() => failedPhones.push(phone))
      )
      await Promise.all(promises)
    }

    if (failedPhones.length > 0) {
      throw new Error(`部分号码发送失败: ${failedPhones.join(', ')}`)
    }

    return messageIds
  }

  private static chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
}