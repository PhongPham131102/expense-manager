import { Controller, Post, Put, Get, Body, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SetInitialBalanceDto } from './dto/set-initial-balance.dto';
import { Authentication } from '../../decorators/authentication.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
