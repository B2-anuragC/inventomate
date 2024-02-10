import { commonFilterQueryDto } from '@inventory-system/dto';
import { PickType } from '@nestjs/swagger';

export class GetUserDto extends PickType(commonFilterQueryDto, [
  'limit',
  'page',
] as const) {}
