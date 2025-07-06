import React from "react";
import styles from '../styles/CategoryBar.module.css';

const CategoryBar = ({ categories, selectedCategory, onSelect }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.scrollContainer}>
                {categories.map((category, index) => {
                    const displayName = typeof category === 'string' ? category : category.name;
                    const isSelected = selectedCategory === displayName;

                    return (
                        <button
                            key={index}
                            className={`${styles.categoryItem} ${isSelected ? styles.active : ''}`}
                            onClick={() => onSelect(displayName)}
                        >
                            {displayName}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryBar;
