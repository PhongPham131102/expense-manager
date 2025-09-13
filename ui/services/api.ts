import { Platform } from 'react-native';

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
    status: string;
    message: string;
    role: any;
    permission: any;
    userData: {
        username: string;
        name: string;
    };
}

export interface ApiError {
    status: string;
    message: string;
    column?: string;
}

class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication APIs
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        return this.request<{ accessToken: string }>('/auth/refresh-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
            },
        });
    }

    async logout(): Promise<void> {
        return this.request<void>('/auth/logout', {
            method: 'POST',
        });
    }

    // User APIs
    async getUserProfile(): Promise<any> {
        return this.request<any>('/user/profile');
    }

    // Health check
    async healthCheck(): Promise<{ status: string }> {
        return this.request<{ status: string }>('/health');
    }
}

export const apiService = new ApiService();
export default apiService;
