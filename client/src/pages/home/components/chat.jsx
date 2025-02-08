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
  const [isTyping,setIsTyping]=useState(false);
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
        members:selectedChats?.members?.map(m=>m._id),
          read:false,
          createdAt:moment().format('DD-MM-YYYY hh:mm:ss')
      })
     
      const response = await createNewMessage(newmessage);
      if(response.success)
      {setMessage("");
    } 
    } catch (err) {
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
     
      if(response.success){
          allChats?.map(chat=>{
            if(chat?._id===selectedChats._id){
              return response.data;
            }
            return chat;
          })
      } 
    } catch (err) {
     
      toast.error(err.response?.data?.error || err.message);
    }
  };
  useEffect(() => {
    getMessages();
    if(selectedChats?.lastMessages?.sender !== user._id){
    clearUnreadMessages()
    }
    socket.off('receive-message').on('receive-message',(message) => {
      const selectedChats=store.getState().userReducer.selectedChats;
       if(selectedChats._id === message.chatId){
      setAllMessage(prevmsg=>[...prevmsg,message]);
       }
       if(selectedChats._id === message.chatId && message.sender !== user._id){
        clearUnreadMessages();
       }

    });
    socket.on('message-count-cleared',data=>{
      const selectedChats=store.getState().userReducer.selectedChats;
      const allChats =store.getState().userReducer.allChats;
      //updating the unread message count
      if(selectedChats?._id === data.chatId){
       const updatedChats= allChats?.map(chat=>{
          if(chat._id===data.chatId){
            return{
              ...chat,
              unreadMessagesCount:0
            }
          }
          return chat;

        })
        dispatch(setAllChats(updatedChats));
        //updating the read propetyin message object
        setAllMessage(prevmsg=>{
          return prevmsg.map(msg=>{
            return {...msg,read:true}
          }
        )})
      }
    })
    socket.on('started-typing',(data)=>{
      if(selectedChats._id === data.chatId && data.sender !== user._id){
        setIsTyping(true);
        setTimeout(()=>{
          setIsTyping(false);
        },2000)
      }

    })
  }, [selectedChats]);
  useEffect(()=>{
     const msgContainer=document.getElementById('main-chat-area');
     msgContainer.scrollTop=msgContainer.scrollHeight;
  },[allMessages,isTyping])

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
        {justifyContent:'end'}:{justifyContent:'start'}} key={user._id}>
          <div>
          <div className={isCurrentUserSender?"send-message":"received-message"}>{msg.text}</div> 
          <div className="message-timestamp" style={isCurrentUserSender?{float:"right"}:{float:"left"}}>
            {formatTime( msg.createdAt)}{isCurrentUserSender && msg.read && <i className='fa fa-check-circle' aria-hidden="true" style={{color:"green"}}></i>}</div>
          </div>
      </div>

        })}
        <div className="typing-indicator" >{isTyping && <i>typing...</i>}</div>
      </div>
      <div className="send-message-div">
    <input type="text" className="send-message-input" 
    placeholder="Type a message" 
    value={message}
    onChange={(e)=>{setMessage(e.target.value)
       socket.emit('user-typing',{
        chatId:selectedChats._id,
        members:selectedChats.members.map(m=>m._id),
        sender:user._id
       })}
    }
    />
    <button className="fa fa-paper-plane send-message-btn" aria-hidden="true"
    onClick={savedMessage}></button>
</div>
    </div>
  );
};

export default Chat;
