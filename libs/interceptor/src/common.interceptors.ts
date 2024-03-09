// src/common/interceptors/response.interceptor.ts

import { ValidationException } from '@inventory-system/exception';
import { formatResponse } from '@inventory-system/utils';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class GeneralRespInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const payload = formatResponse(data, -1);
        return payload;
      }),
      catchError((error) => {
        return throwError(() => {
          if (`${error.code}` == '11000') {
            return new ValidationException(
              `Duplicate entry for keyValue: ${JSON.stringify(
                error.keyValue || error
              )}`
            );
          }
          return error;
        });
      })
    );
  }
}
