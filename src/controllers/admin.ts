import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { User } from '../entities/User'
import { Role } from '../entities/Role'
import { Permission } from '../entities/Permission'

export const adminController = {
  async getUsers(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User)
      const users = await userRepository.find({
        relations: ['roles'],
        select: ['id', 'username', 'email', 'phone', 'isActive', 'createdAt']
      })

      res.json({
        message: '获取用户列表成功',
        data: users
      })
    } catch (error: any) {
      res.status(500).json({
        message: '获取用户列表失败',
        error: error.message
      })
    }
  },

  async toggleUserStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({ id: parseInt(userId) })

      if (!user) {
        return res.status(404).json({ message: '用户不存在' })
      }

      user.isActive = !user.isActive
      await userRepository.save(user)

      res.json({
        message: `用户已${user.isActive ? '启用' : '禁用'}`,
        data: { isActive: user.isActive }
      })
    } catch (error: any) {
      res.status(500).json({
        message: '操作失败',
        error: error.message
      })
    }
  },

  async assignRole(req: Request, res: Response) {
    try {
      const { userId, roleId } = req.body
      const userRepository = AppDataSource.getRepository(User)
      const roleRepository = AppDataSource.getRepository(Role)

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['roles']
      })
      const role = await roleRepository.findOneBy({ id: roleId })

      if (!user || !role) {
        return res.status(404).json({ message: '用户或角色不存在' })
      }

      user.roles.push(role)
      await userRepository.save(user)

      res.json({
        message: '角色分配成功',
        data: { userId, roleId }
      })
    } catch (error: any) {
      res.status(500).json({
        message: '角色分配失败',
        error: error.message
      })
    }
  }
}