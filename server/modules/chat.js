import mongoose from "mongoose";
const chatSchema=new mongoose.Schema({
    members:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,ref:"users"
            }
        ]
    },
    lastMessages:{
        type:mongoose.Schema.Types.ObjectId,ref:"messages"
    },
    unreadMessagesCount:{
        type:Number,
        default:0
    }
},{timestamps:true});
export default mongoose.model("chats",chatSchema);