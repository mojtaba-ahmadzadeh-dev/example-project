import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { SendOtpDto, VerifyOtpDto } from "./dto/auth.dto";
import type { Response } from "express";
import { ApiTags } from "@nestjs/swagger";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("send-otp")
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

@Post('verify-otp')
  @HttpCode(HttpStatus.CREATED)
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyOtpAndRegister(dto, res);
  }
}
