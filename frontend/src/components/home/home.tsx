import React, { useState, useEffect } from 'react';
import './home.css';
import axios from 'axios';
import { useNavigate, Router, Route, Routes } from 'react-router-dom';

interface Course {
  courseId: number,
  title: string;
  description: string;
  imageUrl: string;
}


const HomePage = () => {
  const navigate = useNavigate();

  const handleCourseClick = (id: any) => { //route to dynamic path
    navigate(`/courses/${id}`); // Replace this with navigation logic
  };

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
 },[]);
  

  return (
    <div className="homepage">
      {/* Padding page from NavBar */}
      {/* <header className="navbar">
      </header> */}

      {/* Courses Grid */}
      <main className="courses-grid">
        {courses.length > 0 ? (
         courses.map((course) => (
          <div key={course.courseId} className="course-tile" onClick={() => handleCourseClick(course.courseId)}>
            <div className="course-details">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
            </div>
            <img src={course.imageUrl} alt={course.title} />
          </div>
        ))) : (
          <p>Loading courses...</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
