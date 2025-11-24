import {
    Text, 
    View, 
    StyleSheet, 
    KeyboardAvoidingView, 
    ScrollView,
} from 'react-native';
import {AppColors} from "@/constants/theme";
import Wrapper from "@/components/Wrapper";
import TextInputCustom from "@/components/TextInputCustom"
import {Foundation} from "@expo/vector-icons";
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
        // console.log(email, password, confirmPassword);
        if (validateForm()) {
            await signup(email, password);
            router.push("/login");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }
    }
    
    return (
        <Wrapper>
            <KeyboardAvoidingView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View>
                        <View>
                            <Foundation
                                name={"shopping-cart"}
                                size={40}
                                color={AppColors.primary[500]}
                            />
                        </View>
                        <Text style={styles.title}>ShopNGo</Text>
                        <Text style={styles.subtitle}>Create a new account</Text>
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
        </Wrapper>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: AppColors.background.primary,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: AppColors.primary[50],
        alignItems: "center",
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 28,
        color: AppColors.text.primary,
    },
    subtitle: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.text.secondary,
    },
    form: {
        width: "100%",
    },
    button: {
        marginTop: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24
    },
    footerText: {
        fontFamily: "Inter-Regular",
        fontSize: 14,
        color: AppColors.text.secondary,
    },
    link: {
        fontFamily: "Inter-SemiBold",
        fontSize: 14,
        color: AppColors.primary[500],
        marginLeft: 4,
    },
    errorText: {
        color: AppColors.error,
        fontFamily: "Inter-Regular",
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center"
    },
});