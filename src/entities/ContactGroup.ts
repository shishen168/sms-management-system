import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn
} from 'typeorm'
import { User } from './User'
import { Contact } from './Contact'

@Entity('contact_groups')
export class ContactGroup {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column({ default: 0 })
  contactCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: number

  @ManyToMany(() => Contact)
  @JoinTable({
    name: 'contact_group_members',
    joinColumn: { name: 'groupId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contactId', referencedColumnName: 'id' }
  })
  contacts: Contact[]
}