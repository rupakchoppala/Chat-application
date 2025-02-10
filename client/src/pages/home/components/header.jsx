import { useSelector,useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
const Header=({socket})=>{
    const{user}=useSelector(state=>state.userReducer||{});
    const navigate=useNavigate();
    console.log(user);
    const getFullName=()=>{
        let fname=user?.firstname.toUpperCase();
        let lname=user?.lastname.toUpperCase();
        return fname+' '+lname;
    };
    const getInitials=()=>{
        let f=user?.firstname.toUpperCase()[0];
        let l=user?.lastname.toUpperCase()[0];
        return f+l;
    }
    function formatName(user){
        let fname=user?.firstname.at(0).toUpperCase()+user?.firstname.slice(1).toLowerCase();
        let lname=user?.lastname.at(0).toUpperCase()+user?.lastname.slice(1).toLowerCase();
         return fname+' '+lname;
      }

const logout=()=>{
    localStorage.removeItem('token');
    navigate('/login');
    socket.emit('user-offline',user._id);

}
return(
    <>
<div className="app-header">
    <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
          We Chat
        </div>
    <div className="app-user-profile">
    {user?.profilePic && <img className="logged-user-profile-pic" src={user?.profilePic} alt="Profile" onClick={()=>navigate('/profile')}/>}
        {!user?.profilePic &&<div className="logged-user-profile-pic" onClick={()=>navigate('/profile')}>{getInitials()}</div>}

        <div className="logged-user-name">{formatName(user)}</div>
        <button className="logout-btn" onClick={logout}>
        <i className="fa fa-power-off"></i>
        </button>
        </div>
</div>
</>
);
}
export default Header;