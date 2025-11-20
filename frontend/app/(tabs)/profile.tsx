import {
    Alert,
    Platform,
    StyleSheet,
    Text, TouchableOpacity,
    View,
} from 'react-native';
import {useAuthStore} from "@/store/authStore";
import {useRouter} from "expo-router";
import {useEffect} from "react";
import Wrapper from "@/components/wrapper";
import {AppColors} from "@/constants/theme";
import Button from "@/components/Button";
import {Feather, FontAwesome5, Foundation} from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";

const ProfileScreen = () => {
    const {user, logout, checkSession, isLoading} = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            checkSession();
        }
    }, [user]);

    const menuItems = [
        {
            id: 'cart',
            icon: (
                <Foundation
                    name="shopping-cart"
                    size={20}
                    color={AppColors.primary[500]}
                />
            ),
            title: 'My cart',
            onPress: () => {
                router.push('/(tabs)/cart');
            },
        },
        {
            id: 'orders',
            icon: (
                <FontAwesome5
                    name="box-open"
                    size={16}
                    color={AppColors.primary[500]}
                />
            ),
            title: 'My orders',
            onPress: () => {
                // router.push('/(tabs)/orders');
            },
        },
        {
            id: 'payment',
            icon: (
                <Foundation
                    name="credit-card"
                    size={20}
                    color={AppColors.primary[500]}
                />
            ),
            title: 'My payments',
            onPress: () => {
                // router.push('/(tabs)/cart');
            },
        },
        {
            id: 'address',
            icon: (
                <Foundation
                    name="home"
                    size={20}
                    color={AppColors.primary[500]}
                />
            ),
            title: 'Delivery address',
            onPress: () => {
                // router.push('/(tabs)/cart');
            },
        },
        {
            id: 'settings',
            icon: (
                <Foundation
                    name="home"
                    size={20}
                    color={AppColors.primary[500]}
                />
            ),
            title: 'Parameters',
            onPress: () => {
                // router.push('/(tabs)/cart');
            },
        },
    ];

    const handleLogout = () => {
        Alert.alert("Logging out", "Are you sure you want to log out?", [
            {
                text: "Cancel",
                style:"cancel",
            },
            {
                text: "Logging out",
                onPress: async () => {
                    try {
                        await logout();
                        Toast.show({
                            type: "success",
                            text1: "Logout successful",
                            text2: "You have logged out",
                            visibilityTime: 2000,
                        });
                    } catch (error) {
                        console.log("Profile: Error during log out" ,error);
                        Alert.alert("Logout error", "An error occurred.");
                    }
                },
            },
        ]);
    };

    return (
        <Wrapper>
            {user ? (
                <View>
                    <View style={styles.header}>
                        <Text style={styles.title}>My profile</Text>
                    </View>
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Feather
                                name="user"
                                size={40}
                                color={AppColors.gray[400]}
                            />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileEmail}>{user?.email}</Text>
                            <TouchableOpacity
                                // style={styles.profileBtn}
                                // onPress={() => logout()}
                            >
                                <Text style={styles.editProfileText}>Edit my profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.menuContainer}>
                        {menuItems?.map((item) => (
                            <TouchableOpacity
                                key={item?.id}
                                style={styles.menuItem}
                                onPress={item?.onPress}
                            >
                                <View style={styles.menuItemLeft}>
                                    {item?.icon}
                                    <Text
                                        style={styles.menuItemTitle}
                                    >
                                        {item?.title}
                                    </Text>
                                </View>
                                <MaterialIcons
                                    name="chevron-right"
                                    size={24}
                                    color={AppColors.gray[400]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.logoutContainer}>
                        <Button
                            title="Log out"
                            onPress={handleLogout}
                            variant="outline"
                            fullWidth={true}
                            style={styles.logoutButton}
                            textStyle={styles.logoutButtonText}
                            disabled={isLoading}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.container}>
                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.message}>Please sign in or register to access your profile.</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Sign In"
                                fullWidth={true}
                                style={styles.loginButton}
                                textStyle={styles.buttonText}
                                onPress={() => router.push("/(tabs)/login")}
                        />
                        <Button title="Register"
                                fullWidth={true}
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