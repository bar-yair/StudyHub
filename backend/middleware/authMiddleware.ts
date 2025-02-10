import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'myTestSecretKey';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // קבלת ה-Cookie
    if (!token) {
        res.status(401).json({ error: 'Unauthorized - No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
        (req as any).user = decoded; // הוספת המשתמש המבוטל לאובייקט הבקשה
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
        return;
    }
};

export default authMiddleware;
