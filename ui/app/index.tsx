import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthGuard } from "@/components/AuthGuard";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#2ECC71" />
      <AuthGuard>
        <View />
      </AuthGuard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2ECC71",
  },
});
