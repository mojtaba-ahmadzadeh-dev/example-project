import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { Repository } from "typeorm";
import { OtpEntity } from "../../user/entities/otp.entity";
import { SendOtpDto, VerifyOtpDto } from "../dto/auth.dto";
import { AuthMessages } from "src/common/enum/messages.enum";
import { TokenService } from "./token.service";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private tokenService: TokenService,
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

  async verifyOtpAndRegister(dto: VerifyOtpDto, res: Response) {
    const { phone, code } = dto;

    const otp = await this.otpRepository.findOne({
      where: { code, type: "register", isUsed: false },
      relations: ["user"],
    });

    if (!otp || !otp.user || otp.user.phone !== phone) {
      throw new BadRequestException(AuthMessages.OTP_INVALID);
    }

    if (new Date() > otp.expiresAt!) {
      throw new BadRequestException(AuthMessages.OTP_EXPIRED);
    }

    otp.isUsed = true;
    await this.otpRepository.save(otp);

    let user = otp.user;
    user.isVerified = true;
    await this.userRepository.save(user);

    const payload = { id: user.id, phone: user.phone };
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 15,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      message: AuthMessages.REGISTER_SUCCESS,
    };
  }
}
