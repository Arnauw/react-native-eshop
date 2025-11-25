import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import {useEffect, useState} from "react";
import {Product} from "@/types/product";
import {useProductStore} from "@/store/productStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAppTheme } from "@/hooks/useAppTheme";
import {AntDesign} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import ProductCard from "@/components/ProductCard";
import MainLayout from "@/components/MainLayout";

export default function HomeScreen() {
    const router = useRouter();
    const { colors } = useAppTheme();

    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

    const {
        products,
        categories,
        fetchProducts,
        fetchCategories,
        loading,
        error,
    } = useProductStore();

    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
        if (categories.length === 0) {
            fetchCategories();
        }
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            const reverseProducts = [...products].reverse();
            setFeaturedProducts(reverseProducts as Product[]);
        }
    }, [products]);

    const navigateToCategory = (category: string) => {
        router.push({
            pathname: '/shop',
            params: {
                category,
            },
        });
    };

    const navigateToShop = () => {
        router.push('/shop');
    };

    if (loading && products.length === 0) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
                <LoadingSpinner fullScreen/>
            </View>
        )
    }

    if (error) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>Error: {error}</Text>
            </View>
        )
    }

    return (
        <MainLayout>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainerView}
            >
                <View style={styles.categoriesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.primary[500] }]}>
                            Categories
                        </Text>
                    </View>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {categories?.map((category, index) => (
                            <TouchableOpacity
                                style={[styles.categoryButton, { backgroundColor: colors.background.secondary }]}
                                key={index}
                                onPress={() => navigateToCategory(category)}
                            >
                                <AntDesign
                                    name={"tag"}
                                    size={16}
                                    color={colors.primary[500]}
                                />
                                <Text style={[styles.categoryText, { color: colors.text.primary }]}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
                <View style={styles.featuredSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.primary[500] }]}>
                            Best Sellers
                        </Text>
                        <TouchableOpacity onPress={navigateToShop}>
                            <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>
                                See all
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={featuredProducts}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) => (
                            <View style={styles.featuredProductWrapper}>
                                <ProductCard product={item} compact={true}/>
                            </View>
                        )}
                    />
                </View>
                
                <View style={styles.newestSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.primary[500] }]}>
                            New Products
                        </Text>
                        <TouchableOpacity onPress={navigateToShop}>
                            <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>
                                See All
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.productsGrid}>
                        {products?.map((product) => (
                                <View
                                    key={product.id}
                                    style={styles.productContainer}
                                >
                                    <ProductCard
                                        product={product}
                                        customStyle={styles.productCard}
                                    />
                                </View>
                            )
                        )}
                    </View>
                </View>
            </ScrollView>
        </MainLayout>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainerView: {
        paddingBottom: 20,
    },
    errorText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
    },
    seeAllText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
    },
    categoriesSection: {
        marginTop: 10,
        marginBottom: 16,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 10,
        minWidth: 100,
    },
    categoryText: {
        marginLeft: 6,
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        textTransform: 'capitalize',
    },
    featuredSection: {
        marginVertical: 16,
    },
    featuredProductWrapper: {
        marginRight: 4,
    },
    newestSection: {
        marginVertical: 16,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productContainer: {
        width: "48%",
        marginBottom: 16,
    },
    productCard: {
        width: "100%",
    },
});