import { TRANSACTION_ACTION } from '@inventory-system/constant';
import {
  NotFoundException,
  ValidationException,
} from '@inventory-system/exception';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateProductServiceDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import {
  GetTransaction,
  TransactionServiceDto,
} from './dto/transaction-product.dto';
import { UpdateProductServiceDto } from './dto/update-product.dto';
import { ProdDocument, Product, ProductDocuments } from './model/product.model';
import {
  ProductTransaction,
  ProductTransactionDoc,
} from './model/transaction.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productDocument: Model<ProductDocuments>,

    @InjectModel(ProductTransaction.name)
    private readonly productTransDocument: Model<ProductTransactionDoc>,

    @InjectConnection()
    private readonly mongooseConnection: mongoose.Connection
  ) {}

  async getProduct(getProductDto: GetProductDto) {
    const { _id, name, page, limit } = getProductDto;

    let base_query = {};

    if (_id) Object.assign(base_query, { _id: new Types.ObjectId(_id) });

    if (name)
      Object.assign(base_query, {
        productName: new RegExp(name, 'i'),
      });

    const aggregate = [
      { $match: base_query },
      {
        $lookup: {
          from: 'user',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    console.log(JSON.stringify(aggregate));

    return {
      data: await this.productDocument.aggregate(aggregate).sort({
        updatedAt: -1,
      }),
      count: await this.productDocument.countDocuments(base_query),
    };
  }

  async getProductById(_id: string) {
    return this.productDocument.findOne({ _id: new Types.ObjectId(_id) });
  }

  async create(createProdServiceDto: CreateProductServiceDto) {
    const productDetail = await this.productDocument.create(
      createProdServiceDto
    );

    return productDetail;
  }

  async update(_id: string, updateProductService: UpdateProductServiceDto) {
    return this.productDocument.updateOne(
      { _id: new Types.ObjectId(_id) },
      updateProductService
    );
  }

  async delete(prodId: string) {
    return this.productDocument.deleteOne({ _id: new Types.ObjectId(prodId) });
  }

  async createTransaction(transactionServiceDto: TransactionServiceDto) {
    const session = await this.mongooseConnection.startSession();
    console.log('session start');

    // transactionServiceDto.productId = new Types.ObjectId(
    //   transactionServiceDto.productId
    // );
    // transactionServiceDto.actionBy = new Types.ObjectId(
    //   transactionServiceDto.actionBy
    // );

    const { productId, quantity, action } = transactionServiceDto;

    let productUpdatedDetail;

    try {
      session.startTransaction();

      const productDetail = await this.productDocument.findOne({
        _id: new Types.ObjectId(productId),
      });

      if (!productDetail) {
        throw new NotFoundException('Product not found');
      }

      if (
        quantity > productDetail.productQuantity &&
        action != TRANSACTION_ACTION.INCREMENT
      ) {
        throw new ValidationException(
          `Invalid quantity, ${productDetail.productQuantity} '${productDetail.productName}' in stock`
        );
      }

      const quantityWrapper =
        action == TRANSACTION_ACTION.INCREMENT ? quantity : quantity * -1;

      // transactions
      productUpdatedDetail = await this.productDocument.findOneAndUpdate(
        { _id: new Types.ObjectId(transactionServiceDto.productId) },
        {
          $inc: { productQuantity: quantityWrapper },
          $set: {
            lastTransactionBy: new Types.ObjectId(
              transactionServiceDto.actionBy
            ),
          },
        },
        { session: session, new: true }
      );

      const transactionDoc = {
        ...transactionServiceDto,
        productId: new Types.ObjectId(transactionServiceDto.productId),
        finalQuantity: productUpdatedDetail.productQuantity,
      };

      console.log('transactionDoc', transactionDoc);

      const transactionDetail = await new this.productTransDocument(
        transactionDoc
      ).save({ session: session });
      console.log(productUpdatedDetail, transactionDetail);

      await session.commitTransaction();
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      throw err;
    } finally {
      console.log('session end');
      await session.endSession();
    }
    return productUpdatedDetail;
  }

  async getTransaction(getTransaction: GetTransaction) {
    const {
      _id,
      productId,
      actionBy,
      action,
      quantity_GTE,
      quantity_LTE,
      page,
      limit,
      sortType,
    } = getTransaction;
    let base_query = {};

    if (_id) Object.assign(base_query, { _id: new Types.ObjectId(_id) });

    if (productId)
      Object.assign(base_query, { productId: new Types.ObjectId(productId) });

    if (actionBy)
      Object.assign(base_query, { actionBy: new Types.ObjectId(actionBy) });

    if (action) Object.assign(base_query, { action });

    if (quantity_GTE)
      Object.assign(base_query, { quantity: { $gte: quantity_GTE } });

    if (quantity_LTE)
      Object.assign(base_query, { quantity: { $lte: quantity_LTE } });

    const aggregate = [
      { $match: base_query },
      {
        $lookup: {
          from: 'product',
          localField: 'productId',
          foreignField: '_id',
          as: 'productId',
        },
      },
      {
        $unwind: '$productId',
      },

      {
        $lookup: {
          from: 'user',
          localField: 'actionBy',
          foreignField: '_id',
          as: 'actionBy',
        },
      },
      {
        $unwind: '$actionBy',
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    console.log(aggregate);

    const sortBy = sortType == 'ASC' ? 1 : -1;

    return {
      data: await this.productTransDocument
        .aggregate(aggregate)
        .sort({ createdAt: sortBy }),
      count: await this.productTransDocument.countDocuments(base_query),
    };
  }

  async addDocs(productId: string, docs: ProdDocument[]) {
    return await this.productDocument.findOneAndUpdate(
      { _id: new Types.ObjectId(productId) },
      {
        $addToSet: { productDocuments: { $each: docs } },
      },
      { new: true }
    );
  }

  async removeDocs(removePrductDoc) {
    let query = { _id: new Types.ObjectId(removePrductDoc.id) };

    return await this.productDocument.findOneAndUpdate(
      { _id: new Types.ObjectId(removePrductDoc.productId) },
      {
        $pull: { productDocuments: query },
      },
      { safe: true, multi: true, new: false }
    );
  }
}
