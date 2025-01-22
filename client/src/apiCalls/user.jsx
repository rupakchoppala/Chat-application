import { axiosInstance } from "./index"
export const getLoggedUser=async()=>{
    try{
      const response=  await axiosInstance.get('/api/user/get-logged-user')
      return response.data;
         
    }
    catch(error){
       return error;
    }
}
export const getAllUsers=async()=>{
  try{
    const response=  await axiosInstance.get('/api/user/get-all-user')
    return response.data;
       
  }
  catch(error){
         return error;
  }
}