import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthUser } from '../../decorators/auth-user.decorator';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    async createTransaction(
        @AuthUser() user: any,
        @Body() createTransactionDto: CreateTransactionDto,
    ) {
        return this.transactionService.createTransaction(user.id, createTransactionDto);
    }

    @Get()
    async getTransactions(
        @AuthUser() user: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;

        return this.transactionService.getTransactionsByUser(
            user.id,
            pageNumber,
            limitNumber,
        );
    }

    @Get(':id')
    async getTransactionById(
        @AuthUser() user: any,
        @Param('id') id: string,
    ) {
        return this.transactionService.getTransactionById(id, user.id);
    }
}
