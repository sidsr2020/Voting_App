const express = require('express');
const router = express.Router();
const user = require('./../models/user');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
// POST route to add a user
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;// Assuming the request body contains the user data
        // create a new user document using the Mongoose Model
        const newuser = new user(data);
        // Save the new user to the database
        const response = await newuser.save();
        console.log('data saved');
        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is :", token);
        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// Login Route
router.post('/login', async (req, res) => {
    try {
        // Extract the  aadharCardNumber and password from the request body
        const { aadharCardNumber, password } = req.body;
        // Find the user by the aadharCardNumber in the DataBase
        const user = await user.findOne({ aadharCardNumber: aadharCardNumber });
        // If user does not exist and password does not match, return error
        if (!user || !await user.comparePassword(password)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        // If user exists and password matches, return success
        // Generate Token
        const payload = {
            id: user.id
        }
        const token = generateToken(payload);
        console.log("Token is :", token);
        // Return token as Response
        res.status(200).json({ token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// Profile Route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the id from the token
        const { currentPassword, newPassword } = req.body; // Extract the current and new Password from request body
        // Find the user by userId
        const user = await user.findById(userId);
        if (!await user.comparePassword(currentPassword)) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        // update the user's password
        user.password = newPassword;
        await user.save();
        console.log('password updated');
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;