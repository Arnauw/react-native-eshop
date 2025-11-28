import {
    Text,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from 'react-native';
import { useAppTheme } from "@/hooks/use-app-theme";
import MainLayout from "@/components/MainLayout";
import TextInputCustom from "@/components/TextInputCustom"
import {useAuthStore} from "@/store/authStore";
import {useRouter} from "expo-router";
import ButtonCustom from "@/components/ButtonCustom";
import {useState} from 'react';

const SignUpScreen = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmError, setConfirmError] = useState<string>("");
    const router = useRouter();
    const {signup, isLoading, error} = useAuthStore();
    const { colors } = useAppTheme();

    const validateForm = () => {
        let isValid = true;

        if (!email.trim()) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Invalid email address");
            isValid = false;
        } else {
            setEmailError("");
        }

        if(!password) {
            setPasswordError("Password is required");
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
        } else {
            setPasswordError("");
        }

        if (password !== confirmPassword) {
            setConfirmPassword("Passwords do not match");
            isValid = false;
        } else {
            setConfirmPassword("");
        }
        return isValid;
    }

    const handleSignUp = async () => {
        if (validateForm()) {
            await signup(email, password);
            router.push("/(tabs)/login");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }
    }

    return (
        <MainLayout>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            Create Account
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                            Sign up to get started!
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {
                            error &&
                            <Text style={[styles.errorText, { color: colors.error }]}>
                                {error}
                            </Text>
                        }
                        <TextInputCustom
                            value={email}
                            onChangeText={setEmail}
                            label="Email"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            error={emailError}
                        />
                        <TextInputCustom
                            value={password}
                            onChangeText={setPassword}
                            label="Password"
                            placeholder="Enter your password"
                            error={passwordError}
                            secureTextEntry={true}
                        />
                        <TextInputCustom
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            label="Confirm password"
                            placeholder="Confirm your password"
                            error={confirmError}
                            secureTextEntry={true}
                        />
                        <ButtonCustom
                            title="Sign Up"
                            onPress={handleSignUp}
                            fullWidth={true}
                            loading={isLoading}
                            style={styles.button}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </MainLayout>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 28,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
    },
    form: {
        width: "100%",
    },
    button: {
        marginTop: 24,
    },
    errorText: {
        fontFamily: "Inter-Regular",
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center"
    },
});