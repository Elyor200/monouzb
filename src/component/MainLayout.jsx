import BottomNav from "./BottomNav.jsx";
import React from "react";

const MainLayout = ({ children }) => {
    return (
        <div style={{ paddingBottom: '60px' }}>
            {children}
            <BottomNav />
        </div>
    );
};

export default MainLayout;
