import { PERMISSION_MODULE } from '@inventory-system/constant';
import { commonSearch } from '@inventory-system/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class getPermission extends commonSearch {
  @ApiProperty({
    enum: PERMISSION_MODULE,
  })
  @ApiPropertyOptional()
  @IsEnum(PERMISSION_MODULE)
  @IsOptional()
  module: string;
}

export class createPermission {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  permissionName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    enum: PERMISSION_MODULE,
  })
  @IsEnum(PERMISSION_MODULE)
  permissionModule: string;
}

export class checkValidPermissions {
  @ArrayMinSize(1)
  _ids: ObjectId[];
}
