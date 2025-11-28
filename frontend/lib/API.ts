import {Product} from "@/types/product";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// console.log('API_URL is:', API_URL);

const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching products", error);
        throw error;
    }
};

const getProduct = async (id: number): Promise<Product> => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching product with id: ${id}`, error);
        throw error;
    }
};


const getCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_URL}/products/categories`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching categories", error);
        throw error;
    }
};

const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products/category/${category}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch products in ${category}`, error);
        throw error;
    }
};

const searchProducts = async (query: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const products = await response.json();
        const searchQuery = query.toLowerCase().trim();

        return products.filter(
            (product: Product) => 
                product.title.toLowerCase().includes(searchQuery)
                || product.description.toLowerCase().includes(searchQuery)
                || product.category.toLowerCase().includes(searchQuery)
        );
    } catch (error) {
        console.error(`Error fetching products with query: ${query}`, error);
        throw error;
    }
}

export {
    getProducts,
    getProduct,
    getCategories,
    getProductsByCategory,
    searchProducts,
};