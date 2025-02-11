import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User'; 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import process from 'process';
import authMiddleware from '../middleware/authMiddleware';
import cookieParser from 'cookie-parser';

dotenv.config();
cookieParser();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'myTestSecretKey';

// Define the interface for the request body (including new attributes)
interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  birthDate: Date;
  gender: string;
}

interface LoginRequestBody {
  username: string;
  password: string;
}

// User registration
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, username, password, birthDate, gender }: RegisterRequestBody = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      birthDate,
      gender,
    });
    await newUser.save();

    res.json(newUser);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// User login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password }: LoginRequestBody = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ error: 'Invalid Username or Password' });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid Username or Password' });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET); 

    // Set token in cookie and send response
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none'}).json({ 
      message: 'Login successful', 
      token, 
      firstName: user.firstName, 
      lastName: user.lastName, 
      username: user.username 
    });


  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/check-auth', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({isAuthenticated: true, message: 'User is authenticated', user});
});

router.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('token').json({message: 'Logged out successfully'});
});


router.get('/profile', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log('Fetching profile for user:',decoded.username);
    const dbUser = await User.findById(decoded.id);
    console.log('User:', dbUser);
    if (!dbUser) {
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
      return;
    }

    console.log('User profile:', dbUser);
    res.json(dbUser);

  } catch (err: any) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;