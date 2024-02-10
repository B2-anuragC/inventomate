import { ENUM_OTP_TYPE } from '@inventory-system/constant';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class VerifyOtpServiceDto {
  @ValidateIf((req) => !req.email || req.req_id)
  @IsString()
  @IsNotEmpty()
  req_id: string;

  @ValidateIf((req) => !req.req_id || req.email)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @Length(6)
  @Transform(({ value }) => parseInt(value))
  otp: number;

  @IsNotEmpty()
  @IsEnum(ENUM_OTP_TYPE)
  otpType: string;
}

export class VerifyOtpDto extends PartialType(VerifyOtpServiceDto) {}
