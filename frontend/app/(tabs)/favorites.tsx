import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {useRouter} from "expo-router";
import useFavoriteStore from "@/store/favoriteStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import MainLayout from "@/components/MainLayout";
import Title from "@/components/Title";

const FavoritesScreen = () => {
    const router = useRouter();
    const {favoriteItems, resetFavorite} = useFavoriteStore();
    const { colors } = useAppTheme();

    const navigateToProducts = async () => {
        router.push("/");
    };

    if (favoriteItems?.length === 0) {
        return (
            <MainLayout>
                <EmptyState
                    type="favorites"
                    message="Your favorite list is empty"
                    actionLabel="Start adding products"
                    onAction={navigateToProducts}
                />
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <View style={[styles.headerView, { borderBottomColor: colors.gray[200] }]}>
                <View>
                    <Title>
                        Favorite list
                    </Title>
                    <Text style={[styles.itemCount, { color: colors.text.secondary }]}>
                        {favoriteItems?.length} products
                    </Text>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => resetFavorite()}
                    >
                        <Text style={[styles.resetText, { color: colors.error }]}>
                            Reset favorites
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={favoriteItems}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                renderItem={({item}) => (
                    <View style={styles.productContainer}>
                        <ProductCard
                            product={item}
                            customStyle={{width: "100%"}}
                        />
                    </View>
                )}
                contentContainerStyle={styles.productsGrid}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={styles.footer}/>}
            />
        </MainLayout>
    );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
    headerView: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    resetText: {
        fontWeight: '500',
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
    },
    itemCount: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        marginTop: 2,
    },
    productsGrid: {
        paddingTop: 15,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productContainer: {
        width: '48%',
        marginBottom: 10,
    },
    footer: {
        height: 100,
    },
});