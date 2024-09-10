const express = require('express');
const router = express.Router();
const elector = require('./../models/electors');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const User = require('./../models/user');
// Create elector routes
const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        if (user.role === 'admin') {
            return true;
        }
    } catch (err) {
        return false;
    }
}
// POST route to add an elector
router.post('/', jwtAuthMiddleware ,async (req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) return res.status(403).json({ message: 'user does not have admin role' });
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

router.put('/:electorID', jwtAuthMiddleware ,async (req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) return res.status(403).json({message: 'user does not have admin role'});
        const electorID = req.params.electorID; // Extract the id from the URL parameter
        const updatedElectorData = req.body; // Updated data for the elector
        // Update the person in the database
        const response = await elector.findByIdAndUpdate(electorID, updatedElectorData , {
            new: true,
            runValidators: true,
        });
        if (!response) {
            return res.status(404).json({ error: 'elector not found' });
        }
        console.log('elector data updated');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/:electorID', jwtAuthMiddleware ,async (req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) return res.status(403).json({message: 'user does not have admin role'});
        const electorID = req.params.electorID; // Extract the id from the URL parameter
        // Update the person in the database
        const response = await elector.findByIdAndDelete(electorID);
        if (!response) {
            return res.status(404).json({ error: 'elector not found' });
        }
        console.log('elector deleted');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// Creating voting routes 
// let's start voting

module.exports = router;