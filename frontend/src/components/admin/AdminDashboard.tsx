import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

interface Course {
  courseId: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    
    title: '',
    description: '',
    imageUrl: ''
  });
  const [activeTab, setActiveTab] = useState<'courses' | 'users'>('courses');

  // Fetch courses and users
  useEffect(() => {
    fetchCourses();
    //fetchUsers();
  }, []);

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

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/courses/addCourse', newCourse);
      fetchCourses();
      setNewCourse({ courseId: 0, title: '', description: '', imageUrl: '' });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/deleteCourse/${courseId}`);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        //fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="tab-buttons">
        <button 
          className={activeTab === 'courses' ? 'active' : ''} 
          onClick={() => setActiveTab('courses')}
        >
          Manage Courses
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>

      {activeTab === 'courses' && (
        <div className="courses-section">
          <h2>Add New Course</h2>
          <form onSubmit={handleAddCourse} className="add-course-form">
            <input
              type="number"
              placeholder="Course ID"
              value={newCourse.courseId}
              onChange={(e) => setNewCourse({...newCourse, courseId: parseInt(e.target.value)})}
              required
            />
            <input
              type="text"
              placeholder="Course Title"
              value={newCourse.title}
              onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              required
            />
            <textarea
              placeholder="Course Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="image"
              value={newCourse.imageUrl}
              onChange={(e) => setNewCourse({...newCourse, imageUrl: e.target.value})}
              required
            />
            <button type="submit">Add Course</button>
          </form>

          <h2>Existing Courses</h2>
          <div className="courses-list">
            {courses.map((course) => (
              <div key={course.courseId} className="course-item">
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
                <button 
                  onClick={() => handleDeleteCourse(course.courseId)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>User Management</h2>
          <div className="users-list">
            {users.map((user) => (
              <div key={user._id} className="user-item">
                <div className="user-info">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                  <p>{user.firstName} {user.lastName}</p>
                </div>
                <button 
                  onClick={() => handleDeleteUser(user._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;