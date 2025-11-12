import {Product} from "@/type";

const API_URL = "https://fakestoreapi.com/products";

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