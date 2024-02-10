import { toMongoObjectId } from '@inventory-system/utils';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { Product } from '../model/product.model';

export class ProdDocument {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  _id: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  docName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  docType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  docAddedBy: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  docAddedAt: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  docStatus: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  docPath: string;

  @ApiProperty()
  @IsNotEmpty()
  docMetaData: any;

  @ApiProperty()
  @IsNumber()
  docSize: number;
}

export class CreateProductServiceDto extends PickType(Product, [
  'productName',
  'productDescription',
  'productQuantity',
  'productPrice',
  'createdBy',
]) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  productDescription: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value, key }) => parseInt(value))
  productQuantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value, key }) => parseInt(value))
  productPrice: number;

  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(toMongoObjectId)
  createdBy: Types.ObjectId;

  // @ApiProperty()
  // @IsArray()
  // @IsOptional()
  // productDocuments: ProdDocument[];
}

export class CreateProductDto extends PickType(CreateProductServiceDto, [
  'productName',
  'productDescription',
  'productQuantity',
  'productPrice',
]) {}
