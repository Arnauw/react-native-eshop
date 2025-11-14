import {Animated, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeHeader from "@/components/HomeHeader";
import {useEffect, useState} from "react";
import {Product} from "@/type";
import {useProductStore} from "@/store/productStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import {AppColors} from "@/constants/theme";
import ScrollView = Animated.ScrollView;
import {AntDesign} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import ProductCard from "@/components/ProductCard";

export default function HomeScreen() {
    const router = useRouter();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

    const {
        products, categories,
        fetchProducts, fetchCategories,
        loading, error,
    } = useProductStore();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            const reverseProducts = [...products].reverse();
            setFeaturedProducts(reverseProducts as Product[]);
        }
    }, [products]);

    const navigateToCategory = (category: string) => {
        router.push({
            pathname: '/(tabs)/shop',
            params: {
                category: category,
            },
        });
    }

    if (loading) {
        return (
            <SafeAreaProvider style={styles.container}>
                <View style={styles.errorContainer}>
                    <LoadingSpinner fullScreen/>
                </View>
            </SafeAreaProvider>
        )
    }

    if (error) {
        return (
            <SafeAreaProvider style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                </View>
            </SafeAreaProvider>
        )
    }

    return (
        <View style={styles.wrapper}>
            <HomeHeader/>
            <View style={styles.contentContainer}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainerView}
                >
                    <View style={styles.categoriesSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Categories</Text>
                        </View>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {categories?.map((category, index) => (
                                <TouchableOpacity
                                    style={styles.categoryButton}
                                    key={index}
                                    onPress={() => navigateToCategory(category)}
                                >
                                    <AntDesign
                                        name={"tag"}
                                        size={16}
                                        color={AppColors.primary[500]}
                                    />
                                    <Text style={styles.categoryText}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={styles.featuredSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Best Sellers</Text>
                            <TouchableOpacity
                                // onPress={navigateToAllProducts}
                            >
                                <Text style={styles.seeAllText}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={featuredProducts}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.featuredProductsContainer}
                            renderItem={({item}) => (
                                <View style={styles.featuredProductsContainer}>
                                    <ProductCard product={item} compact={true}/>
                                </View>
                            )}
                        />
                    </View>
                    <View style={styles.newestSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>New Products</Text>
                            <TouchableOpacity>
                                <Text>See All</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.productsGrid}>
                            {products?.map((product, index) => (
                                    <View
                                        key={index}
                                        style={styles.productContainer}
                                    >
                                        <ProductCard 
                                            product={product}
                                            customStyle={{width: "100%"}}
                                        />
                                    </View>
                                )
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        // flex: 1,
        backgroundColor: AppColors.background.primary,
    },
    container: {
        flex: 1,
        backgroundColor: AppColors.background.primary,
    },
    contentContainer: {
        // paddingHorizontal: 20,
        paddingLeft: 20,
    },
    scrollContainerView: {
        paddingBottom: 300,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    categoriesSection: {
        marginTop: 10,
        marginBottom: 16,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.background.secondary,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 5,
        minWidth: 100,
    },
    categoryText: {
        marginLeft: 6,
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: AppColors.text.primary,
        textTransform: 'capitalize',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingRight: 20,
    },
    sectionTitle: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: AppColors.primary[500],
    },
    seeAllText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: AppColors.primary[500],
    },
    errorText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: AppColors.error,
        textAlign: 'center',
    },
    productContainer: {
        width: "48%",
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingRight: 20,
    },
    newestSection: {
        marginVertical: 16,
        marginBottom: 32,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featuredProductsContainer: {},
    featuredProductContainer: {},
    featuredSection: {
        marginVertical: 16,
    },

});