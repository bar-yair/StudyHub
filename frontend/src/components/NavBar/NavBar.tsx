import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import axios from 'axios';
import './NavBar.css'

interface Course {
  courseId: number,
  title: string;
  description: string;
  imageUrl: string;
}

interface CheckAuthResponse {
  isAuthenticated: boolean;
}

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  //local storage items
  const username = localStorage.getItem("username");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => { 
  
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses/returnCourses');
      const coursesArr: Course[] = response.data as Course[];
      setCourses(coursesArr);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  fetchCourses();
 },[]);

 const handleCourseClick = async (id: any) => {
  try {
    // שולח בקשה לבדוק אם המשתמש מחובר (מקבל את ה-cookie מהדפדפן)
    const response = await axios.get<CheckAuthResponse>('http://localhost:5000/api/users/check-auth', { withCredentials: true });
    console.log(response.data);
    if (response.data.isAuthenticated) {
      // אם המשתמש מחובר, נווט לדף הקורס
      navigate(`/courses/${id}`);
      setMenuAnchorEl(null);
    } else {
      // אם המשתמש לא מחובר, הצג הודעה
      setMenuAnchorEl(null);
      alert("עליך להתחבר כדי לצפות בקורס.");
    }
  } catch (error) {
    console.error("Authentication check failed:", error);
    alert("עליך להתחבר כדי לצפות בקורס.");
  }
};


  const handleHomeNav = () => {
    navigate('/home');
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleAccMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCoursesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleAccClose = () => {
    setAnchorEl(null);
  };

  const handleCoursesClose = () => {
    setMenuAnchorEl(null);
  };

  const handleSignOut = () => {
     axios.get('http://localhost:5000/api/users/logout', { withCredentials: true });
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
              sx={{ mr: 2, ml:2 }}
              onClick={handleCoursesMenu}
              //className='toolbar-item'
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
            {auth && (
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
                  onClose={handleAccClose}
                >                  
                    <MenuItem onClick={handleAccClose}>Profile</MenuItem>
                    <MenuItem onClick={handleAccClose}>My account</MenuItem>
                    <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      
    </div>
)}

export default NavBar;
