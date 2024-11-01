import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { SmsTemplate } from '../entities/SmsTemplate'
import { templateSchema } from '../utils/validation'

export const smsTemplateController = {
  async create(req: Request, res: Response) {
    try {
      const validatedData = templateSchema.parse(req.body)
      const templateRepository = AppDataSource.getRepository(SmsTemplate)
      
      const template = templateRepository.create({
        ...validatedData,
        createdBy: req.user!.id
      })
      
      await templateRepository.save(template)
      
      res.json({
        message: '模板创建成功',
        data: template
      })
    } catch (error: any) {
      res.status(400).json({
        message: '模板创建失败',
        error: error.message
      })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const validatedData = templateSchema.parse(req.body)
      const templateRepository = AppDataSource.getRepository(SmsTemplate)
      
      const template = await templateRepository.findOneBy({ id: parseInt(id) })
      if (!template) {
        return res.status(404).json({ message: '模板不存在' })
      }
      
      await templateRepository.update(id, validatedData)
      
      res.json({
        message: '模板更新成功',
        data: await templateRepository.findOneBy({ id: parseInt(id) })
      })
    } catch (error: any) {
      res.status(400).json({
        message: '模板更新失败',
        error: error.message
      })
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      const templateRepository = AppDataSource.getRepository(SmsTemplate)
      
      const template = await templateRepository.findOneBy({ id: parseInt(id) })
      if (!template) {
        return res.status(404).json({ message: '模板不存在' })
      }
      
      await templateRepository.delete(id)
      
      res.json({
        message: '模板删除成功'
      })
    } catch (error: any) {
      res.status(400).json({
        message: '模板删除失败',
        error: error.message
      })
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 10
      
      const templateRepository = AppDataSource.getRepository(SmsTemplate)
      const [templates, total] = await templateRepository.findAndCount({
        order: { createdAt: 'DESC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        relations: ['creator']
      })
      
      res.json({
        message: '获取模板列表成功',
        data: {
          templates,
          total,
          page,
          pageSize
        }
      })
    } catch (error: any) {
      res.status(400).json({
        message: '获取模板列表失败',
        error: error.message
      })
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const templateRepository = AppDataSource.getRepository(SmsTemplate)
      
      const template = await templateRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['creator']
      })
      
      if (!template) {
        return res.status(404).json({ message: '模板不存在' })
      }
      
      res.json({
        message: '获取模板成功',
        data: template
      })
    } catch (error: any) {
      res.status(400).json({
        message: '获取模板失败',
        error: error.message
      })
    }
  }
}