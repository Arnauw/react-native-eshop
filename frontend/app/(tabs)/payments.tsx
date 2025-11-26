import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { useAppTheme } from "@/hooks/useAppTheme";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuthStore} from "@/store/authStore";
import ButtonCustom from "@/components/ButtonCustom";
import useStripePayment from "@/hooks/use-stripe-payment";

const getStringParam = (value: string | string[] | undefined) => {
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const PaymentsScreen = () => {
    const router = useRouter();
    const { colors } = useAppTheme();
    const {
        paymentIntent,
        ephemeralKey,
        customer,
        orderId,
        total,
    } = useLocalSearchParams();
    const {user} = useAuthStore();
    const totalValue = Number(getStringParam(total));

    const {handlePayment, loading} = useStripePayment({
        paymentIntent: getStringParam(paymentIntent),
        ephemeralKey: getStringParam(ephemeralKey),
        customer: getStringParam(customer),
        orderId: getStringParam(orderId),
        userEmail: user?.email ?? "",
        onSuccess: () => router.push("/orders"),
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            
            <Text style={[styles.title, { color: colors.text.primary }]}>
                Complete your payment
            </Text>

            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Please confirm your payment information to finalize the order
            </Text>

            <Text style={[styles.totalPrice, { color: colors.text.primary }]}>
                Total: {totalValue.toFixed(2)} €
            </Text>

            <ButtonCustom
                title={loading ? "Processing..." : "Confirm your payment"}
                fullWidth={true}
                onPress={handlePayment}
                loading={loading}
                disabled={loading}
                style={styles.button}
            />
        </View>
    );
};

export default PaymentsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 24,
        textAlign: "center",
        marginBottom: 16,
    },
    subtitle: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 32,
    },
    totalPrice: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
});