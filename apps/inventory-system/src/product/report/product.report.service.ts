import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workbook } from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import _ from 'lodash';

import { Model, PipelineStage } from 'mongoose';
import { ReportType } from '../dto/transaction-product.dto';
import { Product, ProductDocuments } from '../model/product.model';

const productTransColumn = [
  { header: 'Product Name', key: 'product_name' },
  { header: 'Modifying User', key: 'modifying_user' },
  { header: 'Action', key: 'action' },
  { header: 'Quantity Changed', key: 'quantity_changed' },
  { header: 'Final Quantity', key: 'final_quantity' },
  { header: 'Price', key: 'price' },
  { header: 'Modifying Date', key: 'modifying_date' },
];

@Injectable()
export class ProuductReportService {
  constructor(
    @InjectModel(Product.name)
    private readonly productDocument: Model<ProductDocuments>
  ) {}

  mapPdfData(datas: Array<object>) {
    const mapping = productTransColumn.map((obj) => obj.key);
    return datas.map((data) => {
      let arr = [];
      for (let index in mapping) {
        arr[index] = _.get(data, mapping[index], '');
      }
      return arr;
    });
  }

  async generateReport(
    aggregate: PipelineStage[],
    ReportCate: string
  ): Promise<ArrayBuffer> {
    let resp = null;
    switch (ReportCate) {
      case ReportType.PDF:
        return await this.generatePdf(aggregate);
      case ReportType.EXCEL:
        return await this.generateExcel(aggregate);
    }
  }

  async fetchData(aggregate: PipelineStage[]) {
    aggregate.push({
      $project: {
        product_name: '$productId.productName',
        modifying_user: {
          $concat: ['$actionBy.firstName', ' ', '$actionBy.lastName'],
        },
        action: '$action',
        quantity_changed: '$quantity',
        final_quantity: '$finalQuantity',
        price: '$productId.productPrice',
        modifying_date: {
          $dateToString: { date: '$createdAt', format: '%Y-%m-%d %H:%M:%S' },
        },
      },
    });
    let data = await this.productDocument.aggregate(aggregate);
    return data;
  }

  async generatePdf(aggregate: PipelineStage[]): Promise<ArrayBuffer> {
    let data = await this.fetchData(aggregate);

    data = this.mapPdfData(data);

    console.log(data);

    const doc = new jsPDF();
    autoTable(doc, {
      head: [productTransColumn.map((obj) => obj.key)],
      body: data,
    });

    return Buffer.from(doc.output('arraybuffer'));
  }

  async generateExcel(aggregate: PipelineStage[]): Promise<ArrayBuffer> {
    let data = await this.fetchData(aggregate);

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.columns = productTransColumn;

    console.log('QUERY', JSON.stringify(aggregate));
    console.log('DATA', data);

    data.forEach((val, index) => {
      worksheet.addRow(val);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
