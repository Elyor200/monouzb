import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8088/v1",
});

export default api;