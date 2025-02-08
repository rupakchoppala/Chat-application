import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats, selectedChat } from "../../../redux/userSlice";
import { useEffect } from "react";
import moment from "moment";
import store from "../../../redux/store";

const UserList = ({ searchkey,socket ,onlineUsers}) => {
  const { allUsers, user: currentUser } = useSelector((state) => state.userReducer);
  const { selectedChats } = useSelector((state) => state.userReducer||{selectedChats:null});

  const { allChats } = useSelector((state) => state.userReducer || { allChats: [] });
  const dispatch = useDispatch();

  const startNewChats = async (searchedUserId) => {
    try {
      dispatch(showLoader());
      const response = await createNewChat([currentUser._id, searchedUserId]);
      dispatch(hideLoader());
      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
  
        // Update Redux state
        dispatch(setAllChats([...allChats, newChat]));
        dispatch(selectedChat(newChat));

        
      }
    } catch (error) {
      toast.error(error?.message || "Failed to start chat");
      dispatch(hideLoader());
    }
  };
  const openChat = (selectedUserId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((m) => m._id).includes(currentUser._id) &&
        chat.members.map((m) => m._id).includes(selectedUserId)
    );
    if (chat) {
      dispatch(selectedChat(chat));
    }
  };

  const isChatCreated = (userId) =>
    allChats?.some(
      (chat) =>
        chat?.members?.map((m) => m._id).includes(currentUser._id) &&
        chat?.members?.map((m) => m._id).includes(userId)
    );

    const isSelectedChat = (currentUser) => {
      if (selectedChats?.members) {
        const isSelected = selectedChats?.members?.some(
          (m) => m?._id === currentUser._id
        );
        return isSelected;
      }
      return false;
    };
    
  const getLastMessageTimestamp=(userId)=>{
    const chat=allChats?.find(chat=>chat?.members?.map(m=>m._id).includes(userId));
    if(!chat || !chat?.lastMessages){
      return "";
    }
    else{
     return moment(chat?.lastMessages?.createdAt).format('hh:mm:A');
    }

  }
  const getLastMessage=(userId)=>{
    const chat=allChats?.find(chat=>chat?.members?.map(m=>m._id).includes(userId));
    if(!chat || !chat.lastMessages){
      return "";
    }
    else{
      const messagePrefix=chat?.lastMessages?.sender===currentUser._id?"You:":"";
      return messagePrefix+chat.lastMessages?.text.substring(0,25);
    }

  }
  const getUnreadMessageCount=(userId)=>{
    const chat=allChats?.find(chat => chat?.members?.map(m=>m._id).includes(userId));
    if(chat && chat.unreadMessagesCount && chat.lastMessages.sender !== currentUser._id){
      return  <div className="unread-message-counter">{chat.unreadMessagesCount}</div>;
    }
    else{
      return "";
    }
  }
  
  function getData() {
    if (searchkey === "") {
      // Show only users from chats if no search key
      return allChats.filter((chat) => chat?.members?.every((m) => m?._id));
    } else {
      // Combine users from allChats and allUsers, ensuring no duplicates
      const chatUsers = allChats.map((chat) =>
        chat?.members.find((m) => m._id !== currentUser._id)
      );
  
      const searchedUsers = allUsers.filter(
        (user) =>
          user.firstname?.toLowerCase().includes(searchkey.toLowerCase()) ||
          user.lastname?.toLowerCase().includes(searchkey.toLowerCase())
      );
  
      // Avoid duplicates by filtering out users already in chatUsers
      const uniqueUsers = searchedUsers.filter(
        (user) => !chatUsers.some((chatUser) => chatUser?._id === user._id)
      );
  
      // Combine chat users and unique searched users
      return [...chatUsers, ...uniqueUsers];
    }
  }
  

  // useEffect(() => {
  //   if (selectedChats) {
  //     console.log("Selected chat updated:", selectedChats);
  //   }
  // }, [allChats]);
  function formatName(user){
    let fname=user.firstname.at(0).toUpperCase()+user.firstname.slice(1).toLowerCase();
    let lname=user.lastname.at(0).toUpperCase()+user.lastname.slice(1).toLowerCase();
     return fname+' '+lname;
  }
  useEffect(() => {
    socket.on('receive-message',(message)=>{
      const selectedChats=store.getState().userReducer.selectedChats;
      let allChats=store.getState().userReducer.allChats;
      if(selectedChats?._id !== message.chatId){
          const updatedChats=allChats?.map(chat =>{
            if(chat._id === message.chatId){
              return {
                ...chat,
                unreadMessagesCount:(chat?.unreadMessagesCount||0)+1,
                lastMessages:message
              }
            }
            return chat;
          });
          allChats=updatedChats;
          
      }
      //Find latest chat
      const latestChats=allChats.allChats.find(chat => chat._id === message.chatId);
      //get all other chats;
      const otherChats=allChats.filter(chat=>chat._id !== message.chatId);
      //new array with latest chat as first elment
      allChats=[latestChats,...otherChats];
      dispatch(setAllChats(allChats));
    })
    
  }, [selectedChats]);
  
  
  
  return (
    getData().map((obj) => {
      let user = obj;
      if (obj?.members) {
        user = obj.members.find((mem) => mem?._id !== currentUser?._id);
      }
    
      if (!user?._id) {
        return null; // Skip invalid users
      }
      const uniqueKey = obj?._id ? obj._id : `${currentUser._id}-${user._id}`;

        return (
          
          <div
            className="user-search-filter"
            onClick={() => openChat(user._id)}
            key={currentUser._id}
          >
            <div className={isSelectedChat(user) ? "selected-user" : "filtered-user"}>
              <div className="filter-user-display">
                {/* Display user profile picture or initials */}
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={`${user.firstname} ${user.lastname} Profile`}
                    className="user-profile-image"
                    style={onlineUsers.includes(user._id)?{border:'grey 5px solid'}:{}}
                  />
                ) : (
                  <div className={isSelectedChat(user) ? "user-selected-avatar" : "user-default-profile-pic"}
                  style={onlineUsers.includes(user._id)?{border:'grey 5px solid'}:{}}>
                    {user.firstname[0].toUpperCase() + user.lastname[0].toUpperCase()}
                  </div>
                )}

                {/* User details */}
                <div className="filter-user-details">
                  <div className="user-display-name">{formatName(user)}</div>
                  <div className="user-display-email">{getLastMessage(user._id) || user.email}</div>
                </div>
                <div>
                  {getUnreadMessageCount(user._id)}
                <div className="last-message-timestamp">
                  {getLastMessageTimestamp(user._id)}
                </div>
                </div>

                {/* Start chat button if no chat exists */}
                {!isChatCreated(user._id) && (
                  <div className="user-start-chat">
                    <button
                      className="user-start-chat-btn"
                      onClick={async(e) => {
                        e.stopPropagation(); // Prevent triggering openChat when clicking the button
                        await startNewChats(user._id);
                      }}
                      disabled={isChatCreated(user._id)} // Disable button if chat exists
                    >
                      {isChatCreated(user._id) ? "Chat Created" : "Start Chat"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
        }
        )
  )
      }

export default UserList;
