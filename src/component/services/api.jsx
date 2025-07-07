import axios from "axios";

const api = axios.create({
    baseURL: "https://monouzbbackend.onrender.com/",
});

export default api;