// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useAuth } from '../services/authService';

const ProtectedRoute = ({ allowedRoles }) => {
  const { keycloak, initialized } = useKeycloak();
  const { isAuthenticated, isProfessor, isStudent } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialized) {
    //  console.log("ProtectedRoute useEffect: keycloak initialized");
      setLoading(false);
    }
  }, [initialized]);

  useEffect(() => {
    if (!loading && initialized) {
  
      // Delay in milliseconds
      const delay = 50;
  
      // Set hasAccess after delay
      const timer = setTimeout(() => {
        let access = false;
        if (allowedRoles.includes('professor') && isProfessor()) {
          access = true;
        }
        if (allowedRoles.includes('student') && isStudent()) {
          access = true;
        }
        setHasAccess(access);
      }, delay);
  
      // Clear timer on component unmount or when dependencies change
      return () => clearTimeout(timer);
    }
  }, [loading, initialized, allowedRoles, isProfessor, isStudent, isAuthenticated]);

  if (loading || !initialized) {
    return <div>Loading...</div>;
  }
  let access = false;
  if (allowedRoles.includes('professor') && isProfessor()) {
    access = true;
  }
  if (allowedRoles.includes('student') && isStudent()) {
    access = true;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!access) {
    if (allowedRoles.includes('professor') && isProfessor()){
      return <Navigate to="/professor/courses" />;
    } else {
      return <Navigate to="/student/courses" />;
    }
    
  }

  return <Outlet />;
};

export default ProtectedRoute;
