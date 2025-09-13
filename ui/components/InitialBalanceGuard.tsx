import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { apiService } from "@/services/api";

interface InitialBalanceGuardProps {
  children: React.ReactNode;
}

export const InitialBalanceGuard: React.FC<InitialBalanceGuardProps> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkInitialBalance = async () => {
      if (!isAuthenticated || !user || hasChecked) {
        return;
      }

      try {
        setIsChecking(true);
        console.log("Checking initial balance status for user:", user.id);
        const response = await apiService.getInitialBalanceStatus();
        console.log("Initial balance status response:", response);

        if (response.status === 1 && response.data) {
          if (!response.data.hasSetInitialBalance) {
            console.log("User hasn't set initial balance, redirecting...");
            // User hasn't set initial balance, redirect to set-initial-balance screen
            router.replace("/set-initial-balance");
            return;
          } else {
            console.log("User has already set initial balance");
          }
        } else {
          console.log("Invalid response, redirecting to set initial balance");
          // If response is invalid, assume user needs to set initial balance
          router.replace("/set-initial-balance");
          return;
        }
      } catch (error) {
        console.error("Error checking initial balance status:", error);
        // If there's an error, redirect to set initial balance (safer approach)
        console.log("Error occurred, redirecting to set initial balance");
        router.replace("/set-initial-balance");
        return;
      } finally {
        setIsChecking(false);
        setHasChecked(true);
      }
    };

    checkInitialBalance();
  }, [isAuthenticated, user, hasChecked]);

  // Show loading while checking initial balance status
  if (isAuthenticated && isChecking) {
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
    backgroundColor: "#F8F9FA",
  },
});
