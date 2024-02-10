import { ENUM_OTP_TYPE } from '@inventory-system/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

// export enum hierarchyStatus {
//   active = 'active',
//   inActive = 'inActive',
//   archive = 'archive',
// }

@Schema({
  collection: 'otp',
  timestamps: true,
})
export class Otp {
  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Number, required: true })
  otp: number;

  @Prop({ type: Number, required: true })
  expiryAt: number;

  @Prop({ type: Boolean, required: true })
  isActive: boolean;

  @Prop({ type: String, required: true, enum: ENUM_OTP_TYPE })
  otpType: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
