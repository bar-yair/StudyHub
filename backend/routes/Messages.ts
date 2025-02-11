import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Message from '../models/Message';
import Course from '../models/Course';
import User from '../models/User';


const JWT_SECRET = process.env.JWT_SECRET || 'myTestSecretKey';

const router = express.Router();

router.post('/sendMessage', async (req: Request, res: Response): Promise<void> => {
  try {
    // בדוק אם יש טוקן בבקשה
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // פענח את המשתמש מהטוקן
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    console.log('userId:', userId);

    // חפש את שם המשתמש של היוזר
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // קבל את הנתונים מהבקשה
    const { courseId, content } = req.body;
    if (!courseId || !content) {
       res.status(400).json({ error: 'Missing courseId or content' });
       return;
    }

    // מצא את הקורס המתאים
    const course = await Course.findOne({ courseId });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const DateTmeNow = new Date(Date.now());

    // צור הודעה חדשה
    const newMessage = new Message({
      timestamp: DateTmeNow.toLocaleDateString('en-US', {
              day: '2-digit',   // מציג את היום עם 2 ספרות
              month: 'short',   // מציג את החודש בקצרה, לדוג' "Feb"
              hour: '2-digit',  // מציג את השעה עם 2 ספרות
              minute: '2-digit', // מציג את הדקה עם 2 ספרות
              second: '2-digit', // מציג את השנייה עם 2 ספרות
              hour12: false       // מציג את השעה בפורמט 12 שעות (AM/PM)
            }),
      sender: user.username,
      content,
    });
    await newMessage.save();

    // הוסף את ההודעה למערך ההודעות של הקורס
    course.messages.push(newMessage);
    await course.save();

    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
