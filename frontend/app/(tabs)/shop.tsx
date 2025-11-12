import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

const shop = () => {
    return (
        <SafeAreaView>
            <View style={{ flex: 1 }}>
                <Text style={{color: 'black'}}>Hello</Text>
            </View>
        </SafeAreaView>
    );
};

export default shop;

const styles = StyleSheet.create({});