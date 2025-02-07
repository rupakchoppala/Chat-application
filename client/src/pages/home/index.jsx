import Header from "./components/header";
import SideBar from "./components/sidebar";
import Chat from "./components/chat";
import { useSelector } from "react-redux";
import {io} from 'socket.io-client';
import { useEffect } from "react";
const socket=io('http://localhost:3000');
const  Home=()=>{
    const{selectedChats,user}=useSelector(state=>state.userReducer);

    
   useEffect(()=>{
         if(user){
        socket.emit('join-room',user._id)
        
         }
       //  socket.emit('send-message',{text:'hi durga sai',recipient:'679f9f2a181dfdac5d6eebdd'})
   },[user])
    return(
     <>
     <div className="home-page">
        <Header/>
    <div className="main-content">
        <SideBar socket={socket}></SideBar>
       {selectedChats&& <Chat socket={socket}></Chat>}
         
        {/* <!--CHAT AREA LAYOUT--> */}
    </div>
</div>

     </>
    )
}
export default Home;