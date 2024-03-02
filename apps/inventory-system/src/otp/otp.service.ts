import { dayJsDate, generateOTP } from '@inventory-system/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { ListOtpDto } from './dto/list-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Otp, OtpDocument } from './model/otp.model';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name)
    private readonly otpDocuemnt: Model<OtpDocument>
  ) {}

  async list_otp(otpDto: ListOtpDto) {
    const query = {};
    // const limit = otpDto.limit ?? parseInt(process.env.PAGE_LIMIT);
    const limit = otpDto.limit ?? 10;

    const page = (otpDto.page - 1) * limit;

    return this.otpDocuemnt.find(query).skip(page).limit(limit);
  }

  async generate_otp(generateDto: GenerateOtpDto) {
    let otp = generateOTP();

    const expiryAt = dayJsDate()
      // .add(parseInt(process.env.OTP_MIN_MINUTE), 'minute')
      .add(10, 'minute')
      .valueOf();

    let otpObj = {
      email: generateDto.email,
      otp: otp,
      expiryAt: expiryAt,
      isActive: true,
      otpType: generateDto.otpType,
    };

    //console.log('otpObj', otpObj);

    let otpDetail = await this.otpDocuemnt.create(otpObj);
    //console.log('OTP generated', otpDetail);

    return otpDetail;
  }

  // verify_otp
  async verifyOtp(verifyOtpDto: VerifyOtpDto, otpType?: string) {
    const { req_id, otp, email } = verifyOtpDto;

    let baseFilter = {
      otp: otp,
      expiryAt: { $gt: dayJsDate().valueOf() },
    };

    if (otpType) Object.assign(baseFilter, { otpType: otpType });
    if (req_id) Object.assign(baseFilter, { _id: req_id });
    if (email) Object.assign(baseFilter, { email: email });

    //console.log('baseFilter', baseFilter);

    let updateDetail = await this.otpDocuemnt.findOneAndUpdate(
      baseFilter,
      {
        isActive: false,
      },
      { new: true }
    );

    return updateDetail;
  }
}
