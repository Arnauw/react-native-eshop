import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import Toast, {
    BaseToast,
    ErrorToast,
} from 'react-native-toast-message';
import {useAppTheme} from "@/hooks/use-app-theme";

const SuccessToast = (props: any) => {
    const {colors} = useAppTheme();
    return (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: colors.success,
                backgroundColor: colors.background.primary,
                borderWidth: 1,
                borderColor: colors.gray[200],
                borderLeftWidth: 5
            }}
            contentContainerStyle={{paddingHorizontal: 15}}
            text1Style={{fontSize: 15, fontWeight: '400', color: colors.text.primary}}
            text2Style={{fontSize: 13, color: colors.text.secondary}}
        />
    );
};

const CustomErrorToast = (props: any) => {
    const {colors} = useAppTheme();
    return (
        <ErrorToast
            {...props}
            style={{
                borderLeftColor: colors.error,
                backgroundColor: colors.background.primary,
                borderWidth: 1,
                borderColor: colors.gray[200],
                borderLeftWidth: 5
            }}
            text1Style={{fontSize: 17, color: colors.text.primary}}
            text2Style={{fontSize: 15, color: colors.text.secondary}}
        />
    );
};

const PaymentToast = ({text1, text2, props}: any) => {
    const {colors} = useAppTheme();

    return (
        <View style={[styles.toastContainer, {
            backgroundColor: colors.background.primary,
            borderLeftColor: colors.primary[500],
            borderWidth: 1,
            borderColor: colors.gray[200]
        }]}>
            <View style={styles.textContainer}>
                <Text style={[styles.title, {color: colors.text.primary}]}>
                    {text1}
                </Text>
                <Text style={[styles.message, {color: colors.text.secondary}]}>
                    {text2}
                </Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => Toast.hide()}>
                    <Text style={[styles.cancelText, {color: colors.text.secondary}]}>
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.payButton, {backgroundColor: colors.primary[500]}]}
                    onPress={props.onPay}
                >
                    <Text style={styles.payText}>Pay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const DeleteToast = ({ text1, text2, props }: any) => {
    const { colors } = useAppTheme();

    return (
        <View style={[styles.toastContainer, {
            backgroundColor: colors.background.primary,
            borderLeftColor: colors.error,
            borderWidth: 1,
            borderColor: colors.gray[200]
        }]}>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                    {text1}
                </Text>
                <Text style={[styles.message, { color: colors.text.secondary }]}>
                    {text2}
                </Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => Toast.hide()}>
                    <Text style={[styles.cancelText, { color: colors.text.secondary }]}>
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.payButton, { backgroundColor: colors.error }]}
                    onPress={props.onDelete}
                >
                    <Text style={styles.payText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const toastConfig = {
    success: (props: any) => <SuccessToast {...props} />,
    error: (props: any) => <CustomErrorToast {...props} />,
    paymentToast: (props: any) => <PaymentToast {...props} />,
    deleteToast: (props: any) => <DeleteToast {...props} />,
};

const styles = StyleSheet.create({
    toastContainer: {
        width: '90%',
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderLeftWidth: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    message: {
        fontSize: 13,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    cancelText: {
        fontWeight: '600',
        fontSize: 14,
    },
    payButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    payText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    }
});