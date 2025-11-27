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
import { useAppTheme } from "@/hooks/use-app-theme";
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
    const { colors } = useAppTheme();
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
                <Text style={[styles.errorText, { color: colors.error }]}>
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
                position: "bottom",
            });
            return;
        }

        addItem(product, quantity);
        Toast.show({
            type: "success",
            text1: `Product ${product?.title} has been added to cart`,
            text2: "View cart to complete your purchase.",
            visibilityTime: 2000,
            position: "bottom",
        });
    };

    const handleToggleFavorite = () => {
        toggleFavorite(product);
    }

    return (
        <MainLayout>
            <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
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
                            style={[
                                styles.favoriteButton,
                                { backgroundColor: colors.background.primary, borderColor: colors.gray[200] }
                            ]}
                        >
                            <AntDesign
                                name={"heart"}
                                size={22}
                                color={isFav ? colors.error : colors.gray[400]}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.productInfo, { backgroundColor: colors.background.secondary }]}>
                        <Text style={[styles.category, { color: colors.text.secondary }]}>
                            {
                                product?.category?.charAt(0).toUpperCase()
                                + (product?.category?.slice(1))
                            }
                        </Text>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            {product?.title}
                        </Text>
                        <View style={styles.ratingContainer}>
                            <Rating
                                rating={product?.rating?.rate}
                                count={product?.rating?.count}
                            />
                        </View>
                        <Text style={[styles.price, { color: colors.primary[600] }]}>
                            {product?.price.toFixed(2)} €
                        </Text>

                        <View style={[styles.divider, { backgroundColor: colors.gray[200] }]}/>

                        <Text style={[styles.descriptionTitle, { color: colors.text.primary }]}>
                            Description
                        </Text>
                        <Text style={[styles.description, { color: colors.text.secondary }]}>
                            {product?.description}
                        </Text>
                    </View>
                </ScrollView>

                <View style={[
                    styles.footer,
                    { backgroundColor: colors.background.primary, borderTopColor: colors.gray[200] }
                ]}>
                    <View style={styles.quantityContainer}>
                        <Text style={[styles.quantityTitle, { color: colors.text.primary }]}>Quantity</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                onPress={handleDecreaseQuantity}
                                disabled={quantity <= 1}
                                style={[styles.quantityButton, { backgroundColor: colors.background.secondary }]}
                            >
                                <AntDesign name="minus" size={20} color={colors.primary[600]}/>
                            </TouchableOpacity>

                            <Text style={[styles.quantityValue, { color: colors.text.primary }]}>{quantity}</Text>

                            <TouchableOpacity
                                onPress={handleIncreaseQuantity}
                                disabled={quantity >= 100}
                                style={[styles.quantityButton, { backgroundColor: colors.background.secondary }]}
                            >
                                <AntDesign name="plus" size={20} color={colors.primary[600]}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.gray[200] }]}/>

                    <View style={styles.footerActions}>
                        <View style={styles.totalPriceContainer}>
                            <Text style={[styles.totalLabel, { color: colors.text.primary }]}>
                                Total:
                            </Text>
                            <Text style={[styles.totalPrice, { color: colors.primary[600] }]}>
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
        position: "relative",
    },
    errorButton: {
        marginTop: 8,
    },
    errorText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
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
        lineHeight: 24,
        marginBottom: 24,
    },
    descriptionTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        marginBottom: 8,
    },
    divider: {
        height: 1,
        marginBottom: 16
    },
    price: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        marginBottom: 16,
    },
    ratingContainer: {
        marginBottom: 16,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        marginBottom: 8,
    },
    category: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    productInfo: {
        paddingHorizontal: 24,
        paddingBottom: 20,
        paddingTop: 20,
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
    },
    footer: {
        borderTopWidth: 1,
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
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityValue: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
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
    },
    totalPrice: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
    },
    totalPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        paddingRight: 16,
    },
    addToCartButton: {
        width: "38%",
    },
});