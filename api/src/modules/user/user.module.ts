import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';
import { DatabaseModule } from 'src/database/database.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PermissionModule, RoleModule, DatabaseModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
