import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from "react-router-dom";
import Register from "./component/register/Register.jsx";
import Otp from "./component/register/Otp.jsx";
import {ToastContainer} from "react-toastify";
import Login from "./component/login/Login.jsx";
import ForgotUsername from "./component/login/ForgotUsername.jsx";
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import ScrollToTop from "./component/ScrollToTop.jsx";
import Favorite from "./pages/Favorite.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import MainLayout from "./component/MainLayout.jsx";
import Cart from "./pages/Cart.jsx";
import axios from "axios";
import {useCart} from "./context/CartContext.jsx";
import {AnimatePresence} from "framer-motion";
import PageWrapper from "./component/PageWrapper.jsx";
import Orders from "./pages/Orders.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./component/OrderSuccess.jsx";
import PrivateRoute from "./component/PrivateRoute.jsx";

const App = () => {
    const { setCartCount } = useCart();
    const telegramUserId = localStorage.getItem("telegramUserId");

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const res = await axios.get(`https://8c77-2a05-45c2-4031-9e00-b9fc-7a3e-1859-c5c6.ngrok-free.app/v1/cart/getCart?telegramUserId=${telegramUserId}`);
                setCartCount(res.data.items.length);
            } catch (error) {
                console.log(error);
            }
        };
        if (telegramUserId) void fetchCartCount();
    }, []);

    return (
        <Router>
            <ScrollToTop/>
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/otp" element={<Otp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgotUsername" element={<ForgotUsername />} />

                    <Route path="/home" element={
                        <PrivateRoute>
                            <MainLayout><Home /></MainLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/product/:productId" element={
                        <PrivateRoute>
                            <MainLayout>
                                <PageWrapper><ProductDetails /></PageWrapper>
                            </MainLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/cart" element={
                        <PrivateRoute>
                            <MainLayout><Cart /></MainLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/favorites" element={
                        <PrivateRoute>
                            <MainLayout><Favorite /></MainLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/myProfile" element={
                        <PrivateRoute>
                            <MainLayout><MyProfile /></MainLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/orders" element={
                        <PrivateRoute>
                            <MainLayout><Orders /></MainLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/checkout" element={
                        <PrivateRoute>
                            <Checkout />
                        </PrivateRoute>
                    } />
                    <Route path="/order-success" element={
                        <PrivateRoute>
                            <OrderSuccess />
                        </PrivateRoute>
                    } />
                </Routes>
            </AnimatePresence>
            <ToastContainer />
        </Router>
    )
}

export default App;