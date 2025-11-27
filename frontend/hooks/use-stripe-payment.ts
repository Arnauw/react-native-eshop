// import {Alert} from 'react-native';
import {useStripe} from "@stripe/stripe-react-native";
import {useRouter} from "expo-router";
import {useState} from "react";
import {createURL} from "expo-linking";
import {supabase} from "@/lib/supabase";
import Toast from "react-native-toast-message";

interface useStripePaymentProps {
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
    orderId: string;
    userEmail: string;
    onSuccess?: () => void;
}

const useStripePayment = (
    {
        paymentIntent,
        ephemeralKey,
        customer,
        orderId,
        userEmail,
        onSuccess,
    }: useStripePaymentProps) => {
    const {
        initPaymentSheet,
        presentPaymentSheet,
    } = useStripe();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const returnURL = createURL("/orders");

    const initializePaymentSheet = async () => {
        const {error} = await initPaymentSheet({
            paymentIntentClientSecret: paymentIntent,
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            merchantDisplayName: "Shopngo Store",
            returnURL: returnURL,
            defaultBillingDetails: {
                email: userEmail
            },
        });
        if (error) {
            throw new Error(`Initialization of the payment sheet failed: ${error}`);
        }
    };

    const updatePaymentStatus = async () => {
        const {error} = await supabase
            .from("orders")
            .update({
                payment_status: "success",
            })
            .eq(
                "id",
                orderId,
            )
            .select();

        if (error) {
            throw new Error(`Update of the payment status failed: ${error}`);
        }
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            await initializePaymentSheet();
            const {error: presentError} = await presentPaymentSheet();

            if (presentError) {
                throw new Error(`Payment failed: ${presentError.message}`);
            }

            await updatePaymentStatus();
            // Alert.alert(
            //     "Payment successful!",
            //     "Thanks for your purchase",
            //     [{
            //         text: "OK",
            //         onPress: () => {
            //             if (onSuccess) {
            //                 onSuccess();
            //             } else {
            //                 router.push("/orders");
            //             }
            //         },
            //     }],
            // );
            Toast.show({
                type: "success",
                text1: "Payment successful!",
                text2: "Redirecting to your orders...",
                position: "bottom",
                visibilityTime: 2000,
            });

            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/orders");
            }


        } catch (error: any) {
            const msg = error.message || "Something went wrong";
            Toast.show({
                type: "error",
                text1: "Payment failed",
                text2: msg,
                position: "bottom",
                visibilityTime: 4000,
            });
            console.error("Payment failed error: ", error);
        } finally {
            setLoading(false);
        }
    };
    return {
        handlePayment,
        loading,
    };
};

export default useStripePayment;