import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "@/data/mockData";

interface ComparisonChartProps {
  weeklyData: {
    thisWeek: number;
    lastWeek: number;
    percentage: number;
  };
  monthlyData: {
    thisMonth: number;
    lastMonth: number;
    percentage: number;
  };
  isVisible: boolean;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  weeklyData,
  monthlyData,
  isVisible,
}) => {
  const [selectedTab, setSelectedTab] = useState<"week" | "month">("week");

  const currentData = selectedTab === "week" ? weeklyData : monthlyData;
  const currentValue =
    selectedTab === "week" ? weeklyData.thisWeek : monthlyData.thisMonth;
  const lastValue =
    selectedTab === "week" ? weeklyData.lastWeek : monthlyData.lastMonth;

  const maxValue = Math.max(currentValue, lastValue);
  const maxHeight = 120;

  const thisHeight = maxValue > 0 ? (currentValue / maxValue) * maxHeight : 0;
  const lastHeight = maxValue > 0 ? (lastValue / maxValue) * maxHeight : 0;

  const getTrendIcon = () => {
    if (currentData.percentage === 0) {
      return { icon: "remove", color: "#7F8C8D" };
    } else if (currentData.percentage > 0) {
      return { icon: "trending-up", color: "#E74C3C" };
    } else {
      return { icon: "trending-down", color: "#27AE60" };
    }
  };

  const trend = getTrendIcon();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="bar-chart-outline" size={20} color="#2ECC71" />
          <Text style={styles.title}>So sánh chi tiêu</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "week" && styles.activeTab]}
          onPress={() => setSelectedTab("week")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "week" && styles.activeTabText,
            ]}
          >
            Tuần
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "month" && styles.activeTab]}
          onPress={() => setSelectedTab("month")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "month" && styles.activeTabText,
            ]}
          >
            Tháng
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.summarySection}>
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>
              {isVisible ? formatCurrency(currentValue) : "****** ₫"}
            </Text>
            <Text style={styles.amountLabel}>
              {selectedTab === "week" ? "Tuần" : "Tháng"} này
            </Text>
          </View>

          <View style={styles.trendContainer}>
            <View style={styles.trendIcon}>
              <Ionicons
                name={trend.icon as any}
                size={16}
                color={trend.color}
              />
            </View>
            <Text style={[styles.trendPercentage, { color: trend.color }]}>
              {Math.abs(currentData.percentage)}%
            </Text>
            <Text style={styles.trendLabel}>
              so với {selectedTab === "week" ? "tuần" : "tháng"} trước
            </Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.barsContainer}>
            <View style={styles.barGroup}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    styles.lastBar,
                    { height: Math.max(lastHeight, 4) },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>
                {selectedTab === "week" ? "Tuần" : "Tháng"} trước
              </Text>
              <Text style={styles.barValue}>
                {isVisible ? formatCurrency(lastValue) : "****** ₫"}
              </Text>
            </View>

            <View style={styles.barGroup}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    styles.currentBar,
                    { height: Math.max(thisHeight, 4) },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>
                {selectedTab === "week" ? "Tuần" : "Tháng"} này
              </Text>
              <Text style={styles.barValue}>
                {isVisible ? formatCurrency(currentValue) : "****** ₫"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7F8C8D",
  },
  activeTabText: {
    color: "#2ECC71",
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  summarySection: {
    marginBottom: 24,
  },
  amountContainer: {
    marginBottom: 16,
  },
  amount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  trendPercentage: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  trendLabel: {
    fontSize: 13,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  chartSection: {
    alignItems: "center",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 140,
    justifyContent: "space-around",
    width: "100%",
  },
  barGroup: {
    alignItems: "center",
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 12,
  },
  bar: {
    width: 32,
    borderRadius: 4,
    minHeight: 4,
  },
  lastBar: {
    backgroundColor: "#BDC3C7",
  },
  currentBar: {
    backgroundColor: "#2ECC71",
  },
  barLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "center",
  },
  barValue: {
    fontSize: 11,
    color: "#95A5A6",
    fontWeight: "500",
    textAlign: "center",
  },
});
