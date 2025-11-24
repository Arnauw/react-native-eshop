import {
    View,
    StyleSheet,
} from 'react-native';
import {ReactNode} from "react";
import HomeHeader from "@/components/HomeHeader";
import {AppColors} from "@/constants/theme";

const MainLayout = (
    {children}: { children: ReactNode }
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
    },
});