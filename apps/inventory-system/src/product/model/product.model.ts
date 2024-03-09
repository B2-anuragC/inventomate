import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';

export type ProductDocuments = HydratedDocument<Product>;

export class ProdDocument {
  @Prop({ type: mongoose.Types.ObjectId, required: true })
  _id: ObjectId;

  @Prop({ type: String, required: true })
  docName: string;

  @Prop({ type: String, required: true })
  docType: string;

  @Prop({ type: String, required: true })
  docAddedBy: string;

  @Prop({ type: String, required: true })
  docAddedAt: string;

  @Prop({ type: Boolean, required: true, default: true })
  docStatus: boolean;

  @Prop({ type: String, required: true })
  docPath: string;

  @Prop({ type: Object, required: true })
  docMetaData: object;

  @Prop({ type: Number, required: true })
  docSize: number;
}

@Schema({
  collection: 'product',
  timestamps: true,
})
export class Product {
  @Prop({ type: String, required: true })
  productName: string;

  @Prop({ type: String, required: false })
  productDescription: string;

  @Prop({ type: Number, required: true })
  productQuantity: number;

  @Prop({ type: Number, required: true })
  productPrice: number;

  @Prop({ type: Number, required: true })
  productUnitRate: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'user' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false, ref: 'user' })
  lastTransactionBy: Types.ObjectId;

  @Prop({ type: [ProdDocument], required: false })
  productDocuments: ProdDocument[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
