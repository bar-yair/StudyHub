import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AxiosError from 'axios-error'
import './NavBar.css';

interface Course {
  courseId: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface CheckAuthResponse {
  isAuthenticated: boolean;
  message: string;
  user: any;
}

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => { 
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/returnCourses', {
          headers: {
            'Content-Type': 'application/json' // Good practice
          }
        });

        const coursesArr = response.data; // No need for type assertion here

        console.log("Courses received:", coursesArr);
        setCourses(coursesArr);

      } catch (error) {
        console.error('Error fetching courses:', error);
  
        if (error instanceof AxiosError) {  // Type guard for Axios errors
          console.error("Axios Error Details:", error.response?.data, error.response?.status, error.response?.headers);
          console.error("Axios Request:", error.request);
          console.error("Axios Message:", error.message);
        } else if (error instanceof Error) { // Type guard for general Error objects
          console.error("General Error:", error.message);
        } else {
          console.error("Unknown Error:", error); // Handle truly unknown errors
        }
      }
    };

    fetchCourses();
  }, []);

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  const handleCourseClick = async (id: any) => {
      try {
        const response = await axios.get<CheckAuthResponse>('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/checkAuth', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('token')}` // Get the token from cookies (see previous examples)
          }
        });
    
        const authResponse = response.data;
    
        console.log("Authentication response:", authResponse);
    
        if (authResponse.isAuthenticated) {
          navigate(`/courses/${id}`);
          // No need to set menuAnchorEl to null here, navigation will handle it
        } else {
          // No need to set menuAnchorEl to null here either
          alert(authResponse.message || "עליך להתחבר כדי לצפות בקורס."); // Use the message from the API if available
        }
    
      } catch (error) {
        console.error("Authentication check failed:", error);
    
        if (error instanceof AxiosError) {
          console.error("Axios Error Details:", error.response?.data, error.response?.status, error.response?.headers);
          console.error("Axios Request:", error.request);
          console.error("Axios Message:", error.message);
        } else if (error instanceof Error) {
          console.error("General Error:", error.message);
        } else {
          console.error("Unknown Error:", error);
        }
    
        alert("עליך להתחבר כדי לצפות בקורס."); // Display a generic message to the user
      }
  };
      
    

  const handleHomeNav = () => {
    navigate('/home');
  };

  const handleAccMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCoursesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleAccClose = (route?: string) => {
    setAnchorEl(null);
    if (route) {
      navigate(route);
    }
  };

  const handleCoursesClose = () => {
    setMenuAnchorEl(null);
  };

  const handleSignOut = () => {
    axios.get('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/logoutUser', { withCredentials: true }); //change to aws
    navigate('/');
    setAnchorEl(null);
  };

  return (
    <div id="navbar-container" style={{ width: '100%' }}>
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <AppBar position="static" sx={{ width: '100%' }}>
          <Toolbar className='toolbar-background'>
            <img src="/logopics/Logo1.jpg" className='logo' onClick={handleHomeNav}></img>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, ml: 2 }}
              onClick={handleCoursesMenu}
            >
              Courses
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={menuAnchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(menuAnchorEl)}
              onClose={handleCoursesClose}
            >
              {courses.length > 0 ? (
                courses.map((course) => 
                  <MenuItem key={course.courseId} onClick={() => handleCourseClick(course.courseId)}>{course.title}</MenuItem>
                )) : (
                  <MenuItem>No courses to show</MenuItem>
                )}
            </Menu>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>
            {(
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleAccMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={() => handleAccClose()}
                >
                  <MenuItem onClick={() => handleAccClose('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default NavBar;