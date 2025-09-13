import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LogoHeaderProps {
  title?: string;
  subtitle?: string;
  showIcon?: boolean;
}

export const LogoHeader: React.FC<LogoHeaderProps> = ({
  title = "Quản Lý Chi Tiêu",
  subtitle = "Quản Lý Tài Chính Hiệu Quả Với Ứng Dụng",
  showIcon = true,
}) => {
  return (
    <View style={styles.container}>
      {showIcon && (
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="wallet" size={40} color="#F39C12" />
          </View>
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3498DB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3498DB",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2ECC71",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
