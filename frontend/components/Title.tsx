import {
    Text,
    StyleSheet,
} from 'react-native';
import {AppColors} from "@/constants/theme";
import {ReactNode} from "react";

const Title = (
    {children}: { children: ReactNode }
) => {
    return (
        <Text
            style={styles.title}
        >
            {children}
        </Text>
    );
};

export default Title;

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: AppColors.text.primary
    },
});