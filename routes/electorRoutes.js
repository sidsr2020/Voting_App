const express = require('express');
const router = express.Router();
const elector = require('./../models/electors');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');

const checkAdminRole = async (userID) => {
    const user = await user.findById(userID);
    if (user.role === 'admin') {
        return true;
    }
    return false;
}
// POST route to add an elector
router.post('/electors', async (req, res) => {
    try {
        const data = req.body;// Assuming the request body contains the elector data
        // create a new elector document using the Mongoose Model
        const newElector = new elector(data);
        // Save the new elector to the database
        const response = await newElector.save();
        console.log('data saved');
        res.status(200).json({ response: response});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// Profile Route
router.get('/p', jwtAuthMiddleware, async (req, res) => {
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