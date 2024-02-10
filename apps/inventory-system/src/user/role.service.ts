import { ValidationException } from '@inventory-system/exception';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { createRoleDto, getRole, updateRoleDto } from './dto/role.dto';
import { Role, RoleDocument } from './model/role.model';
import { PermissionService } from './permission.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleDocument: Model<RoleDocument>,
    private readonly permissionService: PermissionService
  ) {}

  async getRoles(getRole: getRole) {
    let query = {};
    if (getRole._id) Object.assign(query, { _id: getRole._id });
    if (getRole.name)
      Object.assign(query, {
        roleName: { $regex: new RegExp(getRole.name, 'i') },
      });

    console.log(query);

    return await this.roleDocument
      .find(query)
      // .populate('permissions')
      .skip((getRole.page - 1) * getRole.limit)
      .limit(getRole.limit);
  }

  async create(createRoleDto: createRoleDto) {
    console.log('service', createRoleDto);
    let invalidPermissions = await this.permissionService.checkValidPermissions(
      createRoleDto.permissions
    );

    if ((invalidPermissions || []).length > 0) {
      throw new ValidationException(
        `Permissions are invalid: ${invalidPermissions.join(',')}`
      );
    }

    return await this.roleDocument.create(createRoleDto);
  }

  async update(id: string, obj: updateRoleDto) {
    return this.roleDocument.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      obj
    );
  }
}
