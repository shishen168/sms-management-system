import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { User } from './User'

@Entity('recharge_records')
export class RechargeRecord {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number

  @Column()
  paymentMethod: 'alipay' | 'wechat' | 'card'

  @Column()
  status: 'pending' | 'completed' | 'failed'

  @Column({ nullable: true })
  transactionId: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, user => user.rechargeRecords)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: number
}