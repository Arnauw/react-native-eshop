import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { useAppTheme } from "@/hooks/useAppTheme";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import ButtonCustom from "@/components/ButtonCustom";

type EmptyStateType =
    "cart" |
    "search" |
    "favorites" |
    "orders" |
    "profile";

interface EmptyStateProps {
    type: EmptyStateType;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
};

const EmptyState = (
    {
        type,
        message,
        actionLabel,
        onAction,
    } : EmptyStateProps
) => {
    const { colors } = useAppTheme();
    const size = 64;
    const color = colors.gray[400];

    const getIcon = () => {
        switch (type) {
            case "cart":
                return (
                    <AntDesign
                        name="shopping-cart"
                        size={size}
                        color={color}
                    />
                );
            case "search":
                return (
                    <Ionicons
                        name="search"
                        size={size}
                        color={color}
                    />
                );
            case "favorites":
                return (
                    <AntDesign
                        name="heart"
                        size={size}
                        color={color}
                    />
                );
            default:
                return (
                    <AntDesign
                        name="user"
                        size={size}
                        color={color}
                    />
                );
        }
    };

    const getDefaultMessage = () => {
        switch (type) {
            case "cart":
                return "Your cart is empty";
            case "search":
                return "No product found";
            case "favorites":
                return "Your list empty";
            default:
                return "Nothing to see here";
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                {getIcon()}
            </View>
            <Text style={[styles.message, { color: colors.text.secondary }]}>
                {message || getDefaultMessage()}
            </Text>
            {
                actionLabel && onAction && (
                    <ButtonCustom
                        title={actionLabel}
                        onPress={onAction}
                        variant="primary"
                        style={styles.button}
                    />
                )
            }
        </View>
    );
};

export default EmptyState;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    iconContainer: {
        marginBottom: 16,
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        marginTop: 16,
    },
});