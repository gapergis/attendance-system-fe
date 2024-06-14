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
  const [professorId, setProfessorId] = useState();
  const { getUserInfo, getToken } = useAuth();
  const token = getToken();
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses(token);
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    const fetchProfessorId = async () => {
      try {
        const professor = await getUserInfo();
        console.log(professor)
        const professorDetails = await getUserDetailsByUsername(professor.username);
        setProfessorId(professorDetails.userId);  // Assuming professorDetails.userId is correct
        console.log(professorDetails.userId);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching professor ID:', error);
        setLoading(false);
      }
    };

    fetchCourses();
    fetchProfessorId();
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
