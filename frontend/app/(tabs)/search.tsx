import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

const search = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Text style={{color: 'black'}}>Hello</Text>
            </View>
        </SafeAreaView>
    );
};

export default search;

const styles = StyleSheet.create({});