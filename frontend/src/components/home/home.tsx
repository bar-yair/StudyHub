import React from 'react';
import './home.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="logo">StudyHub</div>
        <nav>
          <button className="nav-button">Account</button>
          <button className="nav-button">Home Page</button>
          <button className="nav-button">My Courses</button>
        </nav>
      </header>

      {/* Courses Grid */}
      <main className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-tile" onClick={() => handleCourseClick(course.id)}>
            <div className="course-details">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
            </div>
            <img src={course.image} alt={course.title} />
          </div>
        ))}
      </main>
    </div>
  );
};

const courses = [
  { id: 1, title: 'Cyber Security', description: 'Cybersecurity principles and defense', image: '/homepagepics/pic1.png' },
  { id: 2, title: 'AWS', description: 'AWS cloud services basics.', image: '/homepagepics/pic2.png' },
  { id: 3, title: 'Computational Models', description: 'Computational models and algorithms.', image: '/homepagepics/pic3.png' },
  { id: 4, title: 'Neural Networks', description: 'Neural networks and learning.', image: '/homepagepics/pic4.png' },
  { id: 5, title: 'English', description: 'Advanced English', image: '/homepagepics/pic5.png' },
  { id: 6, title: 'Algorithms', description: 'Algorithms design and analysis.', image: '/homepagepics/pic6.png' },
];

// const handleCourseClick = (id) => {
//   alert(`Navigating to course ${id}`); // Replace this with navigation logic
// };

export default HomePage;
