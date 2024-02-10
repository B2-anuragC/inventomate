import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration } from '@inventory-system/constant';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuardModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthGuardModule,
    MongooseModule.forRoot(process.env.DB_URL),
    UserModule,
    ProductModule,
    // SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
