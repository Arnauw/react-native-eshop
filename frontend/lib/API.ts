import {Product} from "@/type";

const API_URL = "https://fakestoreapi.com";

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
}


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
}

export { getProducts, getCategories,};