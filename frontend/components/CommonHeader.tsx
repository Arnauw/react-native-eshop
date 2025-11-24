import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import {
    Feather,
    AntDesign,
    MaterialCommunityIcons
} from "@expo/vector-icons";
import {AppColors} from "@/constants/theme";
import {useRouter} from "expo-router";

interface CommonHeaderProps {
    isFav?: boolean;
    showCart?: boolean;
    handleToggleFavorite?: () => void;
}

const CommonHeader = (
    {
        isFav,
        showCart,
        handleToggleFavorite
    }: CommonHeaderProps
) => {
    const router = useRouter();
    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/');
        }
    }

    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoBack}
            >
                <Feather
                    name="arrow-left"
                    size={24}
                    color={AppColors.text.primary}
                />
            </TouchableOpacity>
            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={[
                        styles.favoriteButton,
                        isFav && styles.activeFavoriteButton
                    ]}
                    onPress={handleToggleFavorite}
                >
                    <AntDesign
                        name="heart"
                        size={24}
                        color={
                            isFav
                                ? AppColors.background.primary
                                : AppColors.text.primary
                        }
                        fill={
                            isFav
                                ? AppColors.background.primary
                                : 'transparent'
                        }
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => router.push('/cart')}
                >
                    <MaterialCommunityIcons
                        name="cart-outline"
                        size={24}
                        color={AppColors.text.primary}
                        // fill={
                        //     isFav
                        //         ? AppColors.background.primary
                        //         : 'transparent'
                        // }
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CommonHeader;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        zIndex: 10,
        marginTop: Platform.OS === "android" ? 35 : 0,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.background.secondary,
    },
    favoriteButton: {
        paddingTop: 4,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: AppColors.background.secondary,
    },
    activeFavoriteButton: {
        backgroundColor: AppColors.error
    },
    buttonView: {
        flexDirection: 'row',
        gap: 7,
    }
});