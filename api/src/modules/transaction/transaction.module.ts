import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
// eslint-disable-next-line prettier/prettier
import { Transaction, TransactionSchema } from '../../database/entity/transaction.entity';
import { UserModule } from '../user/user.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
        ]),
        UserModule,
        // eslint-disable-next-line prettier/prettier
        PermissionModule
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule { }
