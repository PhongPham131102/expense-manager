import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { apiService, DashboardData } from "@/services/api";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { TimePeriodSelector } from "@/components/dashboard/TimePeriodSelector";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import { showToast } from "@/utils/toast";

export default function DashboardScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [isBalanceVisible] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const loadDashboardData = async (period: string) => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardData(period);

      if (response.status === 1 && response.data) {
        setDashboardData(response.data);
      } else {
        showToast.error("Không thể tải dữ liệu dashboard");
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showToast.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(selectedPeriod);
  }, [selectedPeriod]);

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData(selectedPeriod);
    }, [selectedPeriod])
  );

  useEffect(() => {
    // Setup global refresh callback
    (global as any).refreshDashboardCallback = () => {
      loadDashboardData(selectedPeriod);
    };
    return () => {
      (global as any).refreshDashboardCallback = null;
    };
  }, [selectedPeriod]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2ECC71" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusBar} />
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Chào {user?.name || "Người dùng"}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                console.log("Navigating to add-record...");
                router.push("/add-record?refreshCallback=true");
              }}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : dashboardData ? (
          <>
            {/* Total Balance Card */}
            <BalanceCard balance={dashboardData.totalBalance} />

            {/* Income/Expense Section */}
            <View style={styles.section}>
              <TimePeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />

              <IncomeExpenseChart
                income={dashboardData.income}
                spending={dashboardData.spending}
                isVisible={isBalanceVisible}
              />
            </View>

            {/* Comparison Chart Section */}
            <ComparisonChart
              weeklyData={dashboardData.weeklySpending}
              monthlyData={dashboardData.monthlySpending}
              isVisible={isBalanceVisible}
            />
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Không có dữ liệu</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  statusBar: {
    height: 44,
    backgroundColor: "#2ECC71",
  },
  header: {
    backgroundColor: "#2ECC71",
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 8,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    flex: 1,
    marginTop: -10,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 16,
    color: "#E74C3C",
  },
});
