import axios from "axios";

import { axiosInstance } from "./index";

export const signupUser = async (user) => {
  try {
    const response = await axiosInstance.post("/api/auth/signup", user);
    return response.data;
  } catch (error) {
    console.error("Error in signupUser:", error);
    throw error.response?.data || error.message; // Pass the error to be handled in the form
  }
};
export const loginUser=async(user)=>{
  try {
    const response = await axiosInstance.post("/api/auth/login",user);
    return response.data;
  }
  catch(error){
    console.error("Error in login user:",error);
    return error;

  }
}

