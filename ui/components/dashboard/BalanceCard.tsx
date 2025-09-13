import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "@/data/mockData";

interface BalanceCardProps {
  balance: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradientBackground} />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <View style={styles.labelContainer}>
            <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
            <Text style={styles.label}>Tổng số dư</Text>
          </View>
          <Text style={styles.balance}>
            {isVisible ? formatCurrency(balance) : "****** ₫"}
          </Text>
          <Text style={styles.subLabel}>
            {isVisible ? "Số dư khả dụng" : "Ẩn số dư"}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleVisibility} style={styles.eyeButton}>
          <View style={styles.eyeButtonBackground}>
            <Ionicons
              name={isVisible ? "eye" : "eye-off"}
              size={20}
              color="#2ECC71"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#2ECC71",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    minHeight: 100,
  },
  textContainer: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginLeft: 8,
    opacity: 0.9,
  },
  balance: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  eyeButton: {
    padding: 8,
  },
  eyeButtonBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
