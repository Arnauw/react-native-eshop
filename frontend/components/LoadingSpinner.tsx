import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useAppTheme } from "@/hooks/use-app-theme";

interface LoadingSpinnerProps {
    size?: "small" | "large";
    color?: string;
    text?: string;
    fullScreen?: boolean;
}

const LoadingSpinner = (
    {
        size = "small",
        color,
        text = "Loading...",
        fullScreen = false,
    }: LoadingSpinnerProps
) => {
    const { colors } = useAppTheme();
    const spinnerColor = color || colors.primary[500];

    if (fullScreen) {
        return (
            <View style={[styles.fullScreen, { backgroundColor: colors.background.primary }]}>
                <ActivityIndicator size={size} color={spinnerColor}/>
                {text && (
                    <Text style={[styles.text, { color: colors.text.primary }]}>
                        {text}
                    </Text>
                )}
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={spinnerColor}/>
            {text && (
                <Text style={[styles.text, { color: colors.text.primary }]}>
                    {text}
                </Text>
            )}
        </View>
    )
}

export default LoadingSpinner

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 8,
        fontSize: 14,
    }
});