import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

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
