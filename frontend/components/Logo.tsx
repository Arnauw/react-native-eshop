import React from 'react';

import {Text, View, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {AppColors} from "@/constants/theme";
import {useTheme} from "@react-navigation/core";
import {useRouter} from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Logo = () => {

    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.logoView}
            onPress={() => router.push("/")}
        >
            <MaterialIcons
                name={"shopping-cart"}
                size={30}
                color={AppColors.primary[700]}/>
            <Text style={styles.logoText}>ShopNGo</Text>
        </TouchableOpacity>
    );
};

export default Logo;


const styles = StyleSheet.create({
    logoView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20,
        marginLeft: 2,
        fontFamily: 'Inter-Bold',
        color: AppColors.primary[700],
    }
});

