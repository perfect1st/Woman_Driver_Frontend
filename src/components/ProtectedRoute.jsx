// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
  if (!token || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute;
