import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { useAppTheme } from "@/hooks/use-app-theme";
import {ComponentProps, FC} from "react";
import {FontAwesome} from "@expo/vector-icons";

type FontAwesomeIconName = ComponentProps<typeof FontAwesome>['name'];

interface RatingProps {
    rating: number;
    count?: number;
    size?: number;
    showCount?: boolean;
};

const Rating: FC<RatingProps> = (
    {
        rating,
        count,
        size = 16,
        showCount = true,
    }) => {
    const { colors } = useAppTheme();

    const renderStars = () => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            let iconName: FontAwesomeIconName = 'star-o';

            if (rating >= i) {
                iconName = 'star';
            } else if (rating >= i - 0.5) {
                iconName = 'star-half-full';
            }

            stars.push(
                <FontAwesome
                    key={i}
                    name={iconName}
                    size={size}
                    color={colors.accent[500]}
                />
            );
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            <View style={styles.starsContainer}>
                {renderStars()}
            </View>
            {showCount && count !== undefined && (
                <Text style={[styles.count, { color: colors.text.secondary }]}>({count})</Text>
            )}
        </View>
    );
};

export default Rating;

const styles = StyleSheet.create({
    count: {
        marginLeft: 4,
        fontSize: 14,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 1,
    },
    container: {
        flexDirection: 'row',
        alignItems: "center",
    }
});