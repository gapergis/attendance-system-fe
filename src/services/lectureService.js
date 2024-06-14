// services/lectureService.js
import axios from 'axios';
const API_URL = 'http://localhost:8000/api'; // Adjust the base URL as needed


export const getLectures = async () => {
  try {
    const response = await axios.get(`${API_URL}/lectures/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lectures: ' + error.message);
  }
};

export const getLecturesByCourseId = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/lectures/course/${courseId}/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lectures: ' + error.message);
  }
};

export const getLectureDetails = async (lectureId) => {
  try {
    const response = await axios.get(`${API_URL}/lectures/lecture/${lectureId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lecture details: ' + error.message);
  }
};

export const getEnrolledStudents = async (lectureId) => {
  try {
    const response = await axios.get(`${API_URL}/lectures/${lectureId}/enrolled-users`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch enrolled students: ' + error.message);
  }
};

export const getAttendanceByLectureAndStudent = async (lectureId, studentId) => {
  try {
    const response = await axios.get(`${API_URL}/attendances/lecture/${lectureId}/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch attendance: ' + error.message);
  }
};
