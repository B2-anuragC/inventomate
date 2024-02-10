import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListOtpDto } from './dto/list-otp.dto';
import { OtpService } from './otp.service';

@ApiTags('Otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Get('/getAll')
  async list_otp(listDto: ListOtpDto) {
    return this.otpService.list_otp(listDto);
  }
}
