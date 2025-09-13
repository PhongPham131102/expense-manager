import Toast from "react-native-toast-message";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const showToast = {
  success: (message: string, title?: string) => {
    Toast.show({
      type: "success",
      text1: title || "Thành công",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  },

  error: (message: string, title?: string) => {
    Toast.show({
      type: "error",
      text1: title || "Lỗi",
      text2: message,
      position: "top",
      visibilityTime: 4000,
    });
  },

  info: (message: string, title?: string) => {
    Toast.show({
      type: "info",
      text1: title || "Thông báo",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  },

  warning: (message: string, title?: string) => {
    Toast.show({
      type: "info", // react-native-toast-message doesn't have warning type
      text1: title || "Cảnh báo",
      text2: message,
      position: "top",
      visibilityTime: 3500,
    });
  },
};

// Custom toast config for better styling
export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View style={styles.successContainer}>
      <Ionicons
        name="checkmark-circle"
        size={24}
        color="#FFFFFF"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.message}>{text2}</Text>
      </View>
    </View>
  ),

  error: ({ text1, text2 }: any) => (
    <View style={styles.errorContainer}>
      <Ionicons
        name="close-circle"
        size={24}
        color="#FFFFFF"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.message}>{text2}</Text>
      </View>
    </View>
  ),

  info: ({ text1, text2 }: any) => (
    <View style={styles.infoContainer}>
      <Ionicons
        name="information-circle"
        size={24}
        color="#FFFFFF"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.message}>{text2}</Text>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  successContainer: {
    backgroundColor: "#2ECC71",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorContainer: {
    backgroundColor: "#E74C3C",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    backgroundColor: "#3498DB",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  message: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
  },
});
