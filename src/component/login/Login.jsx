import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";
import './Login.css'
import React from "react";
import { formatUzbekPhone } from "../utils/phoneUtils.js";
import api from "../services/api.jsx";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        phoneNumber: "",
    });

    useEffect(() => {
        document.body.classList.add("login-page");
        return () => {
            document.body.classList.remove("login-page");
        };
    }, [])

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e) => {
        const formatted = formatUzbekPhone(e.target.value);
        setForm({ ...form, phoneNumber: formatted });
    };

    const handleLogin = async () => {
        if (!form.username || !form.phoneNumber) {
            toast.error("Please fill required fields", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        const cleanedPhone = form.phoneNumber.replace(/\s+/g, "");
        setLoading(true);

        try {
            const response = await api.post("/v1/users/login", {
                username: form.username,
                phoneNumber: cleanedPhone,
            });
            toast.success("Login success", {
                position: "top-center",
                autoClose: 2000,
            });

            localStorage.setItem("telegramUserId", response.data.telegramUserId);
            localStorage.setItem("username", response.data.username);
            navigate("/home");

            setTimeout(() => {
                navigate("/home");
            }, 2000)
        } catch (error) {
            toast.error(
                error?.response?.data || "Login failed", {
                    position: "top-center",
                    autoClose: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="logo-wrapper">
                <img src="/logo.png" alt="Brand Logo" className="brand-logo-top-left" />
            </div>

            <div className="login-container">
                <div className="login-card">
                    <h2 className="login-title">Login</h2>

                    <div className="login-username">
                        <label style={{ display: "block", marginBottom: "2px", color: "#333333"}} className="lastName">Username*</label>
                        <input
                            name="username"
                            autoComplete="off"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="login-input"
                        />
                    </div>

                    <div className="floating-group">
                        <label style={{ display: "block", marginBottom: "2px", color: "#333333"}} className="floating-label">Phone Number*</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            placeholder="+998 77 100 00 00"
                            value={form.phoneNumber}
                            onChange={handlePhoneChange}
                            className="floating-input"
                            inputMode="tel"
                            required
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="login-button"
                    >
                        {loading ? <span className="spinner" /> : "Login"}
                    </button>

                    <p className="login-footer">
                        Don’t have an account? <a href="/register">Register</a>
                    </p>
                    <p className="forgot-username-link">
                        <a className="link" href="/forgotUsername">Forgot Username?</a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;