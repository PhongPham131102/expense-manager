import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiService } from "@/services/api";
import { showToast } from "@/utils/toast";

export default function VerifyOTPScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  const validateOTP = (otp: string): boolean => {
    return /^\d{6}$/.test(otp);
  };

  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      showToast.error("Vui lòng nhập mã OTP");
      return;
    }

    if (!validateOTP(otpCode)) {
      showToast.error("Mã OTP phải có đúng 6 chữ số");
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.verifyOTP(email, otpCode);

      if (response.status === 1 && response.valid) {
        showToast.success(response.message);
        // Navigate to reset password screen
        setTimeout(() => {
          router.push({
            pathname: "/reset-password",
            params: { email, otpCode },
          });
        }, 1500);
      } else {
        showToast.error(response.message || "Mã OTP không hợp lệ");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showToast.error("Có lỗi xảy ra khi xác thực mã OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await apiService.forgotPassword(email);

      if (response.status === 1) {
        showToast.success("Mã OTP mới đã được gửi");
      } else {
        showToast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      showToast.error("Có lỗi xảy ra khi gửi lại mã OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Xác thực OTP</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={80}
              color="#2ECC71"
            />
          </View>

          <Text style={styles.title}>Nhập mã OTP</Text>
          <Text style={styles.subtitle}>
            Chúng tôi đã gửi mã OTP 6 chữ số đến email{" "}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mã OTP</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="key-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Nhập mã OTP 6 chữ số"
                placeholderTextColor="#999"
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="numeric"
                maxLength={6}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Đang xác thực..." : "Xác thực OTP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendOTP}
            disabled={loading}
          >
            <Text style={styles.resendButtonText}>Gửi lại mã OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToLoginText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#2ECC71",
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  emailText: {
    fontWeight: "600",
    color: "#2ECC71",
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    paddingHorizontal: 15,
    minHeight: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 15,
    textAlign: "center",
    letterSpacing: 2,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#2ECC71",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#2ECC71",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 10,
  },
  resendButtonText: {
    color: "#2ECC71",
    fontSize: 16,
    fontWeight: "500",
  },
  backToLoginButton: {
    alignItems: "center",
    paddingVertical: 15,
  },
  backToLoginText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
});
