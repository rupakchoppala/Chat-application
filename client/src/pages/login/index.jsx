
import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../apiCalls/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";
const Login=()=>{
  const dispatch=useDispatch();
    const[user,setUser]=useState({
        email:'',
        password:''
    });
const onFormSubmit=async(event)=>{
    event.preventDefault();
    if (!user.email || !user.password) {
          alert("Please fill in all fields.");
          return;
        }
    
        try {
          dispatch(showLoader());
          const response = await loginUser(user);
          dispatch(hideLoader());
          if (response.success) {
            toast.success(response.message);
            localStorage.setItem('token',response.token);
            window.location.href = '/';
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          dispatch(hideLoader());
          toast.error(`Error: ${error.message || "Something went wrong"}`);
        }
      };
    


    return(
     <>
     <div className="container md:w-auto sm:w-auto">
        <div className="container-back-img"></div>
        <div className="container-back-color"></div>
        <div className="card">
        <div className="card_title">
            <h1>Login Here</h1>
        </div>
        <div className="form">
        <form onSubmit={onFormSubmit}>
            <input type="email" placeholder="Email" value={user.email}
            onChange={(e)=>setUser({...user,email:e.target.value})}/>
            <input type="password" placeholder="Password"
             value={user.password}
             onChange={(e)=>setUser({...user,password:e.target.value})} />
            <button>Login</button>
        </form>
        </div>
        <div className="card_terms"> 
            <span>Don't have an account yet?
                <Link to='/signup'>Signup Here</Link>
            </span>
        </div>
        </div>
    </div>

     </>
    )
}
export default Login;