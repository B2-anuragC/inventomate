import {
  NotFoundException,
  UnauthorizedException,
  ValidationException,
} from '@inventory-system/exception';
import { GeneralRespInterceptor } from '@inventory-system/interceptor';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { EmailService } from 'libs/notification/src/lib/email.service';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { OtpService } from '../otp/otp.service';
import { OtpReq, OtpSubmit } from './dto/forget-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto, VerifyEmailDto } from './dto/register.dto';
import { LoginResponseDto, UserCreateDto } from './dto/user-create.dto';
import { GetUserDto } from './dto/user-get.dto';
import { UserUdpateDto } from './dto/user-update.dto';
import { User } from './model/user.model';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UseInterceptors(GeneralRespInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{
    userDetail: LoginResponseDto;
    access_token: string;
  }> {
    let userDetail = await this.userService.check_login(loginDto);
    if (!userDetail) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userDetailWrapper = { ...userDetail, _id: userDetail._id.toString() };
    return {
      userDetail: userDetailWrapper,
      access_token: await this.userService.generateToken(userDetailWrapper),
    };
    // return await this.userService.generateToken(userDetail);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    let userDetail = await this.userService.register(registerDto);

    const otpDetail = await this.otpService.generate_otp({
      email: userDetail.email,
      otpType: 'NEW_USER',
    });

    console.log(otpDetail);

    let otpObj = {
      to: [userDetail.email],
      cc: [],
      subject: 'Email Verification',
      html: `<h1>OTP for email verification: ${otpDetail.otp}</h1>`,
    };

    console.log('otpObj', otpObj);

    const emailResp = this.emailService.sendmail(otpObj);

    return userDetail;
  }

  @Get('forget-password-req')
  async forgetPasswordReq(@Query() forgetOtpDto: OtpReq) {
    let userDetail = (await this.userService.getUser(
      forgetOtpDto.email
    )) as User;
    if (!userDetail) throw new ValidationException('Invalid email');
    let otpDetail = await this.otpService.generate_otp({
      email: forgetOtpDto.email,
      triggerNotification: false,
      otpType: 'FORGET_PASSWORD',
    });

    // trigger notification
    const emailResp = this.emailService.sendmail({
      to: [userDetail.email],
      cc: [],
      subject: 'Forget Password',
      html: `<h1>OTP for Forget Password: ${otpDetail.otp}</h1>`,
    });

    console.log(emailResp);

    return {
      msg: 'OTP sent successfully',
      req_id: otpDetail._id.toString(),
    };
    // trigger notification
  }

  @Post('forget-password-submit')
  async forgetPasswordSubmit(@Body() otpSubmitDto: OtpSubmit) {
    // return this.userService.forgetPasswordSubmit(otpSubmitDto);
    let otpDetail = await this.otpService.verifyOtp(
      {
        req_id: otpSubmitDto.otpReq,
        otp: otpSubmitDto.otp,
      },
      'FORGET_PASSWORD'
    );
    if (!otpDetail) throw new ValidationException('Invalid OTP');

    let userDetail = await this.userService.updatePassword(
      otpDetail.email,
      otpSubmitDto.newPassword
    );

    return userDetail;
  }

  @Get('verify-email')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    let otpDetail = await this.otpService.verifyOtp(verifyEmailDto, 'NEW_USER');

    if (!otpDetail)
      throw new ValidationException('Invalid request or otp expired');

    let userDetail = await this.userService.validEmail(verifyEmailDto.email);

    // welcome message
    const emailResp = this.emailService.sendmail({
      to: [userDetail.email],
      cc: [],
      subject: 'Welcome message',
      html: `<h1>User verified successfully</h1>`,
    });

    return userDetail;
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(AuthJWTGuard)
  @Post('create')
  async createUser(@Body() createUser: UserCreateDto) {
    const userDetail = await this.userService.create(createUser);

    const otpDetail = await this.otpService.generate_otp({
      email: userDetail.email,
      otpType: 'NEW_USER',
    });

    const emailResp = this.emailService.sendmail({
      to: [userDetail.email],
      cc: [],
      subject: 'Email Verification',
      html: `<h1>OTP for email verification: ${otpDetail.otp}</h1>`,
    });
    return userDetail;
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(AuthJWTGuard)
  @Put('update/:id')
  async updateUser(
    @Param('id') user_id: string,
    @Body() updateUser: UserUdpateDto
  ) {
    let userDetail = this.userService.update(user_id, updateUser);
    if (!userDetail) throw new NotFoundException('User not found');
    return userDetail;
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(AuthJWTGuard)
  @Get('getUsers')
  async get(@Query() getDto: GetUserDto) {
    return this.userService.getUsers(getDto);
  }
}
