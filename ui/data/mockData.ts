// Mock data for dashboard testing
export interface Category {
    id: string;
    name: string;
    amount: number;
    percentage: number;
    color: string;
    icon: string;
}

export interface ExpenseData {
    totalBalance: number;
    income: number;
    spending: number;
    categories: Category[];
    weeklySpending: {
        thisWeek: number;
        lastWeek: number;
        percentage: number;
    };
    monthlySpending: {
        thisMonth: number;
        lastMonth: number;
        percentage: number;
    };
}

export const mockExpenseData: ExpenseData = {
    totalBalance: 4850000,
    income: 0,
    spending: 150000,
    categories: [
        {
            id: '1',
            name: 'Cà phê',
            amount: 25000,
            percentage: 17,
            color: '#4A90E2',
            icon: '☕'
        },
        {
            id: '2',
            name: 'Sữa & Cà phê',
            amount: 25000,
            percentage: 17,
            color: '#FF9500',
            icon: '🥛'
        },
        {
            id: '3',
            name: 'Tài liệu',
            amount: 50000,
            percentage: 33,
            color: '#8E44AD',
            icon: '📄'
        },
        {
            id: '4',
            name: 'Thuốc',
            amount: 50000,
            percentage: 33,
            color: '#E91E63',
            icon: '💊'
        }
    ],
    weeklySpending: {
        thisWeek: 150000,
        lastWeek: 120000,
        percentage: 25
    },
    monthlySpending: {
        thisMonth: 600000,
        lastMonth: 500000,
        percentage: 20
    }
};

export const timePeriods = [
    { label: 'Hôm nay', value: 'today' },
    { label: 'Tuần này', value: 'week' },
    { label: 'Tháng này', value: 'month' },
    { label: 'Năm nay', value: 'year' }
];

// Format currency to VND
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(amount);
};

// Format number with thousand separators
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(num);
};
