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
import { useAppTheme } from "@/hooks/use-app-theme";
import MainLayout from "@/components/MainLayout";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useProductStore} from "@/store/productStore";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import TextInputCustom from "@/components/TextInputCustom";
import Title from "@/components/Title";

const ShopScreen = () => {
    const { colors } = useAppTheme();
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
    const router = useRouter();

    useEffect(() => {
        if (categories.length === 0) fetchCategories();
        if (filteredProducts.length === 0) fetchProducts();

        if (categoryParam) {
            setCategory(categoryParam);
        }

        return () => {
            if (searchTimeOutRef.current) {
                clearTimeout(searchTimeOutRef.current as number);
            }
        };
    }, []);

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);

        if (searchTimeOutRef.current) {
            clearTimeout(searchTimeOutRef.current as number);
        }
        
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
            <View style={[styles.header, { backgroundColor: colors.background.primary, borderBottomColor: colors.gray[200] }]}>
                <Title>
                    All products
                </Title>

                <View style={styles.flexRow}>
                    <View style={styles.searchContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInputCustom
                                value={searchQuery}
                                onChangeText={handleSearchChange}
                                placeholder="Search a product..."
                                placeholderTextColor={colors.text.secondary}
                                style={styles.searchInputContainer}
                                inputStyle={[styles.searchInputStyle, { backgroundColor: colors.background.secondary, color: colors.text.primary }]}
                            />
                            {searchQuery.length > 0 ? (
                                <TouchableOpacity
                                    onPress={handleClearSearch}
                                    style={styles.clearButton}
                                >
                                    <AntDesign name="close" size={16} color={colors.gray[500]} />
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.searchIcon}>
                                    <Ionicons name="search" size={20} color={colors.text.secondary} />
                                </View>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => setShowShortModal(true)}
                        style={[
                            styles.sortOptionView,
                            { backgroundColor: colors.background.primary, borderColor: colors.gray[200] },
                            isFilterActive && { borderColor: colors.error },
                        ]}
                    >
                        <AntDesign name="filter" size={20} color={colors.text.primary}/>
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
                            { backgroundColor: selectedCategory === null ? colors.primary[500] : colors.background.secondary }
                        ]}
                    >
                        <Text style={[
                            styles.categoryText,
                            { color: selectedCategory === null ? colors.background.primary : colors.text.primary }
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
                                { backgroundColor: selectedCategory === category ? colors.primary[500] : colors.background.secondary }
                            ]}
                        >
                            <Text style={[
                                styles.categoryText,
                                { color: selectedCategory === category ? colors.background.primary : colors.text.primary }
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
                <View style={[styles.loadingSpinner, { backgroundColor: colors.background.primary }]}>
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
            
            <Modal
                visible={showShortModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowShortModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background.primary }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Sort by</Text>
                            <TouchableOpacity onPress={() => setShowShortModal(false)}>
                                <AntDesign name="close" size={24} color={colors.text.primary}/>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.sortOption, { borderBottomColor: colors.gray[200] }]}
                            onPress={() => handleSort("price-asc")}
                        >
                            <Text style={[
                                styles.sortOptionText,
                                { color: colors.text.primary },
                                activeSortOption === "price-asc" && { color: colors.primary[600], fontWeight: 'bold' }
                            ]}>
                                Price: Low to high
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.sortOption, { borderBottomColor: colors.gray[200] }]}
                            onPress={() => handleSort("price-desc")}
                        >
                            <Text style={[
                                styles.sortOptionText,
                                { color: colors.text.primary },
                                activeSortOption === "price-desc" && { color: colors.primary[600], fontWeight: 'bold' }
                            ]}>
                                Price: High to low
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.sortOption, { borderBottomColor: colors.gray[200] }]}
                            onPress={() => handleSort("rating")}
                        >
                            <Text style={[
                                styles.sortOptionText,
                                { color: colors.text.primary },
                                activeSortOption === "rating" && { color: colors.primary[600], fontWeight: 'bold' }
                            ]}>
                                Ranking: High to low
                            </Text>
                        </TouchableOpacity>

                        {isFilterActive && (
                            <TouchableOpacity style={styles.sortOption} onPress={handleResetFilter}>
                                <Text style={[styles.sortOptionText, {color: colors.error}]}>
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
        borderBottomWidth: 1,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
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
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: 'center',
    },
    activeSortButton: {
        borderWidth: 1,
    },
    categoriesContainer: {
        paddingVertical: 8,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    categoryText: {
        fontFamily: "Inter-Medium",
        fontSize: 14,
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
    },
    sortOption: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    sortOptionText: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
    },
});