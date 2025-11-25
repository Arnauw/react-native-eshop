import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    useEffect,
    useRef,
    useState
} from "react";
import {
    AntDesign,
    Ionicons
} from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import {useProductStore} from "@/store/productStore";
import TextInputCustom from "@/components/TextInputCustom";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import MainLayout from "@/components/MainLayout";

const SearchScreen = () => {
    const { colors } = useAppTheme();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const searchTimeOutRef = useRef<NodeJS.Timeout | number | null>(null);
    const {
        error,
        filteredProducts,
        loading,
        fetchProducts,
        searchProductsRealTime,
    } = useProductStore();

    useEffect(() => {
        if (filteredProducts?.length === 0) {
            fetchProducts();
        }
        return () => {
            if (searchTimeOutRef.current) {
                clearTimeout(searchTimeOutRef.current as number);
            }
        };
    }, []);

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        if (searchTimeOutRef.current) {
            clearTimeout(searchTimeOutRef.current as number);
        }
        if (text.length >= 3) {
            searchTimeOutRef.current = setTimeout(() => {
                searchProductsRealTime(text);
            }, 500);
        } else {
            searchProductsRealTime("");
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        searchProductsRealTime("");
    };

    const renderHeader = () => {
        return (
            <View style={[styles.header, {
                backgroundColor: colors.background.primary,
                borderBottomColor: colors.gray[200]
            }]}>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                    Search products
                </Text>
                <View style={styles.searchRow}>
                    <View style={styles.searchContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInputCustom
                                value={searchQuery}
                                onChangeText={handleSearchChange}
                                placeholder="Search a product"
                                style={styles.searchInput}
                                inputStyle={[styles.searchInputStyle, { backgroundColor: colors.background.secondary }]}
                            />
                            {searchQuery?.length > 0 && (
                                <TouchableOpacity
                                    onPress={handleClearSearch}
                                    style={[styles.clearButton, { backgroundColor: colors.gray[200] }]}
                                >
                                    <AntDesign
                                        name="close"
                                        size={16}
                                        color={colors.gray[500]}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={
                            () => searchProductsRealTime(searchQuery)
                        }
                        style={[styles.searchButton, { backgroundColor: colors.primary[500] }]}
                    >
                        <Ionicons
                            name="search"
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <MainLayout>
            {renderHeader()}
            
            {loading ? (
                <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
                    <LoadingSpinner/>
                </View>
            ) : error ? (
                <View style={[styles.errorContainer, { backgroundColor: colors.background.primary }]}>
                    <Text style={[styles.errorText, { color: colors.error }]}>
                        {error}
                    </Text>
                </View>
            ) : filteredProducts?.length === 0 && searchQuery ? (
                <EmptyState
                    type="search"
                    message="Pas de produits correspondant"
                />
            ) : (
                <FlatList
                    data={searchQuery ? filteredProducts : []}
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
                    ListFooterComponent={<View style={styles.footer}/>}
                    ListEmptyComponent={
                        !searchQuery ? (
                            <View style={styles.emptyStateContainer}>
                                <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>
                                    Enter at least 3 letters to start the search
                                </Text>
                            </View>
                        ) : null
                    }
                />
            )}
        </MainLayout>
    )
}

export default SearchScreen;

const styles = StyleSheet.create({
    header: {
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        marginBottom: 16,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        flex: 1,
    },
    inputWrapper: {
        position: "relative",
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        marginBottom: 0,
        flex: 1,
    },
    searchInputStyle: {
        borderRadius: 8,
        borderColor: 'transparent',
        paddingRight: 40,
    },
    clearButton: {
        position: 'absolute',
        right: 12,
        height: 24,
        width: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    searchButton: {
        borderRadius: 8,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    productsGrid: {
        paddingHorizontal: 8,
        paddingTop: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productContainer: {
        width: "48%",
        marginBottom: 16,
    },
    footer: {
        height: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
    },
    emptyStateContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
});