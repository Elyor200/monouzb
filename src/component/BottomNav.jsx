import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {FiHome, FiShoppingBag, FiHeart, FiUser, FiShoppingCart} from "react-icons/fi";
import styles from '../styles/BottomNav.module.css'
import {useCart} from "../context/CartContext.jsx";
const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount } = useCart();

    const tabs = [
        {label: 'Home', path: "/home", icon: <FiHome size={20} />},
        {
            label: 'Cart',
            path: "/cart",
            icon: (
                <div className={styles.iconWrapper}>
                    <FiShoppingCart size={20} />
                    {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                </div>
            )
        },
        {label: 'Favorites', path: "/favorites", icon: <FiHeart size={20} />},
        {label: 'Profile', path: "/myProfile", icon: <FiUser size={20} />},
    ]

    return (
        <nav className={styles.navbar}>
            {tabs.map((tab) => (
                <button
                    key={tab.path}
                    className={`${styles.navItem} ${location.pathname === tab.path ? styles.active : ''}`}
                    onClick={() => navigate(tab.path)}
                >
                    <div className={styles.icon}>{tab.icon}</div>
                    <span className={styles.label}>{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;