import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { EntityNames } from 'src/common/enum/entity.enum';
import { OtpEntity } from './otp.entity';

@Entity(EntityNames.User)
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ select: false, nullable: true }) // password رو در queryهای معمولی برنمی‌گردونه
  password?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  avatar?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OtpEntity, (otp) => otp.user, { cascade: true })
  otps: OtpEntity[];
}