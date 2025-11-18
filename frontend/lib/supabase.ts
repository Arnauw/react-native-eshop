import {
    EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_SUPABASE_URL
} from "@/config";
import {createClient} from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import {Platform} from "react-native";
import {getProducts} from "@/lib/API";

const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        if (Platform.OS === "web") {
            return localStorage.getItem(key);
        }
        return SecureStore.getItem(key);
    },
    setItem: (key: string, value: string) => {
        if (Platform.OS === "web") {
            localStorage.setItem(key, value);
            return;
        }
        return SecureStore.setItem(key, value);
    },
    removeItem: (key: string) => {
        if (Platform.OS === "web") {
            localStorage.removeItem(key);
            return;
        }
        return SecureStore.deleteItemAsync(key);
    },
};


const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    {
        auth: {
            storage: ExpoSecureStoreAdapter,
            autoRefreshToken: true,
            persistSession: false,
            detectSessionInUrl: false,
        },
        realtime: {
            transport: undefined,
        },
    },
);