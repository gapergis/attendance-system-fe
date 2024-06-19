// services/lectureService.js
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const getLectures = async () => {
  try {
    const response = await axios.get(`${apiUrl}/lectures/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch lectures: " + error.message);
  }
};

export const getLecturesByCourseId = async (courseId) => {
  try {
    const response = await axios.get(`${apiUrl}/lectures/course/${courseId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch lectures: " + error.message);
  }
};

export const getLectureDetails = async (lectureId) => {
  try {
    const response = await axios.get(`${apiUrl}/lectures/lecture/${lectureId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch lecture details: " + error.message);
  }
};

export const getEnrolledStudents = async (lectureId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/lectures/${lectureId}/enrolled-users`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch enrolled students: " + error.message);
  }
};

export const getAttendanceByLectureAndStudent = async (
  lectureId,
  studentId
) => {
  try {
    const response = await axios.get(
      `${apiUrl}/attendances/lecture/${lectureId}/student/${studentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch attendance: " + error.message);
  }
};
