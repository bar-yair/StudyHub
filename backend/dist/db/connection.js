import { DynamoDB } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// יצירת חיבור ל-DynamoDB
const dynamoDB = new DynamoDB.DocumentClient();

// הגדרת שם הטבלה
const USERS_TABLE = process.env.USERS_TABLE || 'Users';

const connectDB = async () => {
    try {
        // בדוק אם אנחנו יכולים להתחבר ל-DynamoDB על ידי קריאה לאחת הפקודות
        const params = {
            TableName: USERS_TABLE,
            Key: { userId: 'test-user' },  // אפשר לבדוק משתמש לדוגמה
        };

        // נבצע קריאה לדינמודיבי כדי לבדוק שהחיבור תקין
        await dynamoDB.get(params).promise();
        console.log('Connected to DynamoDB');
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('An unknown error occurred');
        }
        process.exit(1);
    }
};

export default connectDB;
