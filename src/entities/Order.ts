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

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  orderNumber: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number

  @Column()
  status: 'pending' | 'processing' | 'completed' | 'cancelled'

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: number
}