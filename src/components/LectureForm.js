import React, { useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import "../App.css";

const LectureCreationForm = ({ courseId, onClose }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { keycloak } = useKeycloak();
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    try {
      console.log("Sending lecture creation request");
      const lectureResponse = await axios.post(
        `${apiUrl}/lectures/add`,
        {
          topic: topic,
          date: date,
          time: time,
          course: courseId,
        }
      );
      console.log("Lecture created:", lectureResponse.data);

      console.log("Fetching enrolled students");
      const studentsResponse = await axios.get(
        `${apiUrl}/courses/${courseId}/enrolled-users`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      const enrolledStudents = studentsResponse.data;
      console.log("Enrolled students:", enrolledStudents);

      const attendancePromises = enrolledStudents.map(async (student) => {
        await axios.post( 
          `${apiUrl}/attendances/add`,
          {
            lectureId: lectureResponse.data.lecture_id,
            studentId: student.userId,
            status: "N/A",
            confirmation: "unconfirmed",
          },
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );
      });

      await Promise.all(attendancePromises);
      console.log("Attendance records created successfully");

    } catch (error) {
      console.error("Error creating lecture and attendance:", error.message);
      setErrorMessage("Error creating lecture and attendance. Please try again.");
    }

     onClose();
     window.location.reload();
  };

  return (
    <div className="lecture-form-container">
      {keycloak.hasRealmRole("professor") ? (
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
        <div>You are not authorized to access this page.</div>
      )}
    </div>
  );
};

export default LectureCreationForm;
