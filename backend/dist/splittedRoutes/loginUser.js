const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'myTestSecretKey';

// Configure DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user exists
        const params = {
            TableName: 'Users',
            Key: { username }
        };
        
        const data = await docClient.get(params).promise();
        
        if (!data.Item) {
            res.status(400).json({ error: 'Invalid Username or Password' });
            return;
        }

        const user = data.Item;

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid Username or Password' });
            return;
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

        // Set token in cookie and send response
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' }).json({
            message: 'Login successful',
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
