import {Stack} from 'expo-router';
import 'react-native-reanimated';
import Toast from "react-native-toast-message";
import {StripeProvider} from "@stripe/stripe-react-native";
import {toastConfig} from "@/components/ToastConfig";

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
        throw new Error("Missing Stripe Publishable Key");
    }

    return (
        <>
            <StripeProvider
                publishableKey={publishableKey}
                merchantIdentifier={"Shopngo"}
            >
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                </Stack>
                <Toast config={toastConfig}/>
            </StripeProvider>
        </>
    );
}