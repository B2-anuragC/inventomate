import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthJWTGuard, AuthSocketJWTGuard } from './guard/auth.guard';

console.log('process.env', process.env);

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SALT,
      // signOptions: { expiresIn: `${process.env.JWT_MAX_AGE}` },
      signOptions: { expiresIn: `1h` },
    }),
  ],
  providers: [AuthService, AuthJWTGuard, AuthSocketJWTGuard],
  exports: [AuthJWTGuard, AuthService, AuthSocketJWTGuard],
})
export class AuthGuardModule {}
