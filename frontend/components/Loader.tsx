import {
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useAppTheme } from "@/hooks/use-app-theme";

const {width} = Dimensions.get('window');

const Loader = () => {
    const { colors } = useAppTheme();

    return (
        <View style={styles.container}>
            <ActivityIndicator
                size="large"
                color={colors.primary[500]}
            />
        </View>
    );
};

export default Loader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        width: width,
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
    },
});