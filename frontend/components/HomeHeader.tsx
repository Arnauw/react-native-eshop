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
import {router} from "expo-router";

const HomeHeader = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Logo/>
                <View style={styles.iconContainer}>
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
                            <Text style={styles.itemsText}>5</Text>
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
                            <Text style={styles.itemsText}>5</Text>
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