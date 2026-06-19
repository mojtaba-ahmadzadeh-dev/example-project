import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches, Length } from "class-validator";

export class SendOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^09\d{9}$/, {
    message: "شماره موبایل باید با 09 شروع شود و 11 رقم باشد",
  })
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  code: string;
}