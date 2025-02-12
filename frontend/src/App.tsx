import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import AxiosError from 'axios-error'

import './App.css'

import NavBar from './components/NavBar/NavBar'
import Home from './components/home/home'
import Login from './components/login/login'
import Chatupload from './components/chatupload/chatupload'
import Register from './components/register/register'
import AdminDashboard from './components/admin/AdminDashboard';
import Profile from './components/profile/profile';
interface Course {
  courseId: string,
  title: string;
  description: string;
  imageUrl: string;
}

function App() {

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/returnCourses', {
          headers: {
            'Content-Type': 'application/json' // Good practice, even for GET requests.
          }
        });

        // No need for type assertion here, axios handles it.
        const coursesArr = response.data; 

        console.log("Courses received:", coursesArr); // Better log message
        setCourses(coursesArr);

      } catch (error) {
        console.error('Error fetching courses:', error);
  
        if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
          console.error("Axios Error Details:", error.response?.data, error.response?.status, error.response?.headers);
          console.error("Axios Request:", error.request);
          console.error("Axios Message:", error.message);
        } else if (error instanceof Error) {
          console.error("General Error:", error.message);
        } else {
          console.error("Unknown Error:", error);
        }
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
         <Route path="/admin" element={<AdminDashboard />}></Route>
         <Route path="/profile" element={<Profile />}></Route>
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
