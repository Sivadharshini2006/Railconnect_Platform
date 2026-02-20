import React, { useContext } from 'react'; // Added useContext import
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Ensure this path is correct

const RoleAccess = ({ children, roleType }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Convert both to Uppercase to avoid "admin" vs "ADMIN" errors
  if (user.role.toUpperCase() !== roleType.toUpperCase()) {
    console.log(`Access Denied: User role ${user.role} does not match ${roleType}`);
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleAccess;