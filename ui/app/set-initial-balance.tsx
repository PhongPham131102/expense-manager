import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { apiService } from "@/services/api";
import { showToast } from "@/utils/toast";

export default function SetInitialBalanceScreen() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const formatAmount = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Add thousands separators
    if (numericValue) {
      return new Intl.NumberFormat("vi-VN").format(parseInt(numericValue));
    }
    return "";
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setAmount(formatted);
  };

  const handleSetBalance = async () => {
    if (!amount || amount.trim() === "") {
      showToast.error("Vui lòng nhập số dư ban đầu");
      return;
    }

    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ""));
    if (numericAmount < 0) {
      showToast.error("Số dư ban đầu không được âm");
      return;
    }

    if (numericAmount > 999999999999) {
      showToast.error("Số dư ban đầu quá lớn");
      return;
    }

    try {
      setLoading(true);
      // Try to update first, if that fails, try to set
      let response;
      try {
        response = await apiService.updateInitialBalance(numericAmount);
      } catch (updateError) {
        console.log("Update failed, trying set:", updateError);
        response = await apiService.setInitialBalance(numericAmount);
      }

      if (response.status === 1) {
        showToast.success("Thiết lập số dư ban đầu thành công!");
        router.replace("/(tabs)");
      } else {
        showToast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error setting initial balance:", error);
      showToast.error("Có lỗi xảy ra khi thiết lập số dư ban đầu");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Bỏ qua",
      "Bạn có chắc chắn muốn bỏ qua việc thiết lập số dư ban đầu? Bạn có thể thiết lập sau trong phần cài đặt.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Bỏ qua",
          style: "destructive",
          onPress: () => router.replace("/(tabs)"),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2ECC71" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusBar} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Thiết lập số dư ban đầu</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="wallet" size={80} color="#2ECC71" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Số dư tài khoản hiện tại</Text>
        <Text style={styles.subtitle}>
          Nhập số dư hiện tại trong tài khoản của bạn để bắt đầu quản lý tài
          chính
        </Text>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.currencyText}>₫</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            autoFocus
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={handleSkip}
            disabled={loading}
          >
            <Text style={styles.skipButtonText}>Bỏ qua</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.confirmButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleSetBalance}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.confirmButtonText}>Đang thiết lập...</Text>
            ) : (
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          💡 Bạn có thể thay đổi số dư ban đầu sau trong phần cài đặt
        </Text>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 200,
  },
  currencyText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2ECC71",
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
  skipButton: {
    backgroundColor: "#E74C3C",
  },
  confirmButton: {
    backgroundColor: "#2ECC71",
  },
  disabledButton: {
    backgroundColor: "#BDC3C7",
  },
  skipButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    fontStyle: "italic",
  },
});
