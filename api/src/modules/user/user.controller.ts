import { Controller, Post, Put, Get, Body, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SetInitialBalanceDto } from './dto/set-initial-balance.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';
import { Authentication } from '../../decorators/authentication.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('User Management')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('change-password')
  @Authentication()
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: any
  ) {
    const userId = req.user._id;
    return await this.userService.changePassword(userId, changePasswordDto);
  }

  @Put('update-profile')
  @Authentication()
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req: any
  ) {
    const userId = req.user._id;
    return await this.userService.updateProfile(userId, updateProfileDto);
  }

  @Post('set-initial-balance')
  @Authentication()
  async setInitialBalance(
    @Body() setInitialBalanceDto: SetInitialBalanceDto,
    @Request() req: any
  ) {
    const userId = req.user._id;

    return await this.userService.setInitialBalance(
      userId,
      setInitialBalanceDto
    );
  }

  @Put('update-initial-balance')
  @Authentication()
  async updateInitialBalance(
    @Body() setInitialBalanceDto: SetInitialBalanceDto,
    @Request() req: any
  ) {
    const userId = req.user._id;
    return await this.userService.updateInitialBalance(
      userId,
      setInitialBalanceDto
    );
  }

  @Get('initial-balance-status')
  @Authentication()
  async checkInitialBalanceStatus(@Request() req: any) {
    const userId = req.user._id;
    return await this.userService.checkInitialBalanceStatus(userId);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Gửi mã OTP qua email' })
  @ApiResponse({
    status: 200,
    description: 'Mã OTP đã được gửi qua email',
  })
  @ApiResponse({ status: 400, description: 'Email không hợp lệ' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.userService.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Xác thực mã OTP' })
  @ApiResponse({
    status: 200,
    description: 'Mã OTP hợp lệ',
  })
  @ApiResponse({
    status: 400,
    description: 'Mã OTP không hợp lệ hoặc đã hết hạn',
  })
  async verifyOTP(@Body() verifyOTPDto: VerifyOTPDto) {
    return await this.userService.verifyOTP(
      verifyOTPDto.email,
      verifyOTPDto.otpCode
    );
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu với mã OTP' })
  @ApiResponse({
    status: 200,
    description: 'Mật khẩu đã được đặt lại thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Mã OTP không hợp lệ hoặc đã hết hạn',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPasswordDto);
  }
}
