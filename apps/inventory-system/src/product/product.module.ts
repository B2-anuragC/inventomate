import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuardModule } from '../auth/auth.module';
import { ProductDocumentService } from './doc.service';
import { Product, ProductSchema } from './model/product.model';
import {
  ProductTransaction,
  ProductTransactionSchema,
} from './model/transaction.model';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProuductReportService } from './report/product.report.service';
import { ProuductTransReportService } from './report/transaction.report.service';

@Module({
  imports: [
    AuthGuardModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductTransaction.name, schema: ProductTransactionSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SALT, // Replace with a strong and unique secret
      signOptions: {
        // expiresIn: `${process.env.JWT_MAX_AGE}`, // Optional expiration time
        expiresIn: `1h`, // Optional expiration time
      },
    }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductDocumentService,
    ProuductReportService,
    ProuductTransReportService,
  ],
})
export class ProductModule {}
