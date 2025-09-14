import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshUserToken,
  loadUserFromStorage,
} from "@/store/slices/authSlice";
import { showToast } from "@/utils/toast";

interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: any;
  permission: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isLoading, isAuthenticated, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Load user from storage on app start
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // Navigation logic is handled by AuthGuard component

  const login = async (username: string, password: string) => {
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      showToast.success("Đăng nhập thành công!");
      // Navigate to dashboard after successful login
      // InitialBalanceGuard will handle checking if user needs to set initial balance
      router.replace("/(tabs)");
    } catch (error: any) {
      // Extract clean error message
      console.log("Login error in AuthContext:", error);
      let errorMessage = error?.message || "Đăng nhập thất bại";

      // Remove common prefixes
      if (errorMessage.includes("API Error: Error:")) {
        errorMessage = errorMessage.replace("API Error: Error:", "").trim();
      }
      if (errorMessage.includes("Error:")) {
        errorMessage = errorMessage.replace("Error:", "").trim();
      }

      // Show specific error message
      console.log("Final error message:", errorMessage);
      showToast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      showToast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      // Navigate to login screen after successful registration
      router.replace("/login");
    } catch (error: any) {
      // Extract clean error message, remove "API Error: Error:" prefix
      let errorMessage = error?.message || "Đăng ký thất bại";
      if (errorMessage.includes("API Error: Error:")) {
        errorMessage = errorMessage.replace("API Error: Error:", "").trim();
      }
      showToast.error(errorMessage, "Lỗi đăng ký");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      showToast.success("Đăng xuất thành công!");
      // Navigate to onboarding after successful logout
      router.replace("/onboarding");
    } catch (error) {
      showToast.error("Có lỗi xảy ra khi đăng xuất");
      // Even if logout fails, navigate to onboarding
      router.replace("/onboarding");
    }
  };

  const refreshToken = async () => {
    try {
      await dispatch(refreshUserToken()).unwrap();
    } catch (error) {
      showToast.error("Phiên đăng nhập đã hết hạn");
      // If refresh fails, logout user
      await logout();
    }
  };

  const clearError = () => {
    dispatch({ type: "auth/clearError" });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
