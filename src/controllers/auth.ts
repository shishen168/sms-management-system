import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { User } from '../entities/User'
import { generateCaptcha } from '../utils/captcha'
import { hashPassword, comparePassword, generateSecureToken } from '../utils/encryption'
import { registerSchema, loginSchema } from '../utils/validation'
import jwt from 'jsonwebtoken'

const CAPTCHA_EXPIRY = 5 * 60 * 1000 // 5 minutes
const captchaStore = new Map<string, { code: string; expires: number }>()
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_LOGIN_ATTEMPTS = 5
const LOGIN_TIMEOUT = 15 * 60 * 1000 // 15 minutes

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body)
      const captchaId = req.cookies['captcha_id']
      
      // 验证验证码
      const storedCaptcha = captchaStore.get(captchaId)
      if (!storedCaptcha || 
          storedCaptcha.code !== validatedData.captcha || 
          Date.now() > storedCaptcha.expires) {
        return res.status(400).json({ message: '验证码无效或已过期' })
      }
      
      // 创建用户
      const userRepository = AppDataSource.getRepository(User)
      const hashedPassword = await hashPassword(validatedData.password)
      
      const user = userRepository.create({
        username: validatedData.username,
        password: hashedPassword,
        email: validatedData.email,
        phone: validatedData.phone
      })
      
      await userRepository.save(user)
      
      // 生成令牌
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )
      
      // 清理已使用的验证码
      captchaStore.delete(captchaId)
      
      res.json({
        message: '注册成功',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone
          }
        }
      })
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: '用户名、邮箱或手机号已存在' })
      }
      res.status(500).json({ 
        message: '注册失败',
        errors: error.errors || [error.message]
      })
    }
  },

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body)
      const ip = req.ip

      // 检查登录尝试次数
      const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 }
      
      if (attempts.count >= MAX_LOGIN_ATTEMPTS && 
          Date.now() - attempts.lastAttempt < LOGIN_TIMEOUT) {
        return res.status(429).json({ 
          message: '登录尝试次数过多，请稍后再试',
          waitTime: Math.ceil((LOGIN_TIMEOUT - (Date.now() - attempts.lastAttempt)) / 1000)
        })
      }

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ 
        where: { username: validatedData.username }
      })

      if (!user || !(await comparePassword(validatedData.password, user.password))) {
        // 更新登录尝试记录
        loginAttempts.set(ip, {
          count: attempts.count + 1,
          lastAttempt: Date.now()
        })

        return res.status(401).json({ message: '用户名或密码错误' })
      }

      // 登录成功，重置尝试次数
      loginAttempts.delete(ip)

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )

      res.json({
        message: '登录成功',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone
          }
        }
      })
    } catch (error: any) {
      res.status(400).json({ 
        message: '登录失败',
        errors: error.errors || [error.message]
      })
    }
  },

  async generateCaptcha(req: Request, res: Response) {
    const { image, code } = generateCaptcha()
    const captchaId = generateSecureToken(16)
    
    captchaStore.set(captchaId, {
      code,
      expires: Date.now() + CAPTCHA_EXPIRY
    })
    
    // 清理过期验证码
    for (const [id, data] of captchaStore.entries()) {
      if (Date.now() > data.expires) {
        captchaStore.delete(id)
      }
    }
    
    res.cookie('captcha_id', captchaId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: CAPTCHA_EXPIRY,
      sameSite: 'strict'
    })
    
    res.type('image/png').send(image)
  }
}