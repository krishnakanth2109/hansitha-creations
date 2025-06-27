// src/pages/Signup.tsx or wherever you keep your pages

import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <SignUp path="/signup" routing="path" redirectUrl="/" />
    </div>
  );
};

export default Signup;
