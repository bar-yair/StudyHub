import React from 'react';
import './login.css';

const Login: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-left">
          <h1>Studyhub</h1>
          <p>Learn and grow with your personalized study companion.</p>
        </div>
        <div className="login-right">
          <form className="login-form">
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Log In</button>
            <div className="separator"></div>
            <button type="button" className="create-account-btn">Create new account</button>
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
