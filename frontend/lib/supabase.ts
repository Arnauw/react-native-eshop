import {
    EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_SUPABASE_URL
} from "@/config";
import {createClient} from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
        realtime: {
            transport: undefined,
        },
    },
);