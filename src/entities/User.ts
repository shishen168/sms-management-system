import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { SmsRecord } from './SmsRecord'
import { RechargeRecord } from './RechargeRecord'
import { Order } from './Order'
import { Role } from './Role'
import { Permission } from './Permission'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  phone: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number

  @Column({ default: false })
  isVerified: boolean

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToMany(() => Role, role => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' }
  })
  roles: Role[]

  @OneToMany(() => SmsRecord, smsRecord => smsRecord.user)
  smsRecords: SmsRecord[]

  @OneToMany(() => RechargeRecord, rechargeRecord => rechargeRecord.user)
  rechargeRecords: RechargeRecord[]

  @OneToMany(() => Order, order => order.user)
  orders: Order[]

  hasPermission(permissionName: string): boolean {
    return this.roles.some(role => 
      role.permissions.some(permission => 
        permission.name === permissionName
      )
    )
  }

  hasRole(roleName: string): boolean {
    return this.roles.some(role => role.name === roleName)
  }
}