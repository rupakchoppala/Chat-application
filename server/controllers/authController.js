// // import { Router } from "express";
// // const router=Router.post('/signup',(req,res)=>{
// //     res.send("user created successfully");
    
// // });
// // export default router;
// // const express = require('express');
// // const router = express.Router();

// // router.post('/signup', (req, res) => {
// //   res.send('user created successfully!');
// // });

// // module.exports = router;
import express from 'express';
const router = express.Router();
import bycrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from './../modules/user.js';

// Adjust the path to your User model

router.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname,email, password } = req.body;

        // 1. Validate input
        if (!firstname||!lastname || !email || !password) {
            return res.send({
                message: 'All fields are required: name, email, password.',
                success: false,
            });
        }

        // 2. Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send({
                message: 'User already exists.',
                success: false,
            });
        }

        // 3. Hash the password
        const hashedPassword = await bycrypt.hash(password, 10);

        // 4. Create a new user
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword, // Store the hashed password
        });

        // 5. Save the user in the database
        await newUser.save();

        return res.send({
            message: 'User created successfully.',
            success: true,
        });
    } catch (error) {
        console.error('Error during signup:', error); // Log the error for debugging
        return res.send({
            message: 'An error occurred during signup. Please try again later.',
            success: false,
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
         console.log(req.body);
         console.log(email);
        // Validate request data
        if (!email || !password) {
            return res.status(400).send({ message: 'Email and password are required', success: false });
        }

        // Check if user exists (change find to findOne)
        const user = await User.findOne({ email }).select('+password'); // Use findOne instead of find
        console.log(user); // Debugging purpose

        if (!user) {
            return res.send({ message: 'User not found', success: false });
        }

        // Check if password is valid
        if (!user.password) {
            return res.send({ message: 'User password is missing', success: false });
        }

        const isMatch = await bycrypt.compare(password, user.password); // Fix: bcrypt not bycrypt
        if (!isMatch) {
            return res.send({ message: 'Invalid credentials', success: false });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        res.send({
            message: 'Login successful',
            success: true,
            token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.send({ message: 'Server error', success: false });
    }
});

export default router;
