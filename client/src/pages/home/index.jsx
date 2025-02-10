import Header from "./components/header";
import SideBar from "./components/sidebar";
import Chat from "./components/chat";
import { useSelector } from "react-redux";
import {io} from 'socket.io-client';
import { useEffect, useState } from "react";
const socket=io('http://localhost:3000');
const  Home=()=>{
    const{selectedChats,user}=useSelector(state=>state.userReducer);
    const[onlineUsers,setOnlineUsers]=useState([]);
   useEffect(()=>{
         if(user){
        socket.emit('join-room',user._id);
        socket.emit('user-login',user._id);
        socket.on('online-users',onlineUsers=>{
            setOnlineUsers(onlineUsers);

        })
        socket.on('online-users-updated',onlineUsers=>{
            setOnlineUsers(onlineUsers);

        })
        
         }
       //  socket.emit('send-message',{text:'hi durga sai',recipient:'679f9f2a181dfdac5d6eebdd'})
   },[user,onlineUsers])
    return(
     <>
     <div className="home-page">
        <Header socket={socket}/>
    <div className="main-content">
        <SideBar socket={socket} onlineUsers={onlineUsers}></SideBar>
       {selectedChats&& <Chat socket={socket}></Chat>}
         
        {/* <!--CHAT AREA LAYOUT--> */}
    </div>
</div>

     </>
    )
}
export default Home;