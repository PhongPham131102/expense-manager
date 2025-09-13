import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { CustomInput } from "@/components/auth/CustomInput";
import { CustomButton } from "@/components/auth/CustomButton";
import { LogoHeader } from "@/components/auth/LogoHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Họ và tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(formData);
      Alert.alert(
        "Đăng ký thành công!",
        "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" backgroundColor="#2ECC71" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng Ký</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <LogoHeader
            title="Tạo Tài Khoản Mới"
            subtitle="Đăng ký để bắt đầu quản lý tài chính hiệu quả"
            showIcon={false}
          />

          <View style={styles.form}>
            <CustomInput
              label="Tên đăng nhập"
              value={formData.username}
              onChangeText={(value) => updateFormData("username", value)}
              placeholder="Nhập tên đăng nhập"
              autoCapitalize="none"
              error={errors.username}
            />

            <CustomInput
              label="Họ và tên"
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
              placeholder="Nhập họ và tên đầy đủ"
              error={errors.name}
            />

            <CustomInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              placeholder="Nhập địa chỉ email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <CustomInput
              label="Mật Khẩu"
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
              placeholder="Nhập mật khẩu"
              isPassword
              error={errors.password}
            />

            <CustomInput
              label="Nhập Lại Mật Khẩu"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData("confirmPassword", value)}
              placeholder="Xác nhận mật khẩu"
              isPassword
              error={errors.confirmPassword}
            />

            <CustomButton
              title="Đăng Ký"
              onPress={handleRegister}
              style={styles.registerButton}
            />

            <View style={styles.linkContainer}>
              <TouchableOpacity
                style={styles.link}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.linkText}>Đăng Nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  form: {
    flex: 1,
  },
  registerButton: {
    marginTop: 20,
  },
  linkContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  link: {
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 16,
    color: "#2ECC71",
    fontWeight: "500",
  },
});
