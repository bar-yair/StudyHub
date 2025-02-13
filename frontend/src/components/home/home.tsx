import { useState, useEffect } from 'react';
import './home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AxiosError from 'axios-error';

interface Course {
  courseId: string,
  title: string;
  description: string;
  imageUrl: string;
}

interface ApiResponse {
  body: string;
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
        const response = await axios.get<ApiResponse>('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/getCourses', {
          headers: {
            'Content-Type': 'application/json' // Important!
          }
        });

        const coursesArr = JSON.parse(response.data.body); 

        console.log("Courses received:", coursesArr);
        setCourses(coursesArr);
        
      } catch (error) {
        console.error('Error fetching courses:', error);

        if (error instanceof AxiosError) {
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
