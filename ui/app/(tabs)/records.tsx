import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { apiService } from "@/services/api";
import { showToast } from "@/utils/toast";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  isIncome: boolean;
  note: string;
  date: string;
  time: string;
  image?: string;
  createdAt: string;
}

type TabType = "day" | "week" | "month" | "custom";

export default function RecordsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("day");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodStats, setPeriodStats] = useState({
    income: 0,
    expense: 0,
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);

      let startDateParam: string | undefined;
      let endDateParam: string | undefined;

      const now = new Date();

      if (activeTab === "day") {
        // Lọc theo ngày hôm nay
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        startDateParam = startOfDay.toISOString();

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        endDateParam = endOfDay.toISOString();

        console.log("Day filter:", {
          startDate: startOfDay.toDateString(),
          endDate: endOfDay.toDateString(),
          startDateParam,
          endDateParam,
        });
      } else if (activeTab === "week") {
        // Lọc theo tuần (7 ngày từ hôm nay)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 6); // 7 ngày bao gồm hôm nay
        startOfWeek.setHours(0, 0, 0, 0);
        startDateParam = startOfWeek.toISOString();

        const endOfWeek = new Date(now);
        endOfWeek.setHours(23, 59, 59, 999);
        endDateParam = endOfWeek.toISOString();

        console.log("Week filter:", {
          startDate: startOfWeek.toDateString(),
          endDate: endOfWeek.toDateString(),
          startDateParam,
          endDateParam,
        });
      } else if (activeTab === "month") {
        // Lọc theo tháng hiện tại
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);
        startDateParam = startOfMonth.toISOString();

        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        endDateParam = endOfMonth.toISOString();

        console.log("Month filter:", {
          startDate: startOfMonth.toDateString(),
          endDate: endOfMonth.toDateString(),
          startDateParam,
          endDateParam,
        });
      } else if (activeTab === "custom") {
        // Set start date to beginning of day (00:00:00)
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        startDateParam = startOfDay.toISOString();

        // Set end date to end of day (23:59:59.999)
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        endDateParam = endOfDay.toISOString();

        console.log("Custom date range:", {
          startDate: startDate.toDateString(),
          endDate: endDate.toDateString(),
          startDateParam,
          endDateParam,
        });
      }

      const response = await apiService.getTransactions(
        1,
        50,
        startDateParam,
        endDateParam
      );

      if (response.status === 1 && response.data) {
        // Convert TransactionResponse to Transaction format
        const convertedTransactions = response.data.transactions.map(
          (transaction: any) => ({
            ...transaction,
            date: transaction.date.toString(),
            time: transaction.time.toString(),
          })
        );
        setTransactions(convertedTransactions);
        // Always calculate today stats from all transactions, not just filtered ones
        await calculatePeriodStats();
      } else {
        showToast.error("Không thể tải danh sách giao dịch");
      }
    } catch (error: any) {
      console.error("Error loading transactions:", error);
      showToast.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [activeTab, startDate, endDate]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    // Load today stats when component mounts
    calculatePeriodStats();

    // Setup global refresh callback
    (global as any).refreshRecordsCallback = () => {
      loadTransactions();
      calculatePeriodStats();
    };

    // Cleanup on unmount
    return () => {
      (global as any).refreshRecordsCallback = null;
    };
  }, [calculatePeriodStats]);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
      calculatePeriodStats();
    }, [loadTransactions, calculatePeriodStats])
  );

  const calculatePeriodStats = useCallback(async () => {
    try {
      const now = new Date();
      let periodStartDate: Date;
      let periodEndDate: Date;

      if (activeTab === "day") {
        // Tính cho ngày hôm nay
        periodStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        periodEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      } else if (activeTab === "week") {
        // Tính cho tuần (7 ngày từ hôm nay)
        periodStartDate = new Date(now);
        periodStartDate.setDate(now.getDate() - 6);
        periodStartDate.setHours(0, 0, 0, 0);
        periodEndDate = new Date(now);
        periodEndDate.setHours(23, 59, 59, 999);
      } else if (activeTab === "month") {
        // Tính cho tháng hiện tại
        periodStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
        periodStartDate.setHours(0, 0, 0, 0);
        periodEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        periodEndDate.setHours(23, 59, 59, 999);
      } else if (activeTab === "custom") {
        // Tính cho khoảng thời gian tùy chọn
        periodStartDate = new Date(startDate);
        periodStartDate.setHours(0, 0, 0, 0);
        periodEndDate = new Date(endDate);
        periodEndDate.setHours(23, 59, 59, 999);
      } else {
        // Default to today
        periodStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        periodEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      }

      console.log("Calculating stats for period:", {
        activeTab,
        startDate: periodStartDate.toISOString(),
        endDate: periodEndDate.toISOString(),
      });

      // Load all transactions for the period
      const response = await apiService.getTransactions(
        1,
        100, // Load more to ensure we get all transactions
        periodStartDate.toISOString(),
        periodEndDate.toISOString()
      );

      console.log("Stats response:", response);

      if (response.status === 1 && response.data) {
        let income = 0;
        let expense = 0;

        response.data.transactions.forEach((transaction) => {
          console.log("Processing transaction:", {
            amount: transaction.amount,
            isIncome: transaction.isIncome,
            date: transaction.date,
          });

          if (transaction.isIncome) {
            income += transaction.amount;
          } else {
            expense += transaction.amount;
          }
        });

        console.log("Stats calculated:", { income, expense });
        setPeriodStats({ income, expense });
      }
    } catch (error) {
      console.error("Error calculating stats:", error);
      setPeriodStats({ income: 0, expense: 0 });
    }
  }, [activeTab, startDate, endDate]);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Group transactions by date
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};

    transactions.forEach((transaction) => {
      const dateKey = formatDate(transaction.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });

    return grouped;
  };

  const calculateDayStats = (dayTransactions: Transaction[]) => {
    let income = 0;
    let expense = 0;

    dayTransactions.forEach((transaction) => {
      if (transaction.isIncome) {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
      }
    });

    return { income, expense };
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() =>
        router.push(`/add-record?recordId=${item.id}&refreshCallback=true`)
      }
    >
      <View style={styles.transactionLeft}>
        <View
          style={[styles.categoryIcon, { backgroundColor: item.categoryColor }]}
        >
          <Ionicons
            name={item.categoryIcon as keyof typeof Ionicons.glyphMap}
            size={24}
            color="white"
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.categoryName}>{item.categoryName}</Text>
          {item.note && <Text style={styles.note}>{item.note}</Text>}
          {item.image && <Text style={styles.imageNote}>(đính kèm ảnh)</Text>}
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.amount,
            { color: item.isIncome ? "#27AE60" : "#E74C3C" },
          ]}
        >
          {formatAmount(item.amount)} ₫
        </Text>
        <Text style={styles.time}>{formatTime(item.time)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDaySection = (date: string, dayTransactions: Transaction[]) => {
    const dayStats = calculateDayStats(dayTransactions);
    const isToday = date === formatDate(new Date().toISOString());
    const isYesterday =
      date ===
      formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    let dayLabel = date;
    if (isToday) {
      dayLabel = "Hôm nay";
    } else if (isYesterday) {
      dayLabel = "Hôm qua";
    }

    return (
      <View key={date} style={styles.daySection}>
        {/* Day Header */}
        <View style={styles.dayHeader}>
          <View style={styles.dayHeaderLeft}>
            <View style={styles.dayIndicator} />
            <View style={styles.dayInfo}>
              <Text style={styles.dayLabel}>{dayLabel}</Text>
              <Text style={styles.dayDate}>{date}</Text>
            </View>
          </View>
          <View style={styles.dayStats}>
            <Text style={[styles.dayAmount, { color: "#27AE60" }]}>
              {formatAmount(dayStats.income)} ₫
            </Text>
            <Text style={[styles.dayAmount, { color: "#E74C3C" }]}>
              {formatAmount(dayStats.expense)} ₫
            </Text>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.daySeparator} />

        {/* Transactions */}
        <View style={styles.dayTransactions}>
          {dayTransactions.map((transaction, index) => (
            <View key={transaction.id} style={styles.transactionContainer}>
              {index < dayTransactions.length - 1 && (
                <View style={styles.transactionConnector} />
              )}
              {renderTransactionItem({ item: transaction })}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleSearch = () => {
    loadTransactions();
  };

  const renderCustomFilter = () => (
    <View style={styles.customFilterContainer}>
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {formatDate(startDate.toISOString())}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
        <Text style={styles.dateLabel}>Từ ngày</Text>
      </View>

      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {formatDate(endDate.toISOString())}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
        <Text style={styles.dateLabel}>Đến ngày</Text>
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#27AE60" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "day" && styles.activeTab]}
            onPress={() => setActiveTab("day")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "day" && styles.activeTabText,
              ]}
            >
              Ngày
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "week" && styles.activeTab]}
            onPress={() => setActiveTab("week")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "week" && styles.activeTabText,
              ]}
            >
              Tuần
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "month" && styles.activeTab]}
            onPress={() => setActiveTab("month")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "month" && styles.activeTabText,
              ]}
            >
              Tháng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "custom" && styles.activeTab]}
            onPress={() => setActiveTab("custom")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "custom" && styles.activeTabText,
              ]}
            >
              Tùy chọn
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Custom Filter */}
        {activeTab === "custom" && renderCustomFilter()}

        {/* Summary based on active tab */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>
              {activeTab === "day" && "Hôm nay"}
              {activeTab === "week" && "Tuần này"}
              {activeTab === "month" && "Tháng này"}
              {activeTab === "custom" && "Khoảng thời gian"}
            </Text>
            <Text style={styles.summaryDate}>
              {activeTab === "day" && formatDate(new Date().toISOString())}
              {activeTab === "week" && `${formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString())} - ${formatDate(new Date().toISOString())}`}
              {activeTab === "month" && `${new Date().getMonth() + 1}/${new Date().getFullYear()}`}
              {activeTab === "custom" && `${formatDate(startDate.toISOString())} - ${formatDate(endDate.toISOString())}`}
            </Text>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statAmount, { color: "#27AE60" }]}>
                {formatAmount(periodStats.income)} ₫
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statAmount, { color: "#E74C3C" }]}>
                {formatAmount(periodStats.expense)} ₫
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Transaction List */}
        <View style={styles.transactionList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : transactions.length > 0 ? (
            <View>
              {Object.entries(groupTransactionsByDate(transactions))
                .sort(
                  ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
                )
                .map(([date, dayTransactions]) =>
                  renderDaySection(date, dayTransactions)
                )}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#27AE60",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  customFilterContainer: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  dateRow: {
    marginBottom: 15,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  searchButton: {
    backgroundColor: "#27AE60",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  summaryHeader: {
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  summaryDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
  },
  transactionList: {
    padding: 20,
  },
  daySection: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dayIndicator: {
    width: 4,
    height: 40,
    backgroundColor: "#27AE60",
    borderRadius: 2,
    marginRight: 12,
  },
  dayInfo: {
    flex: 1,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dayDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  dayStats: {
    alignItems: "flex-end",
  },
  dayAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  daySeparator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  dayTransactions: {
    paddingLeft: 16,
  },
  transactionContainer: {
    position: "relative",
  },
  transactionConnector: {
    position: "absolute",
    left: -8,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 8,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  note: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  imageNote: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginTop: 2,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
});
