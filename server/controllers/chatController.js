import express from 'express';
import Chat from "./../modules/chat.js";
import authMiddleWare from '../middlewares/authMiddleWare.js';
const router=express.Router();
router.post('/create-new-chat',authMiddleWare,async(req,res)=>{
    try{
        const chat=new Chat(req.body);
        const savedChat=await chat.save();
        res.status(201).send(
            { 
                message:"Chat created successfully",
                success:true,
                data:savedChat

            }
        )

    }
    catch(error){
        res.status(400).send(
            {message:"Error creating chat",
                success:false})

    }
});
// router.get('/get-all-chat',authMiddleWare,async(req,res)=>{
//     console.log(req.body.userId);
//     try{
//         const userId=req.body.userId;
//         const allchat=await new Chat.find({members:{$in:userId}} );
//         console.log(allchat);
//        // const savedChat=await chat.save();
//         res.status(201).send(
//             { 
//                 message:"Chat fetched successfully",
//                 success:true,
//                 data:allchat

//             }
//         )

//     }
//     catch(error){
//         res.status(400).send(
//             {message:"Error fetching chat",
//                 success:false});

//     }
// });
router.get('/get-all-chat', authMiddleWare, async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const userId = req.body.userId;

        // Validate userId
        if (!userId || typeof userId !== 'string') {
            return res.status(400).send({ message: "Invalid userId", success: false });
        }

        // Fetch chats
        const allchat = await  Chat.find({ members: { $in: userId } })
        .populate('members').sort({updatedAt:-1}); 
        console.log("Fetched Chats:", allchat);

        res.status(201).send({
            message: "Chat fetched successfully",
            success: true,
            data: allchat,
        });
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(400).send({
            message: "Error fetching chat",
            success: false,
        });
    }
});

export default router;