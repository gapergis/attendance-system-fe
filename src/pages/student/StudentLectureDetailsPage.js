// src/pages/LectureDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLectureDetails, getAttendanceByLectureAndStudent } from '../../services/lectureService';
import { getUserDetailsById , updateAttendanceStatus } from '../../services/userService';
import { getCoursesById } from "../../services/courseService";
import { useAuth } from '../../services/authService';
import '../../App.css'; // Import the CSS file

const LectureDetailsPage = () => {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [student, setStudent] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isProfessor } = useAuth();
  const { sendEmail }  = useAuth();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lectureData = await getLectureDetails(lectureId);
        setLecture(lectureData);
    
        const studentId = new URLSearchParams(window.location.search).get('studentId');
        if (!studentId) {
          throw new Error('Student ID not provided');
        }
        const studentAttendance = await getAttendanceByLectureAndStudent(lectureId, studentId);
        setAttendance(studentAttendance[0]);

        const studentDetails = await getUserDetailsById(studentId);
        setStudent(studentDetails);

        const courseId = new URLSearchParams(window.location.search).get('courseId');
        if (!courseId) {
          throw new Error('Student ID not provided');
        }
        const course = await getCoursesById(getToken(), courseId);
        let professorId = course.professorId;
        console.log(professorId);
        const professor = await getUserDetailsById(professorId);
        setProfessor(professor);
        console.log(professor)

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [lectureId]);

  const handleStatusChange = async (attendance, newStatus) => {
    try {
      console.log(attendance.attendance_id + " , " + newStatus)
      await updateAttendanceStatus(attendance.attendance_id, newStatus);
      setAttendance(prevAttendance => ({
        ...prevAttendance,
        status: newStatus
      }));
      if (professor.email && lecture && student) {
        const subject = `Attendance Status Changed - ${lecture.topic}`;
        const body = `Dear Professor,\n\nThe attendance status for ${student.surname} in the lecture on ${lecture.date} (${lecture.topic}) has been updated to ${newStatus}.\n\nBest Regards,\nThe Matrix`;

        await sendEmail(professor.email, subject, body);
      }
    } catch (error) {
      console.error('Error updating attendance status:', error);
    }
  };

  const isStudent = !isProfessor;

  return (
    <div className="lecture-details-container">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div>
          <h1>Lecture Details</h1>
          {lecture && (
            <>
              <h2>{lecture.topic}</h2>
              <p>Date: {lecture.date}, Time: {lecture.time}</p>
            </>
          )}
          {student && attendance && (
            <div>
              <h3>Student Details</h3>
              <span><p>Name: {student.surname}</p></span> 
              <span> <p>Attendance: {attendance.status}</p></span>
              <span className="checkbox-container"><select
                  value={attendance.status}
                  onChange={e => handleStatusChange(attendance, e.target.value)}
                >
                  <option disabled defaultValue value> -- select an option -- </option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select></span>
            
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LectureDetailsPage;
