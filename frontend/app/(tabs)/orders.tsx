import {
    Text,
    StyleSheet,
    View,
    Modal,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "@/hooks/use-app-theme";
import {useCallback, useEffect, useState} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {Feather} from "@expo/vector-icons";
import {useAuthStore} from "@/store/authStore";
import {useFocusEffect, useRouter} from "expo-router";
import {supabase} from "@/lib/supabase";
import Toast from "react-native-toast-message";
import Loader from "@/components/Loader";
import MainLayout from "@/components/MainLayout";
import Title from "@/components/Title";
import EmptyState from "@/components/EmptyState";
import OrderItem from "@/components/OrderItem";

interface Order {
    id: number;
    total_price: number;
    payment_status: string;
    created_at: string;
    items: {
        product_id: number;
        title: string;
        price: number;
        quantity: number;
        image: string;
    }[];
}

interface OrderDetailsModalProps {
    visible: boolean;
    order: Order | null;
    onClose: () => void;
}

const OrderDetailsModal = (
    { 
        visible,
        order,
        onClose,
    }: OrderDetailsModalProps) => {
    const { colors, isDarkMode } = useAppTheme();
    const translateY = useSharedValue(300);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            translateY.value = withTiming(300, { duration: 200 });
            opacity.value = withTiming(0, { duration: 200 });
        }
    }, [visible]);

    const animatedModalStyle = useAnimatedStyle(() => ({
        transform: [{translateY: translateY.value}],
        opacity: opacity.value
    }));

    if (!order) return null;
    
    const gradientColors: [string, string] = isDarkMode
        ? [colors.background.secondary, colors.background.primary]
        : ["#ebf5ff", "#dbeafe"];

    return (
        <Modal
            animationType={"none"}
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View style={[styles.modalContent, animatedModalStyle, { backgroundColor: colors.background.primary }]}>
                    <LinearGradient
                        colors={gradientColors}
                        style={styles.modalGradient}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                                Order #{order.id} details
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Feather name="x" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={[styles.modalText, { color: colors.text.primary }]}>
                                Total: {order?.total_price.toFixed(2)} €
                            </Text>
                            <Text style={[styles.modalText, { color: colors.text.primary }]}>
                                {`Status: ${order.payment_status === "success" ? "Payment completed" : "Pending"}`}
                            </Text>
                            <Text style={[styles.modalSectionTitle, { color: colors.text.primary }]}>
                                Articles:
                            </Text>

                            <FlatList
                                data={order.items}
                                keyExtractor={(item) => item?.product_id.toString()}
                                renderItem={({item}) => (
                                    <View style={[styles.itemContainer, { backgroundColor: isDarkMode ? colors.gray[800] : "#ffffff80" }]}>
                                        <Image
                                            source={{uri: item?.image}}
                                            style={styles.itemImage}
                                        />
                                        <View style={styles.itemDetails}>
                                            <Text style={[styles.itemsTitle, { color: colors.text.primary }]}>
                                                {item.title}
                                            </Text>
                                            <Text style={[styles.itemText, { color: colors.text.secondary }]}>
                                                Price: {item.price.toFixed(2)} €
                                            </Text>
                                            <Text style={[styles.itemText, { color: colors.text.secondary }]}>
                                                Quantity: {item.quantity}
                                            </Text>
                                            <Text style={[styles.itemText, { color: colors.text.secondary }]}>
                                                Subtotal: {(item.price * item.quantity).toFixed(2)} €
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                showsHorizontalScrollIndicator={false}
                                style={styles.itemList}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.7}
                            style={[styles.closeButton, { backgroundColor: colors.primary[500] }]}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Modal>
    );
};

const OrdersScreen = () => {
    const { colors } = useAppTheme();
    const { user } = useAuthStore();
    const router = useRouter();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async () => {
        if (!user) {
            setError("Log in to see your orders.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const {data, error} = await supabase
                .from("orders")
                .select("id, total_price, payment_status, created_at, items, user_email")
                .eq("user_email", user.email)
                .order("created_at", {ascending: false});

            if (error) {
                throw new Error(`Failed to fetch orders: ${error.message}`);
            }
            setOrders(data ?? []);

        } catch (error: any) {
            console.log("Error fetching orders", error);
            setError(error.message || "Failed to load your orders");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
                fetchOrders();
            }, [user, router]
        )
    );

    const handleDeleteOrder = async (orderId: number) => {
        Toast.show({
            type: 'deleteToast',
            text1: "Delete Order",
            text2: `Are you sure you want to delete order #${orderId}?`,
            position: 'bottom',
            autoHide: false,
            props: {
                onDelete: async () => {
                    Toast.hide();
                    try {
                        const {error} = await supabase.from("orders").delete().eq("id", orderId);
                        if (error) throw error;
                        await fetchOrders();
                        Toast.show({ 
                            type: "success",
                            text1: "Order deleted",
                        });
                    } catch (error) {
                        Toast.show({ 
                            type: "error",
                            text1: "Error deleting order",
                        });
                    }
                }
            }
        });
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setShowModal(false);
    }

    if (loading) {
        return <Loader/>;
    }

    if (error) {
        return (
            <MainLayout>
                <Title>My Orders</Title>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: colors.error }]}>Error</Text>
                </View>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Title>My Orders</Title>
            {orders?.length > 0 ? (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    refreshing={refreshing}
                    onRefresh={() => fetchOrders()}
                    renderItem={({item}) => (
                        <OrderItem
                            order={item}
                            email={user?.email}
                            onDelete={() => handleDeleteOrder(item.id)}
                            onViewDetails={handleViewDetails}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerStyle}
                />
            ) : (
                <EmptyState
                    type={"cart"}
                    message={"You don't have any orders"}
                    actionLabel={"Start shopping"}
                    onAction={() => router.push("/shop")}
                />
            )}
            <OrderDetailsModal
                visible={showModal}
                order={selectedOrder}
                onClose={handleCloseModal}
            />
        </MainLayout>
    );
};

export default OrdersScreen;

const styles = StyleSheet.create({
    contentContainerStyle: {
        marginTop: 10,
        paddingBottom: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        textAlign: "center",
    },
    listContainer: {
        paddingVertical: 16,
    },
    modalSectionTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 17,
        marginTop: 12,
        marginBottom: 10,
    },
    modalText: {
        fontFamily: "Inter-Regular",
        fontSize: 15,
        marginBottom: 10,
    },
    modalBody: {
        marginBottom: 16,
    },
    modalTitle: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        marginBottom: 16,
    },
    modalGradient: {
        padding: 20,
        borderRadius: 16,
    },
    modalContent: {
        width: "92%",
        maxHeight: "85%",
        borderRadius: 16,
        overflow: "hidden",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    closeButtonText: {
        fontFamily: "Inter-Medium",
        color: "#fff",
        fontSize: 15,
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop: 10,
    },
    itemsTitle: {
        fontFamily: "Inter-Medium",
        fontSize: 15,
        marginBottom: 6,
    },
    itemDetails: {
        flex: 1,
    },
    itemImage: {
        width: 70,
        height: 70,
        resizeMode: "contain",
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: "white",
    },
    itemContainer: {
        flexDirection: "row",
        paddingBottom: 12,
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    itemList: {
        maxHeight: 320,
    },
    itemText: {
        fontFamily: "Inter-Regular",
        fontSize: 13,
        marginBottom: 4,
    },
});