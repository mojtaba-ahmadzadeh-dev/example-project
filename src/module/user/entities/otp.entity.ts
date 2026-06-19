import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { EntityNames } from "src/common/enum/entity.enum";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.UserOtp)
export class OtpEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  code: string;

  @Column({
    type: "enum",
    enum: ["register", "login", "forget_password", "change_phone"],
  })
  type: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;

  @ManyToOne(() => UserEntity, (user) => user.otps, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column({nullable: true})
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
