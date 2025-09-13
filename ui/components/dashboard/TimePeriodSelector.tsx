import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { timePeriods } from "@/data/mockData";

interface TimePeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    timePeriods.find((p) => p.value === selectedPeriod)?.label || "Hôm nay";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="trending-up-outline" size={20} color="#2ECC71" />
          <Text style={styles.title}>Tình hình thu chi</Text>
        </View>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={styles.selectedText}>{selectedLabel}</Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="#2ECC71"
          />
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View style={styles.dropdownList}>
          {timePeriods.map((period) => (
            <TouchableOpacity
              key={period.value}
              style={[
                styles.dropdownItem,
                selectedPeriod === period.value && styles.selectedItem,
              ]}
              onPress={() => {
                onPeriodChange(period.value);
                setIsOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedPeriod === period.value && styles.selectedItemText,
                ]}
              >
                {period.label}
              </Text>
              {selectedPeriod === period.value && (
                <Ionicons name="checkmark" size={16} color="#2ECC71" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginLeft: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  selectedText: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "500",
    marginRight: 6,
  },
  dropdownList: {
    position: "absolute",
    top: 60,
    right: 20,
    left: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F4",
  },
  selectedItem: {
    backgroundColor: "#E8F5E8",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#2C3E50",
    fontWeight: "500",
  },
  selectedItemText: {
    color: "#2ECC71",
    fontWeight: "600",
  },
});
