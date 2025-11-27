import {
    Text,
    StyleSheet,
    View,
    Modal,
    ScrollView,
    Image,
    TouchableOpacity, FlatList,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import {useAppTheme} from "@/hooks/use-app-theme";
import {AppColors} from "@/constants/theme";
import {useEffect, useState} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {Feather} from "@expo/vector-icons";
import {useAuthStore} from "@/store/authStore";
import {useRouter} from "expo-router";

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
    const translateY = useSharedValue(300);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(
                0,
                {
                    damping: 15,
                    stiffness: 100,
                },
            );
            opacity.value = withTiming(
                1,
                {duration: 300},
            );
        } else {
            translateY.value = withTiming(
                300,
                {duration: 200},
            );
            opacity.value = withTiming(
                0,
                {duration: 200},
            );
        }
    }, [visible]);

    const animatedModalStyle =
        useAnimatedStyle(() => ({
            transform: [{translateY: translateY.value}],
            opacity: opacity.value
        }));

    if (!order) return null;

    return (
        <Modal
            animationType={"none"}
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        animatedModalStyle,
                    ]}
                >
                    <LinearGradient
                        colors={[
                            AppColors.primary[50],
                            AppColors.primary[100],
                        ]}
                        style={styles.modalGradient}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Order #{order.id} details
                            </Text>
                            <TouchableOpacity
                                onPress={onClose}
                            >
                                <Feather
                                    name="x"
                                    size={24}
                                    color={AppColors.text.primary}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={styles.modalText}>
                                Total: {order?.total_price.toFixed(2)}
                            </Text>
                            <Text style={styles.modalText}>
                                Status:
                                {order.payment_status === "success"
                                    ? " Payment completed"
                                    : " Pending"}
                            </Text>
                            <Text style={styles.modalSectionTitle}>
                                Articles:
                            </Text>
                            <FlatList
                                data={order.items}
                                keyExtractor={
                                    (item) =>
                                        item?.product_id.toString()
                                }
                                renderItem={({ item }) => (
                                    <View style={styles.itemContainer}>
                                        <Image
                                            source={{uri: item?.image}}
                                            style={styles.itemImage}
                                        />
                                        <View style={styles.itemDetails}>
                                            <Text style={styles.itemsTitle}>
                                                {item.title}
                                            </Text>
                                            <Text style={styles.itemText}>
                                            Price: {item.price.toFixed(2)} €
                                            </Text>
                                            <Text style={styles.itemText}>
                                                Quantity: {item.quantity} €
                                            </Text>
                                            <Text style={styles.itemText}>
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
                            style={styles.closeButton}
                        >
                        </TouchableOpacity>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Modal>
    );

};


const OrdersScreen = () => {
    const {user} = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    
    const fetchOrders = async () => {}
    
    return (
        <View>
            <Text>
                Example Title
            </Text>
        </View>
    );
};

export default OrdersScreen;

const styles = StyleSheet.create({
    erroContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.error,
        textAlign: "center",
    },
    listContainer: {
        paddingVertical: 16,
    },
    modalSectionTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 17,
        color: AppColors.text.primary,
        marginTop: 12,
        marginBottom: 10,
    },
    modalText: {
        fontFamily: "Inter-Regular",
        fontSize: 15,
        color: AppColors.text.primary,
        marginBottom: 10,
    },
    modalBody: {
        marginBottom: 16,
    },
    modalTitle: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: AppColors.text.primary
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        marginBottom: 16,
    },
    modalGradient: {
        padding: 20,
    },
    modalContent: {
        width: "92%",
        maxHeight: "85%",
        borderRadius: 16,
        overflow: "hidden",
    },
    modalOverlay: {
        alignItems: "center"
    },
    closeButtonText: {
        fontFamily: "Inter-Meduim",
        color: "#fff",
        fontSize: 15,
    },
    closeButton: {
        backgroundColor: AppColors.primary[500],
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemsTitle: {
        fontFamily: "Inter-medium",
        fontSize: 15,
        color: AppColors.text.primary,
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
    },
    itemContainer: {
        paddingBottom: 12,
        backgroundColor: AppColors.background.primary + "80",
        borderRadius: 8,
        padding: 8,
    },
    itemList: {
        maxHeight: 320,
    },
    itemText: {
        fontFamily: "Inter-Regular",
        fontSize: 13,
        color: AppColors.text.secondary,
        marginBottom: 4,
    }
});