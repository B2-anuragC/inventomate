import { NotificationModule } from '@inventory-system/notification';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuardModule } from '../auth/auth.module';
import { OtpModule } from '../otp/otp.module';
import { Permission, PermissionSchema } from './model/permission.model';
import { Role, RoleSchema } from './model/role.model';
import { User, UserSchema } from './model/user.model';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    AuthGuardModule,
    OtpModule,
    NotificationModule,
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SALT, // Replace with a strong and unique secret
      signOptions: {
        // expiresIn: `${process.env.JWT_MAX_AGE}`, // Optional expiration time
        expiresIn: `1h`, // Optional expiration time
      },
    }),
  ],
  controllers: [UserController, RoleController, PermissionController],
  providers: [UserService, RoleService, PermissionService],
})
export class UserModule {}
