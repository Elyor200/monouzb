import React, {useEffect, useState} from "react";
import styles from '../styles/Cart.module.css'
import {useCart} from "../context/CartContext.jsx";
import axios from "axios";
import {removeItem} from "framer-motion";
import {AiOutlineDelete} from "react-icons/ai";
import { MdOutlineDelete} from "react-icons/md";
import {FiTrash2} from "react-icons/fi";
import {BiMinus, BiPlus} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import Checkout from "./Checkout.jsx";
import api from "../component/services/api.jsx";

const Cart = () => {
    const [cartItems, setCartItems] = useState({ items: [], totalAmount: 0 });
    const telegramUserId = localStorage.getItem("telegramUserId");
    const { setCartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get(`/v1/cart/getCart?telegramUserId=${telegramUserId}`);
                setCartItems(res.data);
            } catch (err) {
                console.log("Error fetching cart", err);
            }
        };

        if (telegramUserId) void fetchCart();
    }, [telegramUserId]);

    const updateItemInState = (updatedItem) => {
        setCartItems(prevState => {
            const updatedItems = prevState.items.map(item =>
                item.cartItemId === updatedItem.cartItemId ? updatedItem : item
            );

            const updatedTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);

            return {
                ...prevState,
                items: updatedItems,
                totalAmount: updatedTotal,
            }
        })
    }

    const increment = async (item) => {
        try {
            const newQuantity = item.quantity + 1;
            const res = await api.put(`/v1/cart/update/${item.cartItemId}?telegramUserId=${telegramUserId}&quantity=${newQuantity}`);
            updateItemInState(res.data.items.find(i => i.cartItemId === item.cartItemId));
        } catch (err) {
            console.log("Error updating cart", err);
        }
    }

    const decrement = async (item) => {
        if (item.quantity <= 1) return;
        try {
            const newQuantity = item.quantity - 1;
            const res = await api.put(`/v1/cart/update/${item.cartItemId}?telegramUserId=${telegramUserId}&quantity=${newQuantity}`);
            updateItemInState(res.data.items.find(i => i.cartItemId === item.cartItemId))
        } catch (err) {
            console.log("Error updating cart", err);
        }
    }

    const removeItem = async (item) => {
        try {
            await api.delete(`/v1/cart/remove/${item.cartItemId}?telegramUserId=${telegramUserId}`);

            setCartItems(prevState => {
                const updatedItems = prevState.items.filter(i => i.cartItemId !== item.cartItemId);
                const updatedTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);

                setCartCount(updatedItems.length);

                return {
                    ...prevState,
                    items: updatedItems,
                    totalAmount: updatedTotal,
                };
            });
        } catch (err) {
            console.log("Error deleting cart", err);
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
        <div className={styles.cartWrapper}>
            {cartItems.items.length === 0 ? (
                <div className={styles.emptyContainer}>
                    <p className={styles.emptyMessage}>Your cart is empty</p>
                </div>
            ) : (
                <>
                    <h2>My Cart</h2>
                    {cartItems.items.map((item, index) => (
                        <div key={index} className={styles.cartItem}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={`https://monouzbbackend.onrender.com/${item.imageUrl}`}
                                    alt={item.productName}
                                    className={styles.productImage}
                                    onClick={() => navigate(`/product/${item.productId}`, {
                                        state: {
                                            selectedColor: item.color,
                                            selectedSize: item.size,
                                    }
                                    })}
                                />
                            </div>

                            <div className={styles.details}>
                                <h4 className={styles.productName}>{item.productName}</h4>
                                <p className={styles.size}>Size: {item.size}</p>
                                <p className={styles.price}>{formatPrice(item.total)}</p>
                                <div className={styles.actions}>
                                    <button onClick={() => decrement(item)}> <BiMinus size={16}/> </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => increment(item)}> <BiPlus size={16}/> </button>
                                </div>
                            </div>
                            <button
                                className={styles.removeBtn}
                                onClick={() => removeItem(item)}
                                title="Remove from cart"
                            >
                                <FiTrash2 size={20} />
                            </button>
                        </div>
                    ))}
                    <div className={styles.checkoutContainer}>
                        <p className={styles.totalPrice}>Total: {formatPrice(cartItems.totalAmount)}</p>
                        <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>Checkout</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Cart;
