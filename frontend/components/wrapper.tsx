import {StyleSheet, Text, View, Platform} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { AppColors} from "@/constants/theme";
import {ReactNode} from "react";

const wrapper = ({children} :{children : ReactNode}) => {
    return (
        <SafeAreaView style={styles.safeView}>
            <View style={styles.container}>
                <Text style={{color: 'black'}}>Wrap</Text>
            </View>
        </SafeAreaView>
    );
};

export default wrapper;

const styles = StyleSheet.create({});