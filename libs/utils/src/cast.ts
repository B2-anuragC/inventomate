import { DATE_TIME_FORMAT } from '@inventory-system/constant';
import { ValidationException } from '@inventory-system/exception';
import dayjs from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import utc from 'dayjs/plugin/utc';
import parsePhoneNumber from 'libphonenumber-js';
import { Types } from 'mongoose';
import { hashIt } from './crypt';

// dayjs.extend(utc);
// dayjs.extend(customParseFormat);

export function toMongoObjectId({
  value,
  key,
}: {
  value: any;
  key: string;
}): Types.ObjectId {
  if (
    Types.ObjectId.isValid(value) &&
    new Types.ObjectId(value).toString() === value
  ) {
    return new Types.ObjectId(value);
  } else {
    throw new ValidationException(`${key} is not a valid MongoId`);
  }
}

export function strArrayToMongoObjectId({
  value,
  key,
}: {
  value: any;
  key: string;
}): Types.ObjectId[] {
  //console.log('CHECK 1');
  if (!Array.isArray(value)) {
    throw new ValidationException(`${key} is not a valid MongoId list`);
  }
  //console.log('CHECK 2');
  let temp = value.map((item) => {
    //console.log('CHECK 3');
    if (
      Types.ObjectId.isValid(item) &&
      new Types.ObjectId(item).toString() === item
    ) {
      return new Types.ObjectId(item);
    } else {
      throw new ValidationException(`${key} is not a valid MongoId`);
    }
  });
  //console.log(temp);

  return temp;
}

export function trim(value: string): string {
  return value.trim();
}

export function checkProjectString(value: string): string {
  const parts = value.split(' ');

  let subtract: null | boolean = null;

  for (const field of parts) {
    if (field) {
      const currentFieldState = field.trim()[0] === '-' ? true : false;
      if (subtract === null) {
        subtract = currentFieldState;
      }
      if (currentFieldState !== subtract) {
        throw new ValidationException(
          `Invalid string format: cannot do exclusion on field in inclusion projection`
        );
      }
    }
  }

  return value;
}

export function validatePhoneNumber({
  value,
  key,
}: {
  value: any;
  key: string;
}): string {
  if (typeof value !== 'string') {
    throw new ValidationException('Phone number should be a string');
  }
  const phoneNumber = parsePhoneNumber(value);
  if (phoneNumber) {
    if (phoneNumber.isValid() && phoneNumber.country === 'IN') {
      return value as string;
    }
  }

  throw new ValidationException('Invalid phone number');
}

export function convertDateTimeToUTC({
  value,
  key,
}: {
  value: string;
  key: string;
}): string {
  const validateDate = dayjs(value, DATE_TIME_FORMAT);
  if (validateDate.isValid()) {
    return validateDate.format();
  } else {
    throw new ValidationException(
      `${key} has an invalid datetime format ${value}. It should follow iso8601 format`
    );
  }
}

export function convertDateTimeToMilli({
  value,
  key,
}: {
  value: string;
  key: string;
}): number {
  if (typeof value == 'number') return value;
  const validateDate = dayjs(value, DATE_TIME_FORMAT);
  if (validateDate.isValid()) {
    return validateDate.valueOf();
  } else {
    throw new ValidationException(
      `${key} has an invalid datetime format ${value}. It should follow iso8601(${DATE_TIME_FORMAT}) format`
    );
  }
}

export function validateDateTimeFormat({
  value,
  key,
  format,
}: {
  value: string;
  key: string;
  format: string;
}): string {
  const validateDate = dayjs(value, format, true);
  if (validateDate.isValid()) return validateDate.format(format);
  throw new ValidationException(
    `${key} has an invalid format ${value}. It should follow (${format}) format`
  );
}

export function commaSeparate({ value }: { value: string }): string[] {
  return Array.isArray(value) ? value : value.split(',');
}

export function passwordHash(password: string) {
  const salt = process.env?.['PASSWORD_PRIVATE_SALT'];
  return hashIt(`${salt}${password}`);
}

export function passwordHashTransform(transformObj: {
  value: string;
  key: string;
}) {
  return passwordHash(transformObj.value);
}
