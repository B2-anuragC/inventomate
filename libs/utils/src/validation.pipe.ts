import 'multer';

import { VALID_DOC_TYPE } from '@inventory-system/constant';
import { PipeTransform } from '@nestjs/common';

export class ProductDocFileValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[]): Express.Multer.File[] {
    const allowedMimeTypes = Object.values(VALID_DOC_TYPE) as string[];

    let fileSize = 5242880; //5 MB

    const filesWrap = files.map((file) => {
      let msg: string[] = [];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        msg.push(`Invalid image type: ${file.mimetype}`);
      }
      if (file.size > fileSize) {
        msg.push(`File size(${file.size}) is greater then ${fileSize}`);
      }

      if (msg.length) {
        return Object.assign(file, {
          inValidMsg: msg,
        });
      }
      return file;
    });

    return filesWrap;
  }
}
