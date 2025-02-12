const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// DELETE a course by courseId
router.delete('/deleteCourse/:courseId', async (req, res) => {
    const { courseId } = req.params;
    const params = {
        TableName: 'Courses', // שם הטבלה ב-DynamoDB
        Key: {
            courseId: parseInt(courseId, 10),
        },
    };

    try {
        const data = await docClient.delete(params).promise();
        if (!data) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
