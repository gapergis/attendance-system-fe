// src/pages/CoursePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCoursesForStudent } from '../../services/courseService';
import { useAuth } from '../../services/authService';
import {getUserDetailsByUsername} from '../../services/userService'
import { useKeycloak } from '@react-keycloak/web';
import '../../App.css'; // Import the CSS file

const CoursePage = () => {
  const {keycloak} = useKeycloak();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  const token = getToken();
  const username =  keycloak.tokenParsed.preferred_username;

useEffect(() => {
  const fetchStudent = async () => {
    try {
      const response = await getUserDetailsByUsername(username);
        setUser(response);
        setError(null);
    } catch (error) {
      setUser(null);
      setError('An error occurred');
    }
  };  
    fetchStudent();
  }, [username]);  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCoursesForStudent(token, user.userId);
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, user]);

  return (
    <div className="course-page-container">
      {user ? (
        <>
          <h1>Courses for student {user.username}</h1>
          {loading ? (
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
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}  

export default CoursePage;
