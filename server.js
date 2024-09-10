const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;
// Import the router files
const userRoutes = require('./routes/userRoutes');
const electorRoutes = require('./routes/electorRoutes');
// Use the routers
app.use('/user', userRoutes);
app.use('/electors',electorRoutes);
app.listen(PORT, () => {
    console.log(`listening on port 3000`);
});