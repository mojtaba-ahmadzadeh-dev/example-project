import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { OtpEntity } from "../user/entities/otp.entity";
import { SendOtpDto } from "./dto/send-otp.dto";
import { AuthMessages } from "src/common/enum/messages.enum";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { phone } = dto;
    let user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      user = this.userRepository.create({ phone, isVerified: false });
      user = await this.userRepository.save(user);
    }
    if (user.isVerified) {
      throw new ConflictException(AuthMessages.PHONE_ALREADY_EXISTS);
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const otp = this.otpRepository.create({
      code,
      type: "register",
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
      isUsed: false,
      userId: user.id,
    });
    await this.otpRepository.save(otp);
    return {
      message: AuthMessages.OTP_SENT,
    };
  }
}
