import React, { useState, useEffect } from "react";
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

export default function ResetPasswordScreen() {
  const { email, otpCode } = useLocalSearchParams<{
    email: string;
    otpCode: string;
  }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!email || !otpCode) {
      showToast.error("Thông tin xác thực không hợp lệ");
      router.replace("/login");
    }
  }, [email, otpCode]);

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const getPasswordStrength = (
    password: string
  ): { strength: string; color: string } => {
    if (password.length < 8) {
      return { strength: "Yếu", color: "#ff4444" };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { strength: "Yếu", color: "#ff4444" };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { strength: "Trung bình", color: "#ff8800" };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { strength: "Trung bình", color: "#ff8800" };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { strength: "Tốt", color: "#00aa00" };
    }
    return { strength: "Mạnh", color: "#00aa00" };
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      showToast.error("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (!validatePassword(newPassword)) {
      showToast.error(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!email || !otpCode) {
      showToast.error("Thông tin xác thực không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.resetPassword(
        email,
        otpCode,
        newPassword
      );

      if (response.status === 1) {
        showToast.success(response.message);
        // Navigate to login after successful reset
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } else {
        showToast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      showToast.error("Có lỗi xảy ra khi đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

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
          <Text style={styles.headerTitle}>Đặt lại mật khẩu</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="key-outline" size={80} color="#2ECC71" />
          </View>

          <Text style={styles.title}>Tạo mật khẩu mới</Text>
          <Text style={styles.subtitle}>
            Nhập mật khẩu mới của bạn để hoàn tất việc đặt lại
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {newPassword.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <Text style={styles.passwordStrengthLabel}>
                  Độ mạnh mật khẩu:
                </Text>
                <Text
                  style={[
                    styles.passwordStrengthText,
                    { color: passwordStrength.color },
                  ]}
                >
                  {passwordStrength.strength}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <Text style={styles.errorText}>Mật khẩu xác nhận không khớp</Text>
            )}
          </View>

          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
            <Text style={styles.requirementText}>• Ít nhất 8 ký tự</Text>
            <Text style={styles.requirementText}>
              • Có chữ hoa và chữ thường
            </Text>
            <Text style={styles.requirementText}>• Có ít nhất 1 số</Text>
            <Text style={styles.requirementText}>
              • Có ít nhất 1 ký tự đặc biệt (@$!%*?&)
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
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
  inputContainer: {
    marginBottom: 20,
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
  },
  eyeIcon: {
    padding: 5,
  },
  passwordStrengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  passwordStrengthLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  passwordStrengthText: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 14,
    color: "#ff4444",
    marginTop: 8,
  },
  requirementsContainer: {
    backgroundColor: "#f0f7ff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
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
  backToLoginButton: {
    alignItems: "center",
    paddingVertical: 15,
  },
  backToLoginText: {
    color: "#2ECC71",
    fontSize: 16,
    fontWeight: "500",
  },
});
