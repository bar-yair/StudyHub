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
    courseId: 0,
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
      const response = await axios.get('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/returnCourses'); //change to aws
      const coursesArr: Course[] = response.data as Course[];
      console.log(coursesArr);
      setCourses(coursesArr);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await axios.get('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/returnUsers'); //change to aws
      const usersArr: User[] = response.data as User[];
      console.log(usersArr);
      setUsers(usersArr);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const courseToAdd = { ...newCourse, imageUrl: '/homepagepics/general.jpg' };
      await axios.post('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/addCourse', courseToAdd);
      fetchCourses();
      setNewCourse({ courseId: 0, title: '', description: '', imageUrl: '/homepagepics/general.jpg' });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/deleteCourse/${courseId}`); //change to aws
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/deleteUser/${userId}`); //change to aws
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
                <div key={user._id} className="user-item">
                  <div className="user-info">
                    <h3>Username: {user.username}</h3>
                    <p>Email: {user.email}</p>
                    <p>Name: {user.firstName} {user.lastName}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteUser(user._id)}
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