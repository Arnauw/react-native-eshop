import {
    Text,
    StyleSheet,
} from 'react-native';
import { useAppTheme } from "@/hooks/use-app-theme";
import {ReactNode} from "react";

interface TitleProps {
    children: ReactNode;
}

const Title = (
    {children}: TitleProps
) => {
    const { colors } = useAppTheme();

    return (
        <Text
            style={[styles.title, { color: colors.text.primary }]}
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
    },
});