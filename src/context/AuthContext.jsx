import React, { createContext, useContext,useState } from 'react';


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username, password) => {
    let role = 'passenger';

    if (username === 'admin' && password === 'admin123') {
      role = 'admin';
    } else if (username === 'tte' && password === 'tte123') {
      role = 'tte';
    } else {
      role = 'passenger';
    }

    const userData = { username, role };
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
  
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);