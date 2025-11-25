import {
    View,
    StyleSheet,
    Platform
} from 'react-native';
import {ReactNode} from "react";
import HeaderCustom from "@/components/HeaderCustom";
import { useAppTheme } from "@/hooks/useAppTheme";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = (
    {children}: MainLayoutProps
) => {
    const { colors } = useAppTheme();

    return (
        <>
            <HeaderCustom/>
            <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
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
        paddingBottom: Platform.OS === 'ios' ? 20 : 30,
    },
});