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
  Matches,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { ProductTransaction } from '../model/transaction.model';

export enum ReportType {
  'PDF' = 'PDF',
  'EXCEL' = 'EXCEL',
}

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

  @ApiProperty({
    description:
      'If not privided, will pick default unitRate(specified while product creation)',
  })
  @ApiPropertyOptional()
  @IsNumber()
  unitRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  actionBy: Types.ObjectId;
}

export class TransactionDto extends PickType(TransactionServiceDto, [
  'productId',
  'action',
  'quantity',
  'unitRate',
]) {}

export class GetTransactionReport extends PickType(commonSearch, [
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

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  productName: string;

  @ApiProperty({
    example: '2024-01-01 00:00:00',
    format: 'YYYY-MM-DD HH:mm:ss',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(
    /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
    {
      message: '$property must be formatted as YYYY-MM-DD hh:mm:ss',
    }
  )
  start_date: string;

  @ApiProperty({
    example: '2024-01-01 00:00:00',
    format: 'YYYY-MM-DD HH:mm:ss',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(
    /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
    {
      message: '$property must be formatted as YYYY-MM-DD hh:mm:ss',
    }
  )
  end_date: string;

  @ApiProperty({
    enum: ReportType,
  })
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsEnum(ReportType)
  reportType: string;
}

export class GetTransaction extends OmitType(GetTransactionReport, [
  'reportType',
]) {}
