const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Courses'; // שם הטבלה ב-DynamoDB

// POST a new course
router.post('/addCourse', async (req, res) => {
    const { title, courseId, description, imageUrl } = req.body;

    const params = {
        TableName: TABLE_NAME,
        Key: { courseId },
    };

    try {
        // Check if course already exists
        const data = await dynamoDb.get(params).promise();
        if (data.Item) {
            res.status(400).json({ error: 'Course already exists' });
            return;
        }

        const newCourse = {
            TableName: TABLE_NAME,
            Item: {
                courseId,
                title,
                description,
                imageUrl,
            },
        };

        await dynamoDb.put(newCourse).promise();
        res.json(newCourse.Item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
