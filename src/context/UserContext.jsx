import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken'));

  const login = (token) => {
    sessionStorage.removeItem('cart');
    sessionStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  const logout = () => {
    sessionStorage.removeItem('cart');
    sessionStorage.removeItem('authToken');
    setAuthToken(null);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token !== authToken) {
      setAuthToken(token);
    }
  }, []);

  return (
    <UserContext.Provider value={{ authToken, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
