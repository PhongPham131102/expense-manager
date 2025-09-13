import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { CustomButton } from "@/components/auth/CustomButton";
import { LogoHeader } from "@/components/auth/LogoHeader";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#2ECC71" />

      {/* Status Bar Background */}
      <View style={styles.statusBar} />

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <LogoHeader
            title="Quản Lý Chi Tiêu"
            subtitle="Quản Lý Tài Chính Hiệu Quả Với Ứng Dụng"
            showIcon={true}
          />

          {/* Page Indicator */}
          <View style={styles.pageIndicator}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Đăng Ký"
            onPress={handleRegister}
            variant="primary"
            style={styles.primaryButton}
          />

          <CustomButton
            title="Đăng Nhập"
            onPress={handleLogin}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </View>
      </View>

      {/* Bottom System Bar */}
      <View style={styles.systemBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  statusBar: {
    height: 44,
    backgroundColor: "#2ECC71",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  activeDot: {
    backgroundColor: "#2ECC71",
    width: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#2ECC71",
    shadowColor: "#2ECC71",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#2ECC71",
  },
  systemBar: {
    height: 24,
    backgroundColor: "#000000",
  },
});
