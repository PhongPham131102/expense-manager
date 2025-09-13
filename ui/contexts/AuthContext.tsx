import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { apiService, AuthResponse } from "@/services/api";
import { router } from "expo-router";

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
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const userData = await AsyncStorage.getItem("userData");

      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);

      // Mock API call - replace with real API when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      const mockResponse = {
        accessToken: "mock-access-token",
        userId: "mock-user-id",
        userData: {
          username: username,
          name: "Mock User",
        },
        role: { name: "user" },
        permission: [],
      };

      // Store tokens and user data
      await AsyncStorage.setItem("accessToken", mockResponse.accessToken);
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(mockResponse.userData)
      );

      setUser({
        id: mockResponse.userId,
        username: mockResponse.userData.username,
        name: mockResponse.userData.name,
        role: mockResponse.role,
        permission: mockResponse.permission,
      });

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);

      // Mock API call - replace with real API when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      // After successful registration, redirect to login
      router.replace("/login");
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Mock logout - replace with real API when backend is ready
      console.log("Logout called");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage
      await AsyncStorage.multiRemove([
        "accessToken",
        "userData",
        "refreshToken",
      ]);
      setUser(null);

      // Navigate to auth
      router.replace("/onboarding");
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        // Mock refresh token - replace with real API when backend is ready
        console.log("Refresh token called");
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      // If refresh fails, logout user
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
