const express = require('express');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'myTestSecretKey';

// Configure DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

router.get('/profile', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Fetching profile for user:', decoded.username);
        
        // Fetch user from DynamoDB
        const params = {
            TableName: 'Users',
            Key: {
                id: decoded.id, // Assuming 'id' is the partition key
            }
        };

        const data = await docClient.get(params).promise();
        
        if (!data.Item) {
            console.log('User not found');
            res.status(404).json({ error: 'User not found' });
            return;
        }
        
        console.log('User profile:', data.Item);
        res.json(data.Item);
    } catch (err) {
        console.error('Server Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
