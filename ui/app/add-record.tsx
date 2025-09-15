import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { showToast } from "@/utils/toast";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { apiService } from "@/services/api";

// Global callback function
let categorySelectionCallback: ((category: any) => void) | null = null;

export const setCategorySelectionCallback = (
  callback: (category: any) => void
) => {
  categorySelectionCallback = callback;
};

export const callCategorySelectionCallback = (category: any) => {
  if (categorySelectionCallback) {
    categorySelectionCallback(category);
  }
};

export default function AddRecordScreen() {
  const { recordId, refreshCallback } = useLocalSearchParams<{
    recordId?: string;
    refreshCallback?: string;
  }>();
  const isEdit = !!recordId;

  const [saving, setSaving] = useState(false);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<{
    id: string;
    name: string;
    icon: string;
    color: string;
    isIncome?: boolean;
  } | null>(null);
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isIncome, setIsIncome] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [tempTime, setTempTime] = useState<Date>(new Date());

  useEffect(() => {
    // Set up global callback
    categorySelectionCallback = (selectedCategory: any) => {
      console.log("Category selected via callback:", selectedCategory);
      setCategory(selectedCategory);
      setIsIncome(selectedCategory.isIncome || false);
    };

    // Cleanup on unmount
    return () => {
      categorySelectionCallback = null;
    };
  }, []);

  const loadTransaction = useCallback(async () => {
    try {
      const response = await apiService.getTransactionById(recordId!);

      if (response.status === 1 && response.data) {
        const transactionData = response.data;

        // Populate form with existing data
        setAmount(formatAmount(transactionData.amount.toString()));
        setCategory({
          id: transactionData.categoryId,
          name: transactionData.categoryName,
          icon: transactionData.categoryIcon,
          color: transactionData.categoryColor,
          isIncome: transactionData.isIncome,
        });
        setNote(transactionData.note || "");
        setSelectedDate(new Date(transactionData.date));
        setSelectedTime(new Date(transactionData.time));
        setSelectedImage(transactionData.image || null);
        setIsIncome(transactionData.isIncome);
      } else {
        showToast.error("Không thể tải thông tin giao dịch");
        router.back();
      }
    } catch (error) {
      console.error("Error loading transaction:", error);
      showToast.error("Có lỗi xảy ra khi tải dữ liệu");
      router.back();
    }
  }, [recordId]);

  useEffect(() => {
    if (isEdit && recordId) {
      loadTransaction();
    }
  }, [isEdit, recordId, loadTransaction]);

  const triggerRefresh = () => {
    // Trigger refresh in parent component
    if (refreshCallback) {
      // Use global callback to refresh records and dashboard
      (global as any).refreshRecordsCallback?.();
      (global as any).refreshDashboardCallback?.();
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return "Hôm Nay";
    }

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "ios") {
      if (selectedDate) setTempDate(selectedDate);
      return;
    }
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "ios") {
      if (selectedTime) setTempTime(selectedTime);
      return;
    }
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === "ios") {
      setTempDate(selectedDate);
    }
    setShowDatePicker(true);
  };

  const openTimePicker = () => {
    if (Platform.OS === "ios") {
      setTempTime(selectedTime);
    }
    setShowTimePicker(true);
  };

  const formatAmount = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Limit to 12 digits (max 999,999,999,999)
    const limitedValue = numericValue.slice(0, 12);

    // Add commas for thousands separator
    if (limitedValue.length > 0) {
      return limitedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return "";
  };

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    // Check if input exceeds limit
    if (numericValue.length > 12) {
      showToast.error("Số tiền không được vượt quá 999,999,999,999");
      return;
    }

    const formatted = formatAmount(value);
    setAmount(formatted);
  };

  const getNumericAmount = () => {
    return amount.replace(/,/g, "");
  };

  const validateForm = () => {
    // Validate amount
    const numericAmount = getNumericAmount();
    if (!numericAmount || numericAmount.trim() === "") {
      showToast.error("Vui lòng nhập số tiền");
      return false;
    }

    if (parseFloat(numericAmount) <= 0) {
      showToast.error("Số tiền phải lớn hơn 0");
      return false;
    }

    if (parseFloat(numericAmount) > 999999999999) {
      showToast.error("Số tiền không được vượt quá 999,999,999,999");
      return false;
    }

    // Validate category
    if (!category) {
      showToast.error("Vui lòng chọn danh mục");
      return false;
    }

    // Validate note (optional but check length if provided)
    if (note && note.length > 500) {
      showToast.error("Ghi chú không được vượt quá 500 ký tự");
      return false;
    }

    // Validate date (should not be in the future)
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (selectedDate > today) {
      showToast.error("Ngày không được là ngày trong tương lai");
      return false;
    }

    // Validate date (should not be too old, e.g., more than 1 year ago)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (selectedDate < oneYearAgo) {
      showToast.error("Ngày không được quá 1 năm trước");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    // Validate all fields
    if (!validateForm()) {
      return;
    }

    const numericAmount = getNumericAmount();

    try {
      showToast.success("Đang lưu giao dịch...");

      const transactionData = {
        amount: parseInt(numericAmount),
        category: category?.name || "",
        categoryId: category?.id || "",
        categoryName: category?.name || "",
        categoryIcon: category?.icon || "",
        categoryColor: category?.color || "",
        isIncome,
        note: note.trim(),
        date: selectedDate.toISOString(),
        time: selectedTime.toISOString(),
        image: selectedImage || undefined,
      };

      console.log("Saving transaction:", transactionData);

      let response;
      if (isEdit) {
        response = await apiService.updateTransaction(
          recordId!,
          transactionData
        );
      } else {
        response = await apiService.createTransaction(transactionData);
      }

      if (response.status === 1) {
        showToast.success(
          response.message ||
            (isEdit
              ? "Đã cập nhật giao dịch thành công"
              : "Đã thêm giao dịch thành công")
        );
        triggerRefresh();
        router.back();
      } else {
        showToast.error(
          response.message ||
            (isEdit
              ? "Có lỗi xảy ra khi cập nhật giao dịch"
              : "Có lỗi xảy ra khi lưu giao dịch")
        );
      }
    } catch (error: any) {
      console.error("Error saving transaction:", error);
      const errorMessage = error.message || "Có lỗi xảy ra khi lưu giao dịch";
      showToast.error(errorMessage);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa giao dịch này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            setSaving(true);
            const response = await apiService.deleteTransaction(recordId!);

            if (response.status === 1) {
              showToast.success("Xóa giao dịch thành công");
              triggerRefresh();
              router.back();
            } else {
              showToast.error(
                response.message || "Có lỗi xảy ra khi xóa giao dịch"
              );
            }
          } catch (error) {
            console.error("Error deleting transaction:", error);
            showToast.error("Có lỗi xảy ra khi xóa giao dịch");
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  const handleCategorySelect = () => {
    router.push("/select-category");
  };

  const handleImageSelect = async (type: "gallery" | "camera") => {
    try {
      let result;

      if (type === "camera") {
        const permissionResult =
          await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          showToast.error("Cần quyền truy cập camera");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          showToast.error("Cần quyền truy cập thư viện ảnh");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        showToast.success("Đã chọn ảnh thành công");
      }
    } catch {
      showToast.error("Có lỗi khi chọn ảnh");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  console.log("AddRecordScreen rendering...");

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

        <Text style={styles.headerTitle}>
          {isEdit ? "Chỉnh sửa giao dịch" : isIncome ? "Thu Nhập" : "Chi Tiêu"}
        </Text>

        <View style={styles.headerRight}>
          {isEdit && (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.headerButton}
            >
              <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Ionicons name="checkmark" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Số tiền</Text>
          <View style={styles.amountContainer}>
            <View
              style={[
                styles.amountRow,
                { borderBottomColor: isIncome ? "#27AE60" : "#E74C3C" },
              ]}
            >
              <TextInput
                style={[
                  styles.amountInput,
                  { color: isIncome ? "#27AE60" : "#E74C3C" },
                ]}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
                returnKeyType="done"
              />
              <Text
                style={[
                  styles.currencyText,
                  { color: isIncome ? "#27AE60" : "#E74C3C" },
                ]}
              >
                ₫
              </Text>
            </View>
          </View>
        </View>

        {/* Category Selection */}
        <TouchableOpacity
          style={styles.inputRow}
          onPress={handleCategorySelect}
        >
          {category ? (
            <>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: category.color },
                ]}
              >
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color="white"
                />
              </View>
              <Text style={styles.inputText}>{category.name}</Text>
            </>
          ) : (
            <>
              <View style={styles.categoryIconPlaceholder}>
                <Ionicons name="help-circle-outline" size={24} color="#999" />
              </View>
              <Text style={styles.inputTextPlaceholder}>Chọn danh mục</Text>
            </>
          )}
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Note Input */}
        <View style={styles.inputRow}>
          <Ionicons name="document-text-outline" size={24} color="#999" />
          <View style={styles.noteContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="thêm chú thích"
              placeholderTextColor="#999"
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={500}
            />
            <Text style={styles.characterCount}>{note.length}/500</Text>
          </View>
        </View>

        {/* Date and Time */}
        <TouchableOpacity style={styles.inputRow} onPress={openDatePicker}>
          <Ionicons name="calendar-outline" size={24} color="#999" />
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <TouchableOpacity onPress={openTimePicker}>
            <Text style={styles.timeText}>{formatTime(selectedTime)}</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Image Upload */}
        <View style={styles.imageSection}>
          <Text style={styles.imageLabel}>Ảnh (không bắt buộc)</Text>

          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageOptions}>
              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => handleImageSelect("gallery")}
              >
                <Ionicons name="image-outline" size={32} color="#999" />
                <Text style={styles.imageOptionText}>Thư viện</Text>
              </TouchableOpacity>

              <View style={styles.imageDivider} />

              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => handleImageSelect("camera")}
              >
                <Ionicons name="camera-outline" size={32} color="#999" />
                <Text style={styles.imageOptionText}>Máy ảnh</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons
            name={isEdit ? "checkmark" : "add"}
            size={24}
            color="white"
          />
          <Text style={styles.saveButtonText}>
            {saving
              ? isEdit
                ? "Đang cập nhật..."
                : "Đang lưu..."
              : isEdit
              ? "Cập nhật"
              : "Thêm Mới"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker - Android inline */}
      {showDatePicker && Platform.OS !== "ios" && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Time Picker - Android inline */}
      {showTimePicker && Platform.OS !== "ios" && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* iOS Date Picker - Modal */}
      {Platform.OS === "ios" && (
        <>
          <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.modalAction}>Hủy</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Chọn ngày</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDate(tempDate);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text style={styles.modalAction}>Xong</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  themeVariant="light"
                  textColor="#000"
                  onChange={handleDateChange}
                  style={styles.iosPicker}
                />
              </View>
            </View>
          </Modal>

          {/* iOS Time Picker - Modal */}
          <Modal
            visible={showTimePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.modalAction}>Hủy</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Chọn giờ</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTime(tempTime);
                      setShowTimePicker(false);
                    }}
                  >
                    <Text style={styles.modalAction}>Xong</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={tempTime}
                    mode="time"
                    display="spinner"
                    themeVariant="light"
                    minuteInterval={1}
                    textColor="#000"
                    onChange={handleTimeChange}
                    style={styles.iosPicker}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  amountSection: {
    paddingVertical: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#E74C3C", // Default red, will be overridden
    paddingBottom: 4,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "right",
    minWidth: 100,
    borderWidth: 0,
  },
  currencyText: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 4,
  },
  amountUnderline: {
    height: 2,
    backgroundColor: "#E74C3C",
    width: 100,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3498DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  inputTextPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: "#999",
  },
  noteContainer: {
    flex: 1,
    marginLeft: 12,
  },
  noteInput: {
    fontSize: 16,
    color: "#333",
    minHeight: 20,
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  timeText: {
    fontSize: 16,
    color: "#333",
  },
  imageSection: {
    paddingVertical: 20,
  },
  imageLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  imageContainer: {
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOptions: {
    flexDirection: "row",
    height: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  imageOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageDivider: {
    width: 1,
    backgroundColor: "#ddd",
  },
  imageOptionText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  saveButtonContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#27AE60",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalAction: {
    fontSize: 16,
    color: "#27AE60",
    fontWeight: "600",
  },
  iosPicker: {
    marginTop: 4,
  },
  pickerContainer: {
    height: 220,
    justifyContent: "center",
  },
});
