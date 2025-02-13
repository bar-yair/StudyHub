import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './profile.css';

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  birthDate: string;
  gender: string;
}

interface ApiResponse {
  body: string;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching user profile...');
        const token = localStorage.getItem('token'); 
    
        if (!token) {
            console.error('No token found in localStorage');
            return; 
        }
    
        // Decode the JWT to extract username
        const decodedToken = jwtDecode(token);  // או שם המפתח המתאים מה-token
    
        console.log(' decoded token:', decodedToken);
    
        // קריאה ל-API עם ה-username ב-path
        const response = await axios.get<ApiResponse>(`https://your-api-url/dev/getUserProfile/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${decodedToken}`,
            },
        });
    
        const userData = JSON.parse(response.data.body);
    
        console.log('User profile fetched:', userData);
        setUserProfile(userData);
    
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-details">
        <p><strong>First Name:</strong> {userProfile.firstName}</p>
        <p><strong>Last Name:</strong> {userProfile.lastName}</p>
        <p><strong>Username:</strong> {userProfile.username}</p>
        <p><strong>Birth Date:</strong> {new Date(userProfile.birthDate).toLocaleDateString()}</p>
        <p><strong>Gender:</strong> {userProfile.gender}</p>
      </div>
    </div>
  );
};

export default Profile;