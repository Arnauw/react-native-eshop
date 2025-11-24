import {
    View,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
    Image,
    Text,
} from 'react-native';
import {AppColors} from "@/constants/theme";
import {Product} from "@/types/type";
import ButtonCustom from "@/components/ButtonCustom"
import Toast from "react-native-toast-message";
import {useRouter} from "expo-router";
import {FC} from 'react';
import Rating from "@/components/Rating";
import useCartStore from "@/store/cartStore";
import useFavoriteStore from "@/store/favoriteStore";

interface ProductCardProps {
    product: Product;
    compact?: boolean;
    customStyle?: StyleProp<ViewStyle>;
}

const ProductCard: FC<ProductCardProps> = ({product, compact = false, customStyle}) => {
    const {id, title, price, category, image, rating} = product;
    const router = useRouter();
    const {addItem, getItemCount} = useCartStore();
    const {isFavorite, toggleFavorite} = useFavoriteStore();
    
    const handleProductRoute = (e: any) => {
        router.push(`/product/${id}`);
        //     "as any" is probably absolutely not necessary here so I removed it.
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

        addItem(product, 1);
        Toast.show({
            type: 'success',
            text1: `Product ${title} added to cart`,
            text2: 'View cart to complete your purchase',
            visibilityTime: 2000,
            // position: "bottom",
        });
    };

    
    return (
        <TouchableOpacity
            onPress={handleProductRoute}
            style={[
                styles.card,
                compact && styles.compactCard,
                customStyle,
            ]}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: image}}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.category}>{category}</Text>
                <Text
                    style={styles.title}
                    numberOfLines={compact ? 1 : 2}
                    ellipsizeMode={'tail'}
                >
                    {title}
                </Text>

                <View style={styles.footer}>
                    <Text
                        style={[
                            styles.price,
                            !compact
                            && {marginBottom: 7}
                        ]}
                    >
                        {price.toFixed(2)} €
                    </Text>
                    <Text
                        style={[
                            styles.ratingText,
                            !compact
                            && {marginBottom: 7}
                        ]}
                    >
                        <View style={
                            !compact &&
                            {paddingBottom: 7}
                        }>
                            <Rating
                                rating={rating?.rate}
                                count={rating?.count}
                                size={14}
                            />
                        </View>
                    </Text>
                    {!compact &&
                        <ButtonCustom
                            onPress={handleAddToCart}
                            title={'Add to cart'}
                            size={'small'}
                            variant={'outline'}
                        />}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.primary[600],
        marginBottom: 5,
    },
    footer: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },
    ratingText: {
        marginBottom: 8,
        textTransform: 'capitalize',
        color: AppColors.gray[600],
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    category: {
        fontSize: 12,
        color: AppColors.text.tertiary,
        textTransform: 'capitalize',
        marginBottom: 4,
    },
    content: {
        padding: 12,
        backgroundColor: AppColors.background.secondary,
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: -45,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 18,
        padding: 2,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: AppColors.error,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageContainer: {
        position: 'relative',
        height: 150,
        // width: 100,
        backgroundColor: AppColors.background.primary,
        padding: 5,
    },
    compactCard: {
        width: 150,
        marginRight: 12,
    },
    card: {
        backgroundColor: AppColors.background.primary,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        width: '48%',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: AppColors.gray[200],
    },
});