import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { User } from './User'

@Entity('sms_templates')
export class SmsTemplate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  content: string

  @Column()
  type: 'register' | 'login' | 'reset' | 'custom'

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User

  @Column()
  createdBy: number
}