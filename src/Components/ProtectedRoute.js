import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

  const user = localStorage.getItem("chatUserName");


  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute