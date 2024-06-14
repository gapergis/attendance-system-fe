// src/pages/CourseLecturesPage.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLecturesByCourseId } from '../../services/lectureService';
import { checkUserEnrollment, enrollUserInCourse, createAttendances } from '../../services/userService';
import '../../App.css';

const CourseLecturesPage = () => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get('studentId');

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

    const fetchEnrollmentStatus = async () => {
      try {
        const enrollmentStatus = await checkUserEnrollment(courseId, studentId);
        setIsEnrolled(enrollmentStatus);
      } catch (error) {
        console.error('Error checking enrollment status:', error);
      }
    };

    fetchLectures();
    fetchEnrollmentStatus();
  }, [courseId, studentId]);

  const handleEnroll = async () => {
    try {
      await enrollUserInCourse(courseId, studentId);
      await createAttendances(courseId, studentId);
      setIsEnrolled(true);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <div className="lectures-page-container">
      <h1>Lectures for Course {courseId}</h1>
      {loading ? (
        <div className="loading">Loading lectures...</div>
      ) : (
        <div>
          {isEnrolled ? (
            <ul className="lecture-list">
              {lectures.map(lecture => (
                <li key={lecture.lecture_id}>
                  <Link to={`/student/courses/lectures/lecture/${lecture.lecture_id}?studentId=${studentId}&courseId=${courseId}`}>
                    Date: {lecture.date}, Time: {lecture.time}, Topic: {lecture.topic}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p>You are not enrolled in this course.</p>
              <button className="enroll-button" onClick={handleEnroll}>Enroll in Course</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseLecturesPage;
