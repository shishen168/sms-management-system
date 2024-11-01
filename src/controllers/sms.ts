import { Request, Response } from 'express'
import { SmsService } from '../services/sms'
import { AppDataSource } from '../config/database'
import { SmsRecord } from '../entities/SmsRecord'

export const smsController = {
  async sendSingle(req: Request, res: Response) {
    try {
      const { phone, content } = req.body
      const userId = req.user!.id

      const messageId = await SmsService.sendSingle(userId, phone, content)

      res.json({
        message: '发送成功',
        data: { messageId }
      })
    } catch (error: any) {
      res.status(500).json({
        message: '发送失败',
        error: error.message
      })
    }
  },

  async sendBatch(req: Request, res: Response) {
    try {
      const { phones, content } = req.body
      const userId = req.user!.id

      const messageIds = await SmsService.sendBatch(userId, phones, content)

      res.json({
        message: '批量发送成功',
        data: { messageIds }
      })
    } catch (error: any) {
      res.status(500).json({
        message: '批量发送失败',
        error: error.message
      })
    }
  },

  async getRecords(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const pageSize = 10

      const smsRepository = AppDataSource.getRepository(SmsRecord)
      const [records, total] = await smsRepository.findAndCount({
        where: { userId: req.user!.id },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * pageSize,
        take: pageSize
      })

      res.json({
        message: '获取记录成功',
        data: {
          records,
          total,
          page,
          pageSize
        }
      })
    } catch (error: any) {
      res.status(500).json({
        message: '获取记录失败',
        error: error.message
      })
    }
  }
}