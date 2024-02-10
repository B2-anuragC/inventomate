import { ENUM_USER_ROLE } from '@inventory-system/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// export enum hierarchyStatus {
//   active = 'active',
//   inActive = 'inActive',
//   archive = 'archive',
// }

@Schema({
  collection: 'user',
  timestamps: true,
})
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  dob: string;

  @Prop({ type: String, required: false, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({ type: Number, required: false })
  mobileNumber: number;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: false, enum: ENUM_USER_ROLE })
  role: string;

  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean = true;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({ type: Boolean, default: false, required: false })
  emailVerfified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
