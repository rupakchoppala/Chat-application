import { useState } from "react";
import Search from "./search";
import UserList from "./userList";
const SideBar=({socket})=>{
    const [searchkey,setSearchKey]=useState('');
    return(
        <>
        <div className="app-sidebar">
          <Search
          searchkey={searchkey} setSearchKey={setSearchKey}></Search>
        <UserList searchkey={searchkey} socket={socket} ></UserList>
        </div>
        </>
    )
}
export default SideBar;