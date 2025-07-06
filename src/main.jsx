import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './style.css'
import ErrorBoundary from "./component/ErrorBoundary.jsx";
import {CartProvider} from "./context/CartContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
        <ErrorBoundary>
            <CartProvider>
                <App />
            </CartProvider>
        </ErrorBoundary>
    // </React.StrictMode>
);
