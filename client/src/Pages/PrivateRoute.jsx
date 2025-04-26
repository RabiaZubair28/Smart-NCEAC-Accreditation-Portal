import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token'); // Check for token in localStorage

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if no token
  }

  return element; // Return the requested element if the user is authenticated
};

export default PrivateRoute;
