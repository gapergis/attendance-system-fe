// services/userService.js
import axios from 'axios';
const API_URL = 'http://localhost:8000/api';


export const getUserDetailsByUsername = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/users/byUsername/${username}`);
    return response.data;
  } catch (error) {
    console.error('Failed to update attendance status:', error);
    throw new Error('Failed to update attendance status: ' + error.message);
  }
};

export const getUserDetailsById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/byId/${userId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Failed to update attendance status:', error);
    throw new Error('Failed to update attendance status: ' + error.message);
  }
};

export const updateAttendanceConfirmation = async (attendanceId, updatedAttendance) => {
  try {
    const response = await axios.put(`http://localhost:8000/api/attendances/${attendanceId}/toggle`);
    return response.data;
  } catch (error) {
    console.error('Error updating attendance confirmation:', error);
  }
};

export const updateAttendanceStatus = async (attendanceId, newStatus) => {
  try {
    console.log(attendanceId + " , " + newStatus);
    const response = await axios.put(`${API_URL}/attendances/${attendanceId}/${newStatus}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update attendance status:', error);
    throw new Error('Failed to update attendance status: ' + error.message);
  }
};  

export const checkUserEnrollment = async (courseId, studentId) => {
  try {
    const response = await axios.get(`${API_URL}/enrollments/check?courseId=${courseId}&userId=${studentId}`);
    console.log('Enrollment check response:', response.data); // Debugging
    return response.data; // Assuming the API directly returns the boolean
  } catch (error) {
    console.error('Error checking enrollment:', error);
    throw error;
  }
};

export const enrollUserInCourse = async (courseId, studentId) => {
  try {
    const response = await axios.post(`${API_URL}/enrollments/enroll`, { courseId, userId: studentId });
    return response.data;
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    throw error;
  }
};

export const createAttendances = async (courseId, studentId) => {
  try {
    const response = await axios.post(`${API_URL}/enrollments/createAttendances`, { courseId, userId: studentId });
    return response.data;
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    throw error;
  }
};