import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

interface Course {
  courseId: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface User {
  username: string;
  firstName: string;
  lastName: string;
}

interface ApiResponse {
  body: string;
}

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    courseId: '',
    title: '',
    description: '',
    imageUrl: '/homepagepics/general.jpg'
  });
  const [activeTab, setActiveTab] = useState<'courses' | 'users'>('courses');

  // Fetch courses and users
  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get<ApiResponse>('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/getCourses', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const coursesArr = JSON.parse(response.data.body);
      console.log(coursesArr);

      console.log("Courses received:", coursesArr);
      setCourses(coursesArr);

    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await axios.get<ApiResponse>('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/getUsers', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const usersArr = JSON.parse(response.data.body);

      console.log(usersArr);

      console.log("users received:", usersArr);
      setUsers(usersArr);

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const courseToAdd = JSON.stringify({ ...newCourse });
      await axios.post('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/addCourse', courseToAdd, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchCourses();
      setNewCourse({ courseId: '', title: '', description: '', imageUrl: '/homepagepics/general.jpg' });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/deleteCourse/${courseId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/deleteUser/${username}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        fetchUsers();
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
              onChange={(e) => setNewCourse({...newCourse, courseId: e.target.value})}
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
            {users && users.length > 0 ? (
              users.map((user) => (
                <div key={user.username} className="user-item">
                  <div className="user-info">
                    <h3>Username: {user.username}</h3>
                    <p>Name: {user.firstName} {user.lastName}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.username)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;