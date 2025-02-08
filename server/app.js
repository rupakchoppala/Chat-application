import express from 'express';
import cors from 'cors';
import authRoutes from './controllers/authController.js';
//import UserRoutes from './controllers/userController.js';
import UserRoutes from './controllers/userController.js';
import ChatRoutes from './controllers/chatController.js';
import MessageRoutes from "./controllers/messageControllers.js";
const app=express();
app.use(express.json());
app.use(cors());
import {createServer} from 'http';
import { Server } from 'socket.io';
import { sourceMapsEnabled } from 'process';
const server=createServer(app);
const io=new Server(server,{cors:{
    origin:'http://localhost:5173',
    methods:['GET','POST']
}})
const onLineUser=[];
app.use('/api/auth',authRoutes);
app.use('/api/user',UserRoutes);
app.use('/api/chat',ChatRoutes);
app.use('/api/message',MessageRoutes);
//test the socket connection from client
io.on('connection', socket => {
    
    socket.on('join-room',userid=>{
        socket.join(userid);
        console.log("user jpoined",userid);

    })
    socket.on('send-message', (message) => {
        // if (!message || !Array.isArray(message.members) || message.members.length < 2) {
        //     console.error('Invalid message format or members array:', message);
        //     return;
        // }
        
    
        io.to(message.members[0])
          .to(message.members[1])
          .emit('receive-message', message);
    });
    socket.on('clear-unread-message',data=>{
        io.to(data.members[0])
        .to(data.members[1])
        .emit('message-count-cleared',data)
    });
    socket.on('user-typing',(data)=>{
        io.to(data.members[0])
        .to(data.members[1])
        .emit('started-typing',data)

    })
    socket.on('user-login',userId=>{
            if(!onLineUser.includes(userId)){
               onLineUser.push(userId);

            }
            socket.emit('online-users',onLineUser);
    })
    


    
});
export { server};
