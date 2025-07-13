import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from '../styles/OrderHistory.module.css'

const STATUSES = ['Active', 'Finished'];

const OrderHistory = () => {
    const [activeStatus, setActiveStatus] = useState('Active');
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const telegramUserId = localStorage.getItem('telegramUserId');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const [cartLoading, setCartLoading] = useState(false);


    useEffect(() => {
        if (!phoneNumber) return;
        setCartLoading(true);
        fetch(`https://monouzbbackend.onrender.com/v1/orders/getUserHistory?phoneNumber=${encodeURIComponent(phoneNumber)}`)
            .then(res => res.json())
            .then(data => {
                console.log('Received data', data);
                const filtered = data.filter(orders => {
                    if (activeStatus === 'Active') {
                        return ['PENDING', 'PROCESSING', 'SHIPPED'].includes(orders.status);
                    } else {
                        return ['DELIVERED', 'CANCELED'].includes(orders.status);
                    }
                });
                setOrders(filtered);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            })
            .finally(() => {
                setCartLoading(false);
            });
    }, [activeStatus, phoneNumber]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            maximumFractionDigits: 0,
        }).format(price);
    };

    function formatUzbekDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    if (cartLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h2>Your Orders</h2>
            <div className={styles.tabContainer}>
                {STATUSES.map(status => (
                    <button
                        key={status}
                        onClick={() => setActiveStatus(status)}
                        className={activeStatus === status ? styles.activeTab : styles.tab}
                    >
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>
            {orders.length === 0 ? (
                <div className={styles.emptyContainer}>
                    <p className={styles.noOrders}>No finished orders yet</p>
                </div>
            ) : (
                <div className={styles.orders}>
                    {orders.map(order => (
                        <div
                            key={order.orderId}
                            className={styles.orderCard}
                            onClick={() => navigate(`/orders/${order.orderId}`)}
                        >
                            <div className={styles.orderHeader}>
                                <span>Order Id: <strong>{order.orderId}</strong></span>
                                <span>Total: <strong>{formatPrice(order.totalAmount)}</strong></span>
                                <span>Status: <strong>{order.status}</strong></span>
                                <span>Date and Time: <strong>{(formatUzbekDate(order.createdAt))}</strong></span>
                            </div>
                            <button className={styles.viewDetail}>View Details</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;