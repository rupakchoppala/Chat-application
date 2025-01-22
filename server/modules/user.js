import mongoose from 'mongoose';
const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength:8
    },
    profilePic:{
        type:String,
        required:false
    }
},{timestamps:true});
const User=mongoose.model('users',userSchema);
export default User;
