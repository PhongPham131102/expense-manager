import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "@/store/hooks";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const { user } = useAppSelector((state) => state.auth);

  // Mock data - sẽ thay thế bằng API thật sau
  const mockData = {
    totalBalance: 4850000,
    todayIncome: 0,
    todayExpense: 75000,
    expenseCategories: [
      {
        name: "Thuốc",
        amount: 50000,
        percentage: 67,
        color: "#FF6B6B",
        icon: "medical",
      },
      {
        name: "Thực phẩm",
        amount: 25000,
        percentage: 33,
        color: "#FFD93D",
        icon: "restaurant",
      },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#2ECC71" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusBar} />
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Chào {user?.name || "Người dùng"}</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Tổng số dư</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              {formatCurrency(mockData.totalBalance)}
            </Text>
            <TouchableOpacity style={styles.eyeButton}>
              <Ionicons name="eye-outline" size={20} color="#2ECC71" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Income/Expense Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tình hình thu chi</Text>
            <TouchableOpacity style={styles.timeFilter}>
              <Text style={styles.timeFilterText}>Hôm nay</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Chart Placeholder */}
          <View style={styles.chartContainer}>
            <View style={styles.barChart}>
              <View style={[styles.bar, { height: "100%" }]} />
              <Text style={styles.chartLabel}>0%</Text>
              <Text style={styles.chartLabelTop}>100%</Text>
            </View>
          </View>

          {/* Income/Expense Details */}
          <View style={styles.incomeExpenseRow}>
            <View style={styles.incomeExpenseItem}>
              <View style={[styles.dot, { backgroundColor: "#2ECC71" }]} />
              <Text style={styles.incomeExpenseLabel}>Thu</Text>
              <Text style={styles.incomeAmount}>
                {formatCurrency(mockData.todayIncome)}
              </Text>
            </View>
            <View style={styles.incomeExpenseItem}>
              <View style={[styles.dot, { backgroundColor: "#2ECC71" }]} />
              <Text style={styles.incomeExpenseLabel}>Chi</Text>
              <Text style={styles.expenseAmount}>
                {formatCurrency(mockData.todayExpense)}
              </Text>
            </View>
          </View>
        </View>

        {/* Expense Report Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Báo cáo chi tiêu</Text>

          <View style={styles.reportContainer}>
            {/* Donut Chart Placeholder */}
            <View style={styles.donutChart}>
              <View style={styles.donutChartInner}>
                <View style={styles.donutChartSegment1} />
                <View style={styles.donutChartSegment2} />
                <View style={styles.donutChartCenter}>
                  <Ionicons name="medical" size={20} color="#FF6B6B" />
                  <Ionicons name="add" size={12} color="#FF6B6B" />
                </View>
                <View style={styles.donutChartCenter2}>
                  <Ionicons name="restaurant" size={16} color="#FFD93D" />
                </View>
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              {mockData.expenseCategories.map((category, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={12}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.legendText}>
                    {category.percentage}% - {formatCurrency(category.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
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
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  notificationButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  balanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2ECC71",
  },
  eyeButton: {
    padding: 8,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  timeFilter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  timeFilterText: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  barChart: {
    width: 60,
    height: 120,
    position: "relative",
    alignItems: "center",
  },
  bar: {
    width: 40,
    backgroundColor: "#FF6B6B",
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  chartLabelTop: {
    fontSize: 12,
    color: "#666",
    position: "absolute",
    top: -20,
  },
  incomeExpenseRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  incomeExpenseItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  incomeExpenseLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ECC71",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  reportContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  donutChart: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  donutChartInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: "relative",
  },
  donutChartSegment1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FF6B6B",
    transform: [{ rotate: "0deg" }],
  },
  donutChartSegment2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFD93D",
    transform: [{ rotate: "240deg" }],
  },
  donutChartCenter: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  donutChartCenter2: {
    position: "absolute",
    top: 30,
    right: 30,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  legendText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});
