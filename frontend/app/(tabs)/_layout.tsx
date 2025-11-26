import { Stack } from 'expo-router';

export default function TabLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'default',
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="shop" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="search" />
            <Stack.Screen name="favorites" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="payments" />
            <Stack.Screen name="product/[id]" />
        </Stack>
    );
};
