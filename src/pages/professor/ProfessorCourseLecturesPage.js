// src/pages/CourseLecturesPage.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLecturesByCourseId } from '../../services/lectureService';
import LectureCreationForm from '../../components/LectureForm'; // Adjust the import path as needed
import '../../App.css'; // Import the CSS file

const CourseLecturesPage = () => {
  const { courseId } = useParams(); // Use courseId instead of course_id
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // State for toggling form

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const lecturesData = await getLecturesByCourseId(courseId);
        setLectures(lecturesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lectures:', error);
        setLoading(false);
      }
    };

    fetchLectures();
  }, [courseId]); // Include courseId in dependency array

  const toggleForm = () => {
    setShowForm(prevShowForm => !prevShowForm);
  };

  return (
    <div className="lectures-page-container">
      <h1>Professor Lectures for Course {courseId}</h1>
      {loading ? (
        <div className="loading">Loading lectures...</div>
      ) : (
        <div>
          <ul className="lecture-list">
            {lectures.map(lecture => (
              <li key={lecture.lecture_id}>
                <Link courseId={courseId} to={`/professor/courses/lectures/lecture/${lecture.lecture_id}`}>
                  Date: {lecture.date}, Time: {lecture.time}, Topic: {lecture.topic}
                </Link>
              </li>
            ))}
          </ul>
          <button className="button" onClick={toggleForm}>
            {showForm ? 'Hide Form' : 'Add New Lecture'}
          </button>
          {showForm && <LectureCreationForm courseId={courseId} onClose={toggleForm} />}
        </div>
      )}
    </div>
  );
};

export default CourseLecturesPage;
