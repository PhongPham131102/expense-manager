
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
// eslint-disable-next-line prettier/prettier
import { Transaction, TransactionSchema } from '../../database/entity/transaction.entity';
import { UserModule } from '../user/user.module';
import { PermissionModule } from '../permission/permission.module';
import { User, UserSchema } from 'src/database/entity/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
            { name: User.name, schema: UserSchema },
        ]),
        UserModule,
        PermissionModule
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule { }
