import { useDispatch, useSelector } from "react-redux";
import { useEffect ,useState} from "react";
import { createNewMessage ,getAllMessages} from "../../../apiCalls/message";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { clearUnreadMessageCount } from "../../../apiCalls/chat";
import store from "../../../redux/store";
import moment from 'moment';
import toast from "react-hot-toast";
import { selectedChat, setAllChats } from "../../../redux/userSlice";

const Chat = ({socket}) => {
  const { selectedChats, user,allChats } = useSelector((state) => state.userReducer);
  const dispatch=useDispatch();

  // Find the selected user
  const selectedUser = selectedChats?.members?.find((u) => u._id !== user?._id);
  const [message, setMessage] = useState("");
  const[allMessages,setAllMessage]=useState([]);
  const formatTime=(timestamp)=>{
    // moment.locale('en'); // Ensure English formatting

        const now=moment();
        const diff=now.diff(moment(timestamp),'days');
        if(diff<1){
          return `Today ${moment(timestamp).format('hh:mm A')}`;
        }
        else if(diff===1){
          return `Yesterday ${moment(timestamp).format('hh:mm A')} `
        }
        else{
          return moment(timestamp).format('MMMM D, hh:mm A');
        }
  }

  const savedMessage = async () => {
    try {
      const newmessage = {
        chatId: selectedChats._id, // Ensure correct `Chat` ID
        sender: user._id,
        text: message, // Use the state value for message text
      };
      socket.emit('send-message',{
        ...newmessage,
        members:selectedChats.members.map(m=>m._id),
          read:false,
          createdAt:moment().format('DD-MM-YYYY hh:mm:ss')
      })
     // dispatch(showLoader());
      const response = await createNewMessage(newmessage);
     // dispatch(hideLoader());
      //console.log('Message saved:', response);
      setMessage(""); 
      await getMessages();// Clear input field on success
    } catch (err) {
      //dispatch(hideLoader());
      toast.error(err.response?.data?.error || err.message);
    }
  };
  
  const getMessages = async () => {
    try {
      //dispatch(showLoader());
      const response = await getAllMessages(selectedChats._id);
     // dispatch(hideLoader());
      //console.log(response.data);
      if(response.success){
     // console.log('Message saved:', response);
      setAllMessage(response.data);
      } // Clear input field on success
    } catch (err) {
      dispatch(hideLoader());
      toast.error(err.response?.data?.error || err.message);
    }
  };
  const clearUnreadMessages = async () => {
    try {
      socket.emit('clear-unread-message',{
        chatId:selectedChats._id,
        members:selectedChats?.members?.map(m=>m._id)
      })

      const response = await clearUnreadMessageCount(selectedChats._id);
     
      //console.log(response.data);
      if(response.success){
          allChats?.map(chat=>{
            if(chat?._id===selectedChats._id){
              return response.data;
            }
            return chat;
          })
      } // Clear input field on success
    } catch (err) {
      dispatch(hideLoader());
      toast.error(err.response?.data?.error || err.message);
    }
  };
  useEffect(() => {
    // Debug logs to inspect state during re-renders
    // console.log("selectedChats:", selectedChats);
    // console.log("selectedUser:", selectedUser);
    if(selectedChats?._id){
    getMessages();
    if(selectedChats?.lastMessages?.sender !== user._id){
    clearUnreadMessages()

    }
  
    const handleReceiveMessage = (message) => {
      const selectedChat=store.getState().userReducer.selectedChats;
      if(selectedChat._id === message._id){
        setAllMessage(prevmsg=>[...prevmsg,message]);
      }
      if(selectedChat._id===message._id && message.sender!==user._id){
        clearUnreadMessages();
      }
    };
    socket.on('receive-message',handleReceiveMessage)
    socket.on('message-count-cleared',data=>{
      const selectedChat=store.getState().userReducer.selectedChats;
      const allchats=store.getState().userReducer.allChats;
      if(selectedChat?._id===data?.chatId){
        const updatedChats=allchats?.map((chat)=>{
          if(chat?._id=== data.chatId){
            return {...chat,unreadMessagesCount:0}
          }
        })
        dispatch(setAllChats(updatedChats))
        setAllMessage(preVmsg=>{
          return preVmsg.map(msg=>{
            return {...msg,read:true}
          })
        })
      }
    })

    return () => {
      socket.off('receive-message', handleReceiveMessage);
    }
  }
  }, [selectedChats]);
  useEffect(()=>{
     const msgContainer=document.getElementById('main-chat-area');
     msgContainer.scrollTop=msgContainer.scrollHeight;
  },[allMessages])

  // Handle missing or loading state
  if (!selectedChats || !selectedUser) {
    return <p>Loading chat details...</p>;
  }
  function formatName(user){
    let fname=user.firstname.at(0).toUpperCase()+user.firstname.slice(1).toLowerCase();
    let lname=user.lastname.at(0).toUpperCase()+user.lastname.slice(1).toLowerCase();
     return fname+' '+lname;
  }

  return (
    <div className="app-chat-area">
      <div className="app-chat-area-header">
        {/* Receiver's Data */}
        {formatName(selectedUser)}
      </div>
      <div className="main-chat-area" id="main-chat-area">
        {/* Chat Area */}
        {allMessages.map(msg =>{
          const isCurrentUserSender=msg.sender===user._id;
        return  <div className="message-container"style={isCurrentUserSender?
        {justifyContent:'end'}:{justifyContent:'start'}} >
          <div>
          <div className={isCurrentUserSender?"send-message":"received-message"}>{msg.text}</div> 
          <div className="message-timestamp" style={isCurrentUserSender?{float:"right"}:{float:"left"}}>
            {formatTime( msg.createdAt)}{isCurrentUserSender && msg.read && <i className='fa fa-check-circle' aria-hidden="true" style={{color:"green"}}></i>}</div>
          </div>
      </div>

        })}
      </div>
      <div className="send-message-div">
    <input type="text" className="send-message-input" 
    placeholder="Type a message" 
    value={message}
    onChange={(e)=>{setMessage(e.target.value)}}/>
    <button className="fa fa-paper-plane send-message-btn" aria-hidden="true"
    onClick={savedMessage}></button>
</div>
    </div>
  );
};

export default Chat;
