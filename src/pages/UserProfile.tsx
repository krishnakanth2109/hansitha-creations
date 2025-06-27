import React from 'react';
import { useUser } from '@clerk/clerk-react';

const UserProfile = () => {
  const { user } = useUser();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      <p><strong>Name:</strong> {user.fullName}</p>
      <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
};

export default UserProfile;
