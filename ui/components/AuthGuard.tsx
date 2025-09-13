import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAppSelector } from "@/store/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      // Use setTimeout to ensure navigation happens after component is fully mounted
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          // User is logged in, navigate to main app
          router.replace("/(tabs)");
        } else {
          // User is not logged in, navigate to onboarding
          router.replace("/onboarding");
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
