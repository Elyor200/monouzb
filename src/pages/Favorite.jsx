import {useEffect, useState} from "react";
import axios from "axios";
import React from "react";
import styles from '../styles/Favorite.module.css'
import ProductCartFavorite from "../component/ProductCartFavorite.jsx";
import api from "../component/services/api.jsx";

const Favorite = () => {
    const [favorites, setFavorites] = useState([]);
    const telegramUserId = localStorage.getItem("telegramUserId");
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setFavoriteLoading(true);
                const res = await api.get('/v1/favorite-products/getFavoriteProductsByTelegramUserId', {
                    params: {telegramUserId}
                })
                console.log("Favorites: ", res.data);
                setFavorites(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setFavoriteLoading(false);
            }
        };

        if (telegramUserId) void fetchFavorites();
    }, [telegramUserId]);

    const handleToggleFavorite = async (productId) => {
        setFavorites((prev) => prev.filter((p) => p.productId !== productId));

        try {
            await api.post("/v1/favorite-products/addFavoriteProduct", {
                telegramUserId,
                productId,
            });
        } catch (err) {
            console.log("Failed to update favorite", err);
        }
    };

    if (favoriteLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        )
    }

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