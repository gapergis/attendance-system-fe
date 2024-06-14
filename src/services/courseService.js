import axios from 'axios';

const API_URL = 'http://localhost:8000/api/courses/';

export const getCoursesForStudent = async (token, studentId) => {

  try {
    const response = await axios.get(API_URL, {
      params: {
        studentId: studentId // Pass the student's ID or username to the server
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
   // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw new Error('Failed to fetch courses: ' + error.message);
  }
};

export const getCourses = async (token) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch courses: ' + error.message);
    }
  };

  export const getCoursesById = async (token, courseId) => {
    try {
      const response = await axios.get(`${API_URL}${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch courses: ' + error.message);
    }
  };

  

  