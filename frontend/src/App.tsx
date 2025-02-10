import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import './App.css'

import NavBar from './components/NavBar/NavBar'
import Home from './components/home/home'
import Login from './components/login/login'
import Chatupload from './components/chatupload/chatupload'
import Register from './components/register/register'

interface Course {
  courseId: number,
  title: string;
  description: string;
  imageUrl: string;
}

function App() {
  const [count, setCount] = useState(0)

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses/returnCourses');
        const coursesArr: Course[] = response.data as Course[];
        console.log(coursesArr);
        setCourses(coursesArr);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ width: '100%' }}>
     <BrowserRouter>
       <NavBar />
       <Routes>
         <Route path="/" element={<Login />}></Route>
         <Route path="/home" element={<Home />}></Route>
         <Route path="/register" element={<Register />}></Route>
         <Route path="/chatupload" element={<Chatupload />}></Route>
         {
          courses.length > 0 ? (
            courses.map((course) => (
              <Route key={course.courseId} path={`/courses/:courseId`} element={<Chatupload />} />
            )
          )

          ) : (
            <Route path="*" element={<div>Loading...</div>} />
         )}
       </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
