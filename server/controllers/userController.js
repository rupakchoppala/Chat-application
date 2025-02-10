import express from 'express';
import User from './../modules/user.js';
import authMiddleware from '../middlewares/authMiddleWare.js';
import cloudinary from '../cloudinary.js';
import multer from 'multer';

const router1 = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get logged-in user's data
router1.get('/get-logged-user', authMiddleware, async (req, res) => {
    try {
        const userId = req.body.userId; // User ID attached by authMiddleware
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).send(
                { message: 'User not found',
                     success: false });
        }

        return res.status(200).send({
            message: 'User fetched successfully',
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).send({ 
            message: error.message || 
            'Internal server error', success: false });
    }
});
router1.get('/get-all-user', authMiddleware, async (req, res) => {
    try {
        const userId = req.body.userId; // User ID attached by authMiddleware
        const all_user = await User.find({ _id: {$ne:userId} });

        // if (!user) {
        //     return res.status(404).send(
        //         { message: 'User not found',
        //              success: false });
        // }

        return res.status(200).send({
            message: 'All User fetched successfully',
            success: true,
            data: all_user 
        });
    } catch (error) {
        return res.status(500).send({ 
            message: error.message || 
            'Internal server error', success: false });
    }
});
router1.post('/upload-profile-pic', authMiddleware,async (req, res) => {
    try {
         const image = req.body.image;
        const userId = req.body.userId;

        if (!image) throw new Error("Image is missing in the request body");
        if (!image.startsWith("data:image/")) throw new Error("Invalid image format");

        // Upload to Cloudinary
        const UploadImage = await cloudinary.uploader.upload(image, {
            folder: 'real-time-chat',
        });

        // Update user profile
        const user = await User.findByIdAndUpdate(
            userId,
            { profilePic: UploadImage.secure_url },
            { new: true }
        );

        res.send({
            message: 'Profile pic updated successfully',
            success: true,
            data: user,
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.send({
            message: err.message,
            success: false,
        });
    }
});



export default router1;
