import {
    FlatList,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import {AppColors} from "@/constants/theme";
import {Link, useRouter} from "expo-router";
import useCartStore from "@/store/cartStore";
import {useAuthStore} from "@/store/authStore";
import {useState} from "react";
import MainLayout from "@/components/MainLayout";
import EmptyState from "@/components/EmptyState";
import Title from "@/components/Title";
import CartItem from "@/components/CartItem";
import ButtonCustom from "@/components/ButtonCustom";

const CartScreen = () => {
    const router = useRouter();
    const {items, getTotalPrice, clearCart} = useCartStore();
    const {user} = useAuthStore();
    const [loading, setLoading] = useState<boolean>(false);
    const subtotal = getTotalPrice();
    const shippingCost = subtotal > 50 ? 5.99 : 0;
    const total = subtotal + shippingCost;
    

    const handlePlaceOrder = () => {
        
    };

    return (
        <MainLayout>
            {items?.length > 0 ? (
                <View style={styles.container}>
                    <View style={styles.headerView}>
                        <View>
                            <Title>
                                Cart products
                            </Title>
                            <Text
                                style={styles.itemCount}
                            >
                                {items?.length} products
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => clearCart()}
                            >
                                <Text style={styles.resetText}>
                                    Empty the cart
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList
                        data={items}
                        keyExtractor={
                            (item) =>
                                item.product.id.toString()
                        }
                        renderItem={
                            ({item}) => (
                                <CartItem
                                    product={item.product}
                                    quantity={item.quantity}
                                />
                            )
                        }
                        contentContainerStyle={styles.cartItemsContainer}
                        showsVerticalScrollIndicator={false}
                    />
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Subtotal:
                            </Text>
                            <Text style={styles.summaryValue}>
                                {subtotal.toFixed(2)} €
                            </Text>
                        </View>
                        {shippingCost > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>
                                    {"Shipping fees: "}
                                </Text>
                                <Text style={styles.summaryValue}>
                                    {shippingCost.toFixed(2)} €
                                </Text>
                            </View>
                        )}
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Total:
                            </Text>
                            <Text style={styles.summaryValue}>
                                {total.toFixed(2)} €
                            </Text>
                        </View>
                        <ButtonCustom
                            title="Place order"
                            onPress={handlePlaceOrder}
                            disabled={!user || loading}
                            style={styles.checkoutButton}
                        />
                        {!user && (
                            <View style={styles.alertView}>
                                <Text style={styles.alertText}>
                                    Log in to place order
                                </Text>
                                <Link href={"/login"}>
                                    <Text style={styles.loginText}>
                                        Login
                                    </Text>
                                </Link>
                            </View>
                        )}
                    </View>
                </View>
            ) : (
                <EmptyState
                    type="cart"
                    message="Your cart is empty"
                    actionLabel="Start adding products"
                    onAction={() => router.push("/")}
                />
            )}
        </MainLayout>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    resetText: {
        color: AppColors.error,
        fontWeight: '500',
    },
    headerView: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[200],
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    header: {
        paddingBottom: 16,
        paddingTop: 7,
        backgroundColor: AppColors.background.primary,
    },
    itemCount: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: AppColors.text.secondary,
        marginTop: 2,
    },
    cartItemsContainer: {
        paddingVertical: 16,
    },
    summaryContainer: {
        // position: 'absolute',
        // bottom: 200,
        // width: "100%",
        backgroundColor: AppColors.background.primary,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: AppColors.gray[200],
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: AppColors.text.secondary
    },
    summaryValue: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: AppColors.text.primary,
    },
    divider: {
        height: 1,
        backgroundColor: AppColors.gray[200],
        marginVertical: 12,
    },
    totalLabel: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: AppColors.text.primary,
    },
    totalValue: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: AppColors.primary[600],
    },
    checkoutButton: {
        marginTop: 16,
    },
    alertView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertText: {
        fontWeight: "500",
        textAlign: 'center',
        color: AppColors.error,
        marginRight: 3,
    },
    loginText: {
        fontWeight: "700",
        color: AppColors.primary[500]
    },
});