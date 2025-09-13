import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../../database/entity/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { StatusResponse } from '../../common/StatusResponse';

@Injectable()
export class TransactionService {
    constructor(
        @InjectModel(Transaction.name)
        private transactionModel: Model<TransactionDocument>,
    ) { }

    async createTransaction(
        userId: Types.ObjectId,
        createTransactionDto: CreateTransactionDto,
    ): Promise<{ status: number; message: string; data?: TransactionResponseDto }> {
        try {
            const transaction = new this.transactionModel({
                userId: userId,
                ...createTransactionDto,
                date: new Date(createTransactionDto.date),
                time: new Date(createTransactionDto.time),
            });

            const savedTransaction = await transaction.save();

            const responseData: TransactionResponseDto = {
                id: savedTransaction._id.toString(),
                userId: savedTransaction.userId.toString(),
                amount: savedTransaction.amount,
                category: savedTransaction.category,
                categoryId: savedTransaction.categoryId,
                categoryName: savedTransaction.categoryName,
                categoryIcon: savedTransaction.categoryIcon,
                categoryColor: savedTransaction.categoryColor,
                isIncome: savedTransaction.isIncome,
                note: savedTransaction.note,
                date: savedTransaction.date,
                time: savedTransaction.time,
                image: savedTransaction.image,
                createdAt: savedTransaction.createdAt,
                updatedAt: savedTransaction.updatedAt,
            };

            return {
                status: StatusResponse.SUCCESS,
                message: 'Giao dịch đã được tạo thành công',
                data: responseData,
            };
        } catch (error) {
            console.error('Error creating transaction:', error);
            return {
                status: StatusResponse.INTERNAL_SERVER_ERROR,
                message: 'Có lỗi xảy ra khi tạo giao dịch',
            };
        }
    }

    async getTransactionsByUser(
        userId: Types.ObjectId,
        page: number = 1,
        limit: number = 10,
        startDate?: string,
        endDate?: string,
    ): Promise<{ status: number; message: string; data?: any }> {
        try {
            const skip = (page - 1) * limit;

            // Build query with optional date filters
            const query: any = { userId: userId };

            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }

            const transactions = await this.transactionModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const total = await this.transactionModel.countDocuments(query);

            const responseData = {
                transactions: transactions.map(transaction => ({
                    id: transaction._id.toString(),
                    userId: transaction.userId.toString(),
                    amount: transaction.amount,
                    category: transaction.category,
                    categoryId: transaction.categoryId,
                    categoryName: transaction.categoryName,
                    categoryIcon: transaction.categoryIcon,
                    categoryColor: transaction.categoryColor,
                    isIncome: transaction.isIncome,
                    note: transaction.note,
                    date: transaction.date,
                    time: transaction.time,
                    image: transaction.image,
                    createdAt: transaction.createdAt,
                    updatedAt: transaction.updatedAt,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };

            return {
                status: StatusResponse.SUCCESS,
                message: 'Lấy danh sách giao dịch thành công',
                data: responseData,
            };
        } catch (error) {
            console.error('Error getting transactions:', error);
            return {
                status: StatusResponse.INTERNAL_SERVER_ERROR,
                message: 'Có lỗi xảy ra khi lấy danh sách giao dịch',
            };
        }
    }

    async getTransactionById(
        transactionId: string,
        userId: Types.ObjectId,
    ): Promise<{ status: number; message: string; data?: TransactionResponseDto }> {
        try {
            const transaction = await this.transactionModel
                .findOne({ _id: transactionId, userId: userId })
                .exec();

            if (!transaction) {
                return {
                    status: StatusResponse.NOT_FOUND,
                    message: 'Không tìm thấy giao dịch',
                };
            }

            const responseData: TransactionResponseDto = {
                id: transaction._id.toString(),
                userId: transaction.userId.toString(),
                amount: transaction.amount,
                category: transaction.category,
                categoryId: transaction.categoryId,
                categoryName: transaction.categoryName,
                categoryIcon: transaction.categoryIcon,
                categoryColor: transaction.categoryColor,
                isIncome: transaction.isIncome,
                note: transaction.note,
                date: transaction.date,
                time: transaction.time,
                image: transaction.image,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            };

            return {
                status: StatusResponse.SUCCESS,
                message: 'Lấy thông tin giao dịch thành công',
                data: responseData,
            };
        } catch (error) {
            console.error('Error getting transaction:', error);
            return {
                status: StatusResponse.INTERNAL_SERVER_ERROR,
                message: 'Có lỗi xảy ra khi lấy thông tin giao dịch',
            };
        }
    }

    async updateTransaction(
        transactionId: string,
        userId: Types.ObjectId,
        updateTransactionDto: CreateTransactionDto,
    ): Promise<{ status: number; message: string; data?: TransactionResponseDto }> {
        try {
            const transaction = await this.transactionModel
                .findOneAndUpdate(
                    { _id: transactionId, userId: userId },
                    {
                        ...updateTransactionDto,
                        date: new Date(updateTransactionDto.date),
                        time: new Date(updateTransactionDto.time),
                    },
                    { new: true }
                )
                .exec();

            if (!transaction) {
                return {
                    status: StatusResponse.NOT_FOUND,
                    message: 'Không tìm thấy giao dịch',
                };
            }

            const responseData: TransactionResponseDto = {
                id: transaction._id.toString(),
                userId: transaction.userId.toString(),
                amount: transaction.amount,
                category: transaction.category,
                categoryId: transaction.categoryId,
                categoryName: transaction.categoryName,
                categoryIcon: transaction.categoryIcon,
                categoryColor: transaction.categoryColor,
                isIncome: transaction.isIncome,
                note: transaction.note,
                date: transaction.date,
                time: transaction.time,
                image: transaction.image,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            };

            return {
                status: StatusResponse.SUCCESS,
                message: 'Cập nhật giao dịch thành công',
                data: responseData,
            };
        } catch (error) {
            console.error('Error updating transaction:', error);
            return {
                status: StatusResponse.INTERNAL_SERVER_ERROR,
                message: 'Có lỗi xảy ra khi cập nhật giao dịch',
            };
        }
    }

    async deleteTransaction(
        transactionId: string,
        userId: Types.ObjectId,
    ): Promise<{ status: number; message: string }> {
        try {
            const transaction = await this.transactionModel
                .findOneAndDelete({ _id: transactionId, userId: userId })
                .exec();

            if (!transaction) {
                return {
                    status: StatusResponse.NOT_FOUND,
                    message: 'Không tìm thấy giao dịch',
                };
            }

            return {
                status: StatusResponse.SUCCESS,
                message: 'Xóa giao dịch thành công',
            };
        } catch (error) {
            console.error('Error deleting transaction:', error);
            return {
                status: StatusResponse.INTERNAL_SERVER_ERROR,
                message: 'Có lỗi xảy ra khi xóa giao dịch',
            };
        }
    }

}
