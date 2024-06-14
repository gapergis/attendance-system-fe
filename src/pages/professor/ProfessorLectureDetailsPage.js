// src/pages/LectureDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLectureDetails, getEnrolledStudents, getAttendanceByLectureAndStudent } from '../../services/lectureService';
import { updateAttendanceConfirmation } from '../../services/userService'; // Adjust the import as needed
import { useAuth } from '../../services/authService';
import '../../App.css'; // Import the CSS file

const LectureDetailsPage = () => {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const { isProfessor, user } = useAuth(); // Assuming useAuth provides user information
  const { sendEmail } = useAuth();
  const [emailSending, setEmailSending] = useState(false); // State to manage email sending state

  useEffect(() => {
    const fetchLectureDetails = async () => {
      try {
        const lectureData = await getLectureDetails(lectureId);
        setLecture(lectureData);
      } catch (error) {
        console.error('Error fetching lecture details:', error);
      }
    };

    const fetchEnrolledStudentsAndAttendance = async () => {
      try {
        const studentsData = await getEnrolledStudents(lectureId);
        setStudents(studentsData);

        const attendanceData = {};
        await Promise.all(
          studentsData.map(async student => {
            const studentAttendance = await getAttendanceByLectureAndStudent(lectureId, student.userId);
            attendanceData[student.userId] = studentAttendance[0]; // Assuming the first object in the array is the required attendance record
          })
        );
        setAttendance(attendanceData);
      } catch (error) {
        console.error('Error fetching enrolled students and attendance:', error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchLectureDetails(), fetchEnrolledStudentsAndAttendance()]);
      setLoading(false);
    };

    fetchData();
  }, [lectureId]);

  const handleCheckboxChange = async (studentId) => {
    if (!attendance[studentId]) return;

    const newStatus = attendance[studentId].confirmation === 'confirmed' ? 'unconfirmed' : 'confirmed';
    const updatedAttendance = { ...attendance[studentId], confirmation: newStatus };

    try {
      await updateAttendanceConfirmation(updatedAttendance.attendance_id, updatedAttendance);
      setAttendance(prevAttendance => ({
        ...prevAttendance,
        [studentId]: updatedAttendance
      }));
      
      // Send email to student
        setEmailSending(true);
        const student = students.find(student => student.userId === studentId);
        const emailContent = `Dear ${student?.surname},\n\n` +
          `Your attendance status confirmation for the lecture on ${lecture.date} at ${lecture.time} has been updated to ${newStatus} by the professor.\n\n` +
          `Best Regards\nThe Matrix`;
        console.log(student)
        console.log(typeof student.email)
        // Call sendEmail function with student's email and content
        await sendEmail(student?.email, 'Attendance Confirmation Status Update', emailContent);
        setEmailSending(false);
      
    } catch (error) {
      console.error('Error updating attendance confirmation:', error);
      setEmailSending(false);
    }
  };

  return (
    <div className="lecture-details-container">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div>
          <h1>Professor Lecture Details</h1>
          <h2>{lecture.topic}</h2>
          <p>Date: {lecture.date}, Time: {lecture.time}</p>
          <h3>Enrolled Students</h3>
          <ul className="student-list">
            {students.map(student => (
              <li key={student.userId}>
                <span>{student.surname} </span>
                <span> Attendance: {attendance[student.userId] ? attendance[student.userId].status : 'N/A'}</span>
                <span className="checkbox-container">
                  Confirmation:
                  <input
                    type="checkbox"
                    checked={attendance[student.userId] && attendance[student.userId].confirmation === 'confirmed'}
                    readOnly={!isProfessor}
                    onChange={() => isProfessor && handleCheckboxChange(student.userId)}
                  />
                </span>
              </li>
            ))}
          </ul>
          {emailSending && <div>Sending email...</div>}
        </div>
      )}
    </div>
  );
};

export default LectureDetailsPage;