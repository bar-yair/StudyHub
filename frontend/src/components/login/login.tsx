import React from 'react';
import './login.css';
import { useNavigate, Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';

interface User {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  username: string;
  password: string;
  token: string;
}

const Login: React.FC = () => {

  const navigate = useNavigate();
  
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;
  
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
      }, {withCredentials: true});
      const userData = response.data as User;
      localStorage.setItem("token", userData.token);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("firstName", userData.firstName);
      localStorage.setItem("lastName", userData.lastName);
      console.log(localStorage);
      // Handle successful registration (e.g., redirect to login page)
      console.log('Login successful:', response.data);
      navigate("/home");
  
    } catch (error) {
      console.error('Login error:', error);
      // Handle registration errors (e.g., display error message to user)
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');// זה יעביר אותך לדף ה-login
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-left">
          <h1>Studyhub</h1>
          <p>Learn and grow with your personalized study companion.</p>
        </div>
        <div className="login-right">
          <form className="login-form" onSubmit={handleLogin}>
            <input type="text" placeholder="Username" name="username"/>
            <input type="password" placeholder="Password" name="password"/>
            <button type="submit">Log In</button>
            <div className="separator"></div>
            <button type="button" className="create-account-btn" onClick={handleRegisterClick}>Create new account</button>
          </form>
          <a href="#create-page" className="create-page-link">
            Create a Page for a study group, class, or community.
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
