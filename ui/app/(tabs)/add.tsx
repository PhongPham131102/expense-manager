import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AddTransactionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Giao Dịch</Text>
      <Text style={styles.subtitle}>Tính năng này sẽ được triển khai sớm</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
