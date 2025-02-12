import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { DynamoDB } from 'aws-sdk';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'myTestSecretKey';

// יצירת חיבור ל-DynamoDB
const dynamoDB = new DynamoDB.DocumentClient();

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token; // קבלת ה-Cookie
    if (!token) {
        res.status(401).json({ error: 'Unauthorized - No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // הוספת המשתמש המבוטל לאובייקט הבקשה

        // חיפוש המשתמש ב-DynamoDB
        const params = {
            TableName: 'Users',  // שם הטבלה ב-DynamoDB
            Key: { userId: decoded.id }  // חיפוש לפי ה-ID של המשתמש
        };

        const result = await dynamoDB.get(params).promise();

        if (!result.Item) {
            res.status(404).json({ error: 'User not found in database' });
            return;
        }

        // אם המשתמש נמצא, אנו ממשיכים לבקשה הבאה
        req.user = result.Item;  // עדכון עם פרטי המשתמש מ-DynamoDB
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
        return;
    }
};

export default authMiddleware;
