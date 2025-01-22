import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name: 'user',
    initialState: { user: null,
        allUsers:[],
    allChats:[],
selectedChats:null}, // Initial state should be an object
    reducers: {
        setUser: (state,action) => {
            state.user = action.payload;
        },
        setAllUsers: (state,action) => {
            state.allUsers = action.payload;
        },
        setAllChats: (state,action) => {
            state.allChats = action.payload;
        },
        selectedChat: (state,action) => {
            state.selectedChats = action.payload;
        },
    },
});

// Export the actions
export const { setUser,setAllUsers,setAllChats,selectedChat } = UserSlice.actions;

// Export the reducer
export default UserSlice.reducer;
