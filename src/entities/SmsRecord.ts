import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { User } from './User'

@Entity('sms_records')
export class SmsRecord {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  phone: string

  @Column()
  code: string

  @Column()
  type: 'register' | 'login' | 'reset'

  @Column({ default: false })
  isUsed: boolean

  @Column()
  expireTime: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, user => user.smsRecords)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: number
}