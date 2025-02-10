import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate, Router, Route, Routes } from 'react-router-dom';

export const Register: React.FC = () => {
    const [month, setMonth] = useState<string>('Jan');
    const [year, setYear] = useState<string>('2024');
    const [days, setDays] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const daysInMonth = (month: string, year: string) => {
      const monthIndex = new Date(`01 ${month} ${year}`).getMonth(); // Corrected this line
      const date = new Date(Number(year), monthIndex + 1, 0); // Last day of the month
      const days = [];
      for (let i = 1; i <= date.getDate(); i++) {
        days.push(i.toString());
      }
      return days;
    };
  

  useEffect(() => {
    setDays(daysInMonth(month, year));
  }, [month, year]);

  const generateYears = (startYear: number, endYear: number) => {
    const years = [];
    for (let i = startYear; i >= endYear; i--) {
      years.push(i.toString());
    }
    return years;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    const firstName = event.currentTarget.firstName.value;
    const lastName = event.currentTarget.lastName.value;
    const birthDate = `${year}-${month}-${event.currentTarget.day.value}`; // Combine year, month, day
    const gender = event.currentTarget.gender.value;
    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;

    console.log(firstName, lastName, birthDate, gender, username, password);
  
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        firstName,
        lastName,
        username,
        password,
        birthDate,
        gender,
      });
  
      // Handle successful registration (e.g., redirect to login page)
      console.log('Registration successful:', response.data);
      setSuccessMessage('You have registered successfully!');
      setErrorMessage("");
      setTimeout(() => {
      navigate("/login");
      },2000);
  
    } catch (error: any) {
      if(error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      }
      else {
        setErrorMessage('An unexpected error occured. Please try again.');
      }
      // Handle registration errors (e.g., display error message to user)
    }
  };

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');// זה יעביר אותך לדף ה-login
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="title">StudyHub</h1>
        <h2 className="subtitle">Create a new account</h2>
        <p className="description">It's quick and easy.</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group name-inputs">
            <input type="text" name="firstName" placeholder="First name" className="input" />
            <input type="text" name="lastName" placeholder="Last name" className="input" />
          </div>

          <div className="form-group">
            <label className="label">Birthday</label>
            <div className="birthday-select">
              <select
                className="input"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option>Jan</option>
                <option>Feb</option>
                <option>Mar</option>
                <option>Apr</option>
                <option>May</option>
                <option>Jun</option>
                <option>Jul</option>
                <option>Aug</option>
                <option>Sep</option>
                <option>Oct</option>
                <option>Nov</option>
                <option>Dec</option>
              </select>
              <select className="input" defaultValue="1" name="day">
                {days.map((day) => (
                  <option key={day}>{day}</option>
                ))}
              </select>
              <select
                className="input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {generateYears(2025, 1925).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Gender</label>
            <div className="gender-options">
              <label>
                <input type="radio" name="gender" value="male" />
                Male
              </label>
              <label>
                <input type="radio" name="gender" value="female" />
                Female
              </label>
            </div>
          </div>

          <div className="form-group">
            <input type="text" placeholder="User name" className="input" name="username"/>
          </div>

          <div className="form-group">
            <input type="password" name="password" placeholder="New password" className="input" />
          </div>

          <p className="policy">
            By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS Notifications from us and can opt out any time.
          </p>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <p className="already-account" onClick={handleLoginClick}>
                Already have an account?
        </p>
      </div>
    </div>
  );
};

export default Register;