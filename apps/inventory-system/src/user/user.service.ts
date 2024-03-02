import { ValidationException } from '@inventory-system/exception';
import { passwordHash } from '@inventory-system/utils';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { instanceToPlain } from 'class-transformer';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { RegisterServiceDto, userJWTTokenDetail } from './dto/register.dto';
import { UserCreateServiceDto } from './dto/user-create.dto';
import { GetUserDto } from './dto/user-get.dto';
import { UserUdpateServiceDto } from './dto/user-update.dto';
import { User, UserDocument } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userDocuemnt: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async check_login(loginDto: LoginDto) {
    let passwordHashStr = passwordHash(loginDto.password);

    let userDetail = await this.userDocuemnt
      .findOne({
        email: loginDto.email,
        password: passwordHashStr,
      })
      .select({ password: 0 })
      .lean();

    if (!userDetail) throw new ValidationException('Invalid credential');

    return userDetail;

    // //console.log(`${userDetail.password} == ${passwordHashStr}`);

    // if (userDetail.password == passwordHashStr) {
    //   return userDetail;
    // }
    // return null;
  }

  async generateToken(payload: userJWTTokenDetail) {
    return await this.jwtService.sign(instanceToPlain(payload), {
      secret: `${process.env.JWT_SALT}`,
    });
  }

  async create(userServiceDto: UserCreateServiceDto) {
    let userCreated = await this.userDocuemnt.create(userServiceDto);
    return userCreated;
  }

  async update(id: string, userUpdateServiceDto: UserUdpateServiceDto) {
    return await this.userDocuemnt.findOneAndUpdate(
      {
        _id: id,
      },
      userUpdateServiceDto,
      { new: true }
    );
  }

  async validEmail(email: string) {
    return await this.userDocuemnt.findOneAndUpdate(
      { email: email },
      {
        emailVerfified: true,
      },
      { new: true }
    );
  }

  async register(registerServiceDto: RegisterServiceDto) {
    return await this.create(registerServiceDto);
  }

  async getUser(email: string) {
    return await this.userDocuemnt.findOne({ email: email });
  }

  async getUsers(getDto: GetUserDto) {
    // const limit = getDto.limit || parseInt(process.env.PAGE_LIMIT);
    const limit = getDto.limit || 10;
    const skip = ((getDto.page || 1) - 1) * limit;

    let query = {};

    return {
      count: await this.userDocuemnt.countDocuments(query),
      users: await this.userDocuemnt.find(query).skip(skip).limit(limit),
    };
  }

  async updatePassword(email: string, passwordHash: string) {
    return await this.userDocuemnt.findOneAndUpdate(
      { email: email },
      { password: passwordHash },
      { new: true }
    );
  }
}
