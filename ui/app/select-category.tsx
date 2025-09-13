import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { callCategorySelectionCallback } from "./add-record";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories?: Category[];
}

const expenseCategories: Category[] = [
  {
    id: "food",
    name: "Ăn uống",
    icon: "restaurant",
    color: "#3498DB",
    subcategories: [
      {
        id: "market",
        name: "Đi chợ/siêu thị",
        icon: "storefront",
        color: "#E91E63",
      },
      { id: "cafe", name: "Cafe", icon: "cafe", color: "#E91E63" },
      {
        id: "restaurant",
        name: "Ăn tiệm",
        icon: "restaurant",
        color: "#FF9800",
      },
      { id: "breakfast", name: "Ăn sáng", icon: "sunny", color: "#FFC107" },
      { id: "lunch", name: "Ăn trưa", icon: "time", color: "#2196F3" },
      { id: "dinner", name: "Ăn tối", icon: "moon", color: "#E91E63" },
      { id: "snack", name: "Đồ ăn vặt", icon: "ice-cream", color: "#FF5722" },
      { id: "drink", name: "Nước uống", icon: "wine", color: "#795548" },
      { id: "delivery", name: "Giao hàng", icon: "bicycle", color: "#607D8B" },
    ],
  },
  {
    id: "living",
    name: "Sinh hoạt",
    icon: "home",
    color: "#E91E63",
    subcategories: [
      { id: "electricity", name: "Tiền điện", icon: "flash", color: "#2196F3" },
      { id: "water", name: "Tiền nước", icon: "water", color: "#E91E63" },
      { id: "internet", name: "Tiền mạng", icon: "wifi", color: "#FF9800" },
      {
        id: "phone",
        name: "Tiền card Điện thoại",
        icon: "phone-portrait",
        color: "#FFC107",
      },
      { id: "gas", name: "Tiền ga", icon: "flame", color: "#2196F3" },
      { id: "rent", name: "Tiền thuê nhà", icon: "home", color: "#4CAF50" },
      { id: "cleaning", name: "Vệ sinh", icon: "sparkles", color: "#00BCD4" },
      {
        id: "maintenance",
        name: "Sửa chữa",
        icon: "construct",
        color: "#FF9800",
      },
    ],
  },
  {
    id: "transport",
    name: "Đi lại",
    icon: "car",
    color: "#FF9800",
    subcategories: [
      { id: "gasoline", name: "Xăng xe", icon: "car", color: "#FF9800" },
      { id: "parking", name: "Gửi xe", icon: "square", color: "#607D8B" },
      { id: "taxi", name: "Taxi/Grab", icon: "car-sport", color: "#E91E63" },
      { id: "bus", name: "Xe buýt", icon: "bus", color: "#2196F3" },
      { id: "train", name: "Tàu hỏa", icon: "train", color: "#4CAF50" },
      { id: "plane", name: "Máy bay", icon: "airplane", color: "#9C27B0" },
      { id: "bike", name: "Xe đạp", icon: "bicycle", color: "#FFC107" },
      {
        id: "maintenance",
        name: "Bảo dưỡng xe",
        icon: "settings",
        color: "#795548",
      },
    ],
  },
  {
    id: "shopping",
    name: "Mua sắm",
    icon: "bag",
    color: "#9C27B0",
    subcategories: [
      { id: "clothes", name: "Quần áo", icon: "shirt", color: "#E91E63" },
      { id: "shoes", name: "Giày dép", icon: "footsteps", color: "#795548" },
      { id: "cosmetics", name: "Mỹ phẩm", icon: "sparkles", color: "#E91E63" },
      {
        id: "electronics",
        name: "Điện tử",
        icon: "phone-portrait",
        color: "#2196F3",
      },
      { id: "books", name: "Sách vở", icon: "book", color: "#4CAF50" },
      { id: "gifts", name: "Quà tặng", icon: "gift", color: "#FF9800" },
      { id: "online", name: "Mua online", icon: "globe", color: "#9C27B0" },
      {
        id: "supermarket",
        name: "Siêu thị",
        icon: "storefront",
        color: "#FFC107",
      },
    ],
  },
  {
    id: "health",
    name: "Sức khỏe",
    icon: "medical",
    color: "#9C27B0",
    subcategories: [
      { id: "medicine", name: "Thuốc men", icon: "medical", color: "#E91E63" },
      { id: "hospital", name: "Bệnh viện", icon: "business", color: "#F44336" },
      { id: "doctor", name: "Khám bác sĩ", icon: "person", color: "#2196F3" },
      { id: "dentist", name: "Nha sĩ", icon: "medical", color: "#00BCD4" },
      { id: "gym", name: "Phòng gym", icon: "fitness", color: "#4CAF50" },
      { id: "vitamin", name: "Vitamin", icon: "leaf", color: "#8BC34A" },
      { id: "insurance", name: "Bảo hiểm", icon: "shield", color: "#FF9800" },
      { id: "checkup", name: "Khám sức khỏe", icon: "heart", color: "#E91E63" },
    ],
  },
  {
    id: "education",
    name: "Giáo dục",
    icon: "school",
    color: "#4CAF50",
    subcategories: [
      { id: "tuition", name: "Học phí", icon: "school", color: "#2196F3" },
      { id: "books", name: "Sách học", icon: "book", color: "#4CAF50" },
      {
        id: "stationery",
        name: "Đồ dùng học tập",
        icon: "create",
        color: "#FF9800",
      },
      { id: "course", name: "Khóa học", icon: "library", color: "#9C27B0" },
      { id: "exam", name: "Thi cử", icon: "document-text", color: "#E91E63" },
      { id: "uniform", name: "Đồng phục", icon: "shirt", color: "#607D8B" },
      { id: "transport", name: "Đi lại học", icon: "bus", color: "#FFC107" },
      { id: "lunch", name: "Cơm trưa", icon: "restaurant", color: "#FF5722" },
    ],
  },
  {
    id: "entertainment",
    name: "Giải trí",
    icon: "happy",
    color: "#9C27B0",
    subcategories: [
      { id: "movie", name: "Xem phim", icon: "film", color: "#E91E63" },
      { id: "game", name: "Game", icon: "game-controller", color: "#2196F3" },
      { id: "music", name: "Nhạc", icon: "musical-notes", color: "#9C27B0" },
      { id: "travel", name: "Du lịch", icon: "airplane", color: "#4CAF50" },
      { id: "sport", name: "Thể thao", icon: "football", color: "#FF9800" },
      { id: "karaoke", name: "Karaoke", icon: "mic", color: "#E91E63" },
      { id: "party", name: "Tiệc tùng", icon: "wine", color: "#FF5722" },
      { id: "hobby", name: "Sở thích", icon: "heart", color: "#F44336" },
    ],
  },
  {
    id: "family",
    name: "Gia đình",
    icon: "people",
    color: "#FFC107",
    subcategories: [
      { id: "children", name: "Con cái", icon: "people", color: "#FFC107" },
      { id: "elderly", name: "Người già", icon: "person", color: "#795548" },
      { id: "wedding", name: "Cưới hỏi", icon: "heart", color: "#E91E63" },
      { id: "birthday", name: "Sinh nhật", icon: "gift", color: "#FF9800" },
      { id: "holiday", name: "Lễ tết", icon: "calendar", color: "#4CAF50" },
      { id: "support", name: "Hỗ trợ", icon: "hand-left", color: "#2196F3" },
      { id: "insurance", name: "Bảo hiểm", icon: "shield", color: "#9C27B0" },
      { id: "emergency", name: "Khẩn cấp", icon: "warning", color: "#F44336" },
    ],
  },
  {
    id: "investment",
    name: "Đầu tư",
    icon: "trending-up",
    color: "#4CAF50",
    subcategories: [
      {
        id: "stock",
        name: "Chứng khoán",
        icon: "trending-up",
        color: "#4CAF50",
      },
      {
        id: "crypto",
        name: "Tiền điện tử",
        icon: "logo-bitcoin",
        color: "#FF9800",
      },
      { id: "gold", name: "Vàng", icon: "diamond", color: "#FFC107" },
      {
        id: "real-estate",
        name: "Bất động sản",
        icon: "home",
        color: "#2196F3",
      },
      { id: "fund", name: "Quỹ đầu tư", icon: "wallet", color: "#9C27B0" },
      { id: "saving", name: "Tiết kiệm", icon: "save", color: "#00BCD4" },
      { id: "loan", name: "Cho vay", icon: "cash", color: "#795548" },
      {
        id: "business",
        name: "Kinh doanh",
        icon: "business",
        color: "#E91E63",
      },
    ],
  },
  {
    id: "debt",
    name: "Nợ nần",
    icon: "card",
    color: "#F44336",
    subcategories: [
      {
        id: "credit-card",
        name: "Thẻ tín dụng",
        icon: "card",
        color: "#F44336",
      },
      { id: "loan", name: "Vay nợ", icon: "cash", color: "#E91E63" },
      { id: "mortgage", name: "Vay mua nhà", icon: "home", color: "#2196F3" },
      { id: "car-loan", name: "Vay mua xe", icon: "car", color: "#FF9800" },
      { id: "personal", name: "Vay cá nhân", icon: "person", color: "#9C27B0" },
      {
        id: "interest",
        name: "Lãi suất",
        icon: "calculator",
        color: "#795548",
      },
      { id: "penalty", name: "Phạt", icon: "warning", color: "#F44336" },
      {
        id: "installment",
        name: "Trả góp",
        icon: "calendar",
        color: "#607D8B",
      },
    ],
  },
  {
    id: "other",
    name: "Khác",
    icon: "ellipsis-horizontal",
    color: "#607D8B",
    subcategories: [
      { id: "donation", name: "Từ thiện", icon: "heart", color: "#E91E63" },
      { id: "tip", name: "Boa", icon: "cash", color: "#FFC107" },
      { id: "fine", name: "Phạt", icon: "warning", color: "#F44336" },
      { id: "lost", name: "Mất tiền", icon: "sad", color: "#795548" },
      { id: "gift", name: "Quà biếu", icon: "gift", color: "#FF9800" },
      { id: "repair", name: "Sửa chữa", icon: "construct", color: "#2196F3" },
      { id: "cleaning", name: "Giặt ủi", icon: "sparkles", color: "#00BCD4" },
      {
        id: "misc",
        name: "Chi phí khác",
        icon: "ellipsis-horizontal",
        color: "#607D8B",
      },
    ],
  },
  {
    id: "self-development",
    name: "Phát triển bản thân",
    icon: "trending-up",
    color: "#9C27B0",
  },
];

const incomeCategories: Category[] = [
  {
    id: "salary",
    name: "Tiền lương",
    icon: "cash",
    color: "#4CAF50",
    subcategories: [
      {
        id: "monthly",
        name: "Lương tháng",
        icon: "calendar",
        color: "#4CAF50",
      },
      { id: "overtime", name: "Làm thêm giờ", icon: "time", color: "#2196F3" },
      {
        id: "part-time",
        name: "Làm part-time",
        icon: "briefcase",
        color: "#FF9800",
      },
      {
        id: "contract",
        name: "Hợp đồng",
        icon: "document-text",
        color: "#9C27B0",
      },
      { id: "freelance", name: "Freelance", icon: "laptop", color: "#E91E63" },
    ],
  },
  {
    id: "bonus",
    name: "Tiền thưởng",
    icon: "gift",
    color: "#E91E63",
    subcategories: [
      {
        id: "performance",
        name: "Thưởng hiệu suất",
        icon: "trophy",
        color: "#FFC107",
      },
      { id: "holiday", name: "Thưởng lễ tết", icon: "gift", color: "#E91E63" },
      { id: "project", name: "Thưởng dự án", icon: "rocket", color: "#2196F3" },
      {
        id: "sales",
        name: "Hoa hồng bán hàng",
        icon: "trending-up",
        color: "#4CAF50",
      },
      { id: "referral", name: "Giới thiệu", icon: "people", color: "#9C27B0" },
    ],
  },
  {
    id: "investment",
    name: "Đầu tư",
    icon: "trending-up",
    color: "#4CAF50",
    subcategories: [
      {
        id: "stock",
        name: "Chứng khoán",
        icon: "trending-up",
        color: "#4CAF50",
      },
      {
        id: "crypto",
        name: "Tiền điện tử",
        icon: "logo-bitcoin",
        color: "#FF9800",
      },
      { id: "gold", name: "Vàng", icon: "diamond", color: "#FFC107" },
      {
        id: "real-estate",
        name: "Bất động sản",
        icon: "home",
        color: "#2196F3",
      },
      { id: "fund", name: "Quỹ đầu tư", icon: "wallet", color: "#9C27B0" },
      { id: "dividend", name: "Cổ tức", icon: "cash", color: "#00BCD4" },
      {
        id: "interest",
        name: "Lãi suất",
        icon: "calculator",
        color: "#795548",
      },
      {
        id: "profit",
        name: "Lợi nhuận",
        icon: "stats-chart",
        color: "#8BC34A",
      },
    ],
  },
  {
    id: "business",
    name: "Kinh doanh",
    icon: "business",
    color: "#9C27B0",
    subcategories: [
      { id: "sales", name: "Bán hàng", icon: "storefront", color: "#4CAF50" },
      { id: "service", name: "Dịch vụ", icon: "construct", color: "#2196F3" },
      {
        id: "consulting",
        name: "Tư vấn",
        icon: "chatbubbles",
        color: "#FF9800",
      },
      {
        id: "online",
        name: "Kinh doanh online",
        icon: "globe",
        color: "#E91E63",
      },
      { id: "rental", name: "Cho thuê", icon: "home", color: "#00BCD4" },
      { id: "commission", name: "Hoa hồng", icon: "percent", color: "#FFC107" },
      { id: "partnership", name: "Hợp tác", icon: "people", color: "#795548" },
      { id: "royalty", name: "Bản quyền", icon: "copyright", color: "#607D8B" },
    ],
  },
  {
    id: "gift",
    name: "Quà tặng",
    icon: "gift",
    color: "#FF9800",
    subcategories: [
      { id: "birthday", name: "Sinh nhật", icon: "gift", color: "#E91E63" },
      { id: "wedding", name: "Cưới hỏi", icon: "heart", color: "#F44336" },
      { id: "holiday", name: "Lễ tết", icon: "calendar", color: "#4CAF50" },
      {
        id: "graduation",
        name: "Tốt nghiệp",
        icon: "school",
        color: "#2196F3",
      },
      { id: "red-envelope", name: "Lì xì", icon: "cash", color: "#FFC107" },
      { id: "support", name: "Hỗ trợ", icon: "hand-left", color: "#9C27B0" },
      { id: "donation", name: "Quyên góp", icon: "heart", color: "#00BCD4" },
      { id: "inheritance", name: "Thừa kế", icon: "library", color: "#795548" },
    ],
  },
  {
    id: "refund",
    name: "Hoàn tiền",
    icon: "return-up-back",
    color: "#00BCD4",
    subcategories: [
      { id: "tax", name: "Hoàn thuế", icon: "receipt", color: "#4CAF50" },
      { id: "insurance", name: "Bảo hiểm", icon: "shield", color: "#2196F3" },
      {
        id: "purchase",
        name: "Trả hàng",
        icon: "return-up-back",
        color: "#FF9800",
      },
      { id: "deposit", name: "Đặt cọc", icon: "card", color: "#E91E63" },
      {
        id: "overpayment",
        name: "Trả thừa",
        icon: "calculator",
        color: "#9C27B0",
      },
      { id: "rebate", name: "Giảm giá", icon: "pricetag", color: "#FFC107" },
      { id: "cashback", name: "Cashback", icon: "wallet", color: "#00BCD4" },
      { id: "refund", name: "Hoàn tiền", icon: "refresh", color: "#607D8B" },
    ],
  },
  {
    id: "loan",
    name: "Vay mượn",
    icon: "cash",
    color: "#FFC107",
    subcategories: [
      { id: "personal", name: "Vay cá nhân", icon: "person", color: "#FFC107" },
      { id: "bank", name: "Vay ngân hàng", icon: "business", color: "#2196F3" },
      { id: "family", name: "Vay gia đình", icon: "people", color: "#E91E63" },
      { id: "friend", name: "Vay bạn bè", icon: "heart", color: "#4CAF50" },
      {
        id: "emergency",
        name: "Vay khẩn cấp",
        icon: "warning",
        color: "#F44336",
      },
      {
        id: "business",
        name: "Vay kinh doanh",
        icon: "briefcase",
        color: "#9C27B0",
      },
      { id: "student", name: "Vay học tập", icon: "school", color: "#00BCD4" },
      { id: "mortgage", name: "Vay mua nhà", icon: "home", color: "#795548" },
    ],
  },
  {
    id: "other",
    name: "Khác",
    icon: "ellipsis-horizontal",
    color: "#607D8B",
    subcategories: [
      { id: "found", name: "Nhặt được", icon: "search", color: "#FFC107" },
      { id: "lottery", name: "Xổ số", icon: "trophy", color: "#E91E63" },
      { id: "bet", name: "Cá cược", icon: "dice", color: "#F44336" },
      { id: "tip", name: "Boa", icon: "cash", color: "#FF9800" },
      { id: "reward", name: "Thưởng", icon: "star", color: "#FFC107" },
      {
        id: "compensation",
        name: "Bồi thường",
        icon: "shield",
        color: "#2196F3",
      },
      { id: "sale", name: "Bán đồ cũ", icon: "storefront", color: "#4CAF50" },
      {
        id: "misc",
        name: "Thu nhập khác",
        icon: "ellipsis-horizontal",
        color: "#607D8B",
      },
    ],
  },
];

export default function SelectCategoryScreen() {
  const params = useLocalSearchParams();
  const [isIncome, setIsIncome] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    // Load current category and income type from params
    if (params.currentCategory) {
      try {
        const currentCategory = JSON.parse(params.currentCategory as string);
        setSelectedCategory(currentCategory);
      } catch (error) {
        console.error("Error parsing current category:", error);
      }
    }
    if (params.isIncome) {
      setIsIncome(params.isIncome === "true");
    }
  }, [params]);

  const categories = isIncome ? incomeCategories : expenseCategories;

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const selectCategory = (category: Category) => {
    console.log("Selecting category:", category);
    setSelectedCategory(category);

    // Call the callback function
    callCategorySelectionCallback({
      ...category,
      isIncome,
    });

    // Navigate back
    router.back();
  };

  const renderCategory = (category: Category, isSubcategory = false) => {
    const hasSubcategories =
      category.subcategories && category.subcategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory?.id === category.id;

    return (
      <View key={category.id}>
        <TouchableOpacity
          style={[
            styles.categoryItem,
            isSubcategory && styles.subcategoryItem,
            isSelected && styles.selectedCategory,
          ]}
          onPress={() => {
            if (hasSubcategories) {
              toggleCategory(category.id);
            } else {
              selectCategory(category);
            }
          }}
        >
          <View style={styles.categoryLeft}>
            {hasSubcategories && !isSubcategory && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => toggleCategory(category.id)}
              >
                <Ionicons
                  name={isExpanded ? "chevron-down" : "chevron-up"}
                  size={16}
                  color="#999"
                />
              </TouchableOpacity>
            )}

            <View
              style={[styles.categoryIcon, { backgroundColor: category.color }]}
            >
              <Ionicons
                name={category.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color="white"
              />
            </View>

            <Text
              style={[
                styles.categoryText,
                isSubcategory && styles.subcategoryText,
              ]}
            >
              {category.name}
            </Text>
          </View>

          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark" size={20} color="white" />
            </View>
          )}
        </TouchableOpacity>

        {hasSubcategories && isExpanded && (
          <View style={styles.subcategoriesContainer}>
            {category.subcategories!.map((subcategory) =>
              renderCategory(subcategory, true)
            )}
          </View>
        )}
      </View>
    );
  };

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

        <Text style={styles.headerTitle}>Thêm Hạng Mục</Text>

        <View style={styles.headerButton} />
      </View>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, !isIncome && styles.activeTab]}
          onPress={() => setIsIncome(false)}
        >
          <Text style={[styles.tabText, !isIncome && styles.activeTabText]}>
            Chi Tiêu
          </Text>
          {!isIncome && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, isIncome && styles.activeTab]}
          onPress={() => setIsIncome(true)}
        >
          <Text style={[styles.tabText, isIncome && styles.activeTabText]}>
            Thu Nhập
          </Text>
          {isIncome && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <ScrollView
        style={styles.categoriesList}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => renderCategory(category))}
      </ScrollView>
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
    width: 40,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  tabContainer: {
    backgroundColor: "#27AE60",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    // Active tab styling
  },
  tabText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "bold",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#2196F3",
  },
  categoriesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  subcategoryItem: {
    paddingLeft: 40,
    borderBottomColor: "#f8f8f8",
  },
  selectedCategory: {
    backgroundColor: "#f8f8f8",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expandButton: {
    padding: 4,
    marginRight: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  subcategoryText: {
    fontSize: 14,
    color: "#666",
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#27AE60",
    alignItems: "center",
    justifyContent: "center",
  },
  subcategoriesContainer: {
    backgroundColor: "#fafafa",
  },
});
