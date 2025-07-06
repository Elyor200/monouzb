import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import ProductCart from "./ProductCart.jsx";
import React from "react";
import styles from '../styles/ProductList.module.css'

const ProductList = ({ selectedCategory }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const telegramUserId = localStorage.getItem("telegramUserId");
            const response = await axios.get("https://8c77-2a05-45c2-4031-9e00-b9fc-7a3e-1859-c5c6.ngrok-free.app/v1/products/getAllProducts", {
                params: { telegramUserId }
            });

            let filtered = response.data;
            if (selectedCategory !== 'All') {
                filtered = filtered.filter(
                    (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
                );
            }

            setProducts(filtered);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        void fetchProducts();
    }, [fetchProducts]);

    if (loading) return (
        <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
        </div>
    );
    if (products.length === 0) return <div className={styles.image}>No products found</div>;

    return (
        <div className={styles.grid}>
            {products.map((product) => (
                <ProductCart
                    key={product.productId}
                    product={product}
                    onFavoriteToggle={fetchProducts}
                />
            ))}
        </div>
    );
};

export default ProductList;