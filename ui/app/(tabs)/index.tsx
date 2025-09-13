import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { mockExpenseData } from "@/data/mockData";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { TimePeriodSelector } from "@/components/dashboard/TimePeriodSelector";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";

export default function DashboardScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [isBalanceVisible] = useState(true);

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
                router.push("/add-record");
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
        {/* Total Balance Card */}
        <BalanceCard balance={mockExpenseData.totalBalance} />

        {/* Income/Expense Section */}
        <View style={styles.section}>
          <TimePeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          <IncomeExpenseChart
            income={mockExpenseData.income}
            spending={mockExpenseData.spending}
            isVisible={isBalanceVisible}
          />
        </View>

        {/* Comparison Chart Section */}
        <ComparisonChart
          weeklyData={mockExpenseData.weeklySpending}
          monthlyData={mockExpenseData.monthlySpending}
          isVisible={isBalanceVisible}
        />
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
});
