import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"

export  const Profile=()=>{
  const {user}=useSelector(state=>state.userReducer);
  const [image,setImage]=useState('');
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
const onFileSelcet=async(e)=>{
     const file=e.target.files[0];
     const reader=new FileReader(file);
     reader.readAsDataURL(file);
     reader.onloadend=async ()=>{
      setImage(reader.result);
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
                <input type="file" onChange={onFileSelcet}/>
            </div>
        </div>
    </div>
    </>
  )
}