import { axiosInstance } from "./index";
export const createNewMessage = async (message) => {
    try {
      // Send the message object directly, not wrapped in a `message` key
      const response = await axiosInstance.post('/api/message/new-message', message);
      return response.data;
    } catch (error) {
      throw error; // Re-throw error for proper error handling
    }
  };
  export const getAllMessages = async (chatId) => {
    try {
      // Send the message object directly, not wrapped in a `message` key
      const response = await axiosInstance.get(`/api/message/get-all-messages/${chatId}`);
      return response.data;
    } catch (error) {
      throw error; // Re-throw error for proper error handling
    }
  };
  