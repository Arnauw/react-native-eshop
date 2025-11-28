import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useAppTheme } from "@/hooks/use-app-theme";
import {Product} from "@/types/product";
import {useRouter} from "expo-router";
import useCartStore from "@/store/cartStore";
import Toast from "react-native-toast-message";
import {AntDesign} from "@expo/vector-icons";

interface CartItemProps {
    product: Product;
    quantity: number;
}

const CartItem = (
    {
        product,
        quantity,
    }: CartItemProps
) => {
    const router = useRouter();
    const {updateQuantity, removeItem} = useCartStore();
    const { colors } = useAppTheme();

    const handlePress = () => {
        router.push(`/(tabs)/product/${product.id}`);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1);
            Toast.show({
                type: "success",
                text1: "Quantity decreased",
                visibilityTime: 2000,
                position: "bottom",
            });
        } else {
            Toast.show({
                type: "error",
                text1: "You cannot remove less than 1 product",
                visibilityTime: 2000,
                position: "bottom",
            });
        }
    };

    const handleIncrease = () => {
        updateQuantity(product.id, quantity + 1);
        Toast.show({
            type: "success",
            text1: "Quantity increased",
            visibilityTime: 2000,
            position: "bottom",
        });
    };

    const handleRemove = () => {
        removeItem(product.id);
        Toast.show({
            type: "success",
            text1: "Product removed",
            text2: `${product.title} has been removed from the cart`,
            visibilityTime: 2000,
            position: "bottom",
        });
    };

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.background.primary,
                borderColor: colors.gray[200]
            }
        ]}>
            <TouchableOpacity
                onPress={handlePress}
                style={[styles.imageContainer, { backgroundColor: colors.background.secondary }]}
            >
                <Image
                    source={{uri: product.image}}
                    resizeMode="contain"
                    style={styles.image}
                />
            </TouchableOpacity>
            <View style={styles.details}>
                <TouchableOpacity
                    onPress={handlePress}
                >
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        {product.title}
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.price, { color: colors.primary[600] }]}>
                    {(product.price * quantity).toFixed(2)} €
                </Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        onPress={handleDecrease}
                        style={[styles.quantityButton, { backgroundColor: colors.background.secondary }]}
                    >
                        <AntDesign
                            name="minus"
                            size={16}
                            color={colors.text.primary}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.quantity, { color: colors.text.primary }]}>
                        {quantity}
                    </Text>
                    <TouchableOpacity
                        onPress={handleIncrease}
                        style={[styles.quantityButton, { backgroundColor: colors.background.secondary }]}
                    >
                        <AntDesign
                            name="plus"
                            size={16}
                            color={colors.text.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleRemove}
                        style={[styles.removeButton, { backgroundColor: colors.background.secondary }]}
                    >
                        <AntDesign
                            name="delete"
                            size={16}
                            color={colors.error}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default CartItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 16,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    details: {
        flex: 1,
        justifyContent: 'space-between'
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantity: {
        fontSize: 14,
        fontWeight: "500",
        paddingHorizontal: 12,
    },
    removeButton: {
        marginLeft: 'auto',
        width: 28,
        height: 28,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    }
});