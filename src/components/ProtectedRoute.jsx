// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken, getUserCookie } from '../hooks/authCookies';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = getUserCookie();
  const token = getToken();

  if (!token || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute;
