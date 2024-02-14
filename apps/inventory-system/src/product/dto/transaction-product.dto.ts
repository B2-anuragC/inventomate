import { TRANSACTION_ACTION, sortType } from '@inventory-system/constant';
import { commonSearch } from '@inventory-system/dto';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { ProductTransaction } from '../model/transaction.model';

export class TransactionServiceDto extends OmitType(ProductTransaction, [
  'productId',
  'quantity',
  'action',
  'actionBy',
  'finalQuantity',
]) {
  @ApiProperty()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    enum: TRANSACTION_ACTION,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(TRANSACTION_ACTION)
  action: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  actionBy: Types.ObjectId;
}

export class TransactionDto extends PickType(TransactionServiceDto, [
  'productId',
  'action',
  'quantity',
]) {}

export class GetTransaction extends PickType(commonSearch, [
  '_id',
  'limit',
  'page',
]) {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  productId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  actionBy: string;

  @ApiProperty({
    enum: TRANSACTION_ACTION,
  })
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsEnum(TRANSACTION_ACTION)
  action: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Transform(({ value, key }) => parseInt(value))
  quantity_GTE: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsNumber()
  @Transform(({ value, key }) => parseInt(value))
  @IsOptional()
  quantity_LTE: number;

  @ApiProperty({
    enum: sortType,
  })
  @IsNotEmpty()
  @IsEnum(sortType)
  @IsString()
  sortType: string;
}
