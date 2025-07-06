import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from '../styles/ProductCartFavorite.module.css'
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ProductCartFavorite = ({product, isFavorite, onToggleFavorite}) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/product/${product.productId}`);
    }

    return (
        <div className={styles.productCard} onClick={handleCardClick}>
            <div className={styles.imageContainer}>
                <img src={`https://8c77-2a05-45c2-4031-9e00-b9fc-7a3e-1859-c5c6.ngrok-free.app${product.imageUrl?.[0]}`} alt={product.name} />
            </div>

            <div className={styles.infoContainer}>
                <div className={styles.name}>{product.name}</div>
                <div className={styles.category}>{product.category}</div>
                <div className={styles.productId}>{product.productId}</div>
                <div className={styles.priceRow}>
                    <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
                </div>
            </div>

            <div
                className={styles.favoriteIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.productId)
                }}
            >
                {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
            </div>
        </div>
    );
};

export default ProductCartFavorite;