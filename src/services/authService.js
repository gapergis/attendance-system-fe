import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';

export const useAuth = () => {

  const { keycloak } = useKeycloak();

  const getToken = () => {
    // Check if keycloak is available and token is set
    if (keycloak && keycloak.token) {
      return keycloak.token;
    } else {
      // Return a default value or handle the case where token is not available
      return null; // You can change this to an appropriate default value
    }
  };
  

  const getUserInfo = async () => {
    if (keycloak.authenticated) {
      return {
        username: keycloak.tokenParsed.preferred_username,
        email: keycloak.tokenParsed.email,
        role: keycloak.tokenParsed.realm_access.roles[0] // Assuming single role
      };
    }
    return null;
  };

  const isAuthenticated = keycloak.authenticated;

  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

  const isProfessor = () => {
    return keycloak.hasRealmRole('professor');
  };

  const isStudent = () => {
    return keycloak.hasRealmRole('student');
  };


  const loadUserProfile = async (keycloak) => {
    if (keycloak && keycloak.authenticated) {
      let role="";
      if (isProfessor()){
        role = "professor"
      } else {
        role = "student"
      }
      try {
        const profile = await keycloak.loadUserProfile();
        return {
          firstName: profile.firstName || "",
          surname: profile.lastName || "",
          email: profile.email || "",
          username: profile.username || "",
          role: role
        };
      } catch (err) {
        console.error('Failed to load user profile', err);
        throw err;
      }
    }
    return null;
  };
  
  
  const addUserToDatabase = async (user) => {
    try {
      const response = await axios.post('http://localhost:8000/api/users/add', user);
      return response.data;
    } catch (error) {
      console.error('Error adding user to database:', error);
      throw error;
    }
  };

  const sendEmail = async (to, subject, body) => {
    try {
      const url = new URL('http://localhost:8000/api/email/send');
      url.searchParams.append('to', to);
      url.searchParams.append('subject', subject);
      url.searchParams.append('body', body);
  
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('Email sent successfully!');
      } else {
        console.error('Failed to send email:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };
  
 

  return { isAuthenticated, getToken, getUserInfo, isProfessor, isStudent, addUserToDatabase, loadUserProfile, sendEmail };
};
