import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import {useLocalSearchParams} from "expo-router";
import CommonHeader from "@/components/CommonHeader";
import {AppColors} from "@/constants/theme";
import {Product} from "@/types/type"
import {useState, useEffect} from 'react';
import {getProduct} from "@/lib/API"

const SingleProductScreen = () => {
    const {id} = useLocalSearchParams<{ id: string }>();
    console.log("id", id);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const data = await getProduct(Number(id));
                setProduct(data);
            } catch (error) {
                setError('Failed to fetch product data.');
                console.log('Failed to fetch product data.', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id]);
    
    console.log('Product data: ', product);

    return (
        <View style={styles.headerContainerStyle}>
            <CommonHeader/>
        </View>
    );
};

export default SingleProductScreen;

const styles = StyleSheet.create({
    headerContainerStyle: {
        paddingTop: 30,
        backgroundColor: AppColors.background.primary,
    }
});