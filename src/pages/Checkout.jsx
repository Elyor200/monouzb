import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from '../styles/Checkout.module.css'
import {AiOutlineArrowLeft} from "react-icons/ai";
import YandexMap from "../service/YandexMap.jsx";
import {formatUzbekPhone} from "../component/utils/phoneUtils.js";
import {toast} from "react-toastify";
import axios from "axios";
import {useCart} from "../context/CartContext.jsx";
import api from "../component/services/api.jsx";

const Checkout = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [addressDetails, setAddressDetails] = useState({
        lat: null,
        lng: null,
        address: "",
    });
    const [form, setForm] = useState({
        fullName: "",
        phoneNumber: "",
    });
    const [cartItems, setCartItems] = useState([]);
    const telegramUserId = localStorage.getItem("telegramUserId");
    const [totalAmount, setTotalAmount] = useState(0);
    const phoneToSend = form.phoneNumber.replace(/\s+/g, "");
    const { setCartCount } = useCart();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const payload = {
        telegramUserId: telegramUserId,
        fullName: form.fullName,
        phoneNumber: phoneToSend,
        deliveryMethod,
        paymentMethod,
        deliveryAddress: addressDetails.address,
        lat: addressDetails.lat,
        lng: addressDetails.lng,
    }

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        try {
            await api.post("/v1/orders/place-order", payload);
            toast.success("Order placed!", {
                position: "top-right",
                autoClose: 2000,
            });
            setCartItems([]);
            setTotalAmount(0)
            setCartCount(0)
            await fetchData();
            navigate("/order-success")
        } catch (error) {
            console.log(error);
        } finally {
            setIsPlacingOrder(false);
        }
    }

    if (!telegramUserId) return;

    const fetchData = async () => {
        try {
            const res = await fetch(`https://monouzbbackend.onrender.com/v1/cart/getCart?telegramUserId=${telegramUserId}`);
            const data = await res.json();
            if (data?.items && Array.isArray(data.items)) {
                setCartItems(data.items);
                setTotalAmount(data.totalAmount);
            } else {
                setCartItems([]);
            }
        } catch (err) {
            console.error(err);
            setCartItems([]);
        }
    }

    useEffect(() => {
        void fetchData()
    }, [telegramUserId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e) => {
        const formatted = formatUzbekPhone(e.target.value);
        setForm({ ...form, phoneNumber: formatted });
    };

    const handleContinue = () => {
        if (!form.fullName && !form.phoneNumber && !deliveryMethod && !paymentMethod) {
            toast.error("Please fill out all fields", {
                position: "top-center",
                autoClose: 2000,
            });
            return false;
        }

        if (!form.fullName.trim()) {
            toast.error("Please enter your full name!", {
                position: "top-center",
                autoClose: 2000,
            });
            return false;
        }

        if (!deliveryMethod) {
            toast.error("Please choose a delivery method!", {
                position: "top-center",
                autoClose: 2000,
            });
            return false;
        }

        if (!paymentMethod) {
            toast.error("Please choose a payment method!", {
                position: "top-center",
                autoClose: 2000,
            })
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (!telegramUserId) return;

        const fetchUserInfo = async () => {
            try {
                const res = await fetch(`https://monouzbbackend.onrender.com/v1/users/getUserByTelegramUserId?telegramUserId=${telegramUserId}`);
                const data = await res.json();

                const fullName = `${data.firstName} ${data.lastName}`.trim();

                setForm((prev) => ({
                    ...prev,
                    fullName: fullName,
                    phoneNumber: formatUzbekPhone(data?.phoneNumber),
                }));
            } catch (err) {
                console.error(err);
            }
        };
        void fetchUserInfo();
    }, [telegramUserId]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className={styles.checkoutWrapper}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <AiOutlineArrowLeft size={23} className={styles.backIcon} />
                </button>
                <h2 className={styles.checkoutText}>Checkout</h2>
            </header>

            <section className={styles.section}>
                <div className={styles.radioGroup}>
                    <div
                        className={`${styles.radioCard} ${deliveryMethod === "pickup" ? styles.selected : ""}`}
                        onClick={() => {
                            setDeliveryMethod("pickup");
                            setForm((prev) => ({ ...prev, deliveryMethod: "pickup" }));
                        }}
                    >
                        <p className={styles.radioTitle}>Pick up</p>
                        <p className={styles.radioSubGray}>В течение недели</p>
                        <p className={styles.radioSubGreen}>бесплатно</p>
                    </div>

                    <div
                        className={`${styles.radioCard} ${deliveryMethod === "deliver" ? styles.selected : ""}`}
                        onClick={() => {setDeliveryMethod("deliver");
                            setForm((prev) => ({ ...prev, deliveryMethod: "deliver" }));
                        }}
                    >
                        <p className={styles.radioTitle}>Delivery</p>
                        <p className={styles.radioSubGray}>Цена доставки зависит от адреса</p>
                    </div>
                </div>

                {deliveryMethod === "deliver" && (
                    <>
                        <YandexMap
                            initialCoords={[addressDetails.lat, addressDetails.lng]}
                            onAddressSelect={(data) => {
                                setAddressDetails(data);
                                setForm((prev) => ({ ...prev, address: data }));
                            }}
                        />
                        {addressDetails?.address && (
                            <div className={styles.selectedAddress}>
                                Selected location: <strong>{addressDetails.address}</strong>
                            </div>
                        )}
                    </>
                )}

                {errors.deliveryMethod && (
                    <span className={styles.errorText}>{errors.deliveryMethod}</span>
                )}
            </section>

            <section className={styles.section}>
                <div className={styles.contactForm}>
                    <div className={styles.formGroup}>
                        <label>Full Name*</label>
                        <input
                            name="fullName"
                            autoComplete="off"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className={errors.fullName ? styles.errorInput : ""}
                        />
                        {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Phone Number*</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="+998 77 100 00 00"
                            className={errors.phoneNumber ? styles.errorInput : ""}
                            inputMode="tel"
                            required
                        />
                        {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.orderSummary}>
                    {cartItems.map((item) => (
                        <div key={item.cartItemId} className={styles.cartItem}>
                            <div className={styles.imageContainer}>
                                <img src={`https://monouzbbackend.onrender.com/${item.imageUrl}`} alt={item.productName} className={styles.cartImage} />
                            </div>
                            <div className={styles.cartInfo}>
                                <p className={styles.productName}>{item.productName}</p>
                                <p className={styles.productPrice}>{formatPrice(item.productPrice)}</p>
                            </div>
                        </div>
                    ))}
                    <div className={styles.totalAmount}>
                        Total <strong>{formatPrice(totalAmount)}</strong>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.radioGroup}>
                    <div
                        className={`${styles.radioCard} ${paymentMethod === "cash" ? styles.selected : ""}`}
                        onClick={() => setPaymentMethod("cash")}
                    >
                        <p className={styles.radioTitle}>Cash</p>
                        <p className={styles.radioSubGray}>Pay when delivered</p>
                    </div>

                    <div
                        className={`${styles.radioCard} ${paymentMethod === "card" ? styles.selected : ""}`}
                        onClick={() => setPaymentMethod("card")}
                    >
                        <p className={styles.radioTitle}>Card</p>
                        <p className={styles.radioSubGray}>UZCARD or HUMO</p>
                    </div>
                </div>
            </section>

            <div className={styles.placeOrder}>
                <button className={styles.placeOrderButton}
                        onClick={() => {
                            if (handleContinue()) {
                                void handlePlaceOrder()
                            }
                        }}
                        disabled={isPlacingOrder}
                >
                    {isPlacingOrder ? (
                        <span className={styles.spinner}></span>
                    ) : (
                        'Place Order'
                    )}
                </button>
            </div>
        </div>
    );
};

export default Checkout;