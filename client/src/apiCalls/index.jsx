import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: "https://chat-application-server-9ka8.onrender.com", // Replace with your backend URL
    headers: {
      "Content-Type": "application/json",
      authorization:`Bearer ${localStorage.getItem('token')}`
    },
  });
