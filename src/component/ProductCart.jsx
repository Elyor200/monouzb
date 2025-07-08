import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import styles from '../styles/ProductCard.module.css';
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";


const ProductCart = ({product,  onFavoriteToggle}) => {
    const [isFav, setIsFav] = useState(false);
    const navigate = useNavigate();

    const telegramUserId = localStorage.getItem("telegramUserId");
    const productId = product.productId;

    useEffect(() => {
        setIsFav(product.favorite === true);
    }, [product]);

    const toggleFavorite = async () => {
        try {
            const res = await axios.post("https://monouzbbackend.onrender.com/v1/favorite-products/addFavoriteProduct", {
                telegramUserId: telegramUserId,
                productId
            });
            setIsFav((prev) => !prev);
        } catch (error) {
            console.error(error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className={styles.card} onClick={() => navigate(`/product/${product.productId}`)}>
            <div className={styles.imageWrapper}>
                <img
                    src={product.imageUrl?.[0]}
                    alt={product.name}
                    className={styles.image}
                />

                <button
                    className={`${styles.heart} ${isFav ? styles.filled : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        void toggleFavorite();
                    }}
                >
                    {isFav ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
                </button>
            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.category}>{product.category}</p>
                <div className={styles.bottomRow}>
                    <span className={styles.price}>{formatPrice(product.price)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCart;
