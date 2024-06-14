import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../../services/courseService';
import { useAuth } from '../../services/authService';
import { getUserDetailsByUsername } from '../../services/userService';
import CourseCreationForm from '../../components/CourseForm';
import '../../App.css';

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [professorId, setProfessorId] = useState(null);
  const { getUserInfo, getToken } = useAuth();
  const token = getToken();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const professor = await getUserInfo();
        const professorDetails = await getUserDetailsByUsername(professor.username);
        setProfessorId(professorDetails.userId);
        const coursesData = await getCourses(token);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const toggleForm = () => {
    setShowForm(prevShowForm => !prevShowForm);
  };

  return (
    <div className="course-page-container">
      <h1>Professor Courses</h1>
      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <div>
          <ul className="course-list">
            {courses.map(course => (
              <li key={course.courseId}>
                <Link to={`/professor/courses/lectures/${course.courseId}`}>{course.title}</Link>
              </li>
            ))}
          </ul>
          <button className="button" onClick={toggleForm}>
            {showForm ? 'Hide Form' : 'Add New Course'}
          </button>
          {showForm && <CourseCreationForm professorId={professorId} onClose={toggleForm} />}
        </div>
      )}
    </div>
  );
};

export default CoursePage;
