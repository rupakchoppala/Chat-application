import { axiosInstance } from "./index"
export const getAllChats=async()=>{
    try{
      const response=await axiosInstance.get('/api/chat/get-all-chat')
      return response.data;
    }
    catch(error){
        return error;

    }
}
export const createNewChat=async(members)=>{
    try{
      const response=await axiosInstance.post('/api/chat/create-new-chat',{members})
      return response.data;
    }
    catch(error){
        return error;

    }
}