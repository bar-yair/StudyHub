const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../dist/models/Message');
const Course = require('../dist/models/Course');
const User = require('../dist/models/User');
const AWS = require('aws-sdk');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'myTestSecretKey';

// Set up DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient();

router.post('/sendMessage', async (req, res) => {
    try {
        // בדוק אם יש טוקן בבקשה
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // פענח את המשתמש מהטוקן
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        console.log('userId:', userId);

        // חפש את שם המשתמש של היוזר
        const params = {
            TableName: 'Users', // שמו של טבלת ה-DynamoDB
            Key: { id: userId },
        };
        const userData = await dynamoDb.get(params).promise();
        if (!userData.Item) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = userData.Item;

        // קבל את הנתונים מהבקשה
        const { courseId, content } = req.body;
        if (!courseId || !content) {
            res.status(400).json({ error: 'Missing courseId or content' });
            return;
        }

        // מצא את הקורס המתאים
        const courseParams = {
            TableName: 'Courses', // שמו של טבלת ה-DynamoDB
            Key: { courseId: courseId },
        };
        const courseData = await dynamoDb.get(courseParams).promise();
        if (!courseData.Item) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }

        const course = courseData.Item;

        const DateTmeNow = new Date(Date.now());
        // צור הודעה חדשה
        const newMessage = {
            timestamp: DateTmeNow.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }),
            sender: user.username,
            content,
        };

        // שמור את ההודעה ב-DynamoDB
        const messageParams = {
            TableName: 'Messages', // שמו של טבלת ה-DynamoDB
            Item: newMessage,
        };
        await dynamoDb.put(messageParams).promise();

        // הוסף את ההודעה למערך ההודעות של הקורס
        course.messages.push(newMessage);
        const courseUpdateParams = {
            TableName: 'Courses', // שמו של טבלת ה-DynamoDB
            Item: course,
        };
        await dynamoDb.put(courseUpdateParams).promise();

        res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
