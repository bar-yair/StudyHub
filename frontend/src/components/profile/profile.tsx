import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  birthDate: string;
  gender: string;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    function getCookie(name: string): string | null {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
      }
      return null;
    }
    
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching user profile...');
        const token = getCookie('token'); // Replace 'token' with the actual name of your cookie

        if (!token) {
            console.error('No token found in cookies');
            return; // Or handle the error as needed
        }

        const response = await axios.get<UserProfile>('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/getUserProfile', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Use the token from cookies
            }
        });
        console.log('User profile fetched:', response.data);
        setUserProfile(response.data);
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