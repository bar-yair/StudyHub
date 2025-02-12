const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// GET a single course by courseId
router.get('/returnCourse/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const params = {
            TableName: 'Courses', // שם הטבלה ב-DynamoDB
            Key: {
                courseId: parseInt(courseId, 10), // מניח ש- courseId הוא המפתח הראשי
            },
        };

        const data = await docClient.get(params).promise();
        if (!data.Item) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(data.Item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
