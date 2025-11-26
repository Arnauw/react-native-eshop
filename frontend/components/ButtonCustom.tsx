import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
    TouchableOpacity,
    ActivityIndicator,
    GestureResponderEvent,
} from 'react-native';
import { useAppTheme } from "@/hooks/useAppTheme";

interface ButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    disabled?: boolean;
    fullWidth?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const ButtonCustom = (
    {
        title,
        onPress,
        variant = 'primary',
        size = 'medium',
        fullWidth = false,
        disabled = false,
        loading = false,
        style,
        textStyle,
    }: ButtonProps
) => {
    const { colors } = useAppTheme();
    const variantStyles = {
        primary: { backgroundColor: colors.primary[500] },
        secondary: { backgroundColor: colors.accent[500] },
        outline: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.primary[500]
        },
        ghost: { backgroundColor: 'transparent' },
    };

    const variantTextStyles = {
        primary: { color: '#FFFFFF' },
        secondary: { color: '#FFFFFF' },
        outline: { color: colors.primary[500] },
        ghost: { color: colors.primary[500] },
    };

    const buttonStyle = [
        styles.button,
        variantStyles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        variantTextStyles[variant],
        textStyle,
    ];
    
    const spinnerColor = variant === 'primary' || variant === 'secondary'
        ? '#FFFFFF'
        : colors.primary[500];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={spinnerColor} />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default ButtonCustom;

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontWeight: '600',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
});