// src/components/RoleAccess.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleAccess = ({ children, roleType }) => {
  const { user } = useAuth();

 
  if (!user && roleType === 'tte') {
    return <Navigate to="/login" />;
  }

 
  if (roleType === 'user' && user?.role === 'tte') {
    
    return <Navigate to="/tte/charts" />;
  }

  
  if (roleType === 'tte' && user?.role !== 'tte') {
    
    return <Navigate to="/" />;
  }


  return children;
};

export default RoleAccess;