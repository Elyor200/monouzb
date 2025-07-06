import {useEffect, useState} from "react";
import axios from "axios";
import React from "react";
import styles from '../styles/Favorite.module.css'
import ProductCartFavorite from "../component/ProductCartFavorite.jsx";

const Favorite = () => {
    const [favorites, setFavorites] = useState([]);
    const telegramUserId = localStorage.getItem("telegramUserId");

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await axios.get('https://8c77-2a05-45c2-4031-9e00-b9fc-7a3e-1859-c5c6.ngrok-free.app/v1/favorite-products/getFavoriteProductsByTelegramUserId', {
                    params: {telegramUserId}
                })
                console.log("Favorites: ", res.data);
                setFavorites(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (telegramUserId) void fetchFavorites();
    }, [telegramUserId]);

    const handleToggleFavorite = async (productId) => {
        try {
            await axios.post("https://8c77-2a05-45c2-4031-9e00-b9fc-7a3e-1859-c5c6.ngrok-free.app/v1/favorite-products/addFavoriteProduct", {
                telegramUserId,
                productId,
            });
            setFavorites((prev) => prev.filter((p) => p.productId !== productId));
        } catch (err) {
            console.log("Failed to update favorite", err);
        }
    };

    return (
        <div className={styles.favoritePage}>
            {favorites.length === 0 ? (
                <p className={styles.empty}>You have no favorite products yet.</p>
            ) : (
                <div className={styles.list}>
                    {favorites.map((product) => (
                        <ProductCartFavorite
                            key={product.productId}
                            product={product}
                            isFavorite={true}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorite;