import React from 'react';

import {Text, View, StyleSheet, Platform} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {AppColors} from "@/constants/theme";
import Logo from "@/components/Logo";

const HomeHeader = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Logo/>
            </View>
        </SafeAreaView>
    );
};

export default HomeHeader;


const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.background.primary,
        marginTop: Platform.OS === 'android' ? 30 : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

