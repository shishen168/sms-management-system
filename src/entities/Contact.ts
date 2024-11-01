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

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  phone: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  note: string

  @Column({ default: false })
  isStarred: boolean

  @Column({ type: 'json', nullable: true })
  tags: string[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, user => user.contacts)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: number
}