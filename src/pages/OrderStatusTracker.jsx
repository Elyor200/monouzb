import React, {useEffect} from "react";
import styles from '../styles/OrderStatusTracker.module.css';
import {FaCheckCircle, FaRegClock} from "react-icons/fa";
import Stomp from 'stompjs'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderStatusTracker = ({ status }) => {
    const currentIndex = STATUSES.findIndex(s => s.toLowerCase() === status.toLowerCase());

    useEffect(() => {
        const socket = new SockJS('https://monouzbbackend.onrender.com/ws')
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/order-status/${orderId}`, (message) => {
                const data = JSON.parse(message.body);
                console.log("Status updated: ", data)
            });
        });

        return () => {
            stompClient.disconnect();
        }
    }, []);

    return (
        <div className={styles.tracker}>
            {STATUSES.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isNext = index === currentIndex + 1;
                const isFuture = index > currentIndex + 1;

                let circle;
                if (isCompleted || (isCurrent && step === 'Pending')) {
                    circle = (
                        <div className={styles.completedCircle}>
                            <FaCheckCircle size={25} className={styles.checkIcon} />
                        </div>
                    );
                } else if (isNext) {
                    circle = <div className={styles.spinnerCircle} />;
                } else if (isFuture) {
                    circle = (
                        <div className={styles.clockCircle}>
                            <FaRegClock size={24} className={styles.clockIcon} />
                        </div>
                    );
                }

                return (
                    <div key={step} className={styles.stepWrapper}>
                        <div className={styles.step}>
                            {circle}
                            <span className={styles.label}>{step}</span>
                        </div>
                        {index < STATUSES.length - 1 && <div className={styles.line} />}
                    </div>
                );
            })}
        </div>
    );
};

export default OrderStatusTracker;
