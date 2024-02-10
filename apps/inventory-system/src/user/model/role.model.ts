import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

// export enum hierarchyStatus {
//   active = 'active',
//   inActive = 'inActive',
//   archive = 'archive',
// }

@Schema({
  collection: 'role',
  timestamps: true,
})
export class Role {
  @Prop({ type: String, required: true })
  roleName: string;

  @Prop({ type: [mongoose.Types.ObjectId], required: true, ref: 'permission' })
  permissions: mongoose.Types.ObjectId[];

  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
