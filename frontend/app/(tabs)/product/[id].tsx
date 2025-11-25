import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import {useState, useEffect} from 'react';
import {useLocalSearchParams, useRouter} from "expo-router";
import {AppColors} from "@/constants/theme";
import {Product} from "@/types/product"
import {getProduct} from "@/lib/API"
import LoadingSpinner from "@/components/LoadingSpinner";
import ButtonCustom from "@/components/ButtonCustom";
import Rating from "@/components/Rating";
import {AntDesign} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import useCartStore from "@/store/cartStore";
import useFavoriteStore from "@/store/favoriteStore";
import MainLayout from "@/components/MainLayout";
import {useProductStore} from "@/store/productStore";

const {width} = Dimensions.get("window");

const SingleProductScreen = () => {
    const {id} = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const router = useRouter();
    const {addItem, getItemCount} = useCartStore();
    const {isFavorite, toggleFavorite} = useFavoriteStore();
    const {products} = useProductStore();

    useEffect(() => {
        const productId = Number(id);
        
        const cachedProduct = products.find(
            p => p.id === productId
        );

        if (cachedProduct) {
            setProduct(cachedProduct);
            setLoading(false);
        } else {
            const fetchProductData = async () => {
                setLoading(true);
                try {
                    const data = await getProduct(productId);
                    setProduct(data);
                } catch (error) {
                    setError('Failed to fetch product data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProductData();
        }

        setQuantity(1);
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LoadingSpinner fullScreen={true}/>
            </View>
        );
    }
    if (error || !product) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error || "Product not found"}
                </Text>
                <ButtonCustom
                    title="Back"
                    onPress={() => router.back()}
                    style={styles.errorButton}
                />
            </View>
        );
    }
    const isFav = isFavorite(product?.id);

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleIncreaseQuantity = () => {
        if (quantity < 100) {
            setQuantity((prev) => prev + 1);
        }
    };

    const handleAddToCart = () => {
        if (getItemCount() >= 99) {
            Toast.show({
                type: 'error',
                text1: 'Cart is full',
                text2: 'You cannot have more than 99 items.',
                visibilityTime: 2000,
            });
            return;
        }

        addItem(product, quantity);
        Toast.show({
            type: "success",
            text1: `Product ${product?.title} has been added to cart`,
            text2: "View cart to complete your purchase.",
            visibilityTime: 2000,
        });
    };

    const handleToggleFavorite = () => {
        toggleFavorite(product);
    }

    return (
        <MainLayout>
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}
                >
                    <View style={styles.imageContainer}>
                        <Image
                            source={{uri: product?.image}}
                            resizeMode="contain"
                            style={styles.productImage}
                        />

                        <TouchableOpacity
                            onPress={handleToggleFavorite}
                            style={styles.favoriteButton}
                        >
                            <AntDesign
                                name={"heart"}
                                size={22}
                                color={isFav ? AppColors.error : AppColors.gray[400]}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.productInfo}>
                        <Text style={styles.category}>
                            {
                                product?.category?.charAt(0).toUpperCase()
                                + (product?.category?.slice(1))
                            }
                        </Text>
                        <Text style={styles.title}>
                            {product?.title}
                        </Text>
                        <View style={styles.ratingContainer}>
                            <Rating
                                rating={product?.rating?.rate}
                                count={product?.rating?.count}
                            />
                        </View>
                        <Text style={styles.price}>
                            {product?.price.toFixed(2)} €
                        </Text>
                        <View style={styles.divider}/>
                        <Text style={styles.descriptionTitle}>
                            Description
                        </Text>
                        <Text style={styles.description}>
                            {product?.description}
                        </Text>
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityTitle}>Quantity</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity onPress={handleDecreaseQuantity} disabled={quantity <= 1}
                                              style={styles.quantityButton}>
                                <AntDesign name="minus" size={20} color={AppColors.primary[600]}/>
                            </TouchableOpacity>

                            <Text style={styles.quantityValue}>{quantity}</Text>

                            <TouchableOpacity onPress={handleIncreaseQuantity} disabled={quantity >= 100}
                                              style={styles.quantityButton}>
                                <AntDesign name="plus" size={20} color={AppColors.primary[600]}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.footerActions}>
                        <View style={styles.totalPriceContainer}>
                            <Text style={styles.totalLabel}>
                                Total:
                            </Text>
                            <Text style={styles.totalPrice}>
                                {(product?.price * quantity).toFixed(2)} €
                            </Text>
                        </View>
                        <ButtonCustom
                            title="Add to cart"
                            onPress={handleAddToCart}
                            style={styles.addToCartButton}
                        />
                    </View>
                </View>
            </View>
        </MainLayout>
    );
};

export default SingleProductScreen;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: AppColors.background.primary,
        position: "relative",
    },
    errorButton: {
        marginTop: 8,
    },
    errorText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: AppColors.error,
        textAlign: 'center',
        marginBottom: 16,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    description: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: AppColors.text.secondary,
        lineHeight: 24,
        marginBottom: 24,
    },
    descriptionTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: AppColors.gray[200],
        marginBottom: 16
    },
    price: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: AppColors.primary[600],
        marginBottom: 16,
    },
    ratingContainer: {
        marginBottom: 16,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    category: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: AppColors.text.secondary,
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    productInfo: {
        paddingHorizontal: 24,
        paddingBottom: 20,
        paddingTop: 20,
        backgroundColor: AppColors.background.secondary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 10,
    },
    productImage: {
        width: "80%",
        height: "80%",
    },
    imageContainer: {
        width: width,
        height: width,
        alignItems: "center",
        justifyContent: 'center',
        position: 'relative',
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 44,
        backgroundColor: 'white',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: AppColors.gray[100],
    },
    footer: {
        backgroundColor: AppColors.background.primary,
        borderTopWidth: 1,
        borderTopColor: AppColors.gray[200],
        paddingHorizontal: 24,
        paddingVertical: 16,
        paddingBottom: 30,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    quantityTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: AppColors.text.primary,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: AppColors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityValue: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: AppColors.text.primary,
        paddingHorizontal: 16,
        minWidth: 40,
        textAlign: 'center',
    },
    footerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: AppColors.text.primary,
    },
    totalPrice: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: AppColors.primary[600],
    },
    totalPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    addToCartButton: {
        width: "50%",
    },
});