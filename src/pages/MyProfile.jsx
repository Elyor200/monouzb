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

    const handleExit = () => {
        localStorage.clear();
        navigate("/login");
    };

    const firstLetter = userData?.firstName?.charAt(0).toUpperCase();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get("v1/users/getUserByTelegramUserId", {
                    params: {telegramUserId}
                });
                setUserData(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        const fetchTelegramAvatar = async () => {
            try {
                setAvatarUrl(res.data);
                const res = await api.get(`/v1/telegram/getUserAvatar`, {
                    params: {telegramUserId}
                });
            } catch (error) {
                console.error("Avatar fetch error: ", error);
            }
        };

        if (telegramUserId) {
            void fetchUserData();
            void fetchTelegramAvatar();
        }
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
                        <h2>{userData?.firstName}</h2>
                        <p>{userData?.phoneNumber}</p>
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