import {useNavigate} from "react-router-dom";
import {FiLogOut, FiMapPin, FiMessageSquare, FiUser} from "react-icons/fi";
import {BsMoon} from "react-icons/bs";
import {AiOutlineGlobal} from "react-icons/ai";
import {MdOutlineHistory} from "react-icons/md";
import styles from '../styles/MyProfile.module.css'
import React, {useEffect, useState} from "react";
import axios from "axios";
import api from "../component/services/api.jsx";


const MyProfile = () => {
    const navigate = useNavigate();
    const  telegramUserId = localStorage.getItem("telegramUserId");
    const photoUrl = localStorage.getItem("photoUrl");
    const [userData, setUserData] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleExit = () => {
        localStorage.clear();
        navigate("/login");
    };

    const firstLetter = userData?.firstName?.charAt(0).toUpperCase();

    useEffect(() => {
        const cachedTelegramUserId = localStorage.getItem("cachedTelegramUserId");
        const cachedUserData = localStorage.getItem("cachedUserData");
        const cachedAvatar = localStorage.getItem("telegramAvatarUrl");

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const res = await api.get("v1/users/getUserByTelegramUserId", {
                    params: {telegramUserId}
                });
                setUserData(res.data);
                localStorage.setItem("cachedUserData", JSON.stringify(res.data));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        const fetchTelegramAvatar = async () => {
            try {
                const res = await api.get(`/v1/telegram/getUserAvatar`, {
                    params: {telegramUserId}
                });
                const url = res.data;
                setAvatarUrl(url);
                localStorage.setItem("telegramAvatarUrl", url);
            } catch (error) {
                console.error("Avatar fetch error: ", error);
            }
        };

        const isSameUser = telegramUserId === cachedTelegramUserId;
        if (cachedUserData && isSameUser) {
            setUserData(JSON.parse(cachedUserData));
        } else {
            localStorage.removeItem("cachedUserData");
            void fetchUserData();
        }

        if (cachedAvatar && isSameUser) {
            setAvatarUrl(cachedAvatar);
        } else {
            localStorage.removeItem("telegramAvatarUrl");
            void fetchTelegramAvatar();
        }

        localStorage.setItem("cachedTelegramUserId", telegramUserId);
    }, [telegramUserId]);

    return (
        <div className={styles.myProfileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileTop}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className={styles.profileImage} />
                    ) : (
                        <div className={styles.avatarFallback}>
                            {firstLetter}
                        </div>
                    )}
                    <div className={styles.userInfo}>
                        {loading ? (
                            <div className={styles.nameSpinner}></div>
                        ) : (
                            <>
                                <h2>{userData?.firstName}</h2>
                                <p>{userData?.phoneNumber}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.menu}>
                    <div className={styles.item} onClick={() => navigate("/orders")}>
                        <MdOutlineHistory size={20} />
                        <span>Orders history</span>
                    </div>
                    <div className={styles.item} onClick={() => navigate("/addresses")}>
                        <FiMapPin size={20} />
                        <span>My addresses</span>
                    </div>
                    <div className={styles.item} onClick={() => navigate("/personal-data")}>
                        <FiUser size={20} />
                        <span>Personal data</span>
                    </div>
                    <div className={styles.item} onClick={() => navigate("/contact")}>
                        <FiMessageSquare size={20} />
                        <span>Contact us</span>
                    </div>
                    <div className={styles.staticItem}>
                        <AiOutlineGlobal size={20} />
                        <span>Language</span>
                        <span className={styles.rightText}>English</span>
                    </div>
                    <div className={styles.staticItem}>
                        <BsMoon size={20} />
                        <span>Theme</span>
                        <span className={styles.rightText}>Light</span>
                    </div>
                    <div className={styles.exit} onClick={handleExit}>
                        <FiLogOut size={20} color="red" />
                        <span>Exit</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;