import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  error?: string;
  containerStyle?: any;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  isPassword = false,
  error,
  containerStyle,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          secureTextEntry={isPassword && !isPasswordVisible}
          placeholderTextColor="#999"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.underline} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2ECC71",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  inputError: {
    color: "#E74C3C",
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
    padding: 8,
  },
  errorText: {
    color: "#E74C3C",
    fontSize: 14,
    marginTop: 4,
  },
  underline: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 8,
  },
});
