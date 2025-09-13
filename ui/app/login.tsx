import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(username, password);
    } catch (error: any) {
      // Error handling is done by AuthContext with toast
      console.log("Login error:", error);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log("Forgot password clicked");
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
          <Text style={styles.headerTitle}>Đăng Nhập</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <LogoHeader
            title="Chào Mừng Trở Lại!"
            subtitle="Đăng nhập để tiếp tục quản lý tài chính của bạn"
            showIcon={false}
          />

          <View style={styles.form}>
            <CustomInput
              label="Tên đăng nhập"
              value={username}
              onChangeText={setUsername}
              placeholder="Nhập tên đăng nhập"
              autoCapitalize="none"
              error={errors.username}
            />

            <CustomInput
              label="Mật Khẩu"
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu"
              isPassword
              error={errors.password}
            />

            <CustomButton
              title="Đăng Nhập"
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <View style={styles.linkContainer}>
              <TouchableOpacity
                style={styles.link}
                onPress={() => router.push("/register")}
              >
                <Text style={styles.linkText}>Đăng Ký</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.link}
                onPress={handleForgotPassword}
              >
                <Text style={styles.linkText}>Quên Mật Khẩu</Text>
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
  loginButton: {
    marginTop: 20,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
