import {
    View,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Text
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {AppColors} from "@/constants/theme";
import Logo from "@/components/Logo";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import useCartStore from "@/store/cartStore";
import useFavoriteStore from "@/store/favoriteStore";
import ButtonCustom from "@/components/ButtonCustom";

const HomeHeader = () => {
    const router = useRouter();
    const {items} = useCartStore();
    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const {favoriteItems} = useFavoriteStore();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Logo/>
                <View style={styles.iconContainer}>

                    {/* REMOVE THIS LATER IT'S FOR TESTING */}
                    <ButtonCustom
                        title="Clear Cart"
                        onPress={() => useCartStore.persist.clearStorage()}
                        size="small"
                    />

                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => router.push(`/(tabs)/search`)}
                    >
                        <Ionicons
                            name={'search'}
                            size={20}
                            color={AppColors.primary[700]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => router.push(`/(tabs)/favorites`)}
                    >
                        <MaterialCommunityIcons
                            name={'heart-outline'}
                            size={20}
                            color={AppColors.primary[700]}
                        />
                        <View style={styles.itemsView}>
                            <Text style={styles.itemsText}>
                                {favoriteItems?.length ? favoriteItems?.length : 0}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => router.push(`/(tabs)/cart`)}
                    >
                        <MaterialCommunityIcons
                            name={'cart-outline'}
                            size={20}
                            color={AppColors.primary[700]}
                        />
                        <View style={styles.itemsView}>
                            <Text style={styles.itemsText}>
                                {cartItemCount > 0 ? cartItemCount : 0}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default HomeHeader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.background.primary,
        marginTop: Platform.OS === "android" ? 35 : 0,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[300],
        paddingBottom: 5,
        paddingHorizontal: 20,
    },
    iconContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    searchButton: {
        backgroundColor: AppColors.primary[50],
        borderRadius: 5,
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        borderWidth: 1,
        borderColor: AppColors.primary[500],
    },
    itemsView: {
        position: "absolute",
        top: -8,
        right: -8,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: AppColors.background.primary,
        borderWidth: 1,
        borderColor: AppColors.primary[500],
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    itemsText: {
        fontSize: 10,
        color: AppColors.accent[500],
        fontWeight: "bold",
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
});