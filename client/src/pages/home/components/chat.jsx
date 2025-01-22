import { useDispatch, useSelector } from "react-redux";
import { useEffect ,useState} from "react";
import { createNewMessage ,getAllMessages} from "../../../apiCalls/message";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import moment from 'moment';

const Chat = () => {
  const { selectedChats, user } = useSelector((state) => state.userReducer);
  const dispatch=useDispatch();

  // Find the selected user
  const selectedUser = selectedChats?.members?.find((u) => u._id !== user?._id);
  const [message, setMessage] = useState("");
  const[allMessages,setAllMessage]=useState([]);
  const formatTime=(timestamp)=>{
     //moment.locale('en'); // Ensure English formatting

        const now=moment();
        const diff=now.diff(moment(timestamp),'days');
        if(diff<1){
          return `\nToday ${moment(timestamp).format('hh:mm A')}`;
        }
        else if(diff===1){
          return `\nYesterday ${moment(timestamp).format('hh:mm A')} `
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
      dispatch(showLoader());
      const response = await createNewMessage(newmessage);
      dispatch(hideLoader());
      console.log('Message saved:', response);
      setMessage(""); 
      await getMessages();// Clear input field on success
    } catch (err) {
      dispatch(hideLoader());
      toast.error(err.response?.data?.error || err.message);
    }
  };
  
  const getMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllMessages(selectedChats._id);
      dispatch(hideLoader());
      console.log(response.data);
      if(response.success){
     // console.log('Message saved:', response);
      setAllMessage(response.data);
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
    }
    
  }, [selectedChats, selectedUser]);

  // Handle missing or loading state
  if (!selectedChats || !selectedUser) {
    return <p>Loading chat details...</p>;
  }

  return (
    <div className="app-chat-area">
      <div className="app-chat-area-header">
        {/* Receiver's Data */}
        {selectedUser.firstname + " " + selectedUser.lastname}
      </div>
      <div className="main-chat-area">
        {/* Chat Area */}
        {allMessages.map(msg =>{
          const isCurrentUserSender=msg.sender===user._id;
        return  <div className="message-container"style={isCurrentUserSender?
        {justifyContent:'end'}:{justifyContent:'start'}} >
          <div>
          <div className={isCurrentUserSender?"send-message":"received-message"}>{msg.text}</div> 
          <div className="message-timestamp" style={isCurrentUserSender?{float:"right"}:{float:"left"}}>\
            {formatTime( msg.createdAt)}</div>
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
