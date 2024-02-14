import { formatResponse } from '@inventory-system/utils';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(JSON.stringify(exception));

    response
      .status(exception?.status || (exception?.error?.status ?? 500))
      .json(
        formatResponse(
          exception?.response?.error ||
            (exception?.error?.data ?? 'Try again! Something went wrong'),
          exception?.response?.status || (exception?.error?.status ?? 500)
        )
      );
  }
}
