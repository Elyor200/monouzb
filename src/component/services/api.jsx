import axios from "axios";

const api = axios.create({
    baseURL: "https://3381-2a05-45c2-4031-9e00-b9fc-7a3e-1859-c5c6.ngrok-free.app",
});

export default api;