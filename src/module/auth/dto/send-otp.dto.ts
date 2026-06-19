import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class SendOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^09\d{9}$/, {
    message: "شماره موبایل باید با 09 شروع شود و 11 رقم باشد",
  })
  phone: string;
}
