const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure Cognito Identity service
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

// Middleware to check authentication using Cognito
const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const params = {
        AccessToken: token, // Use the token from the request header
    };

    try {
        // Verify the token using Cognito
        const response = await cognitoIdentityServiceProvider.getUser(params).promise();
        req.user = response; // Attach user info to request
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

router.get('/check-auth', authMiddleware, (req, res) => {
    const user = req.user;
    res.json({ isAuthenticated: true, message: 'User is authenticated', user });
});

module.exports = router;
