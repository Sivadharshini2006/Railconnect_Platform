/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check sessionStorage to keep the user logged in after page refresh
    const savedUser = sessionStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ Login function: Handles both UI state and JWT storage
  const login = (userData) => {
    setUser(userData);
    
    // Save user profile for UI (Role, Username)
    sessionStorage.setItem('currentUser', JSON.stringify(userData));

    // Save JWT Token for Backend API calls (used by your JwtFilter)
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };

  // ✅ Logout function: Cleans up all storage
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. ✅ Custom Hook for easy access in Navbar, Dashboard, etc.
// This resolves the error in image_60bdd6.png
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};