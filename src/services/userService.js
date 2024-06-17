// services/userService.js
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const getUserDetailsByUsername = async (username) => {
  try {
    const response = await axios.get(`${apiUrl}users/byUsername/${username}`);
    return response.data;
  } catch (error) {
    console.error("Failed to update attendance status:", error);
    throw new Error("Failed to update attendance status: " + error.message);
  }
};

export const getUserDetailsById = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}users/byId/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to update attendance status:", error);
    throw new Error("Failed to update attendance status: " + error.message);
  }
};

export const updateAttendanceConfirmation = async (
  attendanceId,
  updatedAttendance
) => {
  try {
    const response = await axios.put(
      `${apiUrl}attendances/${attendanceId}/toggle`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating attendance confirmation:", error);
  }
};

export const updateAttendanceStatus = async (attendanceId, newStatus) => {
  try {
    const response = await axios.put(
      `${apiUrl}attendances/${attendanceId}/${newStatus}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update attendance status:", error);
    throw new Error("Failed to update attendance status: " + error.message);
  }
};

export const checkUserEnrollment = async (courseId, studentId) => {
  try {
    const response = await axios.get(
      `${apiUrl}enrollments/check?courseId=${courseId}&userId=${studentId}`
    );
    return response.data; // Assuming the API directly returns the boolean
  } catch (error) {
    console.error("Error checking enrollment:", error);
    throw error;
  }
};

export const enrollUserInCourse = async (courseId, studentId) => {
  try {
    const response = await axios.post(`${apiUrl}enrollments/enroll`, {
      courseId,
      userId: studentId,
    });
    return response.data;
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    throw error;
  }
};

export const createAttendances = async (courseId, studentId) => {
  try {
    const response = await axios.post(
      `${apiUrl}enrollments/createAttendances`,
      { courseId, userId: studentId }
    );
    return response.data;
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    throw error;
  }
};
