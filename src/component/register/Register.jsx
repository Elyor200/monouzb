import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom"
import axios from "axios"
import './css/Register.css'
import {formatUzbekPhone} from "../utils/phoneUtils.js";
import {toast} from "react-toastify";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        phoneNumber: "",
        role: "USER",
    })

    const [error, setError] = useState({});
    const [loading, setLoading] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [emailValid, setEmailValid] = useState({});

    useEffect(() => {
        document.body.classList.add("register-page");
        return () => {
            document.body.classList.remove("register-page");
        };
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({...form, [name]: value});
        if (error[name]) {
            setError({ ...error, [name]: ""});
        }

        if (name === "email") {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            setEmailValid(isValid);
        }
    };

     const handlePhoneChange = (e) => {
        const formatted = formatUzbekPhone(e.target.value);
        setForm({...form, phoneNumber: formatted});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError("")
        try {
            localStorage.setItem("user", JSON.stringify(form))
            const phoneToSend = form.phoneNumber.replace(/\s+/g, "");

            const response = await axios.post("https://8c77-2a05-45c2-4031-9e00-b9fc-7a3e-1859-c5c6.ngrok-free.app/v1/users/create-user", {
                ...form,
                phoneNumber: phoneToSend
            });

            const telegramUserId = response.data.telegramUserId;
            const user = {
                username: response.data.username,
                phoneNumber: response.data.phoneNumber,
                firstName: response.data.firstName,
            }

            localStorage.setItem("user", JSON.stringify(user));

            await axios.post(`https://8c77-2a05-45c2-4031-9e00-b9fc-7a3e-1859-c5c6.ngrok-free.app/v1/phoneVerification/send-verification-code`,
                {},
                {
                    params: {
                        phoneNumber: phoneToSend,
                        telegramUserId: telegramUserId,
                    }
                }
            )
            navigate("/otp", {
                state: {
                    phoneNumber: phoneToSend,
                    telegramUserId: telegramUserId,
                }
            });
        } catch (error) {
            toast.error(
                error?.response?.data, {
                    position: "top-center",
                    autoClose: 2000,
                }
            )
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="logo-wrapper">
                <img src="/logo.png" alt="Brand Logo" className="brand-logo-top-left" />
            </div>

            <div className="register-container">
                <div className="register-card">
                    <h2 className="register-title">Register</h2>
                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="firstName">
                            <label style={{ display: "block", marginBottom: "2px", color: "#333333"}} className="firstName">First Name*</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={form.firstName}
                                onChange={handleChange}
                                spellCheck="false"
                                autoComplete="off"
                                inputMode="text"
                            />
                        </div>
                        <div className="lastName">
                            <label style={{ display: "block", marginBottom: "2px", color: "#333333"}} className="lastName">Last Name*</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={form.lastName}
                                onChange={handleChange}
                                spellCheck="false"
                                autoComplete="off"
                                inputMode="text"
                            />
                        </div>
                        <div className="username">
                            <label style={{ display: "block", marginBottom: "2px", color: "#333333"}} className="username">Username*</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={form.username}
                                onChange={handleChange}
                                spellCheck="false"
                                autoComplete="off"
                                inputMode="text"
                                className={
                                    form.username.length === 0
                                    ? "input-default"
                                    : usernameAvailable === true
                                    ? "input-valid"
                                    : usernameAvailable === false
                                    ? "input-invalid" : ""
                                }
                            />
                        </div>
                        <div className="floating-group">
                            <label style={{ display: "block", marginBottom: "2px", color: "#333333"}} htmlFor="phoneNumber" className="floating-label">Phone Number*</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                id="phoneNumber"
                                placeholder="+998 77 100 00 00"
                                value={form.phoneNumber}
                                onChange={handlePhoneChange}
                                className="floating-input"
                                inputMode="tel"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="register-button"
                        >
                            {loading ? <span className="spinner" /> : "Register"}
                        </button>
                    </form>
                    <p className="login-link">
                        Already have an account? <a className="link" href="/login">Log in</a>
                    </p>
                </div>
            </div>
        </>
    );
};
export default Register;