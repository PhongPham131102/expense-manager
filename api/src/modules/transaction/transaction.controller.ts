import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserDocument } from '../../database/entity/user.entity';
import { Authentication } from '../../decorators/authentication.decorator';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    @Authentication()
    async createTransaction(
        @AuthUser() user: UserDocument,
        @Body() createTransactionDto: CreateTransactionDto,
    ) {

        return this.transactionService.createTransaction(
            user._id,
            createTransactionDto,
        );
    }

    @Get()
    @Authentication()
    async getTransactions(
        @AuthUser() user: UserDocument,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {

        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;

        return this.transactionService.getTransactionsByUser(
            user._id,
            pageNumber,
            limitNumber,
            startDate,
            endDate,
        );
    }

    @Get(':id')
    @Authentication()
    async getTransactionById(@AuthUser() user: UserDocument, @Param('id') id: string) {
        return this.transactionService.getTransactionById(id, user._id);
    }

    @Put(':id')
    @Authentication()
    async updateTransaction(
        @AuthUser() user: UserDocument,
        @Param('id') id: string,
        @Body() updateTransactionDto: CreateTransactionDto,
    ) {
        return this.transactionService.updateTransaction(id, user._id, updateTransactionDto);
    }

    @Delete(':id')
    @Authentication()
    async deleteTransaction(@AuthUser() user: UserDocument, @Param('id') id: string) {
        return this.transactionService.deleteTransaction(id, user._id);
    }

    @Get('dashboard/data')
    @Authentication()
    async getDashboardData(
        @AuthUser() user: UserDocument,
        @Query('period') period?: string
    ) {
        return this.transactionService.getDashboardData(user._id, period || 'today');
    }
}