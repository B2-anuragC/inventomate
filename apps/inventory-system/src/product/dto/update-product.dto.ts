import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductServiceDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  'productName': string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  'productDescription': string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value, key }) => parseInt(value))
  'productPrice': number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsNumber()
  @Transform(({ value, key }) => parseInt(value))
  productUnitRate: number;
}

export class UpdateProductDto extends PickType(UpdateProductServiceDto, [
  'productName',
  'productDescription',
  'productPrice',
  'productUnitRate',
]) {}

export class removePrductDoc {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
