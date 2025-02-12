const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// GET all courses
router.get('/returnCourses', async (req, res) => {
    try {
        const params = {
            TableName: 'Courses', // שם הטבלה ב-DynamoDB
        };

        const data = await docClient.scan(params).promise();
        res.json(data.Items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
