import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(message: string | string[], status?: number) {
    super({ status: status ?? 1, error: message }, HttpStatus.FORBIDDEN);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string | string[], status?: number) {
    super({ status: status ?? 5, error: message }, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string | string[], status?: number) {
    super({ status: status, error: message }, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string | string[], status?: number) {
    super({ status: status ?? 4, error: message }, HttpStatus.NOT_FOUND);
  }
}

export class InternalServerException extends HttpException {
  constructor(message: string | string[], status?: number) {
    super(
      { status: status ?? 500, error: message },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
