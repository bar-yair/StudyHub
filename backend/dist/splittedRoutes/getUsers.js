const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// Get all users
router.get('/returnUsers', async (req, res) => {
    try {
        const params = {
            TableName: 'Users',
        };

        const data = await docClient.scan(params).promise();

        console.log('Found users:', data.Items);
        if (!data.Items || data.Items.length === 0) {
            console.log('No users found in database');
            res.status(404).send('No users found');
            return;
        }
        
        console.log(`Sending ${data.Items.length} users`);
        res.send(data.Items);
    } catch (err) {
        console.error('Error in returnUsers:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
