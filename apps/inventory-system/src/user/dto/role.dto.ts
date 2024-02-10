import { commonSearch } from '@inventory-system/dto';
import { strArrayToMongoObjectId } from '@inventory-system/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class createRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @ApiProperty()
  @Transform(strArrayToMongoObjectId)
  // @IsMongoId({ each: true })
  @ArrayMinSize(1)
  permissions: ObjectId[];
}

export class getRole extends commonSearch {}

export class updateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @ApiProperty()
  @Transform(strArrayToMongoObjectId)
  // @IsMongoId({ each: true })
  @ArrayMinSize(1)
  permissions: ObjectId[];
}
