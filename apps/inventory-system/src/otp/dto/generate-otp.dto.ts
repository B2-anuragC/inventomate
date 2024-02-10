import { ENUM_OTP_TYPE } from '@inventory-system/constant';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { mailConfig } from 'libs/notification/src/lib/email.service';

export class GenerateOtpServiceDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsEnum(ENUM_OTP_TYPE)
  @IsNotEmpty()
  otpType: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => Boolean(value))
  triggerNotification: boolean = false;

  @ValidateIf((body) => body.triggerNotification == true)
  @IsNotEmpty()
  mailConfig: mailConfig;
}

export class GenerateOtpDto extends PartialType(GenerateOtpServiceDto) {}
