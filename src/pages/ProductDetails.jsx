import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import styles from '../styles/ProductDetails.module.css'
import React from "react";
import {AiFillHeart, AiOutlineArrowLeft, AiOutlineHeart} from "react-icons/ai";
import {toast} from "react-toastify";
import {useCart} from "../context/CartContext.jsx";
import api from "../component/services/api.jsx";

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isFav, setIsFav] = useState(false);
    const scrollRef = useRef(null);
    let isScrolling = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const telegramUserId = localStorage.getItem("telegramUserId");
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const { setCartCount } = useCart();
    const location = useLocation();
    const selectedColorFromCart = location.state?.selectedColor;
    const selectedSizeFromCart = location.state?.selectedSize;


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/v1/products/getByProductId?productId=${productId}`);
                setProduct(response.data);
            } catch (err) {
                console.log("Failed to fetch product", err)
            }
        };

        const fetchFavoriteStatus = async () => {
            try {
                const res = await api.get("v1/favorite-products/isFavoriteProduct", {
                    params: {
                        telegramUserId: telegramUserId,
                        productId: productId,
                    },
                });
                setIsFav(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        void fetchProduct();
        void fetchFavoriteStatus();
    }, [productId]);

    useEffect(() => {
        if (!product || !scrollRef.current) return;

        if (scrollRef.current && selectedColorFromCart) {
            const index = product.availableColors.findIndex(
                (color) => color.toLowerCase() === selectedColorFromCart.toLowerCase()
            );
            if (index !== -1) {
                setTimeout(() => {
                    const scrollX = scrollRef.current.offsetWidth * index;
                    scrollRef.current.scrollTo({ left: scrollX, behavior: "smooth" });
                    setSelectedColor(product.availableColors[index]);
                    setActiveIndex(index);
                }, 100);
            }
        }

        if (selectedSizeFromCart) {
            setSelectedSize(selectedSizeFromCart);
        }
    }, [product, selectedColorFromCart, selectedSizeFromCart]);


    const toggleFavorite = async () => {
        try {

            const productId = product.productId;
            await api.post("/v1/favorite-products/addFavoriteProduct", {
                telegramUserId: telegramUserId,
                productId
            });
            setIsFav(prev => !prev);
        } catch (err) {
            console.log("Failed to updated favorite", err)
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleScroll = () => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollLeft = container.scrollLeft;
        const width = container.offsetWidth;
        const index = Math.round(scrollLeft / width);

        setActiveIndex(index);

        if (product?.availableColors?.[index]) {
            setSelectedColor(product.availableColors[index]);
        }
    };

    const handleColorClick = (index) => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollX = container.offsetWidth * index;
        container.scrollTo({ left: scrollX, behavior: "smooth" });
        setActiveIndex(index);
    }

    const ColorDot = ({ colorName, isSelected, onClick }) => {
        const simpleColors = {
            black: "#000000",
            white: "#FFFFFF",
            red: "#cb1313",
            blue: "#09125f",
            lightblue: "#3d8bcb",
            green: "#04361D",
            yellow: "#FFFF00",
            beige: "#F5F5DC",
            gray: "#808080",
            brown: "#8B4513",
            pink: "#FFC0CB",
            purple: "#800080",
            orange: "#FFA500",
            darkblue: "#09125f",
            wineRed: "#500909FF",
        }

        const normalized = colorName.toLowerCase().trim();

        if (normalized.includes("and")) {
            const parts = normalized.split(/and/i).map(p => p.trim());
            const validParts = parts.map(p => simpleColors[p] || "#ccc");

            if (validParts.length === 2) {
                return (
                    <div
                        className={`${styles.colorDotMulti} ${isSelected ? styles.selected : ''}`}
                        onClick={onClick}
                        title={colorName}
                    >
                        <div className={styles.dotHalf} style={{ backgroundColor: validParts[0] }} />
                        <div className={styles.dotHalf} style={{ backgroundColor: validParts[1] }} />
                    </div>
                );
            }
        }

        const baseColor = simpleColors[normalized] || "#ccc";

        return (
            <div
                className={`${styles.colorDot} ${isSelected ? styles.selected : ''}`}
                style={{ backgroundColor: baseColor }}
                onClick={onClick}
                title={colorName}
            />
        );
    }

    const handleAddToCart = async () => {
        if (!selectedSize || !selectedColor) {
            toast.error("Please select color and size!", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        const telegramUserId = localStorage.getItem("telegramUserId");

        try {
            const response = await api.post(`/v1/cart/add?telegramUserId=${telegramUserId}`, {
                productId: product.productId,
                color: selectedColor,
                size: selectedSize,
                quantity: 1
            })
            const updatedCart = response.data;

            console.log("Updated Cart", updatedCart);
            toast.success("Added to cart!", {
                position: "top-right",
                autoClose: 2000,
            })

            setCartCount(prev => prev + 1);
        } catch (error) {
            console.log("Error adding to cart", error);
            toast("Error adding to cart!", {
                position: "top-right",
                autoClose: 2000,
            })
        }
    }

    const imageUrls = product?.imageUrl || [];

    if (!product) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.detailWrapper}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <AiOutlineArrowLeft size={25} className={styles.backIcon} />
            </button>
            <div className={styles.imageContainer}>
                <div
                    className={styles.imageScroll} ref={scrollRef} onScroll={handleScroll}>
                    {imageUrls.map((url, i) => (
                        <div key={i} className={styles.imageBox}>
                            <img
                                key={i}
                                src={`https://monouzbbackend.onrender.com${url}`}
                                alt={`${product?.name || "Product"} (${i + 1})`}
                                className={styles.image}
                            />
                        </div>
                    ))}
                </div>

                <button
                    className={`${styles.heart} ${isFav ? styles.filled : ''}`}
                    onClick={toggleFavorite}
                >
                    {isFav ? <AiFillHeart size={28} /> : <AiOutlineHeart size={28} />}
                </button>

                <div className={styles.dotsContainer}>
                    {imageUrls.map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.dot} ${i === activeIndex ? styles.activeDot : ''}`}
                        />
                    ))}
                </div>

                {product.availableColors?.length > 0 && (
                    <div className={styles.colorSelector}>
                        <div className={styles.colorOptions}>
                            {product.availableColors.map((color, index) => (
                                <ColorDot key={index}
                                          colorName={color}
                                          isSelected={selectedColor === color}
                                          onClick={() => {
                                              handleColorClick(index)
                                              setSelectedColor(color);
                                          }}
                                />
                            ))}
                        </div>

                        <div className={styles.priceSection}>
                            {product.oldPrice && (
                                <span className={styles.oldPrice}>{product.oldPrice}</span>
                            )}
                            <span className={styles.price}>{formatPrice(product.price)}</span>
                            <p className={styles.description}>{product.description}</p>
                        </div>
                    </div>
                )}
            </div>


            <div className={styles.content}>
                <div className={styles.header}>
                    <h2 className={styles.name}>{product.name}</h2>
                </div>

                <p className={styles.category}>{product.category}</p>

                <div className={styles.sizeContainer}>
                    {['XS', 'S', 'M', 'L', 'XL'].map((size, index) => (
                        <button
                            key={index}
                            className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.addToBag} onClick={handleAddToCart}>+ Add to Bag</button>
            </div>
        </div>
    );

};

export default ProductDetails;