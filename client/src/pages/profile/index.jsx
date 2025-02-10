import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { UploadProfilePic } from "../../apiCalls/user";
import { hideLoader, showLoader } from "../../redux/loaderSlice";
import toast from "react-hot-toast";
import { setUser } from "../../redux/userSlice";

export  const Profile=()=>{
  const {user}=useSelector(state=>state.userReducer);
  const [image,setImage]=useState('');
  const dispatch=useDispatch();
  useEffect(()=>{
        if(user?.profilePic){
          setImage(user.profilePic);
        }
  },[user])
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
const onFileSelect = (e) => {
  const file = e.target.files[0];
  if (!file) {
      toast.error("No file selected");
      return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
      console.log("Base64 image generated:", reader.result); // Log the base64 string
      setImage(reader.result); // Store the base64 string in `image`
  };

  reader.readAsDataURL(file);
};


const updateProfilePic=async()=>{
  try{
    dispatch(showLoader());
         const response= await UploadProfilePic(image);
         dispatch(hideLoader());
         if(response.success){
          toast.success(response.message)
          dispatch(setUser(response.data));
         }
         else{
          toast.error(response.message);
         }
  }
  catch(err){
    toast.error(err.message);
      dispatch(hideLoader());

  }
}
  return(
    <>
    <div className="profile-page-container">
        <div className="profile-pic-container">
           { image && <img src={image}
                 alt="Profile Pic" 
                 className="user-profile-pic-upload" 
            /> }
            { !image && <div className="user-default-profile-avatar">
                {getInitials()}
            </div>
            }
        </div>

        <div className="profile-info-container">
            <div className="user-profile-name">
                <h1>{formatName(user)}</h1>
            </div>
            <div>
                <b>Email: </b>{user?.email}
            </div>
            <div>
                <b>Account Created: </b>{moment(user?.createdAt).format('MMM DD,YYYY')}
            </div>
            <div className="select-profile-pic-container">
                <input type="file" onChange={onFileSelect}/>
                <button className="upload-img-btn" onClick={updateProfilePic}> upload</button>
            </div>
        </div>
    </div>
    </>
  )
}