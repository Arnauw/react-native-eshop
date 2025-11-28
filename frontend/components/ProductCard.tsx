import {
    View,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
    Image,
    Text,
    GestureResponderEvent,
} from 'react-native';
import { useAppTheme } from "@/hooks/use-app-theme";
import {Product} from "@/types/product";
import ButtonCustom from "@/components/ButtonCustom"
import Toast from "react-native-toast-message";
import {useRouter} from "expo-router";
import Rating from "@/components/Rating";
import useCartStore from "@/store/cartStore";
import useFavoriteStore from "@/store/favoriteStore";
import {AntDesign} from "@expo/vector-icons";

interface ProductCardProps {
    product: Product;
    compact?: boolean;
    customStyle?: StyleProp<ViewStyle>;
}

const ProductCard = (
    {
        product,
        compact = false,
        customStyle
    }: ProductCardProps
) => {
    const { colors } = useAppTheme();
    const {id, title, price, category, image, rating} = product;
    const router = useRouter();
    const {addItem, getItemCount} = useCartStore();
    const {isFavorite, toggleFavorite} = useFavoriteStore();
    const isFav = isFavorite(id);

    const handleProductRoute = (e: any) => {
        router.push(`/(tabs)/product/${id}`);
    };

    const handleAddToCart = (e: GestureResponderEvent) => {
        e.stopPropagation();

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

        addItem(product, 1);
        Toast.show({
            type: 'success',
            text1: `Product ${title} added to cart`,
            text2: 'View cart to complete your purchase',
            visibilityTime: 2000,
            position: "bottom",
        });
    };

    const handleToggleFavorite = (e: GestureResponderEvent) => {
        e.stopPropagation();
        toggleFavorite(product);
    };
    
    return (
        <TouchableOpacity
            onPress={handleProductRoute}
            style={[
                styles.card,
                { backgroundColor: colors.background.primary, borderColor: colors.gray[200] },
                compact && styles.compactCard,
                customStyle,
            ]}
            activeOpacity={0.8}
        >
            <View style={[styles.imageContainer, { backgroundColor: colors.background.primary }]}>
                <Image
                    source={{uri: image}}
                    style={styles.image}
                    resizeMode="contain"
                />
                <TouchableOpacity
                    onPress={handleToggleFavorite}
                    style={[
                        styles.favoriteButton,
                        {
                            borderWidth: isFav ? 1 : 0,
                            borderColor: colors.error
                        }
                    ]}
                >
                    <AntDesign
                        name="heart"
                        size={18}
                        color={
                            isFav
                                ? colors.error
                                : colors.gray[400]
                        }
                    />
                </TouchableOpacity>
            </View>

            <View style={[styles.content, { backgroundColor: colors.background.secondary }]}>
                <Text style={[styles.category, { color: colors.text.tertiary }]}>{category}</Text>
                <Text
                    style={[styles.title, { color: colors.text.primary }]}
                    numberOfLines={compact ? 1 : 2}
                    ellipsizeMode={'tail'}
                >
                    {title}
                </Text>

                <View style={styles.footer}>
                    <Text
                        style={[
                            styles.price,
                            { color: colors.primary[600] },
                            !compact
                            && {marginBottom: 7}
                        ]}
                    >
                        {price.toFixed(2)} €
                    </Text>
                    <Text
                        style={[
                            styles.ratingText,
                            { color: colors.gray[600] },
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
                    <ButtonCustom
                        onPress={handleAddToCart}
                        title={'Add to cart'}
                        size={'small'}
                        variant={'outline'}
                    />
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
        marginBottom: 5,
    },
    footer: {
        justifyContent: 'space-between',
    },
    ratingText: {
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    category: {
        fontSize: 12,
        textTransform: 'capitalize',
        marginBottom: 4,
    },
    content: {
        padding: 12,
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 18,
        padding: 2,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageContainer: {
        position: 'relative',
        height: 150,
        padding: 5,
    },
    compactCard: {
        width: 150,
        marginRight: 12,
    },
    card: {
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
    },
});