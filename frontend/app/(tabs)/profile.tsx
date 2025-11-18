import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {useAuthStore} from "@/store/authStore";
import {useRouter} from "expo-router";
import {useEffect} from "react";
import Wrapper from "@/components/wrapper";
import {AppColors} from "@/constants/theme";
import Button from "@/components/Button";

const ProfileScreen = () => {
    const {user, logout, checkSession} = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            checkSession();
        }
    }, [user]);

    return (
        <Wrapper>
            {user ? (
                <View>
                    <Text>User available</Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.message}>Please sign in or register to access your profile.</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Sign In" fullWidth
                                style={styles.loginButton}
                                textStyle={styles.buttonText}
                                onPress={() => router.push("/(tabs)/login")}
                        />
                        <Button title="Register" fullWidth
                                variant='outline'
                                style={styles.signupButton}
                                textStyle={styles.signupButtonText}
                                onPress={() => router.push("/(tabs)/signup")}
                        />
                    </View>
                </View>
            )}
        </Wrapper>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        paddingBottom: 16,
        backgroundColor: AppColors.background.primary,
        marginTop: Platform.OS === "android" ? 30 : 0,
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 24,
        color: AppColors.text.primary,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: "center",
        // backgroundColor: AppColors.background.primary,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[200],
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: AppColors.gray[200],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileEmail: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: AppColors.text.primary,
    },
    editProfileText: {
        fontFamily: "Inter-Medium",
        fontSize: 14,
        color: AppColors.primary[500],
    },
    menuContainer: {
        marginTop: 16,
        backgroundColor: AppColors.background.primary,
        borderRadius: 8,
        paddingVertical: 8,
        marginHorizontal: 16,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[200],
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuItemTitle: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        color: AppColors.text.primary,
        marginLeft: 12,
    },
    logoutContainer: {
        marginTop: 24,
        //paddingHorizontal: 16
    },
    logoutButton: {
        backgroundColor: "transparent",
        borderColor: AppColors.error,
    },
    logoutButtonText: {
        color: AppColors.error,
    },
    message: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.text.secondary,
        textAlign: "center",
        marginBottom: 24,
    },
    buttonContainer: {
        width: "100%",
        gap: 16,
    },
    loginButton: {
        backgroundColor: AppColors.primary[500]
    },
    buttonText: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: AppColors.background.primary,
    },
    signupButton: {
        borderColor: AppColors.primary[500],
        backgroundColor: "transparent"
    },
    signupButtonText: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: AppColors.primary[500],
    },
});