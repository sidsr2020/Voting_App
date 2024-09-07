const express = require('express');
const router = express.Router();
const user = require('./../models/user');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
// POST route to add a person
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
        // Extract the username and password from the request body
        const { username, password } = req.body;
        // Find the user in the database
        const user = await Person.findOne({ username: username });
        // If user does not exist and password does not match, return error
        if (!user || !await user.comparePassword(password)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        // If user exists and password matches, return success
        // Generate Token
        const payload = {
            id: user.id,
            username: user.username
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
        console.log("User Data: ", userData);
        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// GET method to get the person
router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find();
        console.log('data fetched');
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;// Extract the work type from the URL parameter
        if (workType == 'chef' || workType == 'manager' || workType == 'waiter' || workType == 'backend-dev') {
            const response = await Person.find({ work: workType });
            console.log('response fetched');
            res.status(200).json(response);
        }
        else {
            res.status(400).json({ error: 'Invalid work type' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.put('/:id', async (req, res) => {
    try {
        const personId = req.params.id; // Extract the id from the URL parameter
        const updatedPersonData = req.body; // Updated data for the person
        // Update the person in the database
        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true,
            runValidators: true,
        });
        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }
        console.log('data updated');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id; // Extract the id from the URL parameter
        // Delete the person from the database
        const response = await Person.findByIdAndDelete(personId);
        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }
        console.log('data deleted');
        res.status(200).json({ message: 'person deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
module.exports = router;