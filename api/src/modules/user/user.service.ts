/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../database/entity/user.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import { PermissionService } from '../permission/permission.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SetInitialBalanceDto } from './dto/set-initial-balance.dto';
import { StatusResponse } from 'src/common/StatusResponse';
import { formatDate } from 'src/common';
import { Request } from 'express';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly permissionService: PermissionService,
  ) { }
  async findOneBy(filter: FilterQuery<UserDocument>) {
    return await this.userModel.findOne(filter);
  }
  async checkEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async findOneById(id: string) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));
      return user;
    } catch (error) {
      return false;
    }
  }
  async checkUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }
  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }
  async checkPassword(password: string, hashPassword: string) {
    const isCorrectPassword = await bcrypt.compare(password, hashPassword);
    return isCorrectPassword;
  }
  async getUserByIdAuthGuard(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id) })
      .populate('role');
    const findPermission = await this.permissionService.getPermissionByRole(
      user.role._id,
    );

    return {
      ...user.toObject(),
      permission: findPermission,
    };
  }
  async create(
    createUserDto: CreateUserDto,
    request: Request,
    userIp: string,
    _user?: UserDocument,
  ) {
    const { password } = createUserDto;
    const hashPassword = await bcrypt.hash(password, 10);

    const alreadyUsername = await this.checkUsername(createUserDto?.username);
    if (alreadyUsername) {
      throw new HttpException(
        {
          status: StatusResponse.EXISTS_USERNAME,
          message: 'Already Exist Username!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (createUserDto?.email) {
      const alreadyEmail = await this.checkEmail(createUserDto?.email);

      if (alreadyEmail) {
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_EMAIL,
            message: 'Already Exist Email!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,

      role: new Types.ObjectId(createUserDto?.role),
    });

    const user = await this.userModel
      .findById(newUser?._id)
      .populate([{ path: 'role', select: 'name' }]);
    const stringLog = `${_user?.username || 'Khách vãng lai'} vừa tạo mới 1 người dùng có các thông tin :\nTên đăng nhập: ${user.username}\nTên: ${user.name}\nEmail: ${user?.email || 'Trống'}\nVai trò: ${user?.role?.name || 'Trống'}\n${formatDate(
      new Date(),
    )}</b>\nIP người thực hiện: ${userIp}.`;
    request['new-data'] =
      `Tên đăng nhập: ${user.username}\nTên: ${user.name}\nEmail: ${user?.email || 'Trống'}\nVai trò: ${user?.role?.name || 'Trống'}\n`;
    request['message-log'] = stringLog;
    return {
      status: StatusResponse.SUCCESS,
      message: 'Create New User successfully',
      user,
    };
  }
  async getUserById(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id) })
      .populate([{ path: 'role', select: '_id name' }]);

    const findPermission = await this.permissionService.getPermissionByRole(
      user.role._id,
    );

    return {
      ...user.toObject(),
      permission: findPermission,
    };
  }
  async updateRefreshToken({ refresh_token, _id }) {
    return await this.userModel.findOneAndUpdate(
      { _id },
      { refresh_token },
      { new: true },
    );
  }
  async findUserByToken(refresh_token: string) {
    return await this.userModel
      .findOne({
        refresh_token,
      })
      .populate({
        path: 'role',
        select: {
          name: 1,
        },
      });
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    // Find user by ID
    const user = await this.userModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new HttpException(
        {
          status: StatusResponse.NOT_EXISTS_USER,
          message: 'Người dùng không tồn tại',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await this.checkPassword(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new HttpException(
        {
          status: StatusResponse.PASSWORD_INCORRECT,
          message: 'Mật khẩu hiện tại không đúng',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if new password is different from current password
    const isSamePassword = await this.checkPassword(newPassword, user.password);
    if (isSamePassword) {
      throw new HttpException(
        {
          status: StatusResponse.BAD_REQUEST,
          message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(userId),
      { password: hashedNewPassword },
      { new: true },
    );

    return {
      status: StatusResponse.SUCCESS,
      message: 'Mật khẩu đã được thay đổi thành công',
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { name, email, username } = updateProfileDto;

    // Find user by ID
    const user = await this.userModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new HttpException(
        {
          status: StatusResponse.NOT_EXISTS_USER,
          message: 'Người dùng không tồn tại',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Check if username is already taken by another user
    if (username !== user.username) {
      const existingUser = await this.checkUsername(username);
      if (existingUser) {
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_USERNAME,
            message: 'Tên đăng nhập đã được sử dụng',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Check if email is already taken by another user (if email is provided)
    if (email && email !== user.email) {
      const existingEmail = await this.checkEmail(email);
      if (existingEmail) {
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_EMAIL,
            message: 'Email đã được sử dụng',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Update user profile
    const updateData: any = {
      name,
      username,
    };

    if (email) {
      updateData.email = email;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(new Types.ObjectId(userId), updateData, {
        new: true,
      })
      .populate([{ path: 'role', select: '_id name' }]);

    return {
      status: StatusResponse.SUCCESS,
      message: 'Thông tin cá nhân đã được cập nhật thành công',
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
      },
    };
  }

  async setInitialBalance(userId: string, setInitialBalanceDto: SetInitialBalanceDto) {
    const { initialBalance } = setInitialBalanceDto;

    console.log("setInitialBalance called:", {
      userId,
      initialBalance,
      setInitialBalanceDto
    });

    // Find user by ID
    const user = await this.userModel.findById(new Types.ObjectId(userId));
    console.log("User found:", {
      userId: user?._id,
      hasSetInitialBalance: user?.hasSetInitialBalance,
      initialBalance: user?.initialBalance
    });

    if (!user) {
      console.log("User not found");
      throw new HttpException(
        {
          status: StatusResponse.NOT_EXISTS_USER,
          message: 'Người dùng không tồn tại',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Allow user to update initial balance even if already set
    // This provides flexibility for users to correct their initial balance

    // Update user with initial balance
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(userId),
        {
          initialBalance,
          hasSetInitialBalance: true,
        },
        { new: true }
      )
      .populate([{ path: 'role', select: '_id name' }]);

    return {
      status: StatusResponse.SUCCESS,
      message: 'Số dư ban đầu đã được thiết lập thành công',
      data: {
        initialBalance: updatedUser.initialBalance,
        hasSetInitialBalance: updatedUser.hasSetInitialBalance,
      },
    };
  }

  async updateInitialBalance(userId: string, setInitialBalanceDto: SetInitialBalanceDto) {
    const { initialBalance } = setInitialBalanceDto;

    console.log("updateInitialBalance called:", {
      userId,
      initialBalance,
      setInitialBalanceDto
    });

    // Find user by ID
    const user = await this.userModel.findById(new Types.ObjectId(userId));
    console.log("User found:", {
      userId: user?._id,
      hasSetInitialBalance: user?.hasSetInitialBalance,
      initialBalance: user?.initialBalance
    });

    if (!user) {
      console.log("User not found");
      throw new HttpException(
        {
          status: StatusResponse.NOT_EXISTS_USER,
          message: 'Người dùng không tồn tại',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Update user with new initial balance (allow update even if already set)
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(userId),
        {
          initialBalance,
          hasSetInitialBalance: true,
        },
        { new: true }
      )
      .populate([{ path: 'role', select: '_id name' }]);

    return {
      status: StatusResponse.SUCCESS,
      message: 'Số dư ban đầu đã được cập nhật thành công',
      data: {
        initialBalance: updatedUser.initialBalance,
        hasSetInitialBalance: updatedUser.hasSetInitialBalance,
      },
    };
  }

  async checkInitialBalanceStatus(userId: string) {
    const user = await this.userModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new HttpException(
        {
          status: StatusResponse.NOT_EXISTS_USER,
          message: 'Người dùng không tồn tại',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: StatusResponse.SUCCESS,
      message: 'Lấy trạng thái số dư ban đầu thành công',
      data: {
        hasSetInitialBalance: user.hasSetInitialBalance,
        initialBalance: user.initialBalance,
      },
    };
  }
}
