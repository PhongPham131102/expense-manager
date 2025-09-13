import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatCurrency } from "@/data/mockData";

interface IncomeExpenseChartProps {
  income: number;
  spending: number;
  isVisible: boolean;
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  income,
  spending,
  isVisible,
}) => {
  const total = income + spending;
  const incomePercentage = total > 0 ? (income / total) * 100 : 0;
  const spendingPercentage = total > 0 ? (spending / total) * 100 : 0;

  const maxHeight = 100;
  const incomeHeight = (incomePercentage / 100) * maxHeight;
  const spendingHeight = (spendingPercentage / 100) * maxHeight;

  return (
    <View style={styles.container}>
      <View style={styles.chartSection}>
        <View style={styles.barsContainer}>
          <View style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  styles.incomeBar,
                  { height: Math.max(incomeHeight, 4) },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>Thu</Text>
            <Text style={styles.percentageText}>
              {Math.round(incomePercentage)}%
            </Text>
          </View>

          <View style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  styles.spendingBar,
                  { height: Math.max(spendingHeight, 4) },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>Chi</Text>
            <Text style={styles.percentageText}>
              {Math.round(spendingPercentage)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryHeader}>
            <View style={[styles.summaryDot, styles.incomeDot]} />
            <Text style={styles.summaryLabel}>Tổng thu nhập</Text>
          </View>
          <Text style={[styles.summaryValue, styles.incomeValue]}>
            {isVisible ? formatCurrency(income) : "****** ₫"}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryHeader}>
            <View style={[styles.summaryDot, styles.spendingDot]} />
            <Text style={styles.summaryLabel}>Tổng chi tiêu</Text>
          </View>
          <Text style={[styles.summaryValue, styles.spendingValue]}>
            {isVisible ? formatCurrency(spending) : "****** ₫"}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Số dư</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: income - spending >= 0 ? "#27AE60" : "#E74C3C" },
            ]}
          >
            {isVisible ? formatCurrency(income - spending) : "****** ₫"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: 160,
  },
  chartSection: {
    flex: 0.4,
    justifyContent: "center",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 120,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  barWrapper: {
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 8,
  },
  bar: {
    width: 28,
    borderRadius: 4,
    minHeight: 4,
  },
  incomeBar: {
    backgroundColor: "#27AE60",
  },
  spendingBar: {
    backgroundColor: "#E74C3C",
  },
  barLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#7F8C8D",
    marginBottom: 2,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2C3E50",
  },
  summarySection: {
    flex: 0.6,
    paddingLeft: 20,
    justifyContent: "space-between",
  },
  summaryItem: {
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  incomeDot: {
    backgroundColor: "#27AE60",
  },
  spendingDot: {
    backgroundColor: "#E74C3C",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  incomeValue: {
    color: "#27AE60",
  },
  spendingValue: {
    color: "#E74C3C",
  },
  balanceValue: {
    color: "#2C3E50",
  },
  separator: {
    height: 1,
    backgroundColor: "#E8F4FD",
    marginVertical: 8,
  },
});
