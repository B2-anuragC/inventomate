import { ENUM_USER_ROLE } from '@inventory-system/constant';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RegisterServiceDto } from './register.dto';

export class UserCreateServiceDto extends RegisterServiceDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ENUM_USER_ROLE)
  role?: string;
}

export class UserCreateDto extends UserCreateServiceDto {}

export class LoginResponseDto extends OmitType(UserCreateDto, [
  'firstName',
  'lastName',
  'dob',
  'email',
  'gender',
  'mobileNumber',
  'role',
]) {
  @IsString()
  @IsNotEmpty()
  _id: string;
}
