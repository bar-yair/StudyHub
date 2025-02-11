import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Register: React.FC = () => {
    const [month, setMonth] = useState<string>('Jan');
    const [year, setYear] = useState<string>('2024');
    const [days, setDays] = useState<string[]>([]);
    const navigate = useNavigate();
    const displayedErrors = new Set<string>();
  
    useEffect(() => {
        setDays(daysInMonth(month, year));
    }, [month, year]);
  
    const daysInMonth = (month: string, year: string) => {
        const monthIndex = new Date(`01 ${month} ${year}`).getMonth();
        const date = new Date(Number(year), monthIndex + 1, 0);
        return Array.from({ length: date.getDate() }, (_, i) => (i + 1).toString());
    };
  
    const generateYears = (startYear: number, endYear: number) => {
        return Array.from({ length: startYear - endYear + 1 }, (_, i) => (startYear - i).toString());
    };
  
    const validateInput = (firstName: string, lastName: string, username: string, password: string, birthYear: number) => {
        const nameRegex = /^[A-Za-z]+$/;
        const usernameRegex = /^[A-Za-z0-9]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        const currentYear = new Date().getFullYear();
  
        if (!nameRegex.test(firstName)) {
            toast.error('First name must contain only letters!');
            return false;
        }
        if (!nameRegex.test(lastName)) {
            toast.error('Last name must contain only letters!');
            return false;
        }
        if (!usernameRegex.test(username)) {
            toast.error('Username must contain only letters and numbers!');
            return false;
        }
        if (!passwordRegex.test(password)) {
            toast.error('Password must be at least 8 characters long and contain both letters and numbers!');
            return false;
        }
        if (currentYear - birthYear < 18) {
            toast.error('You must be at least 18 years old to sign up!');
            return false;
        }
        return true;
    };
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const firstName = event.currentTarget.firstName.value;
        const lastName = event.currentTarget.lastName.value;
        const birthDate = `${year}-${month}-${event.currentTarget.day.value}`;
        const birthYear = parseInt(year);
        const gender = event.currentTarget.gender.value;
        const username = event.currentTarget.username.value;
        const password = event.currentTarget.password.value;
  
        if (!validateInput(firstName, lastName, username, password, birthYear)) return;
  
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                firstName,
                lastName,
                username,
                password,
                birthDate,
                gender,
            });
  
            toast.success('You have registered successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
        }
    };
  
    return (
        <div className="signup-container">
            <div className="signup-box">
                <h1 className="title">StudyHub</h1>
                <h2 className="subtitle">Create a new account</h2>
                <p className="description">It's quick and easy.</p>
  
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group name-inputs">
                        <input type="text" name="firstName" placeholder="First name" className="input" required />
                        <input type="text" name="lastName" placeholder="Last name" className="input" required />
                    </div>
  
                    <div className="form-group">
                        <label className="label">Birthday</label>
                        <div className="birthday-select">
                            <select className="input" value={month} onChange={(e) => setMonth(e.target.value)}>
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <option key={m}>{m}</option>)}
                            </select>
                            <select className="input" defaultValue="1" name="day">
                                {days.map(day => <option key={day}>{day}</option>)}
                            </select>
                            <select className="input" value={year} onChange={(e) => setYear(e.target.value)}>
                                {generateYears(2025, 1925).map(y => <option key={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="label">Gender</label>
                        <div className="gender-options">
                            <label><input type="radio" name="gender" value="male" required /> Male</label>
                            <label><input type="radio" name="gender" value="female" required /> Female</label>
                        </div>
                    </div>
  
                    <div className="form-group">
                        <input type="text" name="username" placeholder="User name" className="input" required />
                    </div>
  
                    <div className="form-group">
                        <input type="password" name="password" placeholder="New password" className="input" required />
                    </div>
  
                    <button type="submit" className="signup-btn">Sign Up</button>
                </form>
            </div>
            
            <ToastContainer position="bottom-right" />
        </div>
    );
};
  
export default Register;