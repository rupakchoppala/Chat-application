import express from 'express';
import Chat from "./../modules/chat.js";
import Messages from "./../modules/message.js";
import authMiddleWare from '../middlewares/authMiddleWare.js';
import message from './../modules/message.js';
const router=express.Router();
router.post('/new-message',authMiddleWare,async(req,res)=>{
    try{
        const newMessage=new Messages(req.body);
        const saveMessage=await newMessage.save();
        // const currentChat=await Chat.findById(req.body.chatId);
        // currentChat.lastMessages=saveMessage._id;
        // await currentChat.save();
        const currentChat=await Chat.findOneAndUpdate({
            _id:req.body.chatId
        },{lastMessages:saveMessage._id,
            $inc:{unreadMessagesCount:1}
        });

  res.status(201).send({
    message:"message sent successfully",
    success:true,
    data:saveMessage
  })

    }
    catch(error){
        res.status(400).send(
            {
                message:error.message,
                success:false
            }
        );
    }
})
router.get('/get-all-messages/:id', authMiddleWare, async (req, res) => {
    try {
      // Use req.params.id to retrieve messages
      const allMessages = await Messages.find({ chatId: req.params.id }).sort({ createdAt: 1 });
      res.status(200).send({
        message: "All messages retrieved successfully",
        success: true,
        data: allMessages,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
        success: false,
      });
    }
  });

export default router;