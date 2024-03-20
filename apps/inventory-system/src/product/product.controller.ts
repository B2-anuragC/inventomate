import {
  NotFoundException,
  ValidationException,
} from '@inventory-system/exception';
import { GeneralRespInterceptor } from '@inventory-system/interceptor';
import {
  ProductDocFileValidationPipe,
  dayJsDate,
} from '@inventory-system/utils';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PipelineStage, Types } from 'mongoose';
import 'multer';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { userJWTTokenDetail } from '../user/dto/register.dto';
import { ProductDocumentService } from './doc.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import {
  GetTransaction,
  GetTransactionReport,
  ReportType,
  TransactionDto,
} from './dto/transaction-product.dto';
import { UpdateProductDto, removePrductDoc } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { ProuductReportService } from './report/product.report.service';
import { ProuductTransReportService } from './report/transaction.report.service';

@Controller('product')
@ApiSecurity('JWT-auth')
@UseGuards(AuthJWTGuard)
@UseInterceptors(GeneralRespInterceptor)
export class ProductController {
  constructor(
    private readonly productService: ProductService, // private readonly docService: ProductDocumentService
    private readonly docService: ProductDocumentService,
    private readonly prodReportService: ProuductReportService,
    private readonly prodTransReportService: ProuductTransReportService
  ) {}

  @ApiTags('Product')
  @Get('')
  async get(@Query() getProductDto: GetProductDto) {
    return this.productService.getProduct(getProductDto);
  }

  @ApiTags('Product')
  @Post('create')
  async create(@Body() createProduct: CreateProductDto, @Req() req: any) {
    const userDetail = req.userDetail as userJWTTokenDetail;

    const productServiceDto = {
      ...createProduct,
      createdBy: new Types.ObjectId(userDetail._id),
    };

    return this.productService.create(productServiceDto);
  }

  @ApiTags('Product')
  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProduct: UpdateProductDto
  ) {
    let updatedDetail = this.productService.update(id, updateProduct);

    if (!updatedDetail) {
      throw new NotFoundException('Product not found');
    }

    return updatedDetail;
  }

  @ApiTags('Product')
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const returnObj = this.productService.delete(id);
    if (!returnObj) {
      throw new NotFoundException('Product not found');
    }
    return returnObj;
  }

  @ApiTags('Product Transaction')
  @Post('transaction/create')
  async createTransaction(
    @Body() transactionDto: TransactionDto,
    @Req() req: any
  ) {
    const { _id } = req.userDetail as userJWTTokenDetail;

    if (!transactionDto.unitRate) {
      const { productUnitRate } = await this.productService.getProductById(
        transactionDto.productId
      );
      transactionDto.unitRate = productUnitRate;
    }

    const dtoWrapper = {
      ...transactionDto,
      actionBy: new Types.ObjectId(_id),
      unitRate: transactionDto.unitRate,
      checkoutPrice: transactionDto.quantity * transactionDto.unitRate,
    };
    return this.productService.createTransaction(dtoWrapper);
  }

  @ApiTags('Product Transaction')
  @Get('transaction/get')
  async getTransactions(@Query() getTransactionDto: GetTransaction) {
    return this.productService.getTransaction(getTransactionDto);
  }

  @ApiTags('Product Transaction')
  @Get('transaction/get/report')
  async getTransReport(
    @Query() getTransactionReportDto: GetTransactionReport,
    @Res() res: any
  ) {
    let aggregateQuery = await this.productService.getTransaction(
      getTransactionReportDto,
      true
    );

    if (getTransactionReportDto.reportType == ReportType.PDF) {
      let pdfBuffer = await this.prodTransReportService.generatePdf(
        aggregateQuery as PipelineStage[]
      );

      res.contentType('application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=table.pdf'); // Adjust filename as needed
      res.send(pdfBuffer);
    } else {
      let excelBuffer = await this.prodTransReportService.generateExcel(
        aggregateQuery as PipelineStage[]
      );

      res.contentType(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=transactionReport.xlsx'
      ); // Adjust filename as needed
      res.send(excelBuffer);
    }
  }

  @ApiTags('Product Documents')
  @Post(':productId/doc/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async addProductDoc(
    @Param('productId') productId: string,
    @Req() req: any,
    @UploadedFiles()
    files?: Express.Multer.File[]
  ) {
    const validatedFiles = new ProductDocFileValidationPipe().transform(files);

    let productDetail = await this.productService.getProductById(productId);

    if (!productDetail) {
      throw new NotFoundException('Product not found');
    }

    const { userDetail } = req;

    let resp = [];

    let docsPromise = files.map(async (file) => {
      let s3Resp = {};

      let inValidMsg = file['inValidMsg'] || [];

      try {
        s3Resp = await this.docService.uploadDoc(file);
      } catch (err) {
        inValidMsg.push(`S3 upload err: ${err}`);
      }

      let document = {
        _id: new Types.ObjectId(),
        docType: file.mimetype,
        docName: file.originalname,
        docAddedBy: userDetail._id,
        docAddedAt: dayJsDate().toDate(),
        docStatus: true,
        docPath: s3Resp['Location'] || null,
        docMetaData: s3Resp,
        docSize: file.size,
      };

      resp.push({
        docPath: document.docPath,
        docName: document.docName,
        _id: document._id,
        inValidMsg: inValidMsg,
      });

      if (inValidMsg.length) {
        throw new ValidationException(inValidMsg);
      }
      return document;
    });

    const documentDetails = await Promise.allSettled(docsPromise);

    let docs = documentDetails
      .filter((item) => item.status == 'fulfilled')
      .map((document) => {
        return document['value'];
      });

    const docDetail = await this.productService.addDocs(productId, docs);

    return {
      product: docDetail,
      file_update_resp: resp,
    };
  }

  @ApiTags('Product Documents')
  @Delete(':productId/doc/remove/:id')
  async removeProductImage(
    @Param()
    removeDocDto: removePrductDoc
  ) {
    let productDetail = await this.productService.removeDocs(removeDocDto);
    if (!productDetail) {
      throw new NotFoundException('ProductId not found');
    }

    let document = (productDetail['productDocuments'] || []).filter(
      (product) => product._id.toString() == removeDocDto.id
    );

    if (document.length == 0) {
      throw new NotFoundException('Document not found');
    }

    const { key, Bucket } = document[0]['docMetaData'] as any;

    let s3Resp = await this.docService.removeDoc(key);

    productDetail['productDocuments'] = (
      productDetail['productDocuments'] || []
    ).filter((product) => product._id.toString() != removeDocDto.id);

    return {
      product: productDetail,
      file_remove_detail: s3Resp,
    };
  }

  @ApiTags('Product Telly')
  @Get('productTelly/:id')
  async productTelly(@Param('id') id: string) {
    return await this.productService.getProductTelly(id);
  }
}
