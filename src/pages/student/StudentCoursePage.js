import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../../services/courseService';
import { useAuth } from '../../services/authService';
import { getUserDetailsByUsername } from '../../services/userService';
import { useKeycloak } from '@react-keycloak/web';
import '../../App.css'; // Import the CSS file

const CoursePage = () => {
  const { keycloak } = useKeycloak();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  const token = getToken();
  const username = keycloak.tokenParsed.preferred_username;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await getUserDetailsByUsername(username);
        setUser(response);
        setError(null);
      } catch (error) {
        setUser(null);
        setError('An error occurred while fetching user details.');
      } finally {
        setLoadingUser(false);
      }
    };
    fetchStudent();
  }, [username]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      try {
        setLoadingCourses(true);
        const coursesData = await getCourses(token);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [token, user]);

  return (
    <div className="course-page-container">
      {loadingUser ? (
        <p>Loading user information...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h1>Courses for student {user.username}</h1>
          {loadingCourses ? (
            <div className="loading">Loading courses...</div>
          ) : (
            <ul className="course-list">
              {courses.map(course => (
                <li key={course.courseId}>
                  <Link to={`/student/courses/lectures/${course.courseId}?studentId=${user.userId}`}>
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default CoursePage;
