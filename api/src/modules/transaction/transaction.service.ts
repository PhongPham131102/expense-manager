import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../../database/entity/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { DashboardResponseDto, CategoryStatsDto, WeeklyStatsDto, MonthlyStatsDto } from './dto/dashboard-response.dto';
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

    async getDashboardData(
        userId: Types.ObjectId,
        period: string = 'today'
    ): Promise<{ status: number; message: string; data?: DashboardResponseDto }> {
        try {
            const now = new Date();
            let startDate: Date;
            let endDate: Date = now;

            // Calculate date range based on period
            switch (period) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    startOfWeek.setHours(0, 0, 0, 0);
                    startDate = startOfWeek;
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
                default:
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            }

            // Get transactions for current period
            const currentTransactions = await this.transactionModel
                .find({
                    userId: userId,
                    date: { $gte: startDate, $lte: endDate }
                })
                .exec();

            // Calculate income and spending
            let income = 0;
            let spending = 0;
            const categoryMap = new Map<string, { amount: number; name: string; color: string; icon: string }>();

            currentTransactions.forEach(transaction => {
                if (transaction.isIncome) {
                    income += transaction.amount;
                } else {
                    spending += transaction.amount;

                    // Aggregate by category
                    const categoryKey = transaction.categoryId;
                    if (categoryMap.has(categoryKey)) {
                        const existing = categoryMap.get(categoryKey)!;
                        existing.amount += transaction.amount;
                    } else {
                        categoryMap.set(categoryKey, {
                            amount: transaction.amount,
                            name: transaction.categoryName,
                            color: transaction.categoryColor,
                            icon: transaction.categoryIcon
                        });
                    }
                }
            });

            // Convert category map to array and calculate percentages
            const totalSpending = spending;
            const categories: CategoryStatsDto[] = Array.from(categoryMap.entries()).map(([id, data]) => ({
                id,
                name: data.name,
                amount: data.amount,
                percentage: totalSpending > 0 ? Math.round((data.amount / totalSpending) * 100) : 0,
                color: data.color,
                icon: data.icon
            })).sort((a, b) => b.amount - a.amount);

            // Calculate weekly comparison
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);

            const lastWeekStart = new Date(weekStart);
            lastWeekStart.setDate(weekStart.getDate() - 7);

            const lastWeekEnd = new Date(weekStart);
            lastWeekEnd.setMilliseconds(-1);

            const thisWeekTransactions = await this.transactionModel
                .find({
                    userId: userId,
                    date: { $gte: weekStart, $lte: now },
                    isIncome: false
                })
                .exec();

            const lastWeekTransactions = await this.transactionModel
                .find({
                    userId: userId,
                    date: { $gte: lastWeekStart, $lte: lastWeekEnd },
                    isIncome: false
                })
                .exec();

            const thisWeekSpending = thisWeekTransactions.reduce((sum, t) => sum + t.amount, 0);
            const lastWeekSpending = lastWeekTransactions.reduce((sum, t) => sum + t.amount, 0);
            const weeklyPercentage = lastWeekSpending > 0 ?
                Math.round(((thisWeekSpending - lastWeekSpending) / lastWeekSpending) * 100) : 0;

            // Calculate monthly comparison
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

            const thisMonthTransactions = await this.transactionModel
                .find({
                    userId: userId,
                    date: { $gte: monthStart, $lte: now },
                    isIncome: false
                })
                .exec();

            const lastMonthTransactions = await this.transactionModel
                .find({
                    userId: userId,
                    date: { $gte: lastMonthStart, $lte: lastMonthEnd },
                    isIncome: false
                })
                .exec();

            const thisMonthSpending = thisMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
            const lastMonthSpending = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
            const monthlyPercentage = lastMonthSpending > 0 ?
                Math.round(((thisMonthSpending - lastMonthSpending) / lastMonthSpending) * 100) : 0;

            // Calculate total balance (assuming we have some initial balance or income history)
            // For now, we'll use a simple calculation: total income - total spending
            const allIncomeTransactions = await this.transactionModel
                .find({ userId: userId, isIncome: true })
                .exec();

            const allSpendingTransactions = await this.transactionModel
                .find({ userId: userId, isIncome: false })
                .exec();

            const totalIncome = allIncomeTransactions.reduce((sum, t) => sum + t.amount, 0);
            const totalSpendingAll = allSpendingTransactions.reduce((sum, t) => sum + t.amount, 0);
            const totalBalance = totalIncome - totalSpendingAll;

            const dashboardData: DashboardResponseDto = {
                totalBalance: Math.max(0, totalBalance), // Ensure balance is not negative
                income,
                spending,
                categories,
                weeklySpending: {
                    thisWeek: thisWeekSpending,
                    lastWeek: lastWeekSpending,
                    percentage: weeklyPercentage
                },
                monthlySpending: {
                    thisMonth: thisMonthSpending,
                    lastMonth: lastMonthSpending,
                    percentage: monthlyPercentage
                }
            };

            return {
                status: StatusResponse.SUCCESS,
                message: 'Lấy dữ liệu dashboard thành công',
                data: dashboardData
            };
        } catch (error) {
            console.error('Error getting dashboard data:', error);
            return {
                status: StatusResponse.INTERNAL_SERVER_ERROR,
                message: 'Có lỗi xảy ra khi lấy dữ liệu dashboard'
            };
        }
    }

}
