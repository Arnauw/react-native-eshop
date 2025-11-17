import {Product} from "@/types/type";

// const API_URL = process.env.API_URL;
const API_URL="https://fakestoreapi.com";

console.log('API_URL is:', API_URL);

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

export {getProducts, getProduct, getCategories,};