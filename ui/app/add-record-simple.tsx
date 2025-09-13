import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AddRecordSimpleScreen() {
  const [amount, setAmount] = useState("0");

  const handleSave = () => {
    console.log("Simple handleSave called with amount:", amount);
    router.back();
  };

  console.log("Simple AddRecordScreen rendering...");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#27AE60" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi Tiêu</Text>

        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Ionicons name="checkmark" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.amountText}>{amount}₫</Text>

        <TouchableOpacity
          style={styles.testButton}
          onPress={() => setAmount((parseInt(amount) + 1000).toString())}
        >
          <Text style={styles.testButtonText}>Test +1000</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  amountText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E74C3C",
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: "#27AE60",
    padding: 15,
    borderRadius: 8,
  },
  testButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
