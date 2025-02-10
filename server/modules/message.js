import mongoose from 'mongoose';
const messageSchema=new mongoose.Schema({
    chatId:{
        type:mongoose.Schema.Types.ObjectId,ref:"chats"
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,ref:"users"
    },
    text:{
        type:String,
        required:true

    },
    image:{
        type:String,
        required:false
    },
    read:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
export default  mongoose.model("messages",messageSchema);