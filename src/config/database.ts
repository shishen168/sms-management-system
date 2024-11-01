import { DataSource } from 'typeorm'
import { User } from '../entities/User'
import { SmsRecord } from '../entities/SmsRecord'
import { RechargeRecord } from '../entities/RechargeRecord'
import { Order } from '../entities/Order'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'recharge_system',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [User, SmsRecord, RechargeRecord, Order],
  migrations: ['src/migrations/*.ts'],
  subscribers: []
})