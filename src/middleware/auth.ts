import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../config/database'
import { User } from '../entities/User'

interface JwtPayload {
  userId: number
}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: '需要认证' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({ 
      where: { id: decoded.userId },
      relations: ['roles', 'roles.permissions']
    })

    if (!user) {
      return res.status(401).json({ message: '用户不存在' })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: '账户已被禁用' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: '无效的令牌' })
  }
}

export const checkPermission = (permissionName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: '需要认证' })
    }

    if (!req.user.hasPermission(permissionName)) {
      return res.status(403).json({ message: '没有权限执行此操作' })
    }

    next()
  }
}

export const checkRole = (roleName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: '需要认证' })
    }

    if (!req.user.hasRole(roleName)) {
      return res.status(403).json({ message: '需要管理员权限' })
    }

    next()
  }
}