import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.0.154:5000", // Replace with your actual API URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;