import api from "./api.jsx";

export const registerUser = (userData) => {
    return api.post('/users/create-user', userData);
};