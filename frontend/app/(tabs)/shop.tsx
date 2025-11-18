import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useEffect, useState} from "react";
import {EXPO_PUBLIC_API_URL as API_URL}  from "@/config";
import {AppColors} from "@/constants/theme";
// Uncomment to refactor using getProducts from API.ts
// import {getProducts} from "@/lib/API";
// import {Product} from "@/types/type";

const ShopScreen = () => {
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        const getProducts = async () => {
            const response = await fetch(`${API_URL}/products`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const data = await response.json();
            setProducts(data);
            console.log(data);
        };
        getProducts();
    }, []);

    // Correct way
    // const [products, setProducts] = useState<Product[]>([]); // ✅ Typed
    //
    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const data = await getProducts();
    //             setProducts(data);
    //         } catch (error) {
    //             console.error("Failed to load products:", error);
    //         }
    //     };
    //     fetchProducts();
    // }, []);
    
    return (
        <SafeAreaView>
            <View style={{ flex: 1 }}>
                <Text style={{color: 'black'}}>Hello</Text>
            </View>
        </SafeAreaView>
    );
};

export default ShopScreen;

const styles = StyleSheet.create({
    header: {
        marginTop: Platform.OS === "android" ? 30 : 0,
        paddingBottom: 16,
        backgroundColor: AppColors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[200],
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        flex: 1,
        marginRight: 5,
    },
    searchContainer: {
        flex: 1,
    },
    searchInput: {
        backgroundColor: AppColors.background.secondary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: AppColors.gray[300],
        color: AppColors.text.primary,
    },
    searchInputStyle: {
        backgroundColor: AppColors.background.secondary,
        borderRadius: 8,
        borderColor: "transparent",
    },
    searchButton: {
        backgroundColor: AppColors.primary[500],
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        position: "absolute",
        right: 0,
    },
    sortButton: {
        backgroundColor: AppColors.background.secondary,
        borderRadius: 8,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
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
        fontFamily:"Inter-Medium",
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
        width:'48%',
    },
    footer: {
        height: 100,
    },
    modalOverlay:{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)"
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
    sortOptionView: {
        borderWidth: 1,
        borderColor: AppColors.gray[200],
        width: 45,
        height: 45,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: 'center'
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
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        padding: 24,
    },
    errorText: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        color: AppColors.error,
        textAlign: "center",
    },
});