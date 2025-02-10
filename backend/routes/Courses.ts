import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User'; 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import process from 'process';
import { IMessage } from '../models/Message';
import Course, { ICourse } from '../models/Course';


const router = express.Router();

interface AddCourseRequestBody {
    title: string;
    courseId: number;
    description: string;
    imageUrl: string;
    messages: IMessage[];
  }

  // GET all courses
router.get('/returnCourses', async (req, res) => {
    try {
      const courses = await Course.find(); 
      res.send(courses); 
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  router.get('/returnCourse/:courseId', async (req, res) => {
    try {
      const { courseId } = req.params; 
      const courseIdNum = parseInt(courseId, 10); 
      const course = await Course.findOne({ courseId:courseIdNum });
      res.send(course); 
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

router.post('/addCourse', async (req: Request, res: Response): Promise<void> => {
    const { title, courseId, description, imageUrl }: AddCourseRequestBody = req.body;
  
    try {
      const courseExists = await Course.findOne({ courseId });
  
      if (courseExists) {
        res.status(400).json({ error: 'Course already exists' });
        return;
      }
      
  
      const newCourse = new Course({
        title, 
        courseId,
        description,
        imageUrl,
      });

      await newCourse.save();
  
      res.json(newCourse);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  export default router;