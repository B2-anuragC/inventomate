import { DATE_FORMAT, ENUM_USER_ROLE } from '@inventory-system/constant';
import { validateDateTimeFormat } from '@inventory-system/utils';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';

export class UserUdpateServiceDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  @Transform((obj) => validateDateTimeFormat({ ...obj, format: DATE_FORMAT }))
  dob: string;

  @ApiProperty()
  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  gender: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Max(10)
  mobileNumber: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailVerfified: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsEnum(ENUM_USER_ROLE)
  role: string;
}

export class UserUdpateDto extends PickType(UserUdpateServiceDto, [
  'firstName',
  'lastName',
  'dob',
  'gender',
  'mobileNumber',
  'password',
  'role',
  'isActive',
  'emailVerfified',
] as const) {}
