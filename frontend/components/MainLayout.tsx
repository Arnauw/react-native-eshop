import {
    View,
    StyleSheet,
    Platform
} from 'react-native';
import {ReactNode} from "react";
import HomeHeader from "@/components/HomeHeader";
import {AppColors} from "@/constants/theme";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = (
    {children}: MainLayoutProps
) => {
    return (
        <>
            <HomeHeader/>
            <View style={styles.container}>
                {children}
            </View>
        </>
    )
};

export default MainLayout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: AppColors.background.primary,
        // Global bottom padding for all screens
        paddingBottom: Platform.OS === 'ios' ? 20 : 30,
    },
});