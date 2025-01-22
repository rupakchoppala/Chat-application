import Header from "./components/header";
import SideBar from "./components/sidebar";
import Chat from "./components/chat";
import { useSelector } from "react-redux";
const  Home=()=>{
    const{selectedChats}=useSelector(state=>state.userReducer);
    return(
     <>
     <div className="home-page">
        <Header/>
    <div className="main-content">
        <SideBar></SideBar>
       {selectedChats&& <Chat></Chat>}
         
        {/* <!--CHAT AREA LAYOUT--> */}
    </div>
</div>

     </>
    )
}
export default Home;