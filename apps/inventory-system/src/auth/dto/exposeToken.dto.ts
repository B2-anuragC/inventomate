import { IsNotEmpty, IsString } from 'class-validator';

export class exposeTokenDto {
  @IsString()
  @IsNotEmpty()
  instanceId: string;

  // @IsString()
  // @IsNotEmpty()
  // @Transform(({ value, key }) =>
  //   validateDateTimeFormat({ value, key, format: DATE_TIME_FORMAT }),
  // )
  // expiryAt: string;
}
