import { TRANSACTION_ACTION } from '@inventory-system/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductTransactionDoc = HydratedDocument<ProductTransaction>;

@Schema({
  collection: 'product_transaction',
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
  versionKey: false,
})
export class ProductTransaction {
  @Prop({ type: Types.ObjectId, required: true, ref: 'product' })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  finalQuantity: number;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({
    type: String,
    required: true,
    enum: { ...TRANSACTION_ACTION, PRODUCT_ADDED: 'PRODUCT_ADDED' },
  })
  action: string;

  @Prop({ type: Number, required: true })
  unitRate: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'user' })
  actionBy: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  checkoutPrice: number;
}

export const ProductTransactionSchema =
  SchemaFactory.createForClass(ProductTransaction);
