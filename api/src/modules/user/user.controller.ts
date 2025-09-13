import { Controller, Post, Put, Body, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Authentication } from '../../decorators/authentication.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('change-password')
  @Authentication()
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: any,
  ) {
    const userId = req.user._id;
    return await this.userService.changePassword(userId, changePasswordDto);
  }

  @Put('update-profile')
  @Authentication()
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req: any,
  ) {
    const userId = req.user._id;
    return await this.userService.updateProfile(userId, updateProfileDto);
  }
}
