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
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching user profile...');
        const response = await axios.get<UserProfile>('http://localhost:5000/api/users/profile', { withCredentials: true });
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