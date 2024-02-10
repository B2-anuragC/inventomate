import { GeneralRespInterceptor } from '@inventory-system/interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { createPermission, getPermission } from './dto/permission.dto';
import { PermissionService } from './permission.service';

@ApiTags('Permission')
@ApiSecurity('JWT-auth')
@UseGuards(AuthJWTGuard)
@Controller('permission')
@UseInterceptors(GeneralRespInterceptor)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('')
  async getPermission(@Query() getPermission: getPermission) {
    return this.permissionService.getPermission(getPermission);
  }

  @Post('create')
  async createPermission(@Body() createPermission: createPermission) {
    return this.permissionService.createPermission(createPermission);
  }
}
