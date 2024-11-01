import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { ContactGroup } from '../entities/ContactGroup'
import { Contact } from '../entities/Contact'

export const contactGroupController = {
  async getGroups(req: Request, res: Response) {
    try {
      const groupRepository = AppDataSource.getRepository(ContactGroup)
      const groups = await groupRepository.find({
        where: { userId: req.user!.id },
        order: { createdAt: 'DESC' }
      })

      res.json({
        message: '获取分组列表成功',
        data: groups
      })
    } catch (error: any) {
      res.status(500).json({
        message: '获取分组列表失败',
        error: error.message
      })
    }
  },

  async createGroup(req: Request, res: Response) {
    try {
      const { name, description } = req.body
      const groupRepository = AppDataSource.getRepository(ContactGroup)

      const group = groupRepository.create({
        name,
        description,
        userId: req.user!.id
      })

      await groupRepository.save(group)

      res.json({
        message: '创建分组成功',
        data: group
      })
    } catch (error: any) {
      res.status(500).json({
        message: '创建分组失败',
        error: error.message
      })
    }
  },

  async updateGroup(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, description } = req.body
      const groupRepository = AppDataSource.getRepository(ContactGroup)

      const group = await groupRepository.findOne({
        where: { id: parseInt(id), userId: req.user!.id }
      })

      if (!group) {
        return res.status(404).json({ message: '分组不存在' })
      }

      group.name = name
      group.description = description

      await groupRepository.save(group)

      res.json({
        message: '更新分组成功',
        data: group
      })
    } catch (error: any) {
      res.status(500).json({
        message: '更新分组失败',
        error: error.message
      })
    }
  },

  async deleteGroup(req: Request, res: Response) {
    try {
      const { id } = req.params
      const groupRepository = AppDataSource.getRepository(ContactGroup)

      const group = await groupRepository.findOne({
        where: { id: parseInt(id), userId: req.user!.id }
      })

      if (!group) {
        return res.status(404).json({ message: '分组不存在' })
      }

      await groupRepository.remove(group)

      res.json({
        message: '删除分组成功'
      })
    } catch (error: any) {
      res.status(500).json({
        message: '删除分组失败',
        error: error.message
      })
    }
  },

  async addContactsToGroup(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { contactIds } = req.body
      
      const groupRepository = AppDataSource.getRepository(ContactGroup)
      const contactRepository = AppDataSource.getRepository(Contact)

      const group = await groupRepository.findOne({
        where: { id: parseInt(id), userId: req.user!.id },
        relations: ['contacts']
      })

      if (!group) {
        return res.status(404).json({ message: '分组不存在' })
      }

      const contacts = await contactRepository.findByIds(contactIds)
      group.contacts.push(...contacts)
      group.contactCount = group.contacts.length

      await groupRepository.save(group)

      res.json({
        message: '添加联系人成功'
      })
    } catch (error: any) {
      res.status(500).json({
        message: '添加联系人失败',
        error: error.message
      })
    }
  },

  async removeContactsFromGroup(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { contactIds } = req.body
      
      const groupRepository = AppDataSource.getRepository(ContactGroup)

      const group = await groupRepository.findOne({
        where: { id: parseInt(id), userId: req.user!.id },
        relations: ['contacts']
      })

      if (!group) {
        return res.status(404).json({ message: '分组不存在' })
      }

      group.contacts = group.contacts.filter(contact => 
        !contactIds.includes(contact.id)
      )
      group.contactCount = group.contacts.length

      await groupRepository.save(group)

      res.json({
        message: '移除联系人成功'
      })
    } catch (error: any) {
      res.status(500).json({
        message: '移除联系人失败',
        error: error.message
      })
    }
  },

  async getGroupContacts(req: Request, res: Response) {
    try {
      const { id } = req.params
      const page = parseInt(req.query.page as string) || 1
      const pageSize = 20
      
      const groupRepository = AppDataSource.getRepository(ContactGroup)

      const group = await groupRepository.findOne({
        where: { id: parseInt(id), userId: req.user!.id },
        relations: ['contacts'],
        skip: (page - 1) * pageSize,
        take: pageSize
      })

      if (!group) {
        return res.status(404).json({ message: '分组不存在' })
      }

      res.json({
        message: '获取分组联系人成功',
        data: {
          contacts: group.contacts,
          total: group.contactCount
        }
      })
    } catch (error: any) {
      res.status(500).json({
        message: '获取分组联系人失败',
        error: error.message
      })
    }
  }
}