import { DATE_FORMAT } from '@inventory-system/constant';
import {
  passwordHashTransform,
  validateDateTimeFormat,
} from '@inventory-system/utils';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

enum gender {
  MALE = 'male',
  FEMAIL = 'female',
  OTHER = 'other',
}

export class RegisterServiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((obj) => validateDateTimeFormat({ ...obj, format: DATE_FORMAT }))
  dob: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(gender)
  gender: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  mobileNumber: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(passwordHashTransform)
  password: string;
}

export class RegisterDto extends PickType(RegisterServiceDto, [
  'firstName',
  'lastName',
  'dob',
  'gender',
  'mobileNumber',
  'email',
  'password',
] as const) {}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  otp: number;
}

export class userJWTTokenDetail extends PickType(RegisterServiceDto, [
  'firstName',
  'lastName',
  'dob',
  'gender',
  'mobileNumber',
  'email',
]) {
  @IsString()
  @IsNotEmpty()
  _id: string;
}
