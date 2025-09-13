import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateTransactionDto {
    @IsNumber()
    @Min(1)
    @Max(999999999999)
    amount: number;

    @IsString()
    category: string;

    @IsString()
    categoryId: string;

    @IsString()
    categoryName: string;

    @IsString()
    categoryIcon: string;

    @IsString()
    categoryColor: string;

    @IsBoolean()
    isIncome: boolean;

    @IsOptional()
    @IsString()
    note?: string;

    @IsDateString()
    date: string;

    @IsDateString()
    time: string;

    @IsOptional()
    @IsString()
    image?: string;
}
