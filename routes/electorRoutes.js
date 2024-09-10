const express = require('express');
const router = express.Router();
const elector = require('./../models/electors');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const user = require('./../models/user');
// Create elector routes
const checkAdminRole = async (userID) => {
    try {
        const user = await user.findById(userID);
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
router.post('/vote/:electorID', jwtAuthMiddleware, async (req, res) => {
    // no admin can vote
    // user can only vote once
    const electorID = req.params.electorID;
    const userID = req.user.id;

    try {
        // Find the elector document with the specified electorID
        const electors = await elector.findById(electorID);
        if (!electors) {
            return res.status(404).json({ error: 'Elector not found' });
        }

        // Find the user document with the specified userID
        const foundUser = await user.findById(userID);
        if (!foundUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (foundUser.isVoted) {
            return res.status(400).json({ error: 'User has already voted' });
        }

        if (foundUser.role === 'admin') {
            return res.status(400).json({ error: 'Admin cannot vote' });
        }

        // Update the elector document to record the vote
        electors.votes.push({ user: userID });
        electors.voteCount += 1;
        await electors.save();

        // Update the user document to record the vote
        foundUser.isVoted = true;
        await foundUser.save();

        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Implement vote count in the voting app
// vote count
router.get('/vote/count', async (req, res) => {
    try {
        // Find all candidates and sort them by voteCount in descending order
        const electors = await elector.find().sort({ voteCount: 'desc' });
        // Map the candidates to only return their name and voteCount
        const voteRecord = electors.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            };
        });
        res.status(200).json(voteRecord);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// Get List of all electors with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const electors = await elector.find({}, 'name party -_id');
        res.status(200).json(electors);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
module.exports = router;