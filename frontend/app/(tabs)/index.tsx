import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import HomeHeader from "@/components/HomeHeader";
import {useState} from "react";

export default function HomeScreen() {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    
    return (
        <SafeAreaView style={{flex: 1}}>
            <HomeHeader/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
