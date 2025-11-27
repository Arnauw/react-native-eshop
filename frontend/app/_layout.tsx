import {Stack} from 'expo-router';
import 'react-native-reanimated';
import Toast from "react-native-toast-message";
import {StripeProvider} from "@stripe/stripe-react-native";
import {EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as publishableKey} from "@/config";
import {toastConfig} from "@/components/ToastConfig";

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    return (
        <>
            <StripeProvider
                publishableKey={publishableKey}
                merchantIdentifier={"Shopngo"}
            >
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="payments" options={{headerShown: false}}/>
                </Stack>
                <Toast config={toastConfig}/>
            </StripeProvider>
        </>
    );
}