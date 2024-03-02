import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { createPermission, getPermission } from './dto/permission.dto';
import { Permission, PermissionDocument } from './model/permission.model';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionDoc: Model<PermissionDocument>
  ) {}

  async getPermission(getPermission: getPermission) {
    let query = {};
    if (getPermission._id) Object.assign(query, { _id: getPermission._id });
    if (getPermission.module)
      Object.assign(query, { permissionModule: getPermission.module });
    if (getPermission.name)
      Object.assign(query, {
        permissionName: { $regex: new RegExp(getPermission.name, 'i') },
      });

    return await this.permissionDoc.find(query);
  }

  async createPermission(permissionDto: createPermission) {
    return this.permissionDoc.create(permissionDto);
  }

  async checkValidPermissions(permissionIds: ObjectId[]) {
    let validIds = await this.permissionDoc.find({
      _id: { $in: permissionIds },
    });

    let strObj = validIds.map((item) => item._id.toString());

    let invalidObj = permissionIds.filter((item) => {
      return !strObj.includes(item.toString());
    });

    //console.log(invalidObj);

    return invalidObj;
  }
}
