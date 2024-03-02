import { GeneralRespInterceptor } from '@inventory-system/interceptor';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { createRoleDto, getRole, updateRoleDto } from './dto/role.dto';
import { RoleService } from './role.service';

@ApiTags('Role')
@ApiSecurity('JWT-auth')
@UseGuards(AuthJWTGuard)
@Controller('role')
@UseInterceptors(GeneralRespInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('')
  async getRole(@Query() getRole: getRole) {
    return this.roleService.getRoles(getRole);
  }

  @Post('create')
  async createRole(@Body() createRoleDto: createRoleDto) {
    //console.log('controller', createRoleDto);
    return this.roleService.create(createRoleDto);
  }

  @Post('update/:id')
  async update(@Param('id') id: string, @Body() updateRole: updateRoleDto) {
    return this.roleService.update(id, updateRole);
  }
}
