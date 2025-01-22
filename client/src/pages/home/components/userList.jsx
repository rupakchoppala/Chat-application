import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats, selectedChat } from "../../../redux/userSlice";
import { useEffect } from "react";

const UserList = ({ searchkey }) => {
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
  
        // Reload the page
        window.location.reload();
        
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
    allChats.some(
      (chat) =>
        chat.members.map((m) => m._id).includes(currentUser._id) &&
        chat.members.map((m) => m._id).includes(userId)
    );

  const isSelectedChat = (user) => {
    if (selectedChats && selectedChats.members) {
      const isSelected = selectedChats.members.some((m) => m._id === user._id);
      //console.log(`User ${user._id} selected: ${isSelected}`); // Debug
      return isSelected;
    }
    return false;
  };

  const filteredUsers = allUsers.filter((user) => {
    return (
      (user.firstname.toLowerCase().includes(searchkey.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchkey.toLowerCase())) &&
        searchkey
    ) || isChatCreated(user._id);
  });

  useEffect(() => {
    if (selectedChats) {
      console.log("Selected chat updated:", selectedChats);
    }
  }, [allChats]);
  return (
    <>
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <div
            className="user-search-filter"
            onClick={() => openChat(user._id)}
            key={user._id}
          >
            <div className={isSelectedChat(user) ? "selected-user" : "filtered-user"}>
              <div className="filter-user-display">
                {/* Display user profile picture or initials */}
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={`${user.firstname} ${user.lastname} Profile`}
                    className="user-profile-image"
                  />
                ) : (
                  <div className={isSelectedChat(user) ? "user-selected-avatar" : "user-default-profile-pic"}>
                    {user.firstname[0].toUpperCase() + user.lastname[0].toUpperCase()}
                  </div>
                )}

                {/* User details */}
                <div className="filter-user-details">
                  <div className="user-display-name">{`${user.firstname} ${user.lastname}`}</div>
                  <div className="user-display-email">{user.email}</div>
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
        ))
      ) : (
        <p className="not-found">No users match your search.</p>
      )}
    </>
  );
};

export default UserList;
