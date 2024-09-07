const jwt = require('jsonwebtoken');
const jwtAuthMiddleware = (req, res, next) => {
    // first check request headers has authorization or not
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Token Not Found' });
    }
    // Extract the jwt token from request header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the user informaton to the request object
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: 'Invalid token' });
    }
}
// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET);

}
module.exports = { jwtAuthMiddleware, generateToken };