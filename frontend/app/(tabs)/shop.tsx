import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Keyboard
} from 'react-native';
import {useEffect, useRef, useState} from "react";
import {AppColors} from "@/constants/theme";
import MainLayout from "@/components/MainLayout";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {useLocalSearchParams} from "expo-router";
import {useProductStore} from "@/store/productStore";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import TextInputCustom from "@/components/TextInputCustom";

const ShopScreen = () => {
    const {
        filteredProducts,
        categories,
        selectedCategory,
        loading,
        fetchProducts,
        fetchCategories,
        setCategory,
        sortProducts,
        searchProductsRealTime,
    } = useProductStore();

    const { category: categoryParam } = useLocalSearchParams<{ category?: string; }>();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const searchTimeOutRef = useRef<NodeJS.Timeout | number | null>(null);
    const [showShortModal, setShowShortModal] = useState<boolean>(false);
    const [activeSortOption, setActiveSortOption] = useState<string | null>(null);
    const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

    useEffect(() => {
        if (categories.length === 0) fetchCategories();
        if (filteredProducts.length === 0) fetchProducts();

        if (categoryParam) {
            setCategory(categoryParam);
        }
        
        return () => {
            if (searchTimeOutRef.current) {
                clearTimeout(searchTimeOutRef.current);
            }
        };
    }, []);
    
    const handleSearchChange = (text: string) => {
        setSearchQuery(text);

        if (searchTimeOutRef.current) {
            clearTimeout(searchTimeOutRef.current);
        }

        // Debounce: Wait 500ms after user stops typing
        if (text.length >= 1) {
            searchTimeOutRef.current = setTimeout(() => {
                searchProductsRealTime(text);
            }, 500);
        } else {
            searchProductsRealTime("");
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        searchProductsRealTime("");
        Keyboard.dismiss();
    };

    const handleSort = (sortBy: "price-asc" | "price-desc" | "rating") => {
        sortProducts(sortBy);
        setActiveSortOption(sortBy);
        setShowShortModal(false);
        setIsFilterActive(true);
    };

    const handleResetFilter = () => {
        sortProducts("price-asc");
        setActiveSortOption(null);
        setShowShortModal(false);
        setIsFilterActive(false);
    };

    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>
                    All products
                </Text>
                
                <View style={styles.flexRow}>
                    <View style={styles.searchContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInputCustom
                                value={searchQuery}
                                onChangeText={handleSearchChange}
                                placeholder="Search a product..."
                                style={styles.searchInputContainer}
                                inputStyle={styles.searchInputStyle}
                            />
                            {searchQuery.length > 0 ? (
                                <TouchableOpacity
                                    onPress={handleClearSearch}
                                    style={styles.clearButton}
                                >
                                    <AntDesign name="close" size={16} color={AppColors.gray[500]} />
                                </TouchableOpacity>
                            ) : (
                                // Magnifying glass icon when no text
                                <View style={styles.searchIcon}>
                                    <Ionicons name="search" size={20} color={AppColors.text.secondary} />
                                </View>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => setShowShortModal(true)}
                        style={[
                            styles.sortOptionView,
                            isFilterActive && styles.activeSortButton,
                        ]}
                    >
                        <AntDesign name="filter" size={20} color={AppColors.text.primary}/>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    <TouchableOpacity
                        onPress={() => setCategory(null)}
                        style={[
                            styles.categoryButton,
                            selectedCategory === null && styles.selectedCategory,
                        ]}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === null && styles.selectedCategoryText,
                        ]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    {categories?.map((category) => (
                        <TouchableOpacity
                            onPress={() => setCategory(category)}
                            key={category}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && styles.selectedCategory,
                            ]}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category && styles.selectedCategoryText,
                            ]}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        )
    };

    return (
        <MainLayout>
            {renderHeader()}

            {loading && filteredProducts.length === 0 ? (
                <View style={styles.loadingSpinner}>
                    <LoadingSpinner fullScreen={true}/>
                </View>
            ) : filteredProducts?.length === 0 ? (
                <EmptyState
                    type="search"
                    message={searchQuery ? "No products found matching your search" : "No products available"}
                />
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    renderItem={({item}) => (
                        <View style={styles.productContainer}>
                            <ProductCard
                                product={item}
                                customStyle={styles.fullWidth}
                            />
                        </View>
                    )}
                    contentContainerStyle={styles.productsGrid}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<View style={styles.footer}/>}
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                />
            )}

            {/* Sort Modal */}
            <Modal
                visible={showShortModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowShortModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Sort by</Text>
                            <TouchableOpacity onPress={() => setShowShortModal(false)}>
                                <AntDesign name="close" size={24} color={AppColors.text.primary}/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.sortOption} onPress={() => handleSort("price-asc")}>
                            <Text style={[styles.sortOptionText, activeSortOption === "price-asc" && styles.activeSortText]}>
                                Price: Low to high
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sortOption} onPress={() => handleSort("price-desc")}>
                            <Text style={[styles.sortOptionText, activeSortOption === "price-desc" && styles.activeSortText]}>
                                Price: High to low
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sortOption} onPress={() => handleSort("rating")}>
                            <Text style={[styles.sortOptionText, activeSortOption === "rating" && styles.activeSortText]}>
                                Ranking: High to low
                            </Text>
                        </TouchableOpacity>
                        {isFilterActive && (
                            <TouchableOpacity style={styles.sortOption} onPress={handleResetFilter}>
                                <Text style={[styles.sortOptionText, {color: AppColors.error}]}>
                                    Remove filters
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </MainLayout>
    );
};

export default ShopScreen;

const styles = StyleSheet.create({
    loadingSpinner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
    },
    fullWidth: {
        width: "100%",
    },
    flexRow: {
        flexDirection: "row",
        width: "100%",
        alignItems: 'center',
        marginBottom: 16,
    },
    header: {
        paddingTop: 10,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: AppColors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[200],
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: AppColors.text.primary,
        marginBottom: 16,
    },
    searchContainer: {
        flex: 1,
        marginRight: 10,
    },
    inputWrapper: {
        position: "relative",
        justifyContent: 'center',
    },
    searchInputContainer: {
        marginBottom: 0,
    },
    searchInputStyle: {
        backgroundColor: AppColors.background.secondary,
        borderRadius: 8,
        borderColor: 'transparent',
        paddingRight: 40,
        height: 44,
    },
    clearButton: {
        position: 'absolute',
        right: 12,
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: AppColors.gray[200],
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        top: 10,
    },
    searchIcon: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
    sortOptionView: {
        borderWidth: 1,
        borderColor: AppColors.gray[200],
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: AppColors.background.primary,
    },
    activeSortButton: {
        borderWidth: 1,
        borderColor: AppColors.error,
    },
    activeSortText: {
        color: AppColors.primary[600],
        fontWeight: 'bold',
    },
    categoriesContainer: {
        paddingVertical: 8,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: AppColors.background.secondary,
        marginRight: 8,
    },
    selectedCategory: {
        backgroundColor: AppColors.primary[500],
    },
    categoryText: {
        fontFamily: "Inter-Medium",
        fontSize: 14,
        color: AppColors.text.primary,
    },
    selectedCategoryText: {
        color: AppColors.background.primary,
    },
    productsGrid: {
        paddingHorizontal: 5,
        paddingTop: 16,
        paddingBottom: 50,
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    productContainer: {
        width: '48%',
    },
    footer: {
        height: 100,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: AppColors.background.primary,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 24,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        fontFamily: "Inter-SemiBold",
        fontSize: 18,
        color: AppColors.text.primary,
    },
    sortOption: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[200],
    },
    activeSortOption: {
        backgroundColor: AppColors.background.secondary
    },
    sortOptionText: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.text.primary,
    },
});