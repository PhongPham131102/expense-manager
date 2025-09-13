import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = Platform.OS === 'ios'
    ? 'http://localhost:5202/api/v1'
    : 'http://10.0.2.2:5202/api/v1'; // Android emulator

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email?: string;
    name: string;
    password: string;
    role: string;
}

export interface AuthResponse {
    accessToken: string;
    userId: string;
    status: number;
    message: string;
    role: any;
    permission: any;
    userData: {
        username: string;
        name: string;
        email?: string;
    };
}

export interface RegisterResponse {
    status: number;
    messsage: string; // Note: backend has typo "messsage"
    data: {
        username: string;
        name: string;
        role: any;
    };
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    status: number;
    message: string;
}

export interface UpdateProfileRequest {
    name: string;
    email?: string;
    username: string;
}

export interface UpdateProfileResponse {
    status: number;
    message: string;
    data?: {
        name: string;
        email?: string;
        username: string;
    };
}

export interface CreateTransactionRequest {
    amount: number;
    category: string;
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    isIncome: boolean;
    note?: string;
    date: string;
    time: string;
    image?: string;
}

export interface TransactionResponse {
    id: string;
    userId: string;
    amount: number;
    category: string;
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    isIncome: boolean;
    note: string;
    date: Date;
    time: Date;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTransactionResponse {
    status: number;
    message: string;
    data?: TransactionResponse;
}

export interface CategoryStats {
    id: string;
    name: string;
    amount: number;
    percentage: number;
    color: string;
    icon: string;
}

export interface WeeklyStats {
    thisWeek: number;
    lastWeek: number;
    percentage: number;
}

export interface MonthlyStats {
    thisMonth: number;
    lastMonth: number;
    percentage: number;
}

export interface DashboardData {
    totalBalance: number;
    income: number;
    spending: number;
    categories: CategoryStats[];
    weeklySpending: WeeklyStats;
    monthlySpending: MonthlyStats;
}

export interface DashboardResponse {
    status: number;
    message: string;
    data?: DashboardData;
}

export interface GetTransactionsResponse {
    status: number;
    message: string;
    data?: {
        transactions: TransactionResponse[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export interface ApiError {
    status: number;
    message: string;
    column?: string;
}

class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private async getAuthToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem('accessToken');
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        requireAuth: boolean = false
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Add Authorization header if required
        if (requireAuth) {
            const token = await this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const config: RequestInit = {
            headers,
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                let errorStatus = response.status;
                let errorColumn = undefined;

                try {
                    const errorData = await response.json();

                    // Handle backend StatusResponse codes
                    if (errorData.status) {
                        switch (errorData.status) {
                            case 5: // EXISTS_USERNAME
                                errorMessage = 'Tên đăng nhập đã tồn tại';
                                break;
                            case 6: // EXISTS_EMAIL
                                errorMessage = 'Email đã được sử dụng';
                                break;
                            case 8: // NOT_EXISTS_ROLE
                                errorMessage = 'Vai trò không tồn tại';
                                break;
                            case 9: // USERNAME_OR_PASSWORD_IS_NOT_CORRECT
                                errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
                                break;
                            case 10: // PASSWORD_INCORRECT
                                errorMessage = 'Mật khẩu không đúng';
                                break;
                            default:
                                errorMessage = errorData.message || errorMessage;
                        }
                    } else if (errorData.message && Array.isArray(errorData.message)) {
                        // Handle NestJS validation error format
                        errorMessage = errorData.message.join(', ');
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    }

                    errorStatus = errorData.status || errorData.statusCode || errorStatus;
                } catch {
                    // If response is not JSON (e.g., HTML error page), use status text
                    console.log('Response is not JSON, using status text');
                }

                const error = new Error(errorMessage);
                (error as any).status = errorStatus;
                (error as any).column = errorColumn;
                throw error;
            }

            return await response.json();
        } catch (error) {
            // Don't log to console to avoid duplicate error display
            throw error;
        }
    }

    // Authentication APIs
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auths/sign-in', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async register(userData: RegisterRequest): Promise<RegisterResponse> {
        return this.request<RegisterResponse>('/auths/sign-up', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async refreshToken(): Promise<{ accessToken: string }> {
        return this.request<{ accessToken: string }>('/auths/refresh-token', {
            method: 'GET',
        });
    }

    async logout(): Promise<void> {
        return this.request<void>('/auths/logout', {
            method: 'POST',
        }, true); // requireAuth = true
    }

    // User APIs
    async getUserProfile(): Promise<any> {
        return this.request<any>('/user/profile');
    }

    async changePassword(passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> {
        return this.request<ChangePasswordResponse>('/user/change-password', {
            method: 'POST',
            body: JSON.stringify(passwordData),
        }, true); // requireAuth = true
    }

    async updateProfile(profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> {
        return this.request<UpdateProfileResponse>('/user/update-profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        }, true); // requireAuth = true
    }

    // Transaction APIs
    async createTransaction(transactionData: CreateTransactionRequest): Promise<CreateTransactionResponse> {
        return this.request<CreateTransactionResponse>('/transactions', {
            method: 'POST',
            body: JSON.stringify(transactionData),
        }, true); // requireAuth = true
    }

    async getTransactions(
        page: number = 1,
        limit: number = 10,
        startDate?: string,
        endDate?: string
    ): Promise<GetTransactionsResponse> {
        let url = `/transactions?page=${page}&limit=${limit}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;

        return this.request<GetTransactionsResponse>(url, {
            method: 'GET',
        }, true); // requireAuth = true
    }

    async getTransactionById(transactionId: string): Promise<CreateTransactionResponse> {
        return this.request<CreateTransactionResponse>(`/transactions/${transactionId}`, {
            method: 'GET',
        }, true); // requireAuth = true
    }

    async updateTransaction(transactionId: string, updateData: CreateTransactionRequest): Promise<CreateTransactionResponse> {
        return this.request<CreateTransactionResponse>(`/transactions/${transactionId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        }, true); // requireAuth = true
    }

    async deleteTransaction(transactionId: string): Promise<{ status: number; message: string }> {
        return this.request<{ status: number; message: string }>(`/transactions/${transactionId}`, {
            method: 'DELETE',
        }, true); // requireAuth = true
    }

    async getDashboardData(period: string = 'today'): Promise<DashboardResponse> {
        return this.request<DashboardResponse>(`/transactions/dashboard/data?period=${period}`, {
            method: 'GET',
        }, true); // requireAuth = true
    }


    // Health check
    async healthCheck(): Promise<{ status: string }> {
        return this.request<{ status: string }>('/health');
    }

}

export const apiService = new ApiService();
export default apiService;
