import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styles from '../styles/OrderDetails.module.css'
import OrderStatusTracker from "./OrderStatusTracker.jsx";
import {AiOutlineArrowLeft} from "react-icons/ai";
import WebSocketOrderStatus from "../sockerSetup.js";

const ORDER_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderDetails = () => {
    const {orderId} = useParams();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://monouzbbackend.onrender.com/v1/orders/getOrderDetails/${orderId}`)
            .then(res => res.json())
            .then(setOrder)
    }, [orderId]);

    if (!order) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        )
    }

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

    return (
        <div className={styles.container}>
            <WebSocketOrderStatus
                orderId={orderId}
                onStatusChange={(data) => {
                    if (data.status) setStatus(data.status);
                }}
            />

            <div className={styles.headerContainer}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <AiOutlineArrowLeft size={20} />
                </button>
            </div>
            <h2>Order Details</h2>
            <div className={styles.sectionTracker}>
                <OrderStatusTracker status={order.status} />
            </div>

            <div className={styles.orderDetailsContainer}>
                <div className={styles.section}>
                    Order Id: <strong>{order.orderId}</strong>
                    <p className={styles.border}></p>
                </div>
                <div className={styles.section}>
                    Total Amount: <strong>{formatPrice(order.totalAmount)}</strong>
                    <p className={styles.border}></p>
                </div>
                <div className={styles.section}>
                    Payment Method: <strong>{order.paymentMethod}</strong>
                    <p className={styles.border}></p>
                </div>
                <div className={styles.section}>
                    Date and Time:{" "}
                    <strong>{formatUzbekDate(order.createdAt)}</strong>
                    <p className={styles.border}></p>
                </div>
                <div className={styles.section}>
                    <p>Address: <strong>{order.address}</strong></p>
                    <p className={styles.border}></p>
                    <p>Phone: <strong>{order.phoneNumber}</strong></p>
                    <p className={styles.border}></p>
                </div>
                <div className={styles.section}>
                    <h3>Order Items</h3>
                    {order.orderItemDetails?.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.details}>
                                <p>Product Id: <strong>{item.productId}</strong></p>
                                <p>Product Name: <strong>{item.productName}</strong></p>
                                <p>Color: <strong>{item.color}</strong></p>
                                <p>Size: <strong>{item.size}</strong></p>
                                <p>Price: <strong>{formatPrice(item.unitPrice)}</strong></p>
                                <p>Quantity: <strong>{item.quantity}</strong></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;