import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import './css/Otp.css'
import { FaCheckCircle } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import OtpInput from "./OtpInput.jsx";


const Otp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [code, setCode] = useState("");


    const { phoneNumber, telegramUserId } = location.state || {};

    useEffect(() => {
        document.body.classList.add("code-confirm-page");
        return () => {
            document.body.classList.remove("code-confirm-page");
        };
    }, [])


    const resendCode = async () => {
        setResendLoading(true);
        setError("")
        try {
            const storedId = localStorage.getItem("telegramUserId");
            const telegramUserId = storedId ? Number(storedId) : null;

            await axios.post(`https://8c77-2a05-45c2-4031-9e00-b9fc-7a3e-1859-c5c6.ngrok-free.app/v1/phoneVerification/send-verification-code`,
                {},
                {
                    params: {
                        phoneNumber,
                        telegramUserId: telegramUserId,
                    },
                }
            );

            toast.success("Verification code resent", {
                position: "top-center",
                autoClose: 3000,
            });

        } catch (err) {
            toast.error("Failed to resend code", {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setResendLoading(false);
        }
    };

    const handleVerifyOtp = async (inputCode) => {
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
            const response = await axios.post(
                "https://8c77-2a05-45c2-4031-9e00-b9fc-7a3e-1859-c5c6.ngrok-free.app/v1/phoneVerification/verify",
                {},
                { params: { phoneNumber, code: trimmedCode } }
            );

            if (response.status === 200) {
                toast.success("Verification successful", {
                    position: "top-center",
                    autoClose: 2000,
                });
            }

            setTimeout(() => {
                navigate("/login");
            }, 2000)

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

    return (
        <>
            <div className="logo-wrapper">
                <img src="/logo.png" alt="Brand Logo" className="brand-logo-top-left" />
            </div>

            <div className="otp-wrapper">
                <div className="otp-container">
                    <h1>Confirm Code</h1>
                    <p>We have sent the verification <br /> code to the Telegram bot</p>

                    <OtpInput onComplete={(fullCode) => {
                        setCode(fullCode);
                        void handleVerifyOtp(fullCode);
                    }} />

                    <button onClick={handleVerifyOtp} disabled={loading} className="otp-button">
                        {loading ? (
                            <div className="spinner-only"></div>
                        ) : (
                            "Verify"
                        )}
                    </button>
                    <button onClick={resendCode} disabled={resendLoading} className={`otp-resend ${resendLoading ? "loading" : ""}`}>
                        Resend Code
                    </button>
                    {status && (
                        <p style={{ color: "green", fontSize: "0.9rem", fontWeight: "700" }}>
                            <FaCheckCircle style={{ marginRight: "5px", verticalAlign: "middle" }} />
                            {status}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Otp;