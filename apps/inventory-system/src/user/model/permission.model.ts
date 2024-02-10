import { PERMISSION_MODULE } from '@inventory-system/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({
  collection: 'permission',
  timestamps: true,
})
export class Permission {
  @Prop({ type: String, required: true })
  permissionName: string;

  @Prop({ type: String, required: true, enum: PERMISSION_MODULE })
  permissionModule: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
PermissionSchema.index(
  { permissionName: 1, permissionModule: 1 },
  { unique: true }
);
