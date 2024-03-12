import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum sortType {
  ASC = 'ASC',
  'DESC' = 'DESC',
}

export class commonFilterQueryDto {
  constructor() {}

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Max(30)
  @Min(1)
  limit: number = 10;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'createdAt',
  })
  sort: string;

  @ApiProperty({
    example: sortType.ASC,
    enum: sortType,
  })
  @IsEnum(sortType)
  @IsNotEmpty()
  @Transform(({ value, key }) => {
    return value == sortType.ASC ? 1 : -1;
  })
  sortType: string;
}

export class commonSearch extends commonFilterQueryDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;
}
