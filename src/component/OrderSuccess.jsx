import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AiOutlineCheckCircle} from "react-icons/ai";
import styles from '../styles/OrderSuccess.module.css'
import { useCart } from "../context/CartContext.jsx";

const orderSuccess = () => {
    const navigate = useNavigate();
    const { setCartCount } = useCart();

    useEffect(() => {
        setCartCount(0);
        localStorage.setItem("cartCleared", "true");
    }, []);

    return (
        <div className={styles.wrapper}>
            <AiOutlineCheckCircle className={styles.icon} />
            <h2 className={styles.title}>Order Placed</h2>
            <p className={styles.subtitle}>Thank you for your purchase. We'll contact with you soon</p>
            <button className={styles.homeBtn} onClick={() => navigate("/home")}>
                Go to Home
            </button>
        </div>
    );
};

export default orderSuccess;