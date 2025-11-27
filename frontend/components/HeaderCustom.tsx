import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/use-app-theme";
import Logo from "@/components/Logo";
import {Ionicons, MaterialCommunityIcons, Feather} from "@expo/vector-icons";
import {useRouter, usePathname} from "expo-router";
import useCartStore from "@/store/cartStore";
import useFavoriteStore from "@/store/favoriteStore";

const HeaderCustom = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { colors, isDarkMode, toggleTheme } = useAppTheme();
    const {items} = useCartStore();
    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const {favoriteItems} = useFavoriteStore();
    const isProfilePage = pathname === '/profile' || pathname === '/login' || pathname === '/signup';

    return (
        <SafeAreaView style={{ backgroundColor: colors.background.primary }}>
            <View style={[styles.header, { borderBottomColor: isDarkMode ? colors.gray[800] : colors.gray[300] }]}>
                <Logo/>
                <View style={styles.iconContainer}>
                    
                    <TouchableOpacity
                        style={[styles.searchButton, { borderColor: colors.primary[500], backgroundColor: isDarkMode ? colors.gray[800] : colors.primary[50] }]}
                        onPress={toggleTheme}
                    >
                        <Feather
                            name={isDarkMode ? "sun" : "moon"}
                            size={20}
                            color={colors.primary[700]}
                        />
                    </TouchableOpacity>

                    {pathname !== '/' && router.canGoBack() && (
                        <TouchableOpacity
                            style={[styles.searchButton, { borderColor: colors.primary[500], backgroundColor: isDarkMode ? colors.gray[800] : colors.primary[50] }]}
                            onPress={() => router.back()}
                        >
                            <Ionicons
                                name={'arrow-back'}
                                size={20}
                                color={colors.primary[700]}
                            />
                        </TouchableOpacity>
                    )}

                    {pathname !== '/shop' && (
                        <TouchableOpacity
                            style={[styles.searchButton, { borderColor: colors.primary[500], backgroundColor: isDarkMode ? colors.gray[800] : colors.primary[50] }]}
                            onPress={() => router.push('/shop')}
                        >
                            <MaterialCommunityIcons
                                name={'storefront-outline'}
                                size={20}
                                color={colors.primary[700]}
                            />
                        </TouchableOpacity>
                    )}

                    {pathname !== '/favorites' && (
                        <TouchableOpacity
                            style={[styles.searchButton, { borderColor: colors.primary[500], backgroundColor: isDarkMode ? colors.gray[800] : colors.primary[50] }]}
                            onPress={() => router.push(`/favorites`)}
                        >
                            <MaterialCommunityIcons
                                name={'heart-outline'}
                                size={20}
                                color={colors.primary[700]}
                            />
                            <View style={[styles.itemsView, { backgroundColor: colors.background.primary, borderColor: colors.primary[500] }]}>
                                <Text style={styles.itemsText}>
                                    {favoriteItems?.length ? favoriteItems?.length : 0}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {pathname !== '/cart' && (
                        <TouchableOpacity
                            style={[styles.searchButton, { borderColor: colors.primary[500], backgroundColor: isDarkMode ? colors.gray[800] : colors.primary[50] }]}
                            onPress={() => router.push(`/cart`)}
                        >
                            <MaterialCommunityIcons
                                name={'cart-outline'}
                                size={20}
                                color={colors.primary[700]}
                            />
                            <View style={[styles.itemsView, { backgroundColor: colors.background.primary, borderColor: colors.primary[500] }]}>
                                <Text style={styles.itemsText}>
                                    {cartItemCount > 0 ? cartItemCount : 0}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {!isProfilePage && (
                        <TouchableOpacity
                            style={[styles.searchButton, { borderColor: colors.primary[500], backgroundColor: isDarkMode ? colors.gray[800] : colors.primary[50] }]}
                            onPress={() => router.push('/profile')}
                        >
                            <Ionicons
                                name={'person-outline'}
                                size={20}
                                color={colors.primary[700]}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default HeaderCustom;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        paddingBottom: 5,
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    iconContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
    },
    searchButton: {
        borderRadius: 5,
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    itemsView: {
        position: "absolute",
        top: -8,
        right: -8,
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    itemsText: {
        fontSize: 10,
        color: "#f97316",
        fontWeight: "bold",
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
});