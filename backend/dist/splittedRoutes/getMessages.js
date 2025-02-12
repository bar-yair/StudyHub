const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// GET messages for a course by courseId
router.get('/getMessages/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        
        // Fetch course from DynamoDB
        const params = {
            TableName: 'Courses',
            Key: {
                courseId: parseInt(courseId, 10), // Assuming courseId is the partition key
            }
        };

        const data = await docClient.get(params).promise();
        
        if (!data.Item) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }

        const course = data.Item;
        
        // Assuming messages is an array inside the course item
        res.json(course.messages || []);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
