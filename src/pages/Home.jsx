import {useEffect, useState} from "react";
import axios from "axios";
import React from "react";
import styles from '../styles/Home.module.css'
import CategoryBar from "../component/CategoryBar.jsx";
import ProductList from "../component/ProductList.jsx";
import BottomNav from "../component/BottomNav.jsx";
import { motion } from "framer-motion";
import {FiBell} from "react-icons/fi";
import api from "../component/services/api.jsx";


const Home = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/v1/categories/getAllCategories");
                const categoryNames = response.data.map(cat => cat.category);
                setCategories(['All', ...categoryNames]);
            } catch (error) {
                console.error("Failed to fetch Categories", error);
            }
        };

        void fetchCategories();
    }, []);


    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 20}}
            transition={{duration: 0.4, ease: "easeOut"}}
            className={styles.homeWrapper}
        >
            <header className={styles.header}>
                <img src="/logo.png" alt="logo" className={styles.logo}/>
                <h1 className={styles.brandName}>Mono.uzbekistan</h1>
                <FiBell size={24} className={styles.notificationIcon} />
            </header>

            <CategoryBar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
            />

            <h2 className={styles.sectionTitle}>
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <ProductList selectedCategory={selectedCategory}/>
        </motion.div>
    );
}
export default Home;

