export class CategoryStatsDto {
    id: string;
    name: string;
    amount: number;
    percentage: number;
    color: string;
    icon: string;
}

export class WeeklyStatsDto {
    thisWeek: number;
    lastWeek: number;
    percentage: number;
}

export class MonthlyStatsDto {
    thisMonth: number;
    lastMonth: number;
    percentage: number;
}

export class DashboardResponseDto {
    totalBalance: number;
    income: number;
    spending: number;
    categories: CategoryStatsDto[];
    weeklySpending: WeeklyStatsDto;
    monthlySpending: MonthlyStatsDto;
}
