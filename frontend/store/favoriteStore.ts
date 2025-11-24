import {Product} from "@/types/type";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface FavoriteState {
    favoriteItems: Product[];
    addFavorite: (product: Product) => void;
    removeFavorite: (productId: number) => void;
    toggleFavorite: (product: Product) => void;
    isFavorite: (productId: number) => boolean;
    resetFavorite: () => void;
}

const useFavoriteStore = create<FavoriteState>()(
    persist(
        (set, get) => ({
            favoriteItems: [],
            addFavorite: (product: Product) => {
                set((state) => ({
                    favoriteItems: [...state.favoriteItems, product],
                }));
            },
            removeFavorite: (productId: number) => {
                set((state) => ({
                    favoriteItems: state.favoriteItems.filter(
                        (item) => item.id !== productId
                    ),
                }));
            },
            toggleFavorite: (product: Product) => {
                const isFav = get().isFavorite(product.id);
                if (isFav) {
                    get().isFavorite(product.id);
                } else {
                    get().addFavorite(product);
                }
            },
            resetFavorite: () => {
                set({favoriteItems: []});
            },
            isFavorite: (productId: number) => {
                return get().favoriteItems.some(
                    (item) => item.id === productId
                );
            },
        }),
        {
            name: "favorites-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

export default useFavoriteStore;
