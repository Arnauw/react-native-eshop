import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {useAppTheme} from "@/hooks/useAppTheme";
import {Link, useRouter} from "expo-router";
import useCartStore from "@/store/cartStore";
import {useAuthStore} from "@/store/authStore";
import {useState} from "react";
import MainLayout from "@/components/MainLayout";
import EmptyState from "@/components/EmptyState";
import Title from "@/components/Title";
import CartItem from "@/components/CartItem";
import ButtonCustom from "@/components/ButtonCustom";
import Toast from "react-native-toast-message";
import {supabase} from "@/lib/supabase";
import axios from "axios";

const CartScreen = () => {
    const router = useRouter();
    const {colors} = useAppTheme();
    const {items, getTotalPrice, clearCart} = useCartStore();
    const {user} = useAuthStore();
    const [loading, setLoading] = useState<boolean>(false);
    const subtotal = getTotalPrice();
    const shippingCost = subtotal > 50 ? 5.99 : 0;
    const total = subtotal + shippingCost;


    const handlePlaceOrder = async () => {
        if (!user) {
            Toast.show({
                type: "error",
                text1: "Login is required",
                text2: "Please, please log in to place your order",
                position: "bottom",
                visibilityTime: 2000,
            });
            return;
        }

        try {
            setLoading(true);

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            console.log("---------------- DEBUG ----------------");
            console.log("Session Error:", sessionError);
            console.log("Is Session Null?", session === null);
            console.log("Access Token present?", !!session?.access_token);
            console.log("User Role:", session?.user?.role);
            console.log("---------------------------------------");

            if (!session) {
                Toast.show({
                    type: "error",
                    text1: "Auth Error",
                    text2: "No active session found. Please log in again.",
                });
                setLoading(false);
                return;
            }

            const orderData = {
                user_email: user.email,
                total_price: total,
                items: items.map((item) => ({
                    product_id: item.product.id,
                    title: item.product.title,
                    price: item.product.price,
                    quantity: item.product.quantity,
                    image: item.product.image,
                })),
                payment_status: "pending",
            };

            console.log("User Email in Store:", user?.email);
            const { data: { user: supabaseUser } } = await supabase.auth.getUser();
            console.log("User Email in Supabase Token:", supabaseUser?.email);

            const {data, error} = await supabase
                .from("orders")
                .insert([orderData])
                .select()
                .single();
            
            if (error) {
                throw new Error(`Failed to save order: ${error.message}`);
            }
            
            const payload = {
                price: total,
                email: user?.email,
            };
            
            const response = await axios.post(
                "http://10.0.2.2/checkout",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                },
            );
            
            const {
                paymentIntent,
                ephemeralKey,
                customer,
            } = response.data;
            
            if (!paymentIntent || !ephemeralKey || !customer) {
                throw new Error("The required Stripe datas from server are missing");
            } else {
                Toast.show({
                    type: "success",
                    text1: "Order placed",
                    text2: "Order placed successfully",
                    position: "bottom",
                    visibilityTime: 2000,
                });

                router.push({
                    pathname: "/payments",
                    params: {
                        paymentIntent,
                        ephemeralKey,
                        customer,
                        orderId: data.id,
                        total: total,
                    },
                });
                clearCart();
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Order failed",
                text2: "Order failure",
                position: "bottom",
                visibilityTime: 2000,
            });
            console.log("Order error", error);
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            {items?.length > 0 ? (
                <View style={styles.container}>
                    <View style={[styles.headerView, {borderBottomColor: colors.gray[200]}]}>
                        <View>
                            <Title>
                                Cart products
                            </Title>
                            <Text style={[styles.itemCount, {color: colors.text.secondary}]}>
                                {items?.length} products
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => clearCart()}
                            >
                                <Text style={[styles.resetText, {color: colors.error}]}>
                                    Empty the cart
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.product.id.toString()}
                        renderItem={({item}) => (
                            <CartItem
                                product={item.product}
                                quantity={item.quantity}
                            />
                        )}
                        contentContainerStyle={styles.cartItemsContainer}
                        style={{flex: 1}}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={[styles.summaryContainer, {
                        backgroundColor: colors.background.primary,
                        borderTopColor: colors.gray[200]
                    }]}>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, {color: colors.text.secondary}]}>
                                Subtotal:
                            </Text>
                            <Text style={[styles.summaryValue, {color: colors.text.primary}]}>
                                {subtotal.toFixed(2)} €
                            </Text>
                        </View>

                        {shippingCost > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={[styles.summaryLabel, {color: colors.text.secondary}]}>
                                    {"Shipping fees: "}
                                </Text>
                                <Text style={[styles.summaryValue, {color: colors.text.primary}]}>
                                    {shippingCost.toFixed(2)} €
                                </Text>
                            </View>
                        )}

                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, {color: colors.text.secondary}]}>
                                Total:
                            </Text>
                            <Text style={[styles.summaryValue, {color: colors.text.primary}]}>
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
                                <Text style={[styles.alertText, {color: colors.error}]}>
                                    Log in to place order
                                </Text>
                                <Link href={"/login"}>
                                    <Text style={[styles.loginText, {color: colors.primary[500]}]}>
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
        fontWeight: '500',
    },
    headerView: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    itemCount: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        marginTop: 2,
    },
    cartItemsContainer: {
        paddingVertical: 16,
    },
    summaryContainer: {
        paddingVertical: 20,
        borderTopWidth: 1,
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
    },
    summaryValue: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
    },
    checkoutButton: {
        marginTop: 16,
    },
    alertView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    alertText: {
        fontWeight: "500",
        textAlign: 'center',
        marginRight: 3,
    },
    loginText: {
        fontWeight: "700",
    },
});