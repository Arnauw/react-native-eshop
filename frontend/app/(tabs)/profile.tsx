import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useAuthStore} from "@/store/authStore";
import {useRouter} from "expo-router";
import {useEffect} from "react";
import MainLayout from "@/components/MainLayout";
import { useAppTheme } from "@/hooks/useAppTheme";
import ButtonCustom from "@/components/ButtonCustom";
import {Feather, FontAwesome5, Foundation} from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";

const ProfileScreen = () => {
    const {user, logout, checkSession, isLoading} = useAuthStore();
    const router = useRouter();
    const { colors } = useAppTheme();

    const handleEditProfile = () => {

    }
    
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
                    color={colors.primary[500]}
                />
            ),
            title: 'My cart',
            onPress: () => {
                router.push('/cart');
            },
        },
        {
            id: 'orders',
            icon: (
                <FontAwesome5
                    name="box-open"
                    size={16}
                    color={colors.primary[500]}
                />
            ),
            title: 'My orders',
            onPress: () => {
                // router.push('/orders');
            },
        },
        {
            id: 'payment',
            icon: (
                <Foundation
                    name="credit-card"
                    size={20}
                    color={colors.primary[500]}
                />
            ),
            title: 'My payment',
            onPress: () => {
                // router.push('/payment');
            },
        },
        {
            id: 'address',
            icon: (
                <Foundation
                    name="home"
                    size={20}
                    color={colors.primary[500]}
                />
            ),
            title: 'Delivery address',
            onPress: () => {
                // router.push('/address');
            },
        },
        {
            id: 'settings',
            icon: (
                <Foundation
                    name="home"
                    size={20}
                    color={colors.primary[500]}
                />
            ),
            title: 'Settings',
            onPress: () => {
                // router.push('/settings');
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
                            position: "bottom",
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
        <MainLayout>
            {user ? (
                <View style={[styles.contentContainer, { backgroundColor: colors.background.primary }]}>
                    <View style={[styles.header, { backgroundColor: colors.background.primary }]}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>My profile</Text>
                    </View>

                    <View style={[styles.profileCard, { borderBottomColor: colors.gray[200] }]}>
                        <View style={[styles.avatarContainer, { backgroundColor: colors.gray[200] }]}>
                            <Feather
                                name="user"
                                size={40}
                                color={colors.gray[400]}
                            />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={[styles.profileEmail, { color: colors.text.primary }]}>
                                {user?.email}
                            </Text>
                            <TouchableOpacity
                                onPress={handleEditProfile}
                            >
                                <Text style={[styles.editProfileText, { color: colors.primary[500] }]}>
                                    Edit my profile
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.menuContainer, { backgroundColor: colors.background.primary }]}>
                        {menuItems?.map((item) => (
                            <TouchableOpacity
                                key={item?.id}
                                style={[styles.menuItem, { borderBottomColor: colors.gray[200] }]}
                                onPress={item?.onPress}
                            >
                                <View style={styles.menuItemLeft}>
                                    {item?.icon}
                                    <Text style={[styles.menuItemTitle, { color: colors.text.primary }]}>
                                        {item?.title}
                                    </Text>
                                </View>
                                <MaterialIcons
                                    name="chevron-right"
                                    size={24}
                                    color={colors.gray[400]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.logoutContainer}>
                        <ButtonCustom
                            title="Log out"
                            onPress={handleLogout}
                            variant="outline"
                            fullWidth={true}
                            style={[styles.logoutButton, { borderColor: colors.error }]}
                            textStyle={[styles.logoutButtonText, { color: colors.error }]}
                            disabled={isLoading}
                        />
                    </View>
                </View>
            ) : (
                <View style={[styles.guestContainer, { backgroundColor: colors.background.primary }]}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>Welcome!</Text>
                    <Text style={[styles.message, { color: colors.text.secondary }]}>
                        Please log in or register to access your profile.
                    </Text>
                    <View style={styles.buttonContainer}>
                        <ButtonCustom title="Log In"
                                      fullWidth={true}
                                      style={[styles.loginButton, { backgroundColor: colors.primary[500] }]}
                                      textStyle={[styles.buttonText, { color: colors.background.primary }]}
                                      onPress={() => router.push("/login")}
                        />
                        <ButtonCustom title="Register"
                                      fullWidth={true}
                                      variant='outline'
                                      style={[styles.signupButton, { borderColor: colors.primary[500] }]}
                                      textStyle={[styles.signupButtonText, { color: colors.primary[500] }]}
                                      onPress={() => router.push("/signup")}
                        />
                    </View>
                </View>
            )}
        </MainLayout>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    guestContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        paddingBottom: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 24,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
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
    },
    editProfileText: {
        fontFamily: "Inter-Medium",
        fontSize: 14,
    },
    menuContainer: {
        marginTop: 16,
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
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuItemTitle: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        marginLeft: 12,
    },
    logoutContainer: {
        marginTop: 24,
        paddingHorizontal: 16
    },
    logoutButton: {
        backgroundColor: "transparent",
    },
    logoutButtonText: {
    },
    message: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 24,
        marginTop: 8,
    },
    buttonContainer: {
        width: "100%",
        gap: 16,
    },
    loginButton: {
    },
    buttonText: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
    },
    signupButton: {
        backgroundColor: "transparent"
    },
    signupButtonText: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
    },
});