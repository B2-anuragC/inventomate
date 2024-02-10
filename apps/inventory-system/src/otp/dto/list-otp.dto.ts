import { commonFilterQueryDto } from '@inventory-system/dto';
import { PickType } from '@nestjs/swagger';

export class ListOtpDto extends PickType(commonFilterQueryDto, [
  'limit',
  'page',
]) {}
