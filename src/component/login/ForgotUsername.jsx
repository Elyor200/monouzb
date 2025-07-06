import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {formatUzbekPhone} from "../utils/phoneUtils.js";
import axios from "axios";
import './ForgotUsername.css'
import React from "react";
import {useNavigate} from "react-router-dom";
import OtpInput from "../register/OtpInput.jsx";
import api from "../services/api.jsx";

const ForgotUsername = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [step, setStep] = useState(1);
    const [code, setCode] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [form, setForm] = useState({
        phoneNumber: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("forgot-username-page");
        return () => {
            document.body.classList.remove("forgot-username-page");
        };
    }, [])

    const handlePhoneChange = (e) => {
        const formatted = formatUzbekPhone(e.target.value);
        setForm({form, phoneNumber: formatted})
    }

    const sendCode = async () => {
        const phoneReplace = form.phoneNumber.replace(/\D/g, "")
        const phoneTrimmed = phoneReplace.startsWith("998") ? phoneReplace.slice(3) : phoneReplace;

        if (phoneTrimmed.length !== 9) {
            toast.error("Please enter a valid phone number", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        const cleanedPhone = form.phoneNumber.replace(/\s+/g, "");

        setLoading(true);

        try {
            const response = await api.post("/v1/users/forgot-username", {
                phoneNumber: cleanedPhone,
            });

            setPhoneNumber(cleanedPhone);

            toast.success(response?.data?.message, {
                position: "top-center",
                autoClose: 2000,
            });
            setStep(2)
        } catch (error) {
            const errorMessage = error.response?.data;
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 2000,
            });
        }

        setLoading(false);
    }

    const handleVerify = async (inputCode) => {
        const trimmedCode = inputCode?.trim();

        if (!trimmedCode || trimmedCode.length !== 6 || !/^\d{6}$/.test(trimmedCode)) {
            toast.error("Please enter a valid verification code", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(
                "/v1/phoneVerification/verify",
                {},
                { params: { phoneNumber, code: inputCode } }
            );

            if (response.status === 200) {
                toast.success("Verification successful", {
                    position: "top-center",
                    autoClose: 2000,
                });
                setStep(3);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message;

            toast.error(err?.response?.data?.message, {
                position: "top-center",
                autoClose: 2000,
            });

            if (errorMessage.includes("Please resend new verification code")) {
                setStep(1);
            } else {
                setStep(2);
            }
        } finally {
            setLoading(false);
        }

        setTimeout(() => setError(""), 3000);
    };

    const resetUsername = async () => {
        if (!code) {
            toast.error("Please enter verification code", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        setError("");
        setLoading(true);
        try {
            const response = await api.put("/v1/users/reset-username", {
                phoneNumber: phoneNumber,
                code,
                newUsername
            });

            toast.success(response?.data?.message, {
                position: "top-center",
                autoClose: 3000,
            });

            setTimeout(() => {
                navigate("/login");
            }, 2000)

            setPhoneNumber("");
            setCode("");
            setNewUsername("");
        } catch (error) {
            toast.error(error.response?.data, {
                position: "top-center",
                autoClose: 2000,
            })
        }
        setLoading(false);
    }

    return (
        <>
            <div className="logo-wrapper">
                <img src="/logo.png" alt="Brand Logo" className="brand-logo-top-left" />
            </div>

            <div className="forgot-username-container">
                <div className="forgot-username-card">
                    {step === 1 && (
                        <>
                            <div>
                                <h2 className="forgot-username-title">Forgot Username</h2>
                                <p className="forgot-username-text">
                                    Please enter your phone number to receive a verification code.
                                </p>
                                <label style={{ display: "block", marginBottom: "2px", color: "#333333"}} htmlFor="phoneNumber" className="floating-label">Phone Number*</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    placeholder="+998 77 100 00 00"
                                    value={form.phoneNumber}
                                    onChange={handlePhoneChange}
                                    className="forgot-username-input"
                                    inputMode="tel"
                                />
                            </div>
                            <button
                                onClick={sendCode}
                                disabled={loading}
                                className="forgot-username-button"
                            >
                                Send
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div>
                                <h2 className="forgot-username-title">Confirm Code</h2>
                                <p className="description">We have sent the verification <br /> code to the Telegram bot</p>
                                <OtpInput
                                    onChange={(value) => setCode(value.trim())}
                                    onComplete={async (value) => {
                                        const trimmed = value.trim();
                                        setCode(trimmed);

                                        const activeElement = document.activeElement;
                                        if (activeElement && typeof activeElement.blur === "function") {
                                            activeElement.blur();
                                        }

                                        await handleVerify(trimmed);
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => handleVerify(code.trim())}
                                disabled={loading}
                                className="forgot-username-button"
                            >
                                Continue
                            </button>

                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div>
                                <h2 className="forgot-username-title">Create New Username</h2>
                                <p className="description">New username should be different from previous username</p>
                                <input
                                    type="text"
                                    placeholder="New Username"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="forgot-username-input"
                                />
                            </div>
                            <button
                                onClick={resetUsername}
                                disabled={loading}
                                className="forgot-username-button"
                            >
                                {loading ? "Resetting..." : "Reset Username"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForgotUsername;