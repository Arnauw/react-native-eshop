import {
    Text,
    View,
    StyleSheet,
    KeyboardTypeOptions,
    StyleProp,
    ViewStyle,
    TextStyle,
    TextInput as RNTextInput,
} from 'react-native';
import { useAppTheme } from "@/hooks/useAppTheme";

interface TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    label?: string;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoCorrect?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    style?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
}

const TextInputCustom = (
    {
        value,
        onChangeText,
        placeholder,
        placeholderTextColor,
        label,
        error,
        secureTextEntry = false,
        keyboardType = "default",
        autoCapitalize = "sentences",
        autoCorrect = true,
        multiline = false,
        numberOfLines = 1,
        style,
        inputStyle,
        labelStyle,
    }: TextInputProps
) => {
    const { colors, isDarkMode } = useAppTheme();

    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text style={[
                    styles.label,
                    { color: colors.text.primary }, // Dynamic Label Color
                    labelStyle
                ]}>
                    {label}
                </Text>
            )}
            <RNTextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor || colors.text.secondary}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                multiline={multiline}
                numberOfLines={numberOfLines}
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.background.secondary,
                        borderColor: isDarkMode ? colors.gray[700] : colors.gray[300],
                        color: colors.text.primary
                    },
                    inputStyle,
                    multiline && styles.multiligneInput,
                    error ? { borderColor: colors.error } : undefined,
                ]}
            />
            {error && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

export default TextInputCustom;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: "100%"
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "500",
    },
    input: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
    },
    multiligneInput: {
        minHeight: 100,
        textAlignVertical: "top"
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    }
});