const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// Delete user
router.delete('/deleteUser/:userId', async (req, res) => {
    const { userId } = req.params;
    const params = {
        TableName: 'Users', // שם הטבלה ב-DynamoDB
        Key: {
            userId: userId, // נניח שהמפתח הראשי הוא userId
        },
    };

    try {
        const data = await docClient.delete(params).promise();
        if (!data) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
