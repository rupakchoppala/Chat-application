import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser}  from "../apiCalls/user";
import getAllUsers from "../apiCalls/user";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { getAllChats } from "../apiCalls/chat";
import toast from "react-hot-toast";
import { setUser, setAllUsers,setAllChats } from "../redux/userSlice";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.userReducer || {});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getLoggedInUser = async () => {
    try {
      dispatch(showLoader());
      const response = await getLoggedUser();
      dispatch(hideLoader());
      console.log("getLoggedUser Response:", response);

      if (response.success) {
        dispatch(setUser(response.data));
        console.log("User data set in Redux:", response.data);
      } else {
        console.log("Invalid token, redirecting to login");
        toast.error(response.message || "Session expired, please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoader());
      console.error("Error in getLoggedInUser:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const getAllUserFromDb = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllUsers();
      dispatch(hideLoader());
      console.log("getAllUsers Response:", response);

      if (response.success) {
        dispatch(setAllUsers(response.data));
      } else {
        console.log("Failed to fetch users");
        toast.error(response.message || "Unable to fetch users.");
      }
    } catch (error) {
      dispatch(hideLoader());
      console.error("Error in getAllUsers:", error);
    }
  };
const getCurrentUserCahts=async()=>{
  try{
     const response=await getAllChats();
     if(response.success){
      dispatch(setAllChats(response.data));

     }
  }
  catch(error){
    navigate('/login');
  }
}
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token at useEffect:", token);

    if (token) {
      getLoggedInUser().then(() => getAllUserFromDb(),getCurrentUserCahts()).finally(() => setLoading(false));
    } else {
      console.log("No token found, redirecting to login");
      navigate("/login");
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
