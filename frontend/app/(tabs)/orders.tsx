import {
    Text,
    StyleSheet,
} from 'react-native';
import {AppColors} from "@/constants/theme";

const MyComponent = () => {
    return (
        <Text>
            
        </Text>
    );
};

export default MyComponent;

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.error,
        textAlign: "center",
    },
    listContainer: {
        paddingVertical: 16,
    },
    modalSectionTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 17,
        color: AppColors.text.primary,
        marginTop: 12,
        marginBottom: 10,
    },
    modalText: {
        fontFamily: "Inter-Regular",
        fontSize: 15,
        color: AppColors.text.primary,
        marginBottom: 10,
    },
    modalBody: {
        marginBottom: 16,
    },
    modalTitle: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: AppColors.text.primary
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
        fontFamily: "Inter-Meduim",
        color: "#fff",
        fontSize: 15,
    },
    closeButton: {
        backgroundColor: AppColors.primary[500],
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
        fontFamily: "Inter-medium",
        fontSize: 15,
        color: AppColors.text.primary,
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
        backgroundColor: AppColors.background.primary + "80",
        borderRadius: 8,
        padding: 8,
    },
    itemList: {
        maxHeight: 320,
    },
    itemText: {
        fontFamily: "Inter-Regular",
        fontSize: 13,
        color: AppColors.text.secondary,
        marginBottom: 4,
    }
});