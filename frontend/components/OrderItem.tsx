import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import {useAppTheme} from "@/hooks/use-app-theme";
import {useState} from "react";
import {useRouter} from "expo-router";
import axios from "axios";
import {EXPO_PUBLIC_ANDROID_EMULATOR_URL} from "@/config";
import Toast from "react-native-toast-message";
import {Feather} from "@expo/vector-icons";

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

interface OrderProps {
    order: Order;
    onDelete: (id: number) => void;
    email: string | undefined;
    onViewDetails: (order: Order) => void;
}

const OrderItem = (
    {
        order,
        onDelete,
        email,
        onViewDetails,
    }: OrderProps) => {
    const {colors} = useAppTheme();

    const isPaid = order?.payment_status === "success";
    const [loading, setLoading] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const router = useRouter();

    const handlePayNow = async () => {
        setLoading(true);
        setDisabled(true);
        const payload = {
            price: order?.total_price,
            email: email,
        };

        try {
            const response = await axios.post(
                `${EXPO_PUBLIC_ANDROID_EMULATOR_URL}/checkout`,
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

            if (response?.data) {
                Toast.show({
                    type: 'paymentToast',
                    text1: "Pay Now",
                    text2: `Initiating payment for order #${order?.id}`,
                    position: 'bottom',
                    autoHide: false,
                    props: {
                        onPay: () => {
                            Toast.hide();
                            router.push({
                                pathname: "/payments",
                                params: {
                                    paymentIntent,
                                    ephemeralKey,
                                    customer,
                                    orderId: order?.id,
                                    total: order?.total_price,
                                }
                            });
                        },
                    },
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setDisabled(false);
        }
    };

    const handleDelete = () => {
        if (order?.id) {
            onDelete(order.id);
        }
    };

    return (
        <View style={[
            styles.orderView,
            {
                backgroundColor: colors.background.primary,
                borderColor: colors.gray[200]
            }
        ]}>
            <View style={styles.orderItem}>
                <Text style={[styles.orderId, {color: colors.text.primary}]}>
                    Order #{order?.id}
                </Text>

                <Text style={{color: colors.text.primary}}>
                    Total: {order?.total_price.toFixed(2)} €
                </Text>

                <Text style={[
                    styles.orderStatus,
                    {color: isPaid ? colors.success : colors.error},
                ]}>
                    Status: {isPaid ? "Payment successful" : "Pending"}
                </Text>

                <Text style={[styles.orderDate, {color: colors.text.secondary}]}>
                    Placed on: {new Date(order.created_at).toLocaleDateString()}
                </Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => onViewDetails(order)}
                        style={[styles.actionButton, {backgroundColor: colors.primary[600]}]}
                    >
                        <Text style={styles.viewDetailsText}>
                            Details
                        </Text>
                    </TouchableOpacity>
                    {!isPaid && (
                        <TouchableOpacity
                            onPress={handlePayNow}
                            disabled={disabled}
                            style={[styles.actionButton, {backgroundColor: colors.primary[500]}]}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size={"small"}
                                    color="#fff"
                                />
                            ) : (
                                <Text style={styles.payNowText}>
                                    Pay
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {order?.items[0]?.image && (
                <Image
                    source={{uri: order?.items[0]?.image}}
                    style={[
                        styles.image,
                        {
                            backgroundColor: colors.background.secondary,
                            borderRadius: 8
                        }
                    ]}
                />
            )}

            <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
            >
                <Feather
                    name="trash-2"
                    size={20}
                    color={colors.error}
                />
            </TouchableOpacity>
        </View>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
    orderView: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
    },
    orderItem: {
        flex: 1,
    },
    orderId: {
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        marginBottom: 4,
    },
    orderTotal: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        marginBottom: 4,
    },
    orderStatus: {
        fontFamily: "Inter-Regular",
        fontSize: 14,
        marginBottom: 4
    },
    orderDate: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
    },
    image: {
        width: 80,
        height: 80,
        resizeMode: "contain",
        marginLeft: 12,
    },
    deleteButton: {
        padding: 8,
        marginLeft: 12,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-start",
        gap: 12,
        marginTop: 12,
    },
    actionButton: {
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        fontFamily: "Inter-Medium",
        color: "#fff",
        fontSize: 14,
    },
    payNowButton: {
        marginTop: 8,
        paddingVertical: 6,
        width: 80,
        borderRadius: 4,
        alignSelf: 'flex-start',
        alignItems: 'center'
    },
    payNowText: {
        fontFamily: 'Inter-Medium',
        color: '#fff',
        fontSize: 14,
    },
    viewDetailsText: {
        fontFamily: "Inter-Medium",
        color: "#fff",
        fontSize: 14,
    },
    viewDetailsButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    }
});