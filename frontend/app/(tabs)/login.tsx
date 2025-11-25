import {
    Text,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import {AppColors} from "@/constants/theme";
import MainLayout from "@/components/MainLayout";
import {useState} from "react";
import {useRouter} from "expo-router";
import {useAuthStore} from "@/store/authStore";
import ButtonCustom from "@/components/ButtonCustom";
import TextInputCustom from "@/components/TextInputCustom"

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const router = useRouter();
    const { login, isLoading, error } = useAuthStore();

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

        return isValid;
    }

    const handleLogin = async () => {
        if (validateForm()) {
            await login(email, password);
            router.push("/profile");
            setEmail("");
            setPassword("");
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
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Log in to your account</Text>
                    </View>

                    <View style={styles.form}>
                        {
                            error &&
                            <Text style={styles.errorText}>{error}</Text>
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
                        <ButtonCustom
                            title="Log In"
                            onPress={handleLogin}
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

export default LoginScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingTop: 40,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 28,
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: AppColors.text.secondary,
    },
    form: {
        width: "100%",
    },
    button: {
        marginTop: 24,
    },
    errorText: {
        color: AppColors.error,
        fontFamily: "Inter-Regular",
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center'
    },
});