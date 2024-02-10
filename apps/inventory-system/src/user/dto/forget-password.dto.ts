import { passwordHashTransform } from '@inventory-system/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OtpReq {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class OtpSubmit {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otpReq: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  otp: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(passwordHashTransform)
  newPassword: string;
}
