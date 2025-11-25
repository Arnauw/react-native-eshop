import {
    Text,
    StyleSheet,
    View,
    Modal,
    ScrollView,
    Image,
    TouchableOpacity
} from 'react-native';
import { useAppTheme } from "@/hooks/useAppTheme";

const MyComponent = () => {
    const { colors } = useAppTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Example Title
            </Text>
        </View>
    );
};

export default MyComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        textAlign: "center",
    },
    listContainer: {
        paddingVertical: 16,
    },
    modalSectionTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 17,
        marginTop: 12,
        marginBottom: 10,
    },
    modalText: {
        fontFamily: "Inter-Regular",
        fontSize: 15,
        marginBottom: 10,
    },
    modalBody: {
        marginBottom: 16,
    },
    modalTitle: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent:'space-between',
        alignItems: "center",
        marginBottom: 16,
    },
    modalGradient: {
        padding: 20,
    },
    modalContent: {
        width: "92%",
        maxHeight: "85%",
        borderRadius: 16,
        overflow: "hidden",
    },
    modalOverlay: {
        alignItems: "center"
    },
    closeButtonText: {
        fontFamily: "Inter-Medium",
        color: "#fff",
        fontSize: 15,
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemsTitle: {
        fontFamily: "Inter-Medium",
        fontSize: 15,
        marginBottom: 6,
    },
    itemDetails: {
        flex: 1,
    },
    itemImage: {
        width: 70,
        height: 70,
        resizeMode: "contain",
        marginRight: 12,
        borderRadius: 8,
    },
    itemContainer: {
        paddingBottom: 12,
        borderRadius: 8,
        padding: 8,
    },
    itemList: {
        maxHeight: 320,
    },
    itemText: {
        fontFamily: "Inter-Regular",
        fontSize: 13,
        marginBottom: 4,
    }
});