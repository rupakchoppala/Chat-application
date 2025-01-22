import express from 'express';
import User from './../modules/user.js';
import authMiddleware from '../middlewares/authMiddleWare.js';

const router1 = express.Router();

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
export default router1;

