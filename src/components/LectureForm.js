// src/components/LectureCreationForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import '../App.css'; // Import the CSS file

const LectureCreationForm = ({courseId}) => {
  const { keycloak } = useKeycloak();
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Create the lecture
      const lectureResponse = await axios.put('http://localhost:8000/api/lectures/create', {
        topic: topic,
        date: date,
        time: time,
        course: courseId,
      }, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
  
      console.log('Lecture created successfully:', lectureResponse.data);
  
      // Get the list of enrolled students for the course
      const studentsResponse = await axios.get(`http://localhost:8000/api/courses/${courseId}/enrolled-users`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
      const enrolledStudents = studentsResponse.data;
  
      // Create attendance records for each enrolled student
      const attendancePromises = enrolledStudents.map(async student => {
        console.log(student);
        await axios.put('http://localhost:8000/api/attendances/create', {
          lectureId: lectureResponse.data.lecture_id,
          studentId: student.userId,
          status: 'N/A',
          confirmation: 'unconfirmed' // Set default status as absent
        }, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });
      });
  
      // Wait for all attendance creation requests to complete
      await Promise.all(attendancePromises);
  
      console.log('Attendance records created successfully for all enrolled students.');
  
      // Provide feedback to the professor about the success of lecture and attendance creation
    } catch (error) {
      console.error('Error creating lecture and attendance:', error.message);
      // Display error message to the professor
      setErrorMessage('Error creating lecture and attendance. Please try again.');
    }
  };
  

  return (
    <div className="lecture-form-container">
      {keycloak.hasRealmRole('professor') ? (
        <form onSubmit={handleSubmit}>
          <label>
            Lecture Topic:
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            Time:
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
          <button type="submit">Create Lecture</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      ) : (
        <div>
          You are not authorized to access this page.
        </div>
      )}
    </div>
  );
};

export default LectureCreationForm;
