import {
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useAppTheme } from "@/hooks/use-app-theme";
import {useRouter} from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Logo = () => {
    const router = useRouter();
    const { colors } = useAppTheme();

    return (
        <TouchableOpacity
            style={styles.logoView}
            onPress={() => router.push("/")}
        >
            <MaterialIcons
                name={"shopping-cart"}
                size={30}
                color={colors.primary[700]}
            />
            <Text style={[styles.logoText, { color: colors.primary[700] }]}>
                ShopNGo
            </Text>
        </TouchableOpacity>
    );
};

export default Logo;

const styles = StyleSheet.create({
    logoView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20,
        marginLeft: 2,
        fontFamily: 'Inter-Bold',
    }
});