import React, {useEffect} from "react";
import styles from '../styles/OrderStatusTracker.module.css';
import {FaCheckCircle, FaRegClock} from "react-icons/fa";

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderStatusTracker = ({ status }) => {
    const currentIndex = STATUSES.findIndex(s => s.toLowerCase() === status.toLowerCase());

    return (
        <div className={styles.tracker}>
            {STATUSES.map((step, index) => {
                const isFinal = index === STATUSES.length - 1;
                const isCompleted = index < currentIndex || (isFinal && index === currentIndex);
                const isCurrent = index === currentIndex && !isFinal;

                let circle;
                if (isCompleted) {
                    circle = (
                        <div className={styles.completedCircle}>
                            <FaCheckCircle size={25} className={styles.checkIcon} />
                        </div>
                    );
                } else if (isCurrent) {
                    circle = <div className={styles.spinnerCircle} />;
                } else {
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
