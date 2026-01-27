// src/components/Profile.jsx
import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import RecruiterProfile from './RecruiterProfile';
import SeekerProfile from './SeekerProfile'; // <--- IMPORT THIS

const Profile = () => {
  const { user } = useContext(UserContext);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container">
        {user.role === 'employer' ? (
            <RecruiterProfile />
        ) : (
            <SeekerProfile /> // <--- USE IT HERE
        )}
    </div>
  );
};

export default Profile;