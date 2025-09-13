import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, AuthResponse, RegisterResponse } from '@/services/api';

export interface User {
    id: string;
    username: string;
    name: string;
    email?: string;
    role: any;
    permission: any;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response: AuthResponse = await apiService.login(credentials);

            // Store tokens in AsyncStorage
            await AsyncStorage.setItem('accessToken', response.accessToken);
            await AsyncStorage.setItem('userData', JSON.stringify(response.userData));

            return {
                accessToken: response.accessToken,
                userId: response.userId,
                userData: response.userData,
                role: response.role,
                permission: response.permission,
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Đăng nhập thất bại');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            // Set default role for new users
            const registerData = {
                ...userData,
                role: '659ba7c62b611171a5347a96', // Default user role ID
            };

            const response = await apiService.register(registerData);
            return response;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Đăng ký thất bại');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            // Try to call logout API (optional)
            try {
                await apiService.logout();
            } catch (apiError) {
                console.log('Logout API call failed, but continuing with local logout');
            }

            // Always clear AsyncStorage regardless of API call result
            await AsyncStorage.multiRemove(['accessToken', 'userData', 'refreshToken']);

            return true;
        } catch (error: any) {
            // If anything fails, still clear local storage
            await AsyncStorage.multiRemove(['accessToken', 'userData', 'refreshToken']);
            return true;
        }
    }
);

export const refreshUserToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.refreshToken();
            await AsyncStorage.setItem('accessToken', response.accessToken);
            return response.accessToken;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Refresh token thất bại');
        }
    }
);

export const loadUserFromStorage = createAsyncThunk(
    'auth/loadFromStorage',
    async (_, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const userData = await AsyncStorage.getItem('userData');

            if (token && userData) {
                const parsedUserData = JSON.parse(userData);
                return {
                    accessToken: token,
                    userData: parsedUserData,
                };
            }

            return null;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Lỗi khi tải dữ liệu từ storage');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        updateUserProfile: (state, action: PayloadAction<{ name: string; email?: string; username: string }>) => {
            if (state.user) {
                state.user.name = action.payload.name;
                state.user.username = action.payload.username;
                if (action.payload.email !== undefined) {
                    state.user.email = action.payload.email;
                }
            }
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.accessToken = action.payload.accessToken;
                state.user = {
                    id: action.payload.userId,
                    username: action.payload.userData.username,
                    name: action.payload.userData.name,
                    email: action.payload.userData.email,
                    role: action.payload.role,
                    permission: action.payload.permission,
                };
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            });

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
            });

        // Refresh Token
        builder
            .addCase(refreshUserToken.fulfilled, (state, action) => {
                state.accessToken = action.payload;
            })
            .addCase(refreshUserToken.rejected, (state) => {
                // If refresh fails, logout user
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
            });

        // Load from storage
        builder
            .addCase(loadUserFromStorage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadUserFromStorage.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.accessToken = action.payload.accessToken;
                    state.user = {
                        id: 'temp-id', // We don't store user ID in AsyncStorage
                        username: action.payload.userData.username,
                        name: action.payload.userData.name,
                        email: action.payload.userData.email,
                        role: { name: 'user' }, // Default role
                        permission: [],
                    };
                    state.isAuthenticated = true;
                }
            })
            .addCase(loadUserFromStorage.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, setLoading, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
