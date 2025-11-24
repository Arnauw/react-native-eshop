import {Product} from "@/types/type";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getItemCount: () => number;
}

const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product: Product, quantity: number = 1) => {
                const currentCount = get().getItemCount();
                if (currentCount + quantity > 99) {
                    return;
                }

                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.product.id === product.id
                    );
                    if (existingItem) {
                        return {
                            items: state.items.map(
                                (item) =>
                                    item.product.id === product.id
                                        ? {...item, quantity: item.quantity + quantity}
                                        : item
                            ),
                        }
                    } else {
                        return {
                            items: [...state.items, {product: product, quantity: quantity}],
                        }
                    }
                });
            },
            removeItem: (productId: number) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => item.product.id !== productId
                    )
                }))
            },
            updateQuantity: (productId: number, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId
                            ? {...item, quantity: quantity}
                            : item
                    ),
                }));
            },
            clearCart: () => {
                set({items: []});
            },
            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) =>
                        total + item.product.price + item.quantity, 0
                );
            },
            getItemCount: () => {
                return get().items.reduce(
                    (total, item) =>
                        total + item.quantity, 0
                );
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

export default useCartStore;